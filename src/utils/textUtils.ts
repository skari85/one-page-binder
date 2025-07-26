export function calculateWordCount(text: string): number {
  if (!text.trim()) return 0
  
  // Remove extra whitespace and split by spaces
  const words = text.trim().split(/\s+/)
  
  // Filter out empty strings and count
  return words.filter(word => word.length > 0).length
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200 // Average reading speed
  const wordCount = calculateWordCount(text)
  
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, minutes) // Minimum 1 minute
}

export function calculateCharacterCount(text: string): number {
  return text.length
}

export function calculateCharacterCountNoSpaces(text: string): number {
  return text.replace(/\s/g, '').length
}

export function getTextStats(text: string) {
  return {
    words: calculateWordCount(text),
    characters: calculateCharacterCount(text),
    charactersNoSpaces: calculateCharacterCountNoSpaces(text),
    readingTime: calculateReadingTime(text),
    paragraphs: text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
  }
}

export function formatText(text: string, format: 'plain' | 'markdown' | 'html'): string {
  switch (format) {
    case 'markdown':
      // Basic markdown formatting
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
    
    case 'html':
      return text.replace(/\n/g, '<br>')
    
    default:
      return text
  }
}

export function extractTitle(text: string): string {
  const lines = text.split('\n')
  const firstLine = lines[0]?.trim()
  
  if (firstLine && firstLine.length > 0 && firstLine.length < 100) {
    return firstLine
  }
  
  return 'Untitled Document'
}

export function generateExcerpt(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text
  
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}