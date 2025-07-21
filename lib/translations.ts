export type Language = 'en' | 'zh'

export const translations = {
  en: {
    // Landing page
    appName: 'Qi',
    tagline: 'A quiet place to write.',
    enter: 'Enter',
    
    // Welcome screen
    welcomeTitle: 'Qi',
    welcomeSubtitle: 'A quiet place to write',
    welcomeFeatures: {
      local: 'Everything saves locally',
      noCloud: 'No cloud, no tracking',
      noDistraction: 'Zero distractions'
    },
    welcomeMessage: 'Welcome to Qi',
    welcomeEnter: 'Enter below',
    enterQi: 'Enter Qi',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    
    // Lock screen
    locked: 'Your writing space is locked',
    unlock: 'Unlock',
    
    // Header
    saving: 'Saving...',
    offline: 'Offline',
    
    // Tooltips
    goToLanding: 'Go to landing page',
    singlePageView: 'Single page view',
    bookView: 'Book view (dual pages)',
    pageSize: 'Page size',
    nativeFileSystem: 'Native file system',
    toggleTheme: 'Toggle theme',
    shareApp: 'Share app',
    saveAsTxt: 'Save as TXT',
    saveAsDocx: 'Save as DOCX',
    importFromFile: 'Import from file',
    print: 'Print',
    toggleTimestamps: 'Toggle automatic timestamps',
    timestampFormat: 'Timestamp format',
    lockWritingSpace: 'Lock writing space',
    
    // Page navigation
    page: 'Page',
    of: 'of',
    pages: 'Pages',
    previous: 'Previous',
    next: 'Next',
    words: 'words',
    
    // Placeholders
    startWriting: 'Start writing... Everything auto-saves locally.',
    startWritingTimestamps: 'Start writing... Timestamps will be added automatically after breaks or double-enter. Press Ctrl+T to insert manually.',
    continueWriting: 'Continue writing...',
    
    // PIN dialogs
    setPinTitle: 'Set 4-Digit PIN',
    setPinDescription: 'Create a PIN to lock your writing space',
    enterPinTitle: 'Enter PIN',
    enterPinDescription: 'Enter your 4-digit PIN to unlock your writing space',
    enterPin: 'Enter 4-digit PIN',
    setPin: 'Set PIN',
    
    // Share dialog
    shareTitle: 'Share Qi',
    shareDescription: 'Share this quiet place to write with others',
    shareOnTwitter: 'Share on Twitter',
    shareOnFacebook: 'Share on Facebook',
    
    // Export
    exportedFrom: 'Exported from Qi - A quiet place to write',
    date: 'Date',
    totalWords: 'Total Words',
    
    // Timestamp formats
    timestampFormats: {
      datetime: 'Date & Time',
      date: 'Date Only',
      time: 'Time Only'
    },
    
    // Page sizes
    pageSizes: {
      A4: 'A4',
      Letter: 'Letter',
      A5: 'A5'
    },
    
    // Language
    language: 'Language',
    english: 'English',
    chinese: '中文'
  },
  
  zh: {
    // Landing page
    appName: '气',
    tagline: '一个安静的写作之地。',
    enter: '进入',
    
    // Welcome screen
    welcomeTitle: '气',
    welcomeSubtitle: '一个安静的写作之地',
    welcomeFeatures: {
      local: '所有内容本地保存',
      noCloud: '无云端，无追踪',
      noDistraction: '零干扰'
    },
    welcomeMessage: '欢迎使用气',
    welcomeEnter: '请在下方进入',
    enterQi: '进入气',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    
    // Lock screen
    locked: '您的写作空间已锁定',
    unlock: '解锁',
    
    // Header
    saving: '保存中...',
    offline: '离线',
    
    // Tooltips
    goToLanding: '返回首页',
    singlePageView: '单页视图',
    bookView: '书本视图（双页）',
    pageSize: '页面大小',
    nativeFileSystem: '本地文件系统',
    toggleTheme: '切换主题',
    shareApp: '分享应用',
    saveAsTxt: '保存为TXT',
    saveAsDocx: '保存为DOCX',
    importFromFile: '从文件导入',
    print: '打印',
    toggleTimestamps: '切换自动时间戳',
    timestampFormat: '时间戳格式',
    lockWritingSpace: '锁定写作空间',
    
    // Page navigation
    page: '第',
    of: '页，共',
    pages: '页',
    previous: '上一页',
    next: '下一页',
    words: '字',
    
    // Placeholders
    startWriting: '开始写作... 所有内容自动本地保存。',
    startWritingTimestamps: '开始写作... 时间戳将在停顿后或双击回车时自动添加。按 Ctrl+T 手动插入。',
    continueWriting: '继续写作...',
    
    // PIN dialogs
    setPinTitle: '设置4位数字密码',
    setPinDescription: '创建密码来锁定您的写作空间',
    enterPinTitle: '输入密码',
    enterPinDescription: '输入您的4位数字密码来解锁写作空间',
    enterPin: '输入4位数字密码',
    setPin: '设置密码',
    
    // Share dialog
    shareTitle: '分享气',
    shareDescription: '与他人分享这个安静的写作之地',
    shareOnTwitter: '在Twitter上分享',
    shareOnFacebook: '在Facebook上分享',
    
    // Export
    exportedFrom: '从气导出 - 一个安静的写作之地',
    date: '日期',
    totalWords: '总字数',
    
    // Timestamp formats
    timestampFormats: {
      datetime: '日期和时间',
      date: '仅日期',
      time: '仅时间'
    },
    
    // Page sizes
    pageSizes: {
      A4: 'A4',
      Letter: 'Letter',
      A5: 'A5'
    },
    
    // Language
    language: '语言',
    english: 'English',
    chinese: '中文'
  }
}

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.')
  let value: any = translations[language]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}
