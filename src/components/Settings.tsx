import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { X, Palette, Type, Volume2, Monitor, Eye } from 'lucide-react'
import { WritingContext } from '../contexts/WritingContext'
import { SettingsProps } from '../types'
import BackgroundSelector from './BackgroundSelector'
import FontSelector from './FontSelector'

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const context = useContext(WritingContext)
  if (!context) throw new Error('Settings must be used within WritingContext')

  const { settings, setSettings } = context

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-text dark:text-text-dark">
          Settings
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-text-muted hover:text-text dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="space-y-8">
          {/* Appearance */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-medium text-text dark:text-text-dark mb-4">
              <Palette size={20} />
              Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text dark:text-text-dark mb-2">
                  Background
                </label>
                <BackgroundSelector
                  currentBackground={settings.background}
                  onBackgroundChange={(background) => updateSetting('background', background)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text dark:text-text-dark mb-2">
                  Font
                </label>
                <FontSelector
                  currentFont={settings.font}
                  onFontChange={(font) => updateSetting('font', font)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text dark:text-text-dark mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text dark:text-text-dark mb-2">
                  Line Height: {settings.lineHeight}
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.4"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Writing Experience */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-medium text-text dark:text-text-dark mb-4">
              <Type size={20} />
              Writing Experience
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => updateSetting('autoSave', e.target.checked)}
                  className="w-4 h-4 text-accent-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-primary/50"
                />
                <span className="text-sm text-text dark:text-text-dark">
                  Auto-save documents
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.spellCheck}
                  onChange={(e) => updateSetting('spellCheck', e.target.checked)}
                  className="w-4 h-4 text-accent-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-primary/50"
                />
                <span className="text-sm text-text dark:text-text-dark">
                  Enable spell check
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.wordCount}
                  onChange={(e) => updateSetting('wordCount', e.target.checked)}
                  className="w-4 h-4 text-accent-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-primary/50"
                />
                <span className="text-sm text-text dark:text-text-dark">
                  Show word count
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.readingTime}
                  onChange={(e) => updateSetting('readingTime', e.target.checked)}
                  className="w-4 h-4 text-accent-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-primary/50"
                />
                <span className="text-sm text-text dark:text-text-dark">
                  Show reading time
                </span>
              </label>
            </div>
          </div>

          {/* Audio */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-medium text-text dark:text-text-dark mb-4">
              <Volume2 size={20} />
              Audio
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.typewriterSound}
                  onChange={(e) => updateSetting('typewriterSound', e.target.checked)}
                  className="w-4 h-4 text-accent-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-primary/50"
                />
                <span className="text-sm text-text dark:text-text-dark">
                  Typewriter sound effects
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ambientSounds}
                  onChange={(e) => updateSetting('ambientSounds', e.target.checked)}
                  className="w-4 h-4 text-accent-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-primary/50"
                />
                <span className="text-sm text-text dark:text-text-dark">
                  Ambient background sounds
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-text dark:text-text-dark mb-2">
                  Sound Volume: {Math.round(settings.soundVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.soundVolume}
                  onChange={(e) => updateSetting('soundVolume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Interface */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-medium text-text dark:text-text-dark mb-4">
              <Monitor size={20} />
              Interface
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.fullscreen}
                  onChange={(e) => updateSetting('fullscreen', e.target.checked)}
                  className="w-4 h-4 text-accent-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-primary/50"
                />
                <span className="text-sm text-text dark:text-text-dark">
                  Start in fullscreen mode
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.zenMode}
                  onChange={(e) => updateSetting('zenMode', e.target.checked)}
                  className="w-4 h-4 text-accent-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-accent-primary/50"
                />
                <span className="text-sm text-text dark:text-text-dark">
                  Start in zen mode
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="px-4 py-2 text-text dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </motion.div>
  )
}

export default Settings