export type Language = "en" | "zh"

export const translations = {
  en: {
    // App basics
    appName: "Qi",
    tagline: "A quiet place to write",
    title: "Qi",
    subtitle: "A quiet place to write",
    enter: "Enter",
    language: "Language",
    english: "English",
    chinese: "中文",

    // Writing interface
    startWriting: "Start writing...",
    startWritingTimestamps: "Start writing... (Ctrl/Cmd+T for timestamp)",
    wordCount: "words",
    characterCount: "characters",
    placeholder: "Start writing your thoughts here...",

    // Export functionality
    export: "Export",
    exportAs: "Export as",
    exportOptions: "Export Options",
    exportAsTxt: "Export as Text",
    exportAsTxtDesc: "Plain text file (.txt)",
    exportAsDocx: "Export as Word",
    exportAsDocxDesc: "Microsoft Word document (.docx)",
    exportPdf: "Export as PDF",
    exportPdfDesc: "Portable Document Format (.pdf)",
    exportHtml: "Export as HTML",
    exportHtmlDesc: "Web page format (.html)",
    printDocument: "Print Document",
    printDocumentDesc: "Print or save as PDF",
    importFromFile: "Import from File",
    importFromFileDesc: "Load text from file (.txt)",

    // Timestamp functionality
    timestampFormat: "Timestamp Format",
    timestampFormats: {
      datetime: "Date & Time",
      date: "Date Only",
      time: "Time Only",
    },
    timestampNone: "No timestamp",
    timestampDate: "Date only",
    timestampTime: "Time only",
    timestampDateTime: "Date & time",

    // PIN/Lock functionality
    setPinTitle: "Set PIN",
    setPinDescription: "Set a 4-digit PIN to lock your writing space",
    enterPinTitle: "Enter PIN",
    enterPinDescription: "Enter your 4-digit PIN to unlock",
    enterPin: "Enter PIN",
    setPin: "Set PIN",
    unlock: "Unlock",

    // Share functionality
    shareTitle: "Share Qi",
    shareDescription: "Share this writing app with others",
    shareOnTwitter: "Share on Twitter",
    shareOnFacebook: "Share on Facebook",

    // About section
    about: "About",
    aboutTitle: "About Qi",
    aboutDescription: "A minimalist writing application focused on privacy and simplicity.",
    aboutFeatures: "Key Features:",
    aboutFeature1: "Everything saves locally in your browser",
    aboutFeature2: "No accounts, no cloud storage, no tracking",
    aboutFeature3: "Export to multiple formats (TXT, DOCX, PDF, HTML)",
    aboutFeature4: "Automatic timestamps and word counting",
    aboutFeature5: "Clean, distraction-free interface",

    // Privacy Policy
    privacy: "Privacy",
    privacyTitle: "Privacy Policy",
    privacyIntro: "Your privacy is our top priority. Here's how we protect it:",
    privacyContent: {
      title: "Privacy Policy",
      subtitle: "Your privacy is our top priority. Here's how we protect it:",
      localOnly: "Local Storage Only",
      localOnlyDesc: "All your writing stays on your device. We never see or store your content.",
      noTracking: "No Tracking",
      noTrackingDesc: "We don't use analytics, cookies, or any tracking technologies.",
      noAccounts: "No Accounts Required",
      noAccountsDesc: "No sign-ups, no personal information collected, ever.",
      openSource: "Open Source",
      openSourceDesc: "Our code is transparent and available for review.",
      dataCollection: "What We Don't Collect",
      dataCollectionList:
        "Personal information, Writing content, Usage analytics, Cookies or tracking data, IP addresses, Device information",
      technical: "Technical Details",
      technicalList:
        "Data stored in browser localStorage only, No server-side storage, No third-party integrations, Works completely offline, You control your data entirely",
    },
    privacyDataCollection: "Data Collection",
    privacyDataCollectionText:
      "We don't collect any personal data, writing content, or usage analytics. Everything stays on your device.",
    privacyLocalStorage: "Local Storage",
    privacyLocalStorageText:
      "Your writing is saved locally in your browser using localStorage. We never have access to this data.",
    privacyNoTracking: "No Tracking",
    privacyNoTrackingText:
      "We don't use cookies, analytics, or any tracking technologies. Your privacy is completely protected.",
    privacyOpenSource: "Open Source",
    privacyOpenSourceText:
      "Our code is open source and available for review. You can verify our privacy claims yourself.",

    // Terms of Service
    terms: "Terms",
    termsTitle: "Terms of Service",
    termsIntro: "Simple terms for using Qi:",
    termsContent: {
      title: "Terms of Service",
      subtitle: "Simple terms for using Qi:",
      acceptance:
        "By using Qi, you agree to these terms. Qi is a free writing application that stores all data locally on your device.",
      service:
        "Qi provides a simple, privacy-focused writing environment. All your content remains on your device and under your control.",
      responsibilities: "Your Responsibilities",
      responsibilitiesList:
        "Back up important content regularly, Use the app responsibly and legally, Understand that data is stored locally only, Keep your device secure if using PIN protection",
      limitations: "Service Limitations",
      limitationsList:
        "We provide the app 'as is' without warranties, Local storage may have browser limitations, We're not responsible for data loss, Service may be updated or discontinued",
      termination: "You can stop using Qi at any time. Your local data will remain on your device until you clear it.",
      contact: "Questions about these terms? Contact us at overthinkr9@gmail.com",
    },
    termsUse: "Use of Service",
    termsUseText:
      "Qi is provided free of charge for personal and commercial use. You retain full ownership of your content.",
    termsData: "Your Data",
    termsDataText: "All data is stored locally on your device. You are responsible for backing up important content.",
    termsLimitations: "Limitations",
    termsLimitationsText:
      "We provide Qi 'as is' without warranties. We're not liable for any data loss or service interruptions.",
    termsContact: "Contact",
    termsContactText: "For questions about these terms, contact us at overthinkr9@gmail.com",

    // Contact
    contact: "Contact",
    contactTitle: "Contact Us",
    contactDescription: "Get in touch with the Qi team",
    contactName: "Name",
    contactNamePlaceholder: "Your name",
    contactEmail: "Email",
    contactEmailPlaceholder: "your@email.com",
    contactMessage: "Message",
    contactMessagePlaceholder: "Tell us what's on your mind...",
    contactSend: "Send Message",
    contactSending: "Sending...",
    contactSuccess: "Message sent successfully!",
    contactError: "Failed to send message. Please try again.",
    contactDirectEmail: "Or email us directly:",
    close: "Close",
  },
  zh: {
    // App basics
    appName: "气",
    tagline: "安静的写作空间",
    title: "气",
    subtitle: "安静的写作空间",
    enter: "进入",
    language: "语言",
    english: "English",
    chinese: "中文",

    // Writing interface
    startWriting: "开始写作...",
    startWritingTimestamps: "开始写作... (Ctrl/Cmd+T 插入时间戳)",
    wordCount: "字数",
    characterCount: "字符数",
    placeholder: "在这里开始写下你的想法...",

    // Export functionality
    export: "导出",
    exportAs: "导出为",
    exportOptions: "导出选项",
    exportAsTxt: "导出为文本",
    exportAsTxtDesc: "纯文本文件 (.txt)",
    exportAsDocx: "导出为Word",
    exportAsDocxDesc: "Microsoft Word文档 (.docx)",
    exportPdf: "导出为PDF",
    exportPdfDesc: "便携式文档格式 (.pdf)",
    exportHtml: "导出为HTML",
    exportHtmlDesc: "网页格式 (.html)",
    printDocument: "打印文档",
    printDocumentDesc: "打印或保存为PDF",
    importFromFile: "从文件导入",
    importFromFileDesc: "从文件加载文本 (.txt)",

    // Timestamp functionality
    timestampFormat: "时间戳格式",
    timestampFormats: {
      datetime: "日期和时间",
      date: "仅日期",
      time: "仅时间",
    },
    timestampNone: "无时间戳",
    timestampDate: "仅日期",
    timestampTime: "仅时间",
    timestampDateTime: "日期和时间",

    // PIN/Lock functionality
    setPinTitle: "设置密码",
    setPinDescription: "设置4位数字密码来锁定你的写作空间",
    enterPinTitle: "输入密码",
    enterPinDescription: "输入你的4位数字密码来解锁",
    enterPin: "输入密码",
    setPin: "设置密码",
    unlock: "解锁",

    // Share functionality
    shareTitle: "分享气",
    shareDescription: "与他人分享这个写作应用",
    shareOnTwitter: "在Twitter上分享",
    shareOnFacebook: "在Facebook上分享",

    // About section
    about: "关于",
    aboutTitle: "关于气",
    aboutDescription: "专注于隐私和简洁的极简写作应用。",
    aboutFeatures: "主要功能：",
    aboutFeature1: "所有内容都保存在你的浏览器本地",
    aboutFeature2: "无需账户，无云存储，无跟踪",
    aboutFeature3: "支持多种格式导出（TXT、DOCX、PDF、HTML）",
    aboutFeature4: "自动时间戳和字数统计",
    aboutFeature5: "简洁、无干扰的界面",

    // Privacy Policy
    privacy: "隐私",
    privacyTitle: "隐私政策",
    privacyIntro: "你的隐私是我们的首要任务。以下是我们如何保护它：",
    privacyContent: {
      title: "隐私政策",
      subtitle: "你的隐私是我们的首要任务。以下是我们如何保护它：",
      localOnly: "仅本地存储",
      localOnlyDesc: "你的所有写作内容都保留在你的设备上。我们永远不会看到或存储你的内容。",
      noTracking: "无跟踪",
      noTrackingDesc: "我们不使用分析、Cookie或任何跟踪技术。",
      noAccounts: "无需账户",
      noAccountsDesc: "无需注册，永远不收集个人信息。",
      openSource: "开源",
      openSourceDesc: "我们的代码是透明的，可供审查。",
      dataCollection: "我们不收集的内容",
      dataCollectionList: "个人信息，写作内容，使用分析，Cookie或跟踪数据，IP地址，设备信息",
      technical: "技术细节",
      technicalList: "数据仅存储在浏览器localStorage中，无服务器端存储，无第三方集成，完全离线工作，你完全控制你的数据",
    },
    privacyDataCollection: "数据收集",
    privacyDataCollectionText: "我们不收集任何个人数据、写作内容或使用分析。一切都保留在你的设备上。",
    privacyLocalStorage: "本地存储",
    privacyLocalStorageText: "你的写作使用localStorage保存在浏览器本地。我们永远无法访问这些数据。",
    privacyNoTracking: "无跟踪",
    privacyNoTrackingText: "我们不使用Cookie、分析或任何跟踪技术。你的隐私得到完全保护。",
    privacyOpenSource: "开源",
    privacyOpenSourceText: "我们的代码是开源的，可供审查。你可以自己验证我们的隐私声明。",

    // Terms of Service
    terms: "条款",
    termsTitle: "服务条款",
    termsIntro: "使用气的简单条款：",
    termsContent: {
      title: "服务条款",
      subtitle: "使用气的简单条款：",
      acceptance: "使用气即表示你同意这些条款。气是一个免费的写作应用，所有数据都本地存储在你的设备上。",
      service: "气提供简单、注重隐私的写作环境。你的所有内容都保留在你的设备上，由你控制。",
      responsibilities: "你的责任",
      responsibilitiesList:
        "定期备份重要内容，负责任和合法地使用应用，理解数据仅本地存储，如果使用PIN保护请保护好你的设备",
      limitations: "服务限制",
      limitationsList:
        "我们按'现状'提供应用，不提供保证，本地存储可能有浏览器限制，我们不对数据丢失负责，服务可能会更新或停止",
      termination: "你可以随时停止使用气。你的本地数据将保留在你的设备上，直到你清除它。",
      contact: "对这些条款有疑问？请联系我们：overthinkr9@gmail.com",
    },
    termsUse: "服务使用",
    termsUseText: "气免费提供个人和商业使用。你保留对内容的完全所有权。",
    termsData: "你的数据",
    termsDataText: "所有数据都本地存储在你的设备上。你有责任备份重要内容。",
    termsLimitations: "限制",
    termsLimitationsText: "我们按'现状'提供气，不提供保证。我们不对任何数据丢失或服务中断负责。",
    termsContact: "联系",
    termsContactText: "关于这些条款的问题，请联系我们：overthinkr9@gmail.com",

    // Contact
    contact: "联系",
    contactTitle: "联系我们",
    contactDescription: "与气团队取得联系",
    contactName: "姓名",
    contactNamePlaceholder: "你的姓名",
    contactEmail: "邮箱",
    contactEmailPlaceholder: "your@email.com",
    contactMessage: "消息",
    contactMessagePlaceholder: "告诉我们你的想法...",
    contactSend: "发送消息",
    contactSending: "发送中...",
    contactSuccess: "消息发送成功！",
    contactError: "发送消息失败。请重试。",
    contactDirectEmail: "或直接发邮件给我们：",
    close: "关闭",
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
