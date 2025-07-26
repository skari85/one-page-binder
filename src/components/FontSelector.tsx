import React from 'react'
import { motion } from 'framer-motion'
import { FontSelectorProps } from '../types'

const FontSelector: React.FC<FontSelectorProps> = ({
  currentFont,
  onFontChange
}) => {
  const fonts = [
    { id: 'serif', name: 'Serif', class: 'font-serif' },
    { id: 'sans', name: 'Sans', class: 'font-sans' },
    { id: 'mono', name: 'Mono', class: 'font-mono' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {fonts.map((font) => (
        <motion.button
          key={font.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFontChange(font.id)}
          className={`relative p-4 rounded-lg border-2 transition-all ${
            currentFont === font.id
              ? 'border-accent-primary shadow-lg bg-accent-primary/5'
              : 'border-gray-200 dark:border-gray-700 hover:border-accent-primary/50'
          }`}
        >
          <div className={`text-lg font-medium text-text dark:text-text-dark ${font.class} mb-2`}>
            Aa
          </div>
          <span className="text-sm font-medium text-text dark:text-text-dark">
            {font.name}
          </span>
          {currentFont === font.id && (
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

export default FontSelector