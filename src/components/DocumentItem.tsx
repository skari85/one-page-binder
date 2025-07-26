import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Trash2, MoreVertical, Calendar } from 'lucide-react'
import { DocumentItemProps } from '../types'
import { formatDistanceToNow } from 'date-fns'

const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  isActive,
  onClick,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <div
        onClick={onClick}
        className={`sidebar-item ${isActive ? 'active' : ''}`}
      >
        <FileText size={16} className="flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="truncate font-medium text-sm">
            {document.title || 'Untitled Document'}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
            <Calendar size={12} />
            <span>{formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}</span>
            <span>•</span>
            <span>{document.wordCount} words</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="p-1 text-text-muted hover:text-text dark:hover:text-text-dark rounded transition-colors"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
        >
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default DocumentItem