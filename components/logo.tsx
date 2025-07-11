"use client"

import { FileText } from "lucide-react"

interface LogoProps {
  /**
   * Size of the logo in pixels. Defaults to 32.
   * This controls both the container square and the icon inside.
   */
  size?: number
  /**
   * Additional Tailwind class names for the outer container.
   */
  className?: string
}

/**
 * `Logo` renders the FileText icon inside a rounded square that adapts to dark / light themes.
 * Use this component anywhere you need to show the project brand to ensure it looks identical
 * across the application.
 */
export function Logo({ size = 32, className = "" }: LogoProps) {
  const containerClasses = `flex items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/20 ${className}`.trim()
  const dimension = `${size}px`
  // The icon is slightly smaller so it sits comfortably within the square.
  const iconSize = Math.floor(size * 0.5) // 50% of container for balanced padding

  return (
    <div className={containerClasses} style={{ width: dimension, height: dimension }}>
      <FileText
        width={iconSize}
        height={iconSize}
        className="text-amber-600 dark:text-amber-400"
        aria-hidden="true"
      />
    </div>
  )
}