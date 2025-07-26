import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WritingArea from './components/WritingArea'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import Settings from './components/Settings'
import { WritingContext } from './contexts/WritingContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import { WritingSettings, Document } from './types'

function App() {
  const [settings, setSettings] = useLocalStorage<WritingSettings>('ommwriter-settings', {
    theme: 'light',
    background: 'cream',
    font: 'serif',
    fontSize: 18,
    lineHeight: 1.6,
    fullscreen: false,
    zenMode: false,
    autoSave: true,
    spellCheck: true,
    wordCount: true,
    readingTime: true,
    typewriterSound: false,
    ambientSounds: false,
    soundVolume: 0.3,
  })

  const [documents, setDocuments] = useLocalStorage<Document[]>('ommwriter-documents', [])
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    // Create default document if none exists
    if (documents.length === 0) {
      const defaultDoc: Document = {
        id: 'default',
        title: 'Untitled Document',
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        wordCount: 0,
        readingTime: 0,
      }
      setDocuments([defaultDoc])
      setCurrentDocument(defaultDoc)
    } else if (!currentDocument) {
      setCurrentDocument(documents[0])
    }
  }, [documents, currentDocument, setDocuments])

  const createNewDocument = () => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: 'Untitled Document',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      wordCount: 0,
      readingTime: 0,
    }
    setDocuments(prev => [newDoc, ...prev])
    setCurrentDocument(newDoc)
  }

  const updateDocument = (id: string, updates: Partial<Document>) => {
    const updatedDocs = documents.map(doc => 
      doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc
    )
    setDocuments(updatedDocs)
    if (currentDocument?.id === id) {
      setCurrentDocument({ ...currentDocument, ...updates, updatedAt: new Date().toISOString() })
    }
  }

  const deleteDocument = (id: string) => {
    const filteredDocs = documents.filter(doc => doc.id !== id)
    setDocuments(filteredDocs)
    if (currentDocument?.id === id) {
      setCurrentDocument(filteredDocs[0] || null)
    }
  }

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light'
    setSettings({ ...settings, theme: newTheme })
    document.documentElement.classList.toggle('dark')
  }

  const toggleFullscreen = () => {
    setSettings({ ...settings, fullscreen: !settings.fullscreen })
  }

  const toggleZenMode = () => {
    setSettings({ ...settings, zenMode: !settings.zenMode })
  }

  return (
    <WritingContext.Provider value={{
      settings,
      setSettings,
      documents,
      currentDocument,
      setCurrentDocument,
      createNewDocument,
      updateDocument,
      deleteDocument,
      toggleTheme,
      toggleFullscreen,
      toggleZenMode,
    }}>
      <div className={`min-h-screen transition-all duration-300 ${
        settings.theme === 'dark' ? 'dark' : ''
      } ${settings.fullscreen ? 'fixed inset-0 z-50' : ''}`}>
        
        {/* Background */}
        <div className={`fixed inset-0 transition-all duration-500 ${
          settings.background === 'cream' ? 'bg-background-cream' :
          settings.background === 'warm' ? 'bg-background-warm' :
          settings.background === 'cool' ? 'bg-background-cool' :
          'bg-background'
        }`} />

        {/* Main Layout */}
        <div className="relative z-10 flex h-screen">
          {/* Sidebar */}
          <AnimatePresence>
            {showSidebar && !settings.zenMode && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-700"
              >
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <AnimatePresence>
              {!settings.zenMode && (
                <motion.div
                  initial={{ y: -60 }}
                  animate={{ y: 0 }}
                  exit={{ y: -60 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Toolbar 
                    onToggleSidebar={() => setShowSidebar(!showSidebar)}
                    onToggleSettings={() => setShowSettings(!showSettings)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Writing Area */}
            <div className="flex-1 relative">
              <WritingArea />
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowSettings(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <Settings onClose={() => setShowSettings(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WritingContext.Provider>
  )
}

export default App