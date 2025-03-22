// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    activeCategory: 0,
    searchValue: '',
    searchResults: [],
    isSearching: false,
    categories: [
      {
        id: 1,
        name: '内容创作',
        icon: 'category-content',
        color: 'blue',
        tools: [
          {
            id: 101,
            name: '文本生成',
            description: '智能创作各类文本内容',
            icon: 'text-tool',
            url: '/pages/tools/text-generation/index',
            isHot: true
          },
          {
            id: 102,
            name: '文章润色',
            description: '优化文章结构与表达',
            icon: 'text-tool',
            url: '/pages/tools/text-generation/index',
            isNew: true
          },
        //   {
        //     id: 104,
        //     name: '社交媒体',
        //     description: '创作社交平台内容',
        //     icon: 'text-tool',
        //     url: '/pages/tools/text-generation/index'
        //   }
        ]
      },
      {
        id: 2,
        name: '图像工具',
        icon: 'category-image',
        color: 'green',
        tools: [
          {
            id: 201,
            name: '图像增强',
            description: '优化提升图片质量',
            icon: 'image-tool',
            url: '/pages/tools/image-enhancement/index',
            isHot: true
          },
          {
            id: 202,
            name: '去除背景',
            description: '去除图片背景，轻松抠图',
            icon: 'bg-remover',
            url: '/pages/tools/background-remover/index',
            isNew: true
          },
          {
            id: 203,
            name: 'AI去水印',
            description: '去除水印，轻松实现',
            icon: 'watermark-remover',
            url: '/pages/tools/background-remover/index',
            isNew: true
          }
        ]
      },
      {
        id: 3,
        name: '语音工具',
        icon: 'category-voice',
        color: 'purple',
        tools: [
          {
            id: 301,
            name: '语音转写',
            description: '将语音快速转为文字',
            icon: 'voice-tool',
            url: '/pages/tools/voice-transcription/index'
          }
        ]
      },
      {
        id: 4,
        name: '翻译工具',
        icon: 'translate-tool',
        color: 'blue',
        tools: [
          {
            id: 401,
            name: '智能翻译',
            description: '精准多语言互译',
            icon: 'translate-tool',
            url: '/pages/tools/language-translator/index',
            isNew: true
          }
        ]
      },
      {
        id: 5,
        name: '效率工具',
        icon: 'category-productivity',
        color: 'yellow',
        tools: [
          {
            id: 501,
            name: '文档分析',
            description: '智能分析文档内容',
            icon: 'document-tool',
            url: '/pages/tools/document-analysis/index'
          },
          {
            id: 502,
            name: '日程规划',
            description: '智能规划每日日程',
            icon: 'calculator-tool',
            url: '/pages/tools/schedule-planner/index'
          },
        ]
      },
      {
        id: 6,
        name: '学习工具',
        icon: 'category-development',
        color: 'red',
        tools: [
          {
            id: 601,
            name: '作业检查',
            description: '快速提升学习成绩',
            icon: 'homework-check',
            url: '/pages/tools/homework-checker/index'
          }
        ]
      },
      {
        id: 7,
        name: '数据工具',
        icon: 'category-data',
        color: 'indigo',
        tools: [
          {
            id: 701,
            name: '数据可视化',
            description: '将数据转为图表分析',
            icon: 'qrcode-tool',
            url: '/pages/tools/data-visualizer/index'
          }
        ]
      }
    ]
  },

  onLoad() {
    // 页面加载时执行的操作
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }
  },

  switchCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      activeCategory: id
    });
  },

  navigateToTool(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url
    });
  },

  onSearchInput(e) {
    const value = e.detail.value;
    this.setData({
      searchValue: value,
      isSearching: value.length > 0
    });

    if (value.length > 0) {
      // 搜索逻辑
      const allTools = [];
      this.data.categories.forEach(category => {
        category.tools.forEach(tool => {
          allTools.push({
            ...tool,
            categoryName: category.name,
            color: category.color
          });
        });
      });

      const results = allTools.filter(tool =>
        tool.name.includes(value) ||
        tool.description.includes(value) ||
        tool.categoryName.includes(value)
      );

      this.setData({
        searchResults: results
      });
    }
  },

  clearSearch() {
    this.setData({
      searchValue: '',
      isSearching: false,
      searchResults: []
    });
  },

  onPullDownRefresh() {
    // 模拟刷新数据
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
})