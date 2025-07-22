export type Language = "en" | "zh"

export const translations = {
  en: {
    // App basics
    appName: "Qi",
    tagline: "A quiet place to write",
    enter: "Enter",
    english: "English",
    chinese: "中文",
    language: "Language",

    // Navigation
    page: "Page",
    pages: "Pages",
    of: "of",
    previous: "Previous",
    next: "Next",

    // Writing
    startWriting: "Start writing... Everything auto-saves locally.",
    startWritingTimestamps:
      "Start writing... Timestamps will be added automatically after breaks or double-enter. Press Ctrl+T to insert manually.",
    continueWriting: "Continue writing...",

    // Export
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

    // Timestamps
    timestampFormat: "Timestamp Format",
    timestampFormats: {
      datetime: "Date & Time",
      date: "Date Only",
      time: "Time Only",
    },

    // Security
    setPinTitle: "Set 4-Digit PIN",
    setPinDescription: "Create a PIN to lock your writing space",
    enterPinTitle: "Enter PIN",
    enterPinDescription: "Enter your 4-digit PIN to unlock your writing space",
    enterPin: "Enter 4-digit PIN",
    setPin: "Set PIN",
    unlock: "Unlock",

    // Sharing
    shareTitle: "Share Qi",
    shareDescription: "Share this quiet place to write with others",
    shareOnTwitter: "Share on Twitter",
    shareOnFacebook: "Share on Facebook",

    // Landing page
    privacyTitle: "Privacy Policy",
    termsTitle: "Terms of Service",
    contactTitle: "Contact Us",
    contactDescription: "Have questions or feedback? We'd love to hear from you.",
    contactName: "Name",
    contactEmail: "Email",
    contactMessage: "Message",
    contactSend: "Send Message",
    contactSuccess: "Thank you! Your message has been sent.",

    // Privacy content
    privacyContent: {
      title: "Your Privacy Matters",
      subtitle: "We believe your writing should remain private and secure.",
      localOnly: "Local Storage Only",
      localOnlyDesc:
        "All your writing is stored locally on your device. We never send your content to our servers or the cloud.",
      noTracking: "No Tracking",
      noTrackingDesc:
        "We don't track your usage, collect analytics about your writing habits, or monitor your behavior.",
      noAccounts: "No Accounts Required",
      noAccountsDesc: "You don't need to create an account, provide personal information, or sign up for anything.",
      openSource: "Open Source",
      openSourceDesc: "Our code is open source, so you can verify exactly how we handle your data and privacy.",
      dataCollection: "What We Don't Collect",
      dataCollectionList: [
        "Your writing content or documents",
        "Personal information or contact details",
        "Usage patterns or writing statistics",
        "Cookies for tracking purposes",
        "Any data shared with third parties",
      ],
      technical: "Technical Details",
      technicalList: [
        "All data stored in browser's localStorage",
        "No server-side storage of content",
        "No network requests for writing data",
        "Works completely offline",
        "Data never leaves your device",
      ],
    },

    // Terms content
    termsContent: {
      title: "Simple Terms",
      subtitle: "Clear terms for a simple writing app.",
      acceptance: "By using Qi, you agree to these terms. If you don't agree, please don't use the app.",
      service:
        "Qi is a minimalist writing tool that stores content locally on your device. We provide it 'as is' without warranties.",
      responsibilities: "Your Responsibilities",
      responsibilitiesList: [
        "Back up your own writing - we can't recover lost data",
        "Use the app only for lawful, appropriate content",
        "Understand that you retain full ownership of your writing",
        "Keep your PIN secure if you choose to use the lock feature",
      ],
      limitations: "Limitations",
      limitationsList: [
        "We don't guarantee the app will always be available",
        "We're not responsible for any data loss",
        "The app is provided without warranties of any kind",
        "We may update these terms occasionally",
      ],
      termination: "You can stop using Qi anytime. We may discontinue the service with notice.",
      contact: "Questions about these terms? Contact us at overthinkr9@gmail.com",
    },
  },
  zh: {
    // App basics
    appName: "Qi",
    tagline: "一个安静的写作空间",
    enter: "进入",
    english: "English",
    chinese: "中文",
    language: "语言",

    // Navigation
    page: "页面",
    pages: "页面",
    of: "共",
    previous: "上一页",
    next: "下一页",

    // Writing
    startWriting: "开始写作... 所有内容都会自动保存到本地。",
    startWritingTimestamps: "开始写作... 时间戳会在停顿后或双击回车时自动添加。按 Ctrl+T 手动插入。",
    continueWriting: "继续写作...",

    // Export
    exportOptions: "导出选项",
    exportAsTxt: "导出为 TXT",
    exportAsTxtDesc: "纯文本格式，通用兼容性",
    exportAsDocx: "导出为 DOCX",
    exportAsDocxDesc: "Microsoft Word 格式，带格式",
    exportAsPdf: "导出为 PDF",
    exportAsPdfDesc: "打印就绪格式，打开打印对话框",
    exportAsEpub: "导出为 EPUB",
    exportAsEpubDesc: "电子书格式，适用于数字阅读器",
    printDocument: "打印文档",
    printDocumentDesc: "直接打印当前内容",
    importFromFile: "从文件导入",
    importFromFileDesc: "从 .txt 文件加载文本",

    // Timestamps
    timestampFormat: "时间戳格式",
    timestampFormats: {
      datetime: "日期和时间",
      date: "仅日期",
      time: "仅时间",
    },

    // Security
    setPinTitle: "设置 4 位数字密码",
    setPinDescription: "创建密码来锁定您的写作空间",
    enterPinTitle: "输入密码",
    enterPinDescription: "输入您的 4 位数字密码来解锁写作空间",
    enterPin: "输入 4 位数字密码",
    setPin: "设置密码",
    unlock: "解锁",

    // Sharing
    shareTitle: "分享 Qi",
    shareDescription: "与他人分享这个安静的写作空间",
    shareOnTwitter: "在 Twitter 上分享",
    shareOnFacebook: "在 Facebook 上分享",

    // Landing page
    privacyTitle: "隐私政策",
    termsTitle: "服务条款",
    contactTitle: "联系我们",
    contactDescription: "有问题或反馈？我们很乐意听取您的意见。",
    contactName: "姓名",
    contactEmail: "邮箱",
    contactMessage: "消息",
    contactSend: "发送消息",
    contactSuccess: "谢谢！您的消息已发送。",

    // Privacy content
    privacyContent: {
      title: "您的隐私很重要",
      subtitle: "我们相信您的写作应该保持私密和安全。",
      localOnly: "仅本地存储",
      localOnlyDesc: "您的所有写作都存储在您的设备本地。我们从不将您的内容发送到我们的服务器或云端。",
      noTracking: "无跟踪",
      noTrackingDesc: "我们不跟踪您的使用情况，不收集您的写作习惯分析，也不监控您的行为。",
      noAccounts: "无需账户",
      noAccountsDesc: "您无需创建账户、提供个人信息或注册任何内容。",
      openSource: "开源",
      openSourceDesc: "我们的代码是开源的，因此您可以验证我们如何处理您的数据和隐私。",
      dataCollection: "我们不收集什么",
      dataCollectionList: [
        "您的写作内容或文档",
        "个人信息或联系方式",
        "使用模式或写作统计",
        "用于跟踪的 Cookie",
        "与第三方共享的任何数据",
      ],
      technical: "技术细节",
      technicalList: [
        "所有数据存储在浏览器的 localStorage 中",
        "无服务器端内容存储",
        "写作数据无网络请求",
        "完全离线工作",
        "数据从不离开您的设备",
      ],
    },

    // Terms content
    termsContent: {
      title: "简单条款",
      subtitle: "简单写作应用的清晰条款。",
      acceptance: "使用 Qi 即表示您同意这些条款。如果您不同意，请不要使用该应用。",
      service: "Qi 是一个极简主义的写作工具，将内容存储在您设备的本地。我们按原样提供，不提供保证。",
      responsibilities: "您的责任",
      responsibilitiesList: [
        "备份您自己的写作 - 我们无法恢复丢失的数据",
        "仅将应用用于合法、适当的内容",
        "理解您保留对写作的完全所有权",
        "如果选择使用锁定功能，请保护好您的密码",
      ],
      limitations: "限制",
      limitationsList: [
        "我们不保证应用始终可用",
        "我们不对任何数据丢失负责",
        "应用按原样提供，不提供任何形式的保证",
        "我们可能偶尔更新这些条款",
      ],
      termination: "您可以随时停止使用 Qi。我们可能会提前通知终止服务。",
      contact: "对这些条款有疑问？请联系我们：overthinkr9@gmail.com",
    },
  },
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Fallback to English if key not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // Return key if not found in fallback
        }
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}
