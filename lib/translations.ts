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

    // Landing page
    landing: {
      title: "One Page Binder",
      subtitle: "A quiet place to write and organize your thoughts",
      enter: "Enter App",
    },

    // Writing interface
    startWriting: "Start writing...",
    startWritingTimestamps: "Start writing... (Ctrl/Cmd+T for timestamp)",
    wordCount: "words",
    characterCount: "characters",
    placeholder: "Start writing your thoughts here...",

    // Focus exercises
    focus: {
      title: "Focus Exercises",
      subtitle: "Mindful prompts to help you get started",
      getStarted: "Try this to get started:",
    },
    focusExercises: "Focus Exercises",
    tryThis: "Try this:",
    exercises: {
      rightNow: {
        title: "Right now I notice…",
        prompt: 'Complete the phrase "Right now I notice…" three times. Don\'t overthink it.',
        icon: "🧘",
        category: "Grounding + expressive",
      },
      todayOnly: {
        title: "Write one sentence that could only happen today.",
        prompt: "Look at your day so far. What happened that could only happen today? Capture it in a sentence.",
        icon: "📅",
        category: "Time anchoring + creative memory",
      },
      objectView: {
        title: "Choose an object near you. What has it seen today?",
        prompt: "Pick something nearby. Tell a moment from its point of view.",
        icon: "🪞",
        category: "Perspective shift + imaginative entry",
      },
      colorFeeling: {
        title: "Write a sentence where you swap a feeling with a color.",
        prompt: 'Example: "She left and the room turned blue." Now try your own.',
        icon: "🎨",
        category: "Metaphor training + emotion unlocking",
      },
      tenWords: {
        title: "Tell me something true in exactly ten words.",
        prompt: "Use exactly 10 words. Make them count. It can be funny, deep, or simple.",
        icon: "🧠",
        category: "Constraint-driven flow + honesty",
      },
    },

    // Toolbar
    toolbar: {
      home: "Home",
      bookView: "Book View",
      export: "Export",
      import: "Import",
      share: "Share",
      print: "Print",
    },

    // Editor
    editor: {
      placeholder: "Start writing your thoughts here...",
    },

    // Export functionality
    export: {
      success: "Export successful!",
      error: "Export failed. Please try again.",
      noContent: "Nothing to export. Please write something first.",
      formats: {
        txt: "Text File (.txt)",
        docx: "Word Document (.docx)",
        pdf: "PDF Document (.pdf)",
        html: "HTML File (.html)",
      },
    },

    // Import functionality
    import: {
      success: "File imported successfully!",
    },

    // Timestamp functionality
    timestamp: {
      format: "Timestamp Format",
      customFormat: "Custom Format",
      formats: {
        iso: "ISO Format",
        locale: "Local Format",
        custom: "Custom Format",
      },
    },

    // PIN/Lock functionality
    pin: {
      setup: "Setup PIN",
      unlock: "Unlock",
      lock: "Lock",
      locked: "Content Locked",
      lockedMessage: "Your content is protected with a PIN.",
      setPin: "Set PIN",
      enterPin: "Enter PIN",
      setPinFirst: "Please set a PIN first",
      unlocked: "Content unlocked successfully",
      incorrect: "Incorrect PIN",
    },

    // Auto-save
    autosave: {
      saved: "Last saved",
    },

    // Footer
    footer: {
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
    },

    // Privacy Policy
    privacy: {
      title: "Privacy Policy",
      intro: "Your privacy is our top priority. Here's how we protect it:",
      dataCollection: {
        title: "Data Collection",
        content:
          "We don't collect any personal data, writing content, or usage analytics. Everything stays on your device.",
      },
      dataStorage: {
        title: "Data Storage",
        content: "Your writing is saved locally in your browser using localStorage. We never have access to this data.",
      },
      dataSharing: {
        title: "Data Sharing",
        content: "We don't share any data with third parties because we don't collect any data in the first place.",
      },
      userRights: {
        title: "Your Rights",
        content: "You have complete control over your data. You can clear it anytime by clearing your browser storage.",
      },
      contact: {
        title: "Contact",
        content: "If you have any privacy concerns, please contact us at privacy@onepageBinder.com",
      },
    },

    // Terms of Service
    terms: {
      title: "Terms of Service",
      intro: "Simple terms for using One Page Binder:",
      acceptance: {
        title: "Acceptance",
        content:
          "By using One Page Binder, you agree to these terms. The service is provided as-is for personal and commercial use.",
      },
      serviceDescription: {
        title: "Service Description",
        content: "One Page Binder is a writing application that stores all data locally on your device.",
      },
      userResponsibilities: {
        title: "User Responsibilities",
        content: "You are responsible for backing up your content and using the service legally and responsibly.",
      },
      limitations: {
        title: "Limitations",
        content:
          "We provide the service without warranties. We're not liable for any data loss or service interruptions.",
      },
      changes: {
        title: "Changes",
        content: "We may update these terms occasionally. Continued use constitutes acceptance of any changes.",
      },
    },

    // Contact
    contact: {
      title: "Contact Us",
      intro: "Get in touch with the One Page Binder team:",
      email: {
        label: "Email",
        value: "hello@onepageBinder.com",
      },
      website: {
        label: "Website",
        value: "https://onepageBinder.com",
      },
      response: "We typically respond within 24 hours.",
    },
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

    // Landing page
    landing: {
      title: "一页装订器",
      subtitle: "安静的写作和整理思绪的地方",
      enter: "进入应用",
    },

    // Writing interface
    startWriting: "开始写作...",
    startWritingTimestamps: "开始写作... (Ctrl/Cmd+T 插入时间戳)",
    wordCount: "字数",
    characterCount: "字符数",
    placeholder: "在这里开始写下你的想法...",

    // Focus exercises
    focus: {
      title: "专注练习",
      subtitle: "帮助你开始写作的正念提示",
      getStarted: "试试这个来开始：",
    },
    focusExercises: "专注练习",
    tryThis: "试试这个：",
    exercises: {
      rightNow: {
        title: "现在我注意到…",
        prompt: '完成这个句子"现在我注意到…"三次。不要过度思考。',
        icon: "🧘",
        category: "接地气 + 表达性",
      },
      todayOnly: {
        title: "写一句只有今天才会发生的话。",
        prompt: "回顾你今天到目前为止的经历。什么事情只有今天才会发生？用一句话记录下来。",
        icon: "📅",
        category: "时间锚定 + 创意记忆",
      },
      objectView: {
        title: "选择你附近的一个物体。它今天看到了什么？",
        prompt: "选择附近的某样东西。从它的角度讲述一个时刻。",
        icon: "🪞",
        category: "视角转换 + 想象力入口",
      },
      colorFeeling: {
        title: "写一句话，把感觉和颜色互换。",
        prompt: '例如："她离开了，房间变成了蓝色。" 现在试试你自己的。',
        icon: "🎨",
        category: "隐喻训练 + 情感解锁",
      },
      tenWords: {
        title: "用恰好十个字说一件真实的事。",
        prompt: "恰好用10个字。让它们有意义。可以是有趣的、深刻的或简单的。",
        icon: "🧠",
        category: "约束驱动流 + 诚实",
      },
    },

    // Toolbar
    toolbar: {
      home: "主页",
      bookView: "书本视图",
      export: "导出",
      import: "导入",
      share: "分享",
      print: "打印",
    },

    // Editor
    editor: {
      placeholder: "在这里开始写下你的想法...",
    },

    // Export functionality
    export: {
      success: "导出成功！",
      error: "导出失败。请重试。",
      noContent: "没有内容可导出。请先写点什么。",
      formats: {
        txt: "文本文件 (.txt)",
        docx: "Word文档 (.docx)",
        pdf: "PDF文档 (.pdf)",
        html: "HTML文件 (.html)",
      },
    },

    // Import functionality
    import: {
      success: "文件导入成功！",
    },

    // Timestamp functionality
    timestamp: {
      format: "时间戳格式",
      customFormat: "自定义格式",
      formats: {
        iso: "ISO格式",
        locale: "本地格式",
        custom: "自定义格式",
      },
    },

    // PIN/Lock functionality
    pin: {
      setup: "设置密码",
      unlock: "解锁",
      lock: "锁定",
      locked: "内容已锁定",
      lockedMessage: "你的内容受密码保护。",
      setPin: "设置密码",
      enterPin: "输入密码",
      setPinFirst: "请先设置密码",
      unlocked: "内容解锁成功",
      incorrect: "密码错误",
    },

    // Auto-save
    autosave: {
      saved: "上次保存",
    },

    // Footer
    footer: {
      privacy: "隐私",
      terms: "条款",
      contact: "联系",
    },

    // Privacy Policy
    privacy: {
      title: "隐私政策",
      intro: "你的隐私是我们的首要任务。以下是我们如何保护它：",
      dataCollection: {
        title: "数据收集",
        content: "我们不收集任何个人数据、写作内容或使用分析。一切都保留在你的设备上。",
      },
      dataStorage: {
        title: "数据存储",
        content: "你的写作使用localStorage保存在浏览器本地。我们永远无法访问这些数据。",
      },
      dataSharing: {
        title: "数据共享",
        content: "我们不与第三方共享任何数据，因为我们首先不收集任何数据。",
      },
      userRights: {
        title: "你的权利",
        content: "你完全控制你的数据。你可以随时通过清除浏览器存储来清除它。",
      },
      contact: {
        title: "联系",
        content: "如果你有任何隐私问题，请联系我们：privacy@onepageBinder.com",
      },
    },

    // Terms of Service
    terms: {
      title: "服务条款",
      intro: "使用一页装订器的简单条款：",
      acceptance: {
        title: "接受",
        content: "使用一页装订器即表示你同意这些条款。该服务按现状提供，供个人和商业使用。",
      },
      serviceDescription: {
        title: "服务描述",
        content: "一页装订器是一个将所有数据本地存储在你设备上的写作应用程序。",
      },
      userResponsibilities: {
        title: "用户责任",
        content: "你有责任备份你的内容并合法负责地使用该服务。",
      },
      limitations: {
        title: "限制",
        content: "我们不提供保证地提供服务。我们不对任何数据丢失或服务中断负责。",
      },
      changes: {
        title: "变更",
        content: "我们可能偶尔更新这些条款。继续使用即表示接受任何变更。",
      },
    },

    // Contact
    contact: {
      title: "联系我们",
      intro: "与一页装订器团队取得联系：",
      email: {
        label: "邮箱",
        value: "hello@onepageBinder.com",
      },
      website: {
        label: "网站",
        value: "https://onepageBinder.com",
      },
      response: "我们通常在24小时内回复。",
    },
  },
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".")
  let value: unknown = translations[language]

  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k]
  }

  return (value as string) || key
}
