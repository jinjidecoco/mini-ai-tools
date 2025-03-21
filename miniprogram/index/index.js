Page({
  data: {
    // 快速工具列表
    quickTools: [
      {
        id: 1,
        name: '文本生成',
        icon: '../../assets/icons/text-tool.svg',
        color: 'blue',
        url: '/pages/tools/text-generation/index'
      },
      {
        id: 2,
        name: '图片处理',
        icon: '../../assets/icons/image-tool.svg',
        color: 'green',
        url: '/pages/tools/image-processing/index'
      },
      {
        id: 3,
        name: '语音转文字',
        icon: '../../assets/icons/voice-tool.svg',
        color: 'purple',
        url: '/pages/tools/voice-to-text/index'
      },
      {
        id: 4,
        name: '文档转换',
        icon: '../../assets/icons/document-tool.svg',
        color: 'yellow',
        url: '/pages/tools/document-converter/index'
      },
      {
        id: 5,
        name: '二维码',
        icon: '../../assets/icons/qrcode-tool.svg',
        color: 'blue',
        url: '/pages/tools/qrcode-generator/index'
      },
      {
        id: 6,
        name: '翻译助手',
        icon: '../../assets/icons/translate-tool.svg',
        color: 'green',
        url: '/pages/tools/translator/index'
      },
      {
        id: 7,
        name: '计算器',
        icon: '../../assets/icons/calculator-tool.svg',
        color: 'purple',
        url: '/pages/tools/calculator/index'
      },
      {
        id: 8,
        name: '更多工具',
        icon: '../../assets/icons/more-tool.svg',
        color: 'gray',
        url: '/pages/categories/index'
      }
    ],

    // 热门工具列表
    popularTools: [
      {
        id: 101,
        name: 'AI写作助手',
        icon: '../../assets/icons/ai-write.svg',
        image: '../../assets/icons/ai-write.svg',
        color: 'blue',
        description: '智能完成各类文案写作，轻松提升写作效率',
        usageCount: '25.3万',
        url: '/pages/tools/ai-writing/index'
      },
      {
        id: 102,
        name: '智能图片生成',
        icon: '../../assets/icons/ai-image.svg',
        image: '../../assets/icons/ai-image.svg',
        color: 'green',
        description: '用AI生成高质量图片，激发创作灵感',
        usageCount: '18.7万',
        url: '/pages/tools/ai-image-generation/index'
      },
      {
        id: 103,
        name: '简历优化助手',
        icon: '../../assets/icons/resume-tool.svg',
        image: '../../assets/icons/resume-tool.svg',
        color: 'purple',
        description: '职场必备，优化简历内容，提升求职成功率',
        usageCount: '10.2万',
        url: '/pages/tools/resume-optimizer/index'
      }
    ],

    // 最近使用的工具
    recentTools: [
      {
        id: 201,
        name: '文本润色',
        icon: '../../assets/icons/text-polish.svg',
        color: 'blue',
        description: '一键优化文本表达，让文章更专业流畅',
        url: '/pages/tools/text-polishing/index'
      },
      {
        id: 202,
        name: '语法检查',
        icon: '../../assets/icons/grammar.svg',
        color: 'green',
        description: '智能检测语法错误，提高写作质量',
        url: '/pages/tools/grammar-check/index'
      },
      {
        id: 203,
        name: '海报设计',
        icon: '../../assets/icons/poster.svg',
        color: 'purple',
        description: '快速创建精美海报，提升营销效果',
        url: '/pages/tools/poster-design/index'
      },
      {
        id: 204,
        name: '语音合成',
        icon: '../../assets/icons/voice-synth.svg',
        color: 'yellow',
        description: '将文本转换为自然流畅的语音',
        url: '/pages/tools/voice-synthesis/index'
      }
    ]
  },

  // ...保留其余代码...
}