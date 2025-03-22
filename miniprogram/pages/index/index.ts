// const app = getApp<IAppOption>()

// interface ToolItem {
//   id: number;
//   name: string;
//   icon: string;
//   color: string;
//   url: string;
// }

// interface PopularTool {
//   id: number;
//   name: string;
//   description: string;
//   image: string;
//   users: string;
//   url: string;
// }

// interface RecentTool {
//   id: number;
//   name: string;
//   description: string;
//   icon: string;
//   bgColor: string;
//   url: string;
// }

// Page({
//   data: {
//     userInfo: {},
//     hasUserInfo: false,
//     canIUseGetUserProfile: false,
//     quickTools: [
//       { id: 1, name: '文本生成', icon: '/assets/icons/text-tool.svg', color: '#EFF6FF', url: '/pages/tools/text-generation/index' },
//       { id: 2, name: 'AI去水印', icon: '/assets/icons/watermark-remover.svg', color: '#F0F4FF', url: '/pages/tools/watermark-remover/index' },
//       { id: 3, name: '语音转文字', icon: '/assets/icons/voice-tool.svg', color: '#F0FDF4', url: '/pages/tools/voice-transcription/index' },
//       { id: 4, name: '作业检查', icon: '/assets/icons/homework-check.svg', color: '#FEF3C7', url: '/pages/tools/homework-checker/index' }
//     ],
//     popularTools: [
//       { id: 1, name: '文本生成', icon: '/assets/icons/text-tool.svg', color: '#EFF6FF', url: '/pages/tools/text-generation/index' },
//       { id: 2, name: '图像增强', icon: '/assets/icons/image-tool.svg', color: '#F0FDFA', url: '/pages/tools/image-enhancement/index' },
//       { id: 3, name: 'AI去水印', icon: '/assets/icons/watermark-remover.svg', color: '#F0F4FF', url: '/pages/tools/watermark-remover/index' },
//       { id: 4, name: '二维码生成', icon: '/assets/icons/qrcode-tool.svg', color: '#F0F9FF', url: '/pages/tools/qrcode-generator/index' },
//       { id: 5, name: '背景去除', icon: '/assets/icons/bg-remover.svg', color: '#F0FDFA', url: '/pages/tools/background-remover/index' },
//       { id: 6, name: '更多工具', icon: '/assets/icons/more.svg', color: '#F9FAFB', url: '/pages/tools-list/index' }
//     ],
//     recentTools: [
//       {
//         id: 1,
//         name: '文章润色',
//         description: '优化文章结构与表达',
//         icon: '../../assets/icons/recent-1.svg',
//         bgColor: 'bg-blue-100',
//         url: '/pages/tools/text-generation/index'
//       },
//       {
//         id: 2,
//         name: '人像美化',
//         description: '自动美化人像照片',
//         icon: '../../assets/icons/recent-2.svg',
//         bgColor: 'bg-green-100',
//         url: '/pages/tools/image-enhancement/index'
//       },
//       {
//         id: 3,
//         name: '会议记录',
//         description: '语音转文字记录',
//         icon: '../../assets/icons/recent-3.svg',
//         bgColor: 'bg-purple-100',
//         url: '/pages/tools/voice-transcription/index'
//       },
//       {
//         id: 4,
//         name: '日程规划',
//         description: '智能规划每日日程',
//         icon: '../../assets/icons/recent-4.svg',
//         bgColor: 'bg-yellow-100',
//         url: '/pages/tools/schedule-planner/index'
//       }
//     ]
//   },

//   onLoad() {
//     // 检查是否可以使用 getUserProfile
//     if (typeof wx.getUserProfile === 'function') {
//       this.setData({
//         canIUseGetUserProfile: true
//       })
//     }
//   },

//   getUserProfile() {
//     // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
//     wx.getUserProfile({
//       desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
//       success: (res) => {
//         console.log(res)
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     })
//   },

//   // 导航到工具页面
//   navigateToTool(e: any) {
//     const { url } = e.currentTarget.dataset
//     wx.navigateTo({
//       url
//     })
//   },

//   // 导航到分类页面
//   navigateToCategory: function() {
//     wx.switchTab({
//       url: '/pages/categories/index'
//     });
//   },

//   // 导航到工具列表页面
//   navigateToToolsList: function() {
//     wx.navigateTo({
//       url: '/pages/tools-list/index'
//     });
//   },

//   // 查看全部工具
//   viewAllTools() {
//     wx.switchTab({
//       url: '/pages/categories/categories'
//     })
//   },

//   // 查看历史记录
//   viewHistory() {
//     wx.navigateTo({
//       url: '/pages/history/history'
//     })
//   },

//   // 升级至专业版
//   upgradeToPro() {
//     wx.navigateTo({
//       url: '/pages/subscription/subscription'
//     })
//   },

//   // 工具点击处理函数
//   handleToolClick(e: any) {
//     const url = e.currentTarget.dataset.url;
//     if (url) {
//       wx.navigateTo({
//         url
//       });
//     }
//   }
// })

// index.js
Page({
  data: {
    // 快速工具列表
    quickTools: [
      {
        id: 1,
        name: "文本生成",
        icon: "../../assets/icons/text-tool.svg",
        color: "lightblue",
        url: "/pages/tools/text-generation/index",
      },
      {
        id: 2,
        name: "AI去水印",
        icon: "../../assets/icons/watermark-remover.svg",
        color: "purple",
        url: "/pages/tools/watermark-remover/index",
      },
      {
        id: 3,
        name: "语音转文字",
        icon: "../../assets/icons/voice-tool.svg",
        color: "green",
        url: "/pages/tools/voice-transcription/index",
      },
      {
        id: 4,
        name: "作业检查",
        icon: "../../assets/icons/homework-check.svg",
        color: "yellow",
        url: "/pages/tools/homework-checker/index",
      },
      {
        id: 5,
        name: "二维码",
        icon: "../../assets/icons/qrcode-tool.svg",
        color: "blue",
        url: "/pages/tools/qrcode-generator/index",
      },
      {
        id: 6,
        name: "翻译助手",
        icon: "../../assets/icons/translate-tool.svg",
        color: "green",
        url: "/pages/tools/translator/index",
      },
      {
        id: 7,
        name: "去除背景",
        icon: "../../assets/icons/bg-remover.svg",
        color: "purple",
        url: "/pages/tools/background-remover/index",
      },
      {
        id: 8,
        name: "更多工具",
        icon: "../../assets/icons/more.svg",
        color: "gray",
        url: "/pages/categories/index",
      },
    ],

    // 热门工具列表
    popularTools: [
      {
        id: 101,
        name: "AI写作助手",
        icon: "../../assets/icons/text-tool.svg",
        description: "智能写作助手，轻松生成各类文案",
        usageCount: "2.1万",
        tags: ["AI", "文案", "热门"],
        url: "/pages/tools/text-generation/index",
      },
      {
        id: 102,
        name: "AI日程规划",
        icon: "../../assets/icons/category-content.svg",
        description: "智能规划您的日程安排",
        usageCount: "1.8万",
        tags: ["AI", "计划", "日程"],
        url: "/pages/tools/schedule-planner/index",
      },
      {
        id: 104,
        name: "图像增强",
        icon: "../../assets/icons/image-tool.svg",
        description: "一键提升图片质量，修复老旧照片",
        usageCount: "7834",
        tags: ["图像", "AI", "实用"],
        url: "/pages/tools/image-enhancement/index",
      },
      {
        id: 105,
        name: "去除背景",
        icon: "../../assets/icons/bg-remover.svg",
        description: "一键去除图片背景，轻松抠图",
        color: "purple",
        usageCount: "6542",
        tags: ["图像", "设计", "实用"],
        url: "/pages/tools/background-remover/index",
      },
    ],

    // 最近使用的工具
    recentTools: [
      {
        id: 1,
        name: "文章润色",
        description: "优化文章结构与表达",
        icon: "../../assets/icons/recent-1.svg",
        bgColor: "bg-blue-100",
        url: "/pages/tools/text-generation/index",
      },
      {
        id: 2,
        name: "人像美化",
        description: "自动美化人像照片",
        icon: "../../assets/icons/recent-2.svg",
        bgColor: "bg-green-100",
        url: "/pages/tools/image-enhancement/index",
      },
      {
        id: 3,
        name: "会议记录",
        description: "语音转文字记录",
        icon: "../../assets/icons/recent-3.svg",
        bgColor: "bg-purple-100",
        url: "/pages/tools/voice-transcription/index",
      },
      {
        id: 4,
        name: "日程规划",
        description: "智能规划每日日程",
        icon: "../../assets/icons/recent-4.svg",
        bgColor: "bg-yellow-100",
        url: "/pages/tools/schedule-planner/index",
      },
    ],
  },

  // 处理搜索按钮点击
  handleSearch: function () {
    wx.navigateTo({
      url: "/pages/search/index",
    })
  },

  // 处理通知按钮点击
  handleNotification: function () {
    wx.navigateTo({
      url: "/pages/notifications/index",
    })
  },

  // 跳转到分类页面
  navigateToCategory: function () {
    wx.switchTab({
      url: "/pages/categories/index",
    })
  },

  // 升级到专业版
  upgradeToPremium: function () {
    wx.navigateTo({
      url: "/pages/profile/membership/index",
    })
  },

  // 工具点击处理函数
  handleToolClick(e: any) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url,
      })
    }
  },

  onLoad: function () {
    // 初始化页面数据
  },

  onShow: function () {
    // 页面显示时更新数据
  },
})
