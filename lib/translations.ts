export type Language = "en" | "zh"

export const translations = {
  en: {
    // Landing page
    landing: {
      title: "Qi",
      subtitle: "One Page Binder",
      description:
        "A minimalist writing space for your thoughts, ideas, and creativity. Focus on what matters most - your words.",
      enter: "Enter Writing Space",
      footer: {
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact",
      },
    },

    // Privacy dialog
    privacy: {
      title: "Privacy Policy",
      content:
        "Your privacy is important to us. All your writing is stored locally on your device and never sent to our servers. We use Vercel Analytics to understand how the app is used, but no personal content is collected.",
      close: "Close",
    },

    // Terms dialog
    terms: {
      title: "Terms of Service",
      content:
        "By using this application, you agree to use it responsibly. The app is provided as-is for personal writing and note-taking purposes. We are not responsible for any data loss, though we recommend regular backups of important content.",
      close: "Close",
    },

    // Contact dialog
    contact: {
      title: "Contact Us",
      content:
        "For questions, feedback, or support, please reach out to us at support@qi-app.com. We'd love to hear from you and help improve your writing experience.",
      close: "Close",
    },

    // Main app
    app: {
      home: "Home",
      view: "View",
      single: "Single Page",
      book: "Book View",
      share: "Share",
      export: "Export",
      print: "Print",
      import: "Import",
      timestamp: "Timestamp",
      pin: "PIN",
      placeholder: "Start writing your thoughts here...",
      wordCount: "words",
      charCount: "characters",
      saving: "Saving...",
      autoSaved: "Auto-saved",

      // Book view specific
      book: {
        previous: "Previous",
        next: "Next",
        page: "Page",
        pages: "Pages",
        of: "of",
        editContent: "Edit Content",
      },

      // Share options
      shareOptions: {
        twitter: "Share on Twitter",
        facebook: "Share on Facebook",
        linkedin: "Share on LinkedIn",
        copy: "Copy Link",
      },

      // Export options
      exportOptions: {
        txt: "Export as TXT",
        docx: "Export as DOCX",
        pdf: "Export as PDF",
        html: "Export as HTML",
      },

      // Timestamp formats
      timestampFormats: {
        none: "None",
        date: "Date Only",
        time: "Time Only",
        datetime: "Date & Time",
        iso: "ISO Format",
      },

      // PIN functionality
      unlockTitle: "Content Locked",
      unlockDescription: "Enter your 4-digit PIN to access your writing.",
      enterPin: "Enter PIN",
      unlock: "Unlock",
      setPinTitle: "Set PIN Lock",
      setPinDescription: "Create a 4-digit PIN to protect your writing.",
      pinSet: "PIN has been set successfully",
      unlocked: "Content unlocked",
      locked: "Content locked",
      wrongPin: "Incorrect PIN",
    },

    // Focus exercises
    focus: {
      title: "Focus",
      subtitle: "Mindful Writing Exercises",
      suggestion: {
        title: "Need inspiration?",
        description: "Try a mindful writing exercise to get started",
        button: "Try Exercise",
      },
      exercises: {
        grounding:
          "Take three deep breaths. Notice five things you can see, four things you can hear, three things you can touch, two things you can smell, and one thing you can taste. Now write about this moment.",
        today:
          "What made today unique? Write about one small moment that stood out to you, no matter how ordinary it might seem.",
        object:
          "Look around and choose one object near you. Describe it in detail - its texture, color, weight, and what memories or feelings it brings up.",
        color:
          "Pick a color you can see right now. Write about what this color means to you, what memories it holds, and how it makes you feel.",
        truth:
          "Complete this sentence: 'Something I've never told anyone is...' and continue writing whatever comes to mind.",
      },
    },
  },

  zh: {
    // Landing page
    landing: {
      title: "气",
      subtitle: "一页装订器",
      description: "为您的思想、想法和创造力提供的极简写作空间。专注于最重要的事情——您的文字。",
      enter: "进入写作空间",
      footer: {
        privacy: "隐私政策",
        terms: "服务条款",
        contact: "联系我们",
      },
    },

    // Privacy dialog
    privacy: {
      title: "隐私政策",
      content:
        "您的隐私对我们很重要。您的所有写作内容都存储在您的设备本地，绝不会发送到我们的服务器。我们使用 Vercel Analytics 来了解应用的使用情况，但不会收集任何个人内容。",
      close: "关闭",
    },

    // Terms dialog
    terms: {
      title: "服务条款",
      content:
        "使用此应用程序即表示您同意负责任地使用它。该应用按原样提供，用于个人写作和记笔记。我们不对任何数据丢失负责，但建议定期备份重要内容。",
      close: "关闭",
    },

    // Contact dialog
    contact: {
      title: "联系我们",
      content:
        "如有问题、反馈或需要支持，请通过 support@qi-app.com 联系我们。我们很乐意听取您的意见并帮助改善您的写作体验。",
      close: "关闭",
    },

    // Main app
    app: {
      home: "首页",
      view: "视图",
      single: "单页",
      book: "书本视图",
      share: "分享",
      export: "导出",
      print: "打印",
      import: "导入",
      timestamp: "时间戳",
      pin: "密码",
      placeholder: "在这里开始写下您的想法...",
      wordCount: "字",
      charCount: "字符",
      saving: "保存中...",
      autoSaved: "自动保存",

      // Book view specific
      book: {
        previous: "上一页",
        next: "下一页",
        page: "第",
        pages: "页",
        of: "共",
        editContent: "编辑内容",
      },

      // Share options
      shareOptions: {
        twitter: "分享到 Twitter",
        facebook: "分享到 Facebook",
        linkedin: "分享到 LinkedIn",
        copy: "复制链接",
      },

      // Export options
      exportOptions: {
        txt: "导出为 TXT",
        docx: "导出为 DOCX",
        pdf: "导出为 PDF",
        html: "导出为 HTML",
      },

      // Timestamp formats
      timestampFormats: {
        none: "无",
        date: "仅日期",
        time: "仅时间",
        datetime: "日期和时间",
        iso: "ISO 格式",
      },

      // PIN functionality
      unlockTitle: "内容已锁定",
      unlockDescription: "输入您的4位数字密码以访问您的写作内容。",
      enterPin: "输入密码",
      unlock: "解锁",
      setPinTitle: "设置密码锁",
      setPinDescription: "创建一个4位数字密码来保护您的写作内容。",
      pinSet: "密码设置成功",
      unlocked: "内容已解锁",
      locked: "内容已锁定",
      wrongPin: "密码错误",
    },

    // Focus exercises
    focus: {
      title: "专注",
      subtitle: "正念写作练习",
      suggestion: {
        title: "需要灵感？",
        description: "尝试正念写作练习来开始",
        button: "尝试练习",
      },
      exercises: {
        grounding:
          "深呼吸三次。注意你能看到的五样东西，能听到的四样东西，能触摸到的三样东西，能闻到的两样东西，以及能尝到的一样东西。现在写下这个时刻。",
        today: "今天有什么独特之处？写下一个让你印象深刻的小时刻，无论它看起来多么平凡。",
        object: "环顾四周，选择你附近的一个物体。详细描述它——它的质地、颜色、重量，以及它带给你的记忆或感受。",
        color: "选择一个你现在能看到的颜色。写下这个颜色对你意味着什么，它承载着什么记忆，以及它给你的感受。",
        truth: "完成这个句子：'我从未告诉过任何人的事情是...' 然后继续写下任何浮现在脑海中的内容。",
      },
    },
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
