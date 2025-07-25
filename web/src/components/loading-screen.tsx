"use client"

import { useState, useEffect } from "react"
import { useThemeDetection } from "@/hooks/use-theme-detection"
import logoWhite from "@/assets/images/kigri-white.svg"
import logoBlack from "@/assets/images/kigri-black.svg"

interface LoadingScreenProps {
  onLoadingComplete: () => void
  delay?: number
}

export function LoadingScreen({ onLoadingComplete, delay = 2000 }: LoadingScreenProps) {
  const [isFading, setIsFading] = useState(false)
  const isDark = useThemeDetection()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true)
      // Wait for fade out animation to complete before calling onLoadingComplete
      setTimeout(onLoadingComplete, 500)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, onLoadingComplete])

  // Determine which logo and background to use based on theme
  const logo = isDark ? logoWhite : logoBlack
  const backgroundColor = isDark ? 'bg-black' : 'bg-white'

  return (
    <div 
      className={`fixed inset-0 ${backgroundColor} z-[9999] flex items-center justify-center transition-all duration-500 ease-in-out ${
        isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex items-center">
        <img 
          src={logo} 
          alt="Kigri" 
          className="h-20 animate-pulse transition-transform duration-300 hover:scale-110" 
        />
      </div>
    </div>
  )
} 