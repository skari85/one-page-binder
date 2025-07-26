import React, { useState, useEffect, useRef, useContext } from 'react'
import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'
import { WritingContext } from '../contexts/WritingContext'
import Stats from './Stats'
import { calculateWordCount, calculateReadingTime } from '../utils/textUtils'

const WritingArea: React.FC = () => {
  const context = useContext(WritingContext)
  if (!context) throw new Error('WritingArea must be used within WritingContext')

  const { 
    settings, 
    currentDocument, 
    updateDocument 
  } = context

  const [content, setContent] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save effect
  useEffect(() => {
    if (settings.autoSave && currentDocument) {
      const timeoutId = setTimeout(() => {
        const wordCount = calculateWordCount(content)
        const readingTime = calculateReadingTime(content)
        updateDocument(currentDocument.id, {
          content,
          wordCount,
          readingTime,
        })
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [content, settings.autoSave, currentDocument, updateDocument])

  // Update content when document changes
  useEffect(() => {
    if (currentDocument) {
      setContent(currentDocument.content)
    }
  }, [currentDocument])

  // Keyboard shortcuts
  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault()
    if (currentDocument) {
      const wordCount = calculateWordCount(content)
      const readingTime = calculateReadingTime(content)
      updateDocument(currentDocument.id, {
        content,
        wordCount,
        readingTime,
      })
    }
  })

  useHotkeys('ctrl+n, cmd+n', (e) => {
    e.preventDefault()
    context.createNewDocument()
  })

  useHotkeys('ctrl+b, cmd+b', (e) => {
    e.preventDefault()
    // Add bold formatting
  })

  useHotkeys('ctrl+i, cmd+i', (e) => {
    e.preventDefault()
    // Add italic formatting
  })

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const getFontClass = () => {
    switch (settings.font) {
      case 'serif':
        return 'font-serif'
      case 'mono':
        return 'font-mono'
      default:
        return 'font-sans'
    }
  }

  const getTextColor = () => {
    return settings.theme === 'dark' ? 'text-text-dark' : 'text-text'
  }

  if (!currentDocument) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No Document Selected</h2>
          <p className="text-text-muted mb-6">Create a new document to start writing</p>
          <button
            onClick={context.createNewDocument}
            className="px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
          >
            Create New Document
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Writing Area */}
      <div className="flex-1 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full flex flex-col"
        >
          {/* Document Title */}
          <div className="px-8 pt-8 pb-4">
            <input
              type="text"
              value={currentDocument.title}
              onChange={(e) => updateDocument(currentDocument.id, { title: e.target.value })}
              className={`w-full text-3xl font-bold bg-transparent border-none outline-none ${getTextColor()} placeholder-text-muted`}
              placeholder="Document Title"
            />
          </div>

          {/* Text Editor */}
          <div className="flex-1 px-8 pb-8 relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`w-full h-full resize-none bg-transparent border-none outline-none ${getFontClass()} ${getTextColor()} placeholder-text-muted writing-focus`}
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
              }}
              placeholder="Start writing your thoughts..."
              spellCheck={settings.spellCheck}
            />
            
            {/* Focus indicator */}
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none border-2 border-accent-primary/20 rounded-lg"
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      {settings.wordCount || settings.readingTime ? (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
        >
          <Stats
            wordCount={currentDocument.wordCount}
            readingTime={currentDocument.readingTime}
            characterCount={content.length}
          />
        </motion.div>
      ) : null}
    </div>
  )
}

export default WritingArea