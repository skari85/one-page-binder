"use client"

import { useEffect, useRef } from "react"

interface QRCodeGeneratorProps {
  data: string
  size?: number
}

export function QRCodeGenerator({ data, size = 200 }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    // Simple QR code generation using a library would be ideal,
    // but for this demo, we'll create a placeholder pattern
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, size, size)

    // Create a simple pattern based on data hash
    const hash = data.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    const gridSize = 25
    const cellSize = size / gridSize

    ctx.fillStyle = "black"

    // Generate pattern based on hash
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cellHash = (hash + i * gridSize + j) % 100
        if (cellHash > 50) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
        }
      }
    }

    // Add corner markers (finder patterns)
    const markerSize = cellSize * 7
    const positions = [
      [0, 0],
      [size - markerSize, 0],
      [0, size - markerSize],
    ]

    positions.forEach(([x, y]) => {
      // Outer square
      ctx.fillStyle = "black"
      ctx.fillRect(x, y, markerSize, markerSize)

      // Inner white square
      ctx.fillStyle = "white"
      ctx.fillRect(x + cellSize, y + cellSize, markerSize - 2 * cellSize, markerSize - 2 * cellSize)

      // Center black square
      ctx.fillStyle = "black"
      ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, markerSize - 4 * cellSize, markerSize - 4 * cellSize)
    })
  }, [data, size])

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border rounded"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  )
}
