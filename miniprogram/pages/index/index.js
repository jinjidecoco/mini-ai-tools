// index.js
Page({
  data: {
    // 快速工具列表
    quickTools: [
      {
        id: 1,
        name: '文本生成',
        icon: '../../assets/icons/text-tool.png',
        color: 'blue',
        url: '/pages/tools/text-generation/index'
      },
      {
        id: 2,
        name: 'AI去水印',
        icon: '../../assets/icons/watermark-remover.svg',
        color: 'purple',
        url: '/pages/tools/watermark-remover/index'
      },
      {
        id: 3,
        name: '语音转文字',
        icon: '../../assets/icons/voice-tool.png',
        color: 'green',
        url: '/pages/tools/voice-to-text/index'
      },
      {
        id: 4,
        name: '作业检查',
        icon: '../../assets/icons/homework-check.svg',
        color: 'yellow',
        url: '/pages/tools/homework-checker/index'
      },
      {
        id: 5,
        name: '二维码',
        icon: '../../assets/icons/qrcode-tool.png',
        color: 'blue',
        url: '/pages/tools/qrcode-generator/index'
      },
      {
        id: 6,
        name: '翻译助手',
        icon: '../../assets/icons/translate-tool.png',
        color: 'green',
        url: '/pages/tools/translator/index'
      },
      {
        id: 7,
        name: '去除背景',
        icon: '../../assets/icons/bg-remover.svg',
        color: 'purple',
        url: '/pages/tools/background-remover/index'
      },
      {
        id: 8,
        name: '更多工具',
        icon: '../../assets/icons/more.svg',
        color: 'gray',
        url: '/pages/categories/index'
      }
    ],

    // 热门工具列表
    popularTools: [
      {
        id: 101,
        name: 'AI写作助手',
        icon: '../../assets/icons/ai-write.png',
        description: '智能写作助手，轻松生成各类文案',
        color: 'blue',
        usageCount: '2.1万',
        url: '/pages/tools/text-generation/index'
      },
      {
        id: 102,
        name: '智能图片生成',
        icon: '../../assets/icons/ai-image.png',
        description: '描述即可生成精美图片，激发创作灵感',
        color: 'purple',
        usageCount: '1.8万',
        url: '/pages/tools/image-generation/index'
      },
      {
        id: 103,
        name: '简历优化助手',
        icon: '../../assets/icons/resume.svg',
        description: '智能优化简历内容，提高求职成功率',
        color: 'green',
        usageCount: '9563',
        url: '/pages/tools/resume-optimizer/index'
      }
    ],

    // 最近使用的工具
    recentTools: [
      {
        id: 201,
        name: '文本润色',
        icon: '../../assets/icons/text-polish.png',
        description: '优化文本表达，提升文章质量',
        color: 'blue',
        url: '/pages/tools/text-polishing/index'
      },
      {
        id: 202,
        name: '语法检查',
        icon: '../../assets/icons/grammar.png',
        description: '智能检测文本语法问题并修正',
        color: 'green',
        url: '/pages/tools/grammar-check/index'
      },
      {
        id: 203,
        name: '海报设计',
        icon: '../../assets/icons/poster.png',
        description: '一键生成专业海报设计',
        color: 'purple',
        url: '/pages/tools/poster-maker/index'
      },
      {
        id: 204,
        name: '语音合成',
        icon: '../../assets/icons/voice-synth.png',
        description: '将文本转换为自然流畅的语音',
        color: 'blue',
        url: '/pages/tools/voice-synthesis/index'
      }
    ]
  },

  // 处理搜索按钮点击
  handleSearch: function() {
    wx.navigateTo({
      url: '/pages/search/index'
    });
  },

  // 处理通知按钮点击
  handleNotification: function() {
    wx.navigateTo({
      url: '/pages/notifications/index'
    });
  },

  // 处理工具点击，跳转到对应的工具页面
  navigateToTool: function(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: url,
        fail: function(err) {
          console.error('导航失败:', err);
          wx.showToast({
            title: '该工具暂未开放',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },

  // 跳转到分类页面
  navigateToCategory: function() {
    wx.switchTab({
      url: '/pages/categories/index'
    });
  },

  // 升级到专业版
  upgradeToPremium: function() {
    wx.navigateTo({
      url: '/pages/profile/membership/index'
    });
  },

  onLoad: function() {
    // 初始化页面数据
  },

  onShow: function() {
    // 页面显示时更新数据
  },

  onPullDownRefresh: function() {
    // 下拉刷新
    wx.stopPullDownRefresh();
  }
});