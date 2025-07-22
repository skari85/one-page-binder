export type Language = "en" | "zh"

export interface Translations {
  // App basics
  appName: string
  tagline: string
  enter: string

  // Navigation
  page: string
  pages: string
  of: string
  previous: string
  next: string

  // Writing interface
  startWriting: string
  startWritingTimestamps: string
  continueWriting: string

  // Export options
  exportOptions: string
  exportAsTxt: string
  exportAsTxtDesc: string
  exportAsDocx: string
  exportAsDocxDesc: string
  exportAsPdf: string
  exportAsPdfDesc: string
  exportAsEpub: string
  exportAsEpubDesc: string
  printDocument: string
  printDocumentDesc: string
  importFromFile: string
  importFromFileDesc: string

  // Timestamp formats
  timestampFormat: string
  timestampFormats: {
    datetime: string
    date: string
    time: string
  }

  // PIN dialogs
  setPinTitle: string
  setPinDescription: string
  enterPinTitle: string
  enterPinDescription: string
  enterPin: string
  setPin: string
  unlock: string

  // Share dialog
  shareTitle: string
  shareDescription: string
  shareOnTwitter: string
  shareOnFacebook: string

  // Language settings
  language: string
  english: string
  chinese: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // App basics
    appName: "Qi",
    tagline: "A quiet place to write",
    enter: "Enter",

    // Navigation
    page: "Page",
    pages: "Pages",
    of: "of",
    previous: "Previous",
    next: "Next",

    // Writing interface
    startWriting: "Start writing... Everything auto-saves locally.",
    startWritingTimestamps:
      "Start writing... Timestamps will be added automatically after breaks or double-enter. Press Ctrl+T to insert manually.",
    continueWriting: "Continue writing...",

    // Export options
    exportOptions: "Export Options",
    exportAsTxt: "Export as TXT",
    exportAsTxtDesc: "Plain text format, universal compatibility",
    exportAsDocx: "Export as DOCX",
    exportAsDocxDesc: "Microsoft Word format with formatting",
    exportAsPdf: "Export as PDF",
    exportAsPdfDesc: "Print-ready format, opens print dialog",
    exportAsEpub: "Export as EPUB",
    exportAsEpubDesc: "E-book format for digital readers",
    printDocument: "Print Document",
    printDocumentDesc: "Print current content directly",
    importFromFile: "Import from File",
    importFromFileDesc: "Load text from .txt file",

    // Timestamp formats
    timestampFormat: "Timestamp format",
    timestampFormats: {
      datetime: "Date & Time",
      date: "Date Only",
      time: "Time Only",
    },

    // PIN dialogs
    setPinTitle: "Set 4-Digit PIN",
    setPinDescription: "Create a PIN to lock your writing space",
    enterPinTitle: "Enter PIN",
    enterPinDescription: "Enter your 4-digit PIN to unlock your writing space",
    enterPin: "Enter 4-digit PIN",
    setPin: "Set PIN",
    unlock: "Unlock",

    // Share dialog
    shareTitle: "Share Qi",
    shareDescription: "Share this quiet place to write with others",
    shareOnTwitter: "Share on Twitter",
    shareOnFacebook: "Share on Facebook",

    // Language settings
    language: "Language",
    english: "English",
    chinese: "中文",
  },

  zh: {
    // App basics
    appName: "Qi",
    tagline: "一个安静的写作空间",
    enter: "进入",

    // Navigation
    page: "页面",
    pages: "页面",
    of: "共",
    previous: "上一页",
    next: "下一页",

    // Writing interface
    startWriting: "开始写作... 所有内容都会自动保存到本地。",
    startWritingTimestamps: "开始写作... 时间戳会在停顿后或双击回车时自动添加。按 Ctrl+T 手动插入。",
    continueWriting: "继续写作...",

    // Export options
    exportOptions: "导出选项",
    exportAsTxt: "导出为 TXT",
    exportAsTxtDesc: "纯文本格式，通用兼容性",
    exportAsDocx: "导出为 DOCX",
    exportAsDocxDesc: "Microsoft Word 格式，带格式",
    exportAsPdf: "导出为 PDF",
    exportAsPdfDesc: "打印就绪格式，打开打印对话框",
    exportAsEpub: "导出为 EPUB",
    exportAsEpubDesc: "数字阅读器的电子书格式",
    printDocument: "打印文档",
    printDocumentDesc: "直接打印当前内容",
    importFromFile: "从文件导入",
    importFromFileDesc: "从 .txt 文件加载文本",

    // Timestamp formats
    timestampFormat: "时间戳格式",
    timestampFormats: {
      datetime: "日期和时间",
      date: "仅日期",
      time: "仅时间",
    },

    // PIN dialogs
    setPinTitle: "设置 4 位数字密码",
    setPinDescription: "创建密码来锁定您的写作空间",
    enterPinTitle: "输入密码",
    enterPinDescription: "输入您的 4 位数字密码来解锁写作空间",
    enterPin: "输入 4 位数字密码",
    setPin: "设置密码",
    unlock: "解锁",

    // Share dialog
    shareTitle: "分享 Qi",
    shareDescription: "与他人分享这个安静的写作空间",
    shareOnTwitter: "在 Twitter 上分享",
    shareOnFacebook: "在 Facebook 上分享",

    // Language settings
    language: "语言",
    english: "English",
    chinese: "中文",
  },
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
