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

    // Simple QR code generation (for demo - use proper QR library in production)
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

    // Generate pattern
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const cellHash = (hash + x * 31 + y * 17) & 0xffffff
        if (cellHash % 2 === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }

    // Add corner markers (simplified)
    const markerSize = cellSize * 3
    ctx.fillStyle = "black"

    // Top-left marker
    ctx.fillRect(0, 0, markerSize, markerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(cellSize, cellSize, cellSize, cellSize)

    // Top-right marker
    ctx.fillStyle = "black"
    ctx.fillRect(size - markerSize, 0, markerSize, markerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(size - markerSize + cellSize, cellSize, cellSize, cellSize)

    // Bottom-left marker
    ctx.fillStyle = "black"
    ctx.fillRect(0, size - markerSize, markerSize, markerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(cellSize, size - markerSize + cellSize, cellSize, cellSize)
  }, [data, size])

  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-48 bg-muted rounded-lg">
        <p className="text-muted-foreground">No data to generate QR code</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas ref={canvasRef} width={size} height={size} className="border rounded-lg" />
      <p className="text-xs text-muted-foreground text-center">
        Scan this QR code to share encrypted content
        <br />
        (Demo QR - use proper QR library for production)
      </p>
    </div>
  )
}
