export interface WritingSettings {
  theme: 'light' | 'dark'
  background: 'default' | 'cream' | 'warm' | 'cool'
  font: 'serif' | 'sans' | 'mono'
  fontSize: number
  lineHeight: number
  fullscreen: boolean
  zenMode: boolean
  autoSave: boolean
  spellCheck: boolean
  wordCount: boolean
  readingTime: boolean
  typewriterSound: boolean
  ambientSounds: boolean
  soundVolume: number
}

export interface Document {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
  wordCount: number
  readingTime: number
}

export interface WritingContextType {
  settings: WritingSettings
  setSettings: (settings: WritingSettings) => void
  documents: Document[]
  currentDocument: Document | null
  setCurrentDocument: (doc: Document | null) => void
  createNewDocument: () => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  toggleTheme: () => void
  toggleFullscreen: () => void
  toggleZenMode: () => void
}

export interface ToolbarProps {
  onToggleSidebar: () => void
  onToggleSettings: () => void
}

export interface SidebarProps {}

export interface WritingAreaProps {}

export interface SettingsProps {
  onClose: () => void
}

export interface StatsProps {
  wordCount: number
  readingTime: number
  characterCount: number
}

export interface BackgroundSelectorProps {
  currentBackground: string
  onBackgroundChange: (background: string) => void
}

export interface FontSelectorProps {
  currentFont: string
  onFontChange: (font: string) => void
}

export interface DocumentItemProps {
  document: Document
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}