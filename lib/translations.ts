export const translations = {
  en: {
    landing: {
      title: "Qi",
      subtitle: "A quiet place to write",
      description:
        "A minimalist writing application focused on privacy and simplicity. Everything saves locally, no cloud storage, no tracking.",
      enter: "Enter",
      footer: {
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact",
      },
    },
    privacy: {
      title: "Privacy Policy",
      content:
        "Your privacy is important to us. This application stores all data locally on your device. We do not collect, store, or transmit any personal information or writing content to external servers.",
      close: "Close",
    },
    terms: {
      title: "Terms of Service",
      content:
        "By using this application, you agree to use it responsibly and in accordance with applicable laws. The application is provided as-is without warranties.",
      close: "Close",
    },
    contact: {
      title: "Contact Us",
      content: "For questions or support, please reach out to us at support@qi-writer.com",
      close: "Close",
    },
    app: {
      home: "Home",
      view: "View",
      single: "Single",
      book: "Book",
      pageSize: "Page Size",
      share: "Share",
      export: "Export",
      print: "Print",
      import: "Import",
      timestamp: "Timestamp",
      pin: "PIN",
      lock: "Lock",
      unlock: "Unlock",
      setPinTitle: "Set PIN",
      setPinDescription: "Enter a 4-digit PIN to lock your writing",
      enterPin: "Enter PIN",
      unlockTitle: "Enter PIN to Unlock",
      unlockDescription: "Enter your 4-digit PIN to access your writing",
      wrongPin: "Wrong PIN. Try again.",
      pinSet: "PIN set successfully",
      unlocked: "Unlocked successfully",
      locked: "Writing locked",
      wordCount: "words",
      charCount: "characters",
      autoSaved: "Auto-saved",
      saving: "Saving...",
      placeholder: "Start writing...",
      exportOptions: {
        txt: "Export as TXT",
        docx: "Export as DOCX",
        pdf: "Export as PDF",
        html: "Export as HTML",
      },
      timestampFormats: {
        none: "None",
        date: "Date only",
        time: "Time only",
        datetime: "Date & Time",
        iso: "ISO Format",
      },
      shareOptions: {
        twitter: "Share on Twitter",
        facebook: "Share on Facebook",
        linkedin: "Share on LinkedIn",
        copy: "Copy Link",
      },
    },
    focus: {
      title: "Focus Exercises",
      subtitle: "Mindful prompts to help you start writing",
      exercises: {
        grounding: "Right now I notice...",
        today: "Write one sentence that could only happen today.",
        object: "Choose an object near you. What has it seen today?",
        color: "Write a sentence where you swap a feeling with a color.",
        truth: "Tell me something true in exactly ten words.",
      },
      suggestion: {
        title: "Need help getting started?",
        description: "Try a mindful writing exercise to spark your creativity.",
        button: "Get a writing prompt",
      },
    },
  },
  zh: {
    landing: {
      title: "气",
      subtitle: "安静的写作空间",
      description: "专注于隐私和简洁的极简写作应用。所有内容本地保存，无云存储，无追踪。",
      enter: "进入",
      footer: {
        privacy: "隐私政策",
        terms: "服务条款",
        contact: "联系我们",
      },
    },
    privacy: {
      title: "隐私政策",
      content:
        "您的隐私对我们很重要。此应用程序将所有数据本地存储在您的设备上。我们不收集、存储或向外部服务器传输任何个人信息或写作内容。",
      close: "关闭",
    },
    terms: {
      title: "服务条款",
      content: "使用此应用程序即表示您同意负责任地使用它并遵守适用法律。应用程序按原样提供，不提供任何保证。",
      close: "关闭",
    },
    contact: {
      title: "联系我们",
      content: "如有问题或需要支持，请通过 support@qi-writer.com 联系我们",
      close: "关闭",
    },
    app: {
      home: "首页",
      view: "视图",
      single: "单页",
      book: "书本",
      pageSize: "页面大小",
      share: "分享",
      export: "导出",
      print: "打印",
      import: "导入",
      timestamp: "时间戳",
      pin: "密码",
      lock: "锁定",
      unlock: "解锁",
      setPinTitle: "设置密码",
      setPinDescription: "输入4位数字密码来锁定您的写作",
      enterPin: "输入密码",
      unlockTitle: "输入密码解锁",
      unlockDescription: "输入您的4位数字密码来访问您的写作",
      wrongPin: "密码错误，请重试。",
      pinSet: "密码设置成功",
      unlocked: "解锁成功",
      locked: "写作已锁定",
      wordCount: "字",
      charCount: "字符",
      autoSaved: "自动保存",
      saving: "保存中...",
      placeholder: "开始写作...",
      exportOptions: {
        txt: "导出为TXT",
        docx: "导出为DOCX",
        pdf: "导出为PDF",
        html: "导出为HTML",
      },
      timestampFormats: {
        none: "无",
        date: "仅日期",
        time: "仅时间",
        datetime: "日期和时间",
        iso: "ISO格式",
      },
      shareOptions: {
        twitter: "分享到Twitter",
        facebook: "分享到Facebook",
        linkedin: "分享到LinkedIn",
        copy: "复制链接",
      },
    },
    focus: {
      title: "专注练习",
      subtitle: "帮助您开始写作的正念提示",
      exercises: {
        grounding: "现在我注意到...",
        today: "写一句只有今天才会发生的话。",
        object: "选择您附近的一个物体。它今天看到了什么？",
        color: "写一句话，将感觉与颜色互换。",
        truth: "用十个字告诉我一些真实的事情。",
      },
      suggestion: {
        title: "需要帮助开始吗？",
        description: "尝试正念写作练习来激发您的创造力。",
        button: "获取写作提示",
      },
    },
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

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
          return key // Return key if not found
        }
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}
