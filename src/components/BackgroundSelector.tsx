import React from 'react'
import { motion } from 'framer-motion'
import { BackgroundSelectorProps } from '../types'

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onBackgroundChange
}) => {
  const backgrounds = [
    { id: 'default', name: 'Default', color: 'bg-background' },
    { id: 'cream', name: 'Cream', color: 'bg-background-cream' },
    { id: 'warm', name: 'Warm', color: 'bg-background-warm' },
    { id: 'cool', name: 'Cool', color: 'bg-background-cool' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {backgrounds.map((bg) => (
        <motion.button
          key={bg.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onBackgroundChange(bg.id)}
          className={`relative p-4 rounded-lg border-2 transition-all ${
            currentBackground === bg.id
              ? 'border-accent-primary shadow-lg'
              : 'border-gray-200 dark:border-gray-700 hover:border-accent-primary/50'
          }`}
        >
          <div className={`w-full h-12 rounded ${bg.color} mb-2`} />
          <span className="text-sm font-medium text-text dark:text-text-dark">
            {bg.name}
          </span>
          {currentBackground === bg.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  )
}

export default BackgroundSelector