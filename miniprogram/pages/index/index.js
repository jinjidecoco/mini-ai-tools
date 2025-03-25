Page({
  data: {
    quickTools: [],
    popularTools: [],
    recentTools: []
  },

  onLoad: function() {
    this.loadToolsData();
  },

  onShow: function() {
    // 页面显示时刷新最近使用的工具
    this.loadRecentTools();
  },

  onPullDownRefresh: function() {
    // 下拉刷新
    this.loadToolsData();
    wx.stopPullDownRefresh();
  },

  loadToolsData: function() {
    // 加载快速工具数据
    this.loadQuickTools();
    // 加载热门工具数据
    this.loadPopularTools();
    // 加载最近使用的工具
    this.loadRecentTools();
  },

  loadQuickTools: function() {
    // 模拟从服务器获取快速工具数据
    const quickTools = [
      {
        id: 1,
        name: '文本生成',
        icon: '../../assets/icons/text.svg',
        url: '/pages/tools/text-generator/index'
      },
      {
        id: 2,
        name: '图像生成',
        icon: '../../assets/icons/image.svg',
        url: '/pages/tools/image-generator/index'
      },
      {
        id: 3,
        name: '代码助手',
        icon: '../../assets/icons/code.svg',
        url: '/pages/tools/code-assistant/index'
      },
      {
        id: 4,
        name: '语音转文字',
        icon: '../../assets/icons/voice.svg',
        url: '/pages/tools/speech-to-text/index'
      },
      {
        id: 5,
        name: '翻译助手',
        icon: '../../assets/icons/translate.svg',
        url: '/pages/tools/translator/index'
      },
      {
        id: 6,
        name: '文档摘要',
        icon: '../../assets/icons/summary.svg',
        url: '/pages/tools/document-summary/index'
      },
      {
        id: 7,
        name: '数据分析',
        icon: '../../assets/icons/data.svg',
        url: '/pages/tools/data-analysis/index'
      },
      {
        id: 8,
        name: '更多工具',
        icon: '../../assets/icons/more.svg',
        url: '/pages/category/index'
      }
    ];

    this.setData({
      quickTools: quickTools
    });
  },

  loadPopularTools: function() {
    // 模拟从服务器获取热门工具数据
    const popularTools = [
      {
        id: 1,
        name: 'AI写作助手',
        description: '智能生成高质量文章、报告和创意内容',
        icon: '../../assets/icons/writing.svg',
        usageCount: '10.5万',
        tags: ['写作', '创作'],
        url: '/pages/tools/ai-writer/index'
      },
      {
        id: 2,
        name: '智能图像生成',
        description: '根据文字描述生成精美图像',
        icon: '../../assets/icons/image-gen.svg',
        usageCount: '8.2万',
        tags: ['图像', '创意'],
        url: '/pages/tools/image-generator/index'
      },
      {
        id: 3,
        name: '代码解释器',
        description: '解释复杂代码，提供优化建议',
        icon: '../../assets/icons/code-explain.svg',
        usageCount: '6.7万',
        tags: ['编程', '开发'],
        url: '/pages/tools/code-explainer/index'
      }
    ];

    this.setData({
      popularTools: popularTools
    });
  },

  loadRecentTools: function() {
    // 从本地存储获取最近使用的工具
    const recentToolsStr = wx.getStorageSync('recentTools') || '[]';
    let recentTools = [];

    try {
      recentTools = JSON.parse(recentToolsStr);
    } catch (e) {
      console.error('解析最近使用工具数据失败', e);
    }

    this.setData({
      recentTools: recentTools
    });
  },

  handleToolClick: function(e) {
    const url = e.currentTarget.dataset.url;

    // 记录工具使用
    this.recordToolUsage(url);

    // 导航到工具页面
    wx.navigateTo({
      url: url
    });
  },

  recordToolUsage: function(url) {
    // 从所有工具中找到被点击的工具
    const allTools = [...this.data.quickTools, ...this.data.popularTools];
    const clickedTool = allTools.find(tool => tool.url === url);

    if (!clickedTool) return;

    // 从本地存储获取最近使用的工具
    const recentToolsStr = wx.getStorageSync('recentTools') || '[]';
    let recentTools = [];

    try {
      recentTools = JSON.parse(recentToolsStr);
    } catch (e) {
      console.error('解析最近使用工具数据失败', e);
    }

    // 移除已存在的相同工具（如果有）
    recentTools = recentTools.filter(tool => tool.id !== clickedTool.id);

    // 添加到最近使用的工具列表开头
    recentTools.unshift(clickedTool);

    // 限制最近使用工具数量为10个
    if (recentTools.length > 10) {
      recentTools = recentTools.slice(0, 10);
    }

    // 保存到本地存储
    wx.setStorageSync('recentTools', JSON.stringify(recentTools));
  },

  navigateToCategory: function() {
    wx.navigateTo({
      url: '/pages/category/index'
    });
  },

  viewHistory: function() {
    wx.navigateTo({
      url: '/pages/history/index'
    });
  },

  handleSearch: function() {
    wx.navigateTo({
      url: '/pages/search/index'
    });
  },

  handleNotification: function() {
    wx.navigateTo({
      url: '/pages/notification/index'
    });
  },

  upgradeToPro: function() {
    wx.navigateTo({
      url: '/pages/subscription/index'
    });
  }
});