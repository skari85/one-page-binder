"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine)
    
    // Set up event listeners for online/offline events
    const handleOffline = () => {
      setIsOffline(true)
      setShowIndicator(true)
      setFadeOut(false)
    }
    
    const handleOnline = () => {
      setIsOffline(false)
      // Keep showing the indicator for a moment, then fade out
      setTimeout(() => {
        setFadeOut(true)
        // Hide completely after animation
        setTimeout(() => {
          setShowIndicator(false)
        }, 1000)
      }, 3000)
    }
    
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    
    // Initial check
    if (!navigator.onLine) {
      handleOffline()
    }
    
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])
  
  if (!showIndicator) return null
  
  return (
    <div 
      className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full 
                 shadow-lg flex items-center space-x-2 transition-opacity duration-1000
                 ${isOffline ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
                 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You're offline. Changes saved locally.</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">You're back online!</span>
        </>
      )}
    </div>
  )
}