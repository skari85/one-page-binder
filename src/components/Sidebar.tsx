import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Folder, 
  FileText, 
  Trash2, 
  MoreVertical,
  Calendar,
  Tag
} from 'lucide-react'
import { WritingContext } from '../contexts/WritingContext'
import DocumentItem from './DocumentItem'
import { formatDistanceToNow } from 'date-fns'

const Sidebar: React.FC = () => {
  const context = useContext(WritingContext)
  if (!context) throw new Error('Sidebar must be used within WritingContext')

  const { documents, currentDocument, createNewDocument, deleteDocument } = context
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const recentDocuments = documents
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text dark:text-text-dark">Documents</h2>
          <button
            onClick={createNewDocument}
            className="p-2 text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors"
            title="New Document"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent Documents */}
        {recentDocuments.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-text-muted mb-3 flex items-center gap-2">
              <Calendar size={14} />
              Recent
            </h3>
            <div className="space-y-2">
              {recentDocuments.map((doc) => (
                <DocumentItem
                  key={doc.id}
                  document={doc}
                  isActive={currentDocument?.id === doc.id}
                  onClick={() => context.setCurrentDocument(doc)}
                  onDelete={() => deleteDocument(doc.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Documents */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-text-muted mb-3 flex items-center gap-2">
            <FileText size={14} />
            All Documents ({documents.length})
          </h3>
          
          <AnimatePresence>
            {filteredDocuments.length > 0 ? (
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DocumentItem
                      document={doc}
                      isActive={currentDocument?.id === doc.id}
                      onClick={() => context.setCurrentDocument(doc)}
                      onDelete={() => deleteDocument(doc.id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText size={48} className="mx-auto text-text-muted mb-4" />
                <p className="text-text-muted text-sm">
                  {searchTerm ? 'No documents found' : 'No documents yet'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={createNewDocument}
                    className="mt-4 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors text-sm"
                  >
                    Create your first document
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>Total: {documents.length} documents</span>
          <span>
            {documents.reduce((total, doc) => total + doc.wordCount, 0)} words
          </span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar