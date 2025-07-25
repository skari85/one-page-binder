export type Language = "en" | "zh"

export const translations = {
  en: {
    landing: {
      title: "Qi",
      subtitle: "One Page Binder",
      description: "A simple, focused writing space for your thoughts and ideas.",
      enter: "Enter",
      footer: {
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact",
      },
    },
    app: {
      title: "Qi - One Page Binder",
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
      placeholder: "Start writing...",
      wordCount: "words",
      charCount: "characters",
      saving: "Saving...",
      autoSaved: "Auto-saved",
      locked: "Locked",
      unlocked: "Unlocked",
      pinSet: "PIN set successfully",
      wrongPin: "Wrong PIN",
      unlockTitle: "Enter PIN to unlock",
      unlockDescription: "Your content is protected with a PIN",
      enterPin: "Enter PIN",
      unlock: "Unlock",
      setPinTitle: "Set PIN",
      setPinDescription: "Set a 4-digit PIN to protect your content",
      shareOptions: {
        twitter: "Share on Twitter",
        facebook: "Share on Facebook",
        linkedin: "Share on LinkedIn",
        copy: "Copy Link",
      },
      exportOptions: {
        txt: "Export as TXT",
        docx: "Export as DOCX",
        pdf: "Print as PDF",
        html: "Export as HTML",
      },
      timestampFormats: {
        none: "None",
        date: "Date only",
        time: "Time only",
        datetime: "Date & Time",
        iso: "ISO Format",
      },
    },
    focus: {
      title: "Focus",
      subtitle: "Mindful writing exercises to get you started",
      suggestion: {
        title: "Try a focus exercise",
        description: "Get started with a mindful writing prompt",
        button: "Try it",
      },
      exercises: {
        grounding: "Right now I notice...",
        today: "Write one sentence that could only happen today.",
        object: "Choose an object near you. What has it seen today?",
        color: "Write a sentence where you swap a feeling with a color.",
        truth: "Tell me something true in exactly ten words.",
      },
    },
    privacy: {
      title: "Privacy Policy",
      content:
        "Your privacy is important to us. All your writing is stored locally on your device and never sent to our servers.",
      close: "Close",
    },
    terms: {
      title: "Terms of Service",
      content: "By using this application, you agree to use it responsibly and in accordance with applicable laws.",
      close: "Close",
    },
    contact: {
      title: "Contact Us",
      content: "For questions or support, please email us at support@qi-writer.com",
      close: "Close",
    },
  },
  zh: {
    landing: {
      title: "气",
      subtitle: "一页装订器",
      description: "一个简单、专注的写作空间，用于记录您的想法和创意。",
      enter: "进入",
      footer: {
        privacy: "隐私",
        terms: "条款",
        contact: "联系",
      },
    },
    app: {
      title: "气 - 一页装订器",
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
      placeholder: "开始写作...",
      wordCount: "字",
      charCount: "字符",
      saving: "保存中...",
      autoSaved: "自动保存",
      locked: "已锁定",
      unlocked: "已解锁",
      pinSet: "密码设置成功",
      wrongPin: "密码错误",
      unlockTitle: "输入密码解锁",
      unlockDescription: "您的内容受密码保护",
      enterPin: "输入密码",
      unlock: "解锁",
      setPinTitle: "设置密码",
      setPinDescription: "设置4位数字密码保护您的内容",
      shareOptions: {
        twitter: "分享到Twitter",
        facebook: "分享到Facebook",
        linkedin: "分享到LinkedIn",
        copy: "复制链接",
      },
      exportOptions: {
        txt: "导出为TXT",
        docx: "导出为DOCX",
        pdf: "打印为PDF",
        html: "导出为HTML",
      },
      timestampFormats: {
        none: "无",
        date: "仅日期",
        time: "仅时间",
        datetime: "日期和时间",
        iso: "ISO格式",
      },
    },
    focus: {
      title: "专注",
      subtitle: "正念写作练习帮助您开始",
      suggestion: {
        title: "尝试专注练习",
        description: "从正念写作提示开始",
        button: "试试看",
      },
      exercises: {
        grounding: "现在我注意到...",
        today: "写一句只有今天才会发生的话。",
        object: "选择你身边的一个物体。它今天看到了什么？",
        color: "写一句话，用颜色来替换一种感觉。",
        truth: "用恰好十个字告诉我一些真实的事情。",
      },
    },
    privacy: {
      title: "隐私政策",
      content: "您的隐私对我们很重要。您的所有写作内容都存储在您的设备本地，绝不会发送到我们的服务器。",
      close: "关闭",
    },
    terms: {
      title: "服务条款",
      content: "使用此应用程序即表示您同意负责任地使用它并遵守适用法律。",
      close: "关闭",
    },
    contact: {
      title: "联系我们",
      content: "如有问题或需要支持，请发送邮件至 support@qi-writer.com",
      close: "关闭",
    },
  },
}

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
