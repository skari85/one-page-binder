"use client"

import { useEffect, useRef } from "react"

interface QRCodeGeneratorProps {
  data: string
  size?: number
}

export function QRCodeGenerator({ data, size = 200 }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!data || !canvasRef.current) return

    // Simple QR code generation (basic implementation)
    // In production, use a proper QR code library like 'qrcode'
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, size, size)

    // Generate a simple pattern based on data
    // This is a placeholder - use a real QR library for production
    const gridSize = 25
    const cellSize = size / gridSize

    ctx.fillStyle = "black"

    // Create a simple pattern based on data hash
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) & 0xffffffff
    }

    // Generate pattern
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const seed = (x * gridSize + y + hash) % 1000
        if (seed % 3 === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }

    // Add corner markers (simplified)
    const markerSize = cellSize * 7
    ctx.fillStyle = "black"

    // Top-left marker
    ctx.fillRect(0, 0, markerSize, markerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(cellSize, cellSize, markerSize - 2 * cellSize, markerSize - 2 * cellSize)
    ctx.fillStyle = "black"
    ctx.fillRect(2 * cellSize, 2 * cellSize, markerSize - 4 * cellSize, markerSize - 4 * cellSize)

    // Top-right marker
    ctx.fillStyle = "black"
    ctx.fillRect(size - markerSize, 0, markerSize, markerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(size - markerSize + cellSize, cellSize, markerSize - 2 * cellSize, markerSize - 2 * cellSize)
    ctx.fillStyle = "black"
    ctx.fillRect(size - markerSize + 2 * cellSize, 2 * cellSize, markerSize - 4 * cellSize, markerSize - 4 * cellSize)

    // Bottom-left marker
    ctx.fillStyle = "black"
    ctx.fillRect(0, size - markerSize, markerSize, markerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(cellSize, size - markerSize + cellSize, markerSize - 2 * cellSize, markerSize - 2 * cellSize)
    ctx.fillStyle = "black"
    ctx.fillRect(2 * cellSize, size - markerSize + 2 * cellSize, markerSize - 4 * cellSize, markerSize - 4 * cellSize)
  }, [data, size])

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas ref={canvasRef} width={size} height={size} className="border border-gray-300 rounded" />
      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        ⚠️ Demo QR Code - Use proper QR library for production
      </p>
    </div>
  )
}
