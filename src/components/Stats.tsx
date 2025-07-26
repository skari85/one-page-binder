import React from 'react'
import { motion } from 'framer-motion'
import { Type, Clock, Hash } from 'lucide-react'
import { StatsProps } from '../types'

const Stats: React.FC<StatsProps> = ({ wordCount, readingTime, characterCount }) => {
  const stats = [
    {
      icon: Type,
      label: 'Words',
      value: wordCount.toLocaleString(),
      color: 'text-accent-primary'
    },
    {
      icon: Hash,
      label: 'Characters',
      value: characterCount.toLocaleString(),
      color: 'text-accent-secondary'
    },
    {
      icon: Clock,
      label: 'Reading Time',
      value: `${readingTime} min`,
      color: 'text-accent-success'
    }
  ]

  return (
    <div className="px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <stat.icon size={16} className={stat.color} />
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  {stat.value}
                </span>
                <span className="text-xs text-text-muted">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-xs text-text-muted">
          Auto-saved
        </div>
      </div>
    </div>
  )
}

export default Stats