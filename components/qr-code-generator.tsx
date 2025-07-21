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

    // Simple QR code placeholder - in production, use a proper QR library
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, size, size)

    // Draw a simple pattern representing QR code
    ctx.fillStyle = "black"
    const cellSize = size / 20

    // Create a simple pattern based on data hash
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) & 0xffffffff
    }

    // Draw pattern
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        const shouldFill = (hash + x * 7 + y * 13) % 3 === 0
        if (shouldFill) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }

    // Draw corner markers
    const markerSize = cellSize * 3
    ctx.fillRect(0, 0, markerSize, markerSize)
    ctx.fillRect(size - markerSize, 0, markerSize, markerSize)
    ctx.fillRect(0, size - markerSize, markerSize, markerSize)
  }, [data, size])

  if (!data) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded border-2 border-dashed"
        style={{ width: size, height: size }}
      >
        <span className="text-muted-foreground text-sm">No data to encode</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas ref={canvasRef} width={size} height={size} className="border rounded" />
      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        Scan this QR code to get the encrypted data
      </p>
    </div>
  )
}
