export interface Translations {
  [key: string]: any
}

export const translations: Record<string, Translations> = {
  en: {
    landing: {
      title: "Qi",
      subtitle: "A quiet place to write",
      enter: "Enter",
      footer: {
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact",
      },
    },
    app: {
      title: "One Page Binder",
      home: "Home",
      save: "Save",
      export: "Export",
      print: "Print",
      share: "Share",
      settings: "Settings",
      lock: "Lock",
      unlock: "Unlock",
      enterPin: "Enter PIN",
      setPin: "Set PIN",
      confirmPin: "Confirm PIN",
      wrongPin: "Wrong PIN",
      pinSet: "PIN set successfully",
      autoSave: "Auto-save",
      wordCount: "words",
      characterCount: "characters",
      timestamp: "Timestamp",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      language: "Language",
      pageSize: "Page Size",
      viewMode: "View Mode",
      singlePage: "Single Page",
      bookView: "Book View",
      exportOptions: {
        txt: "Export as TXT",
        docx: "Export as DOCX",
        pdf: "Export as PDF",
        html: "Export as HTML",
      },
      shareOptions: {
        twitter: "Share on Twitter",
        facebook: "Share on Facebook",
        linkedin: "Share on LinkedIn",
        email: "Share via Email",
      },
      timestampFormats: {
        none: "None",
        iso: "ISO Format",
        locale: "Local Format",
        custom: "Custom Format",
      },
      placeholder: "Start writing...",
      offline: "You are offline",
      online: "You are online",
    },
    focus: {
      title: "Focus Exercises",
      subtitle: "Mindful prompts to get you started",
      exercises: [
        "Right now I notice...",
        "Write one sentence that could only happen today.",
        "Choose an object near you. What has it seen today?",
        "Write a sentence where you swap a feeling with a color.",
        "Tell me something true in exactly ten words.",
      ],
      contextualPrompt: "Need inspiration? Try a focus exercise to get started.",
      tryExercise: "Try an exercise",
    },
    dialogs: {
      privacy: {
        title: "Privacy Policy",
        content:
          "Your privacy is important to us. This application stores your writing locally on your device. We do not collect, store, or transmit any of your personal writing content to external servers. All data remains private and under your control.",
      },
      terms: {
        title: "Terms of Service",
        content:
          "By using this application, you agree to use it responsibly and in accordance with applicable laws. The application is provided as-is, without warranties. You retain full ownership of any content you create.",
      },
      contact: {
        title: "Contact Us",
        content:
          "For support or feedback, please reach out to us at support@onepageBinder.com. We appreciate your input and will respond as soon as possible.",
      },
    },
  },
  zh: {
    landing: {
      title: "气",
      subtitle: "安静的写作空间",
      enter: "进入",
      footer: {
        privacy: "隐私",
        terms: "条款",
        contact: "联系",
      },
    },
    app: {
      title: "单页装订器",
      home: "首页",
      save: "保存",
      export: "导出",
      print: "打印",
      share: "分享",
      settings: "设置",
      lock: "锁定",
      unlock: "解锁",
      enterPin: "输入密码",
      setPin: "设置密码",
      confirmPin: "确认密码",
      wrongPin: "密码错误",
      pinSet: "密码设置成功",
      autoSave: "自动保存",
      wordCount: "字数",
      characterCount: "字符数",
      timestamp: "时间戳",
      theme: "主题",
      light: "浅色",
      dark: "深色",
      language: "语言",
      pageSize: "页面大小",
      viewMode: "查看模式",
      singlePage: "单页",
      bookView: "书本视图",
      exportOptions: {
        txt: "导出为TXT",
        docx: "导出为DOCX",
        pdf: "导出为PDF",
        html: "导出为HTML",
      },
      shareOptions: {
        twitter: "分享到Twitter",
        facebook: "分享到Facebook",
        linkedin: "分享到LinkedIn",
        email: "通过邮件分享",
      },
      timestampFormats: {
        none: "无",
        iso: "ISO格式",
        locale: "本地格式",
        custom: "自定义格式",
      },
      placeholder: "开始写作...",
      offline: "您处于离线状态",
      online: "您已连接网络",
    },
    focus: {
      title: "专注练习",
      subtitle: "帮助您开始写作的正念提示",
      exercises: [
        "现在我注意到...",
        "写一句只有今天才会发生的话。",
        "选择你附近的一个物体。它今天看到了什么？",
        "写一句话，把感觉和颜色互换。",
        "用十个字告诉我一些真实的事情。",
      ],
      contextualPrompt: "需要灵感？试试专注练习来开始吧。",
      tryExercise: "试试练习",
    },
    dialogs: {
      privacy: {
        title: "隐私政策",
        content:
          "您的隐私对我们很重要。此应用程序将您的写作内容本地存储在您的设备上。我们不会收集、存储或向外部服务器传输您的任何个人写作内容。所有数据都保持私密并在您的控制之下。",
      },
      terms: {
        title: "服务条款",
        content:
          "使用此应用程序即表示您同意负责任地使用它并遵守适用法律。应用程序按原样提供，不提供保证。您保留对所创建内容的完全所有权。",
      },
      contact: {
        title: "联系我们",
        content: "如需支持或反馈，请通过 support@onepageBinder.com 联系我们。我们重视您的意见，会尽快回复。",
      },
    },
  },
}

export function getTranslation(language: string, key: string): string {
  const keys = key.split(".")
  let value: any = translations[language] || translations.en

  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      // Fallback to English
      value = translations.en
      for (const fallbackKey of keys) {
        value = value?.[fallbackKey]
        if (value === undefined) {
          return key // Return the key if translation is not found
        }
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}
