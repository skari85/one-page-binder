export type Language = "en" | "zh"

export const translations = {
  en: {
    appName: "Qi",
    tagline: "A quiet place to write",
    enter: "Enter",
    landing: {
      title: "Qi",
      subtitle: "A quiet place to write",
      enter: "Enter Qi",
    },
    footer: {
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
    },
    privacy: {
      title: "Privacy Policy",
      intro: "Your privacy is important to us. This policy explains how we handle your data.",
      dataCollection: {
        title: "Data Collection",
        content: "We do not collect any personal data. All your writing is stored locally on your device.",
      },
      dataStorage: {
        title: "Data Storage",
        content: "Your content is stored in your browser's local storage and never leaves your device.",
      },
      dataSharing: {
        title: "Data Sharing",
        content: "We do not share any data with third parties because we don't collect any data.",
      },
      userRights: {
        title: "Your Rights",
        content: "You have full control over your data. You can clear it anytime by clearing your browser storage.",
      },
      contact: {
        title: "Contact Us",
        content: "If you have questions about this policy, contact us at overthinkr9@gmail.com",
      },
    },
    terms: {
      title: "Terms of Service",
      intro: "By using this service, you agree to these terms.",
      acceptance: {
        title: "Acceptance",
        content: "By accessing and using this service, you accept and agree to be bound by these terms.",
      },
      serviceDescription: {
        title: "Service Description",
        content: "Qi is a simple writing application that stores your content locally on your device.",
      },
      userResponsibilities: {
        title: "User Responsibilities",
        content: "You are responsible for your content and ensuring you have the right to write and store it.",
      },
      limitations: {
        title: "Limitations",
        content: "This service is provided as-is without warranties. We are not liable for any data loss.",
      },
      changes: {
        title: "Changes",
        content: "We may update these terms at any time. Continued use constitutes acceptance of new terms.",
      },
    },
    contact: {
      title: "Contact Us",
      intro: "Get in touch with us for any questions or feedback.",
      email: {
        label: "Email",
        value: "overthinkr9@gmail.com",
      },
      website: {
        label: "Website",
        value: "qi.app",
      },
      response: "We'll get back to you as soon as possible.",
    },
    toolbar: {
      home: "Home",
      bookView: "Book View",
      export: "Export",
      import: "Import",
      share: "Share",
      print: "Print",
    },
    focus: {
      title: "Focus Exercises",
      subtitle: "Mindful prompts to help you get started writing",
      getStarted: "Try this to get started:",
    },
    exercises: {
      rightNow: {
        title: "Present Moment",
        prompt: "Right now I notice...",
        icon: "🧘",
        category: "Grounding",
      },
      todayOnly: {
        title: "Today's Unique Moment",
        prompt: "Write one sentence that could only happen today.",
        icon: "📅",
        category: "Time Anchoring",
      },
      objectView: {
        title: "Object's Perspective",
        prompt: "Choose an object near you. What has it seen today?",
        icon: "🪞",
        category: "Perspective Shift",
      },
      colorFeeling: {
        title: "Color Metaphor",
        prompt: "Write a sentence where you swap a feeling with a color.",
        icon: "🎨",
        category: "Metaphor Training",
      },
      tenWords: {
        title: "Ten Word Truth",
        prompt: "Tell me something true in exactly ten words.",
        icon: "🧠",
        category: "Constraint Writing",
      },
    },
    tryThis: "Try this to get started:",
    export: {
      noContent: "No content to export",
      success: "Export successful",
      error: "Export failed",
      formats: {
        txt: "Text File (.txt)",
        docx: "Word Document (.docx)",
        pdf: "PDF Document (.pdf)",
        html: "HTML File (.html)",
      },
    },
    import: {
      success: "File imported successfully",
    },
    timestamp: {
      format: "Timestamp Format",
      customFormat: "Custom Format",
      formats: {
        iso: "ISO Format",
        locale: "Local Format",
        custom: "Custom Format",
      },
    },
    pin: {
      setup: "Setup PIN",
      unlock: "Unlock",
      lock: "Lock",
      locked: "Content Locked",
      lockedMessage: "Enter your PIN to access your writing",
      setPin: "Set PIN",
      enterPin: "Enter PIN",
      setPinFirst: "Please set a PIN first",
      unlocked: "Content unlocked",
      incorrect: "Incorrect PIN",
    },
    autosave: {
      saved: "Last saved",
    },
    editor: {
      placeholder: "Start writing...",
    },
  },
  zh: {
    appName: "气",
    tagline: "安静的写作空间",
    enter: "进入",
    landing: {
      title: "气",
      subtitle: "安静的写作空间",
      enter: "进入气",
    },
    footer: {
      privacy: "隐私政策",
      terms: "服务条款",
      contact: "联系我们",
    },
    privacy: {
      title: "隐私政策",
      intro: "您的隐私对我们很重要。此政策说明我们如何处理您的数据。",
      dataCollection: {
        title: "数据收集",
        content: "我们不收集任何个人数据。您的所有写作内容都存储在您的设备本地。",
      },
      dataStorage: {
        title: "数据存储",
        content: "您的内容存储在浏览器的本地存储中，永远不会离开您的设备。",
      },
      dataSharing: {
        title: "数据共享",
        content: "我们不与第三方共享任何数据，因为我们不收集任何数据。",
      },
      userRights: {
        title: "您的权利",
        content: "您完全控制您的数据。您可以随时通过清除浏览器存储来清除数据。",
      },
      contact: {
        title: "联系我们",
        content: "如果您对此政策有疑问，请通过 overthinkr9@gmail.com 联系我们",
      },
    },
    terms: {
      title: "服务条款",
      intro: "使用此服务即表示您同意这些条款。",
      acceptance: {
        title: "接受条款",
        content: "通过访问和使用此服务，您接受并同意受这些条款约束。",
      },
      serviceDescription: {
        title: "服务描述",
        content: "气是一个简单的写作应用程序，将您的内容本地存储在您的设备上。",
      },
      userResponsibilities: {
        title: "用户责任",
        content: "您对您的内容负责，并确保您有权编写和存储它。",
      },
      limitations: {
        title: "限制",
        content: "此服务按原样提供，不提供保证。我们不对任何数据丢失负责。",
      },
      changes: {
        title: "更改",
        content: "我们可能随时更新这些条款。继续使用即表示接受新条款。",
      },
    },
    contact: {
      title: "联系我们",
      intro: "如有任何问题或反馈，请与我们联系。",
      email: {
        label: "邮箱",
        value: "overthinkr9@gmail.com",
      },
      website: {
        label: "网站",
        value: "qi.app",
      },
      response: "我们会尽快回复您。",
    },
    toolbar: {
      home: "首页",
      bookView: "书本视图",
      export: "导出",
      import: "导入",
      share: "分享",
      print: "打印",
    },
    focus: {
      title: "专注练习",
      subtitle: "帮助您开始写作的正念提示",
      getStarted: "试试这个开始：",
    },
    exercises: {
      rightNow: {
        title: "当下时刻",
        prompt: "现在我注意到...",
        icon: "🧘",
        category: "扎根练习",
      },
      todayOnly: {
        title: "今日独特时刻",
        prompt: "写一句只有今天才会发生的话。",
        icon: "📅",
        category: "时间锚定",
      },
      objectView: {
        title: "物体视角",
        prompt: "选择你身边的一个物体。它今天看到了什么？",
        icon: "🪞",
        category: "视角转换",
      },
      colorFeeling: {
        title: "颜色隐喻",
        prompt: "写一句话，用颜色来替换一种感觉。",
        icon: "🎨",
        category: "隐喻训练",
      },
      tenWords: {
        title: "十字真言",
        prompt: "用恰好十个字告诉我一些真实的事情。",
        icon: "🧠",
        category: "限制写作",
      },
    },
    tryThis: "试试这个开始：",
    export: {
      noContent: "没有内容可导出",
      success: "导出成功",
      error: "导出失败",
      formats: {
        txt: "文本文件 (.txt)",
        docx: "Word文档 (.docx)",
        pdf: "PDF文档 (.pdf)",
        html: "HTML文件 (.html)",
      },
    },
    import: {
      success: "文件导入成功",
    },
    timestamp: {
      format: "时间戳格式",
      customFormat: "自定义格式",
      formats: {
        iso: "ISO格式",
        locale: "本地格式",
        custom: "自定义格式",
      },
    },
    pin: {
      setup: "设置密码",
      unlock: "解锁",
      lock: "锁定",
      locked: "内容已锁定",
      lockedMessage: "输入您的密码以访问您的写作",
      setPin: "设置密码",
      enterPin: "输入密码",
      setPinFirst: "请先设置密码",
      unlocked: "内容已解锁",
      incorrect: "密码错误",
    },
    autosave: {
      saved: "最后保存",
    },
    editor: {
      placeholder: "开始写作...",
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
      return key // Return the key if translation not found
    }
  }

  return typeof value === "string" ? value : key
}
