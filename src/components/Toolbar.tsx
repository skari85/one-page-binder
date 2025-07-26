import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, 
  Settings, 
  Moon, 
  Sun, 
  Maximize, 
  Minimize,
  Eye,
  EyeOff,
  Save,
  Download,
  Upload,
  Type,
  Volume2,
  VolumeX
} from 'lucide-react'
import { WritingContext } from '../contexts/WritingContext'
import { ToolbarProps } from '../types'

const Toolbar: React.FC<ToolbarProps> = ({ onToggleSidebar, onToggleSettings }) => {
  const context = useContext(WritingContext)
  if (!context) throw new Error('Toolbar must be used within WritingContext')

  const { 
    settings, 
    setSettings, 
    toggleTheme, 
    toggleFullscreen, 
    toggleZenMode,
    currentDocument 
  } = context

  const handleExport = () => {
    if (!currentDocument) return
    
    const blob = new Blob([currentDocument.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentDocument.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.md'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          if (currentDocument) {
            context.updateDocument(currentDocument.id, { content })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const toggleSound = () => {
    setSettings({
      ...settings,
      typewriterSound: !settings.typewriterSound,
      ambientSounds: !settings.ambientSounds
    })
  }

  return (
    <motion.div
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-text-muted hover:text-text dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
          
          <button
            onClick={handleImport}
            className="p-2 text-text-muted hover:text-text dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Import Document"
          >
            <Upload size={18} />
          </button>
          
          <button
            onClick={handleExport}
            disabled={!currentDocument}
            className="p-2 text-text-muted hover:text-text dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export Document"
          >
            <Download size={18} />
          </button>
        </div>

        {/* Center Section - Document Info */}
        <div className="flex items-center gap-4 text-sm text-text-muted">
          {currentDocument && (
            <>
              <div className="flex items-center gap-2">
                <Type size={16} />
                <span>{currentDocument.wordCount} words</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>{currentDocument.readingTime} min read</span>
              </div>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg transition-colors ${
              settings.typewriterSound || settings.ambientSounds
                ? 'text-accent-primary bg-accent-primary/10'
                : 'text-text-muted hover:text-text dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={settings.typewriterSound || settings.ambientSounds ? 'Disable Sounds' : 'Enable Sounds'}
          >
            {settings.typewriterSound || settings.ambientSounds ? (
              <Volume2 size={18} />
            ) : (
              <VolumeX size={18} />
            )}
          </button>

          {/* Zen Mode Toggle */}
          <button
            onClick={toggleZenMode}
            className={`p-2 rounded-lg transition-colors ${
              settings.zenMode
                ? 'text-accent-primary bg-accent-primary/10'
                : 'text-text-muted hover:text-text dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={settings.zenMode ? 'Exit Zen Mode' : 'Enter Zen Mode'}
          >
            {settings.zenMode ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-text-muted hover:text-text dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={`Switch to ${settings.theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {settings.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-text-muted hover:text-text dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={settings.fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {settings.fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

          {/* Settings */}
          <button
            onClick={onToggleSettings}
            className="p-2 text-text-muted hover:text-text dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Toolbar