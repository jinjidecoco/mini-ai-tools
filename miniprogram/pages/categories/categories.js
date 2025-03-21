// categories.js
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
        icon: '../../assets/icons/category-content.svg',
        bgColor: 'bg-blue-50',
        tools: [
          {
            id: 101,
            name: '文本生成',
            description: '智能创作各类文本内容',
            icon: '../../assets/icons/tool-1.svg',
            url: '/pages/tools/text-generation/index',
            isHot: true
          },
          {
            id: 102,
            name: '文章润色',
            description: '优化文章结构与表达',
            icon: '../../assets/icons/template-outline.svg',
            url: '/pages/tools/text-generation/index',
            isNew: true
          },
          {
            id: 103,
            name: '营销文案',
            description: '生成吸引人的广告文案',
            icon: '../../assets/icons/template-marketing.svg',
            url: '/pages/tools/text-generation/index'
          },
          {
            id: 104,
            name: '社交媒体',
            description: '创作社交平台内容',
            icon: '../../assets/icons/template-social.svg',
            url: '/pages/tools/text-generation/index'
          }
        ]
      },
      {
        id: 2,
        name: '图像工具',
        icon: '../../assets/icons/category-image.svg',
        bgColor: 'bg-green-50',
        tools: [
          {
            id: 201,
            name: '图像增强',
            description: '优化提升图片质量',
            icon: '../../assets/icons/tool-2.svg',
            url: '/pages/tools/image-enhancement/index',
            isHot: true
          },
          {
            id: 202,
            name: '文本生成图像',
            description: '将文字创意变为图像',
            icon: '../../assets/icons/style-realistic.svg',
            url: '/pages/tools/text-to-image/index',
            isNew: true
          }
        ]
      },
      {
        id: 3,
        name: '语音工具',
        icon: '../../assets/icons/category-voice.svg',
        bgColor: 'bg-purple-50',
        tools: [
          {
            id: 301,
            name: '语音转写',
            description: '将语音快速转为文字',
            icon: '../../assets/icons/tool-3.svg',
            url: '/pages/tools/voice-transcription/index'
          }
        ]
      },
      {
        id: 4,
        name: '翻译工具',
        icon: '../../assets/icons/translator.svg',
        bgColor: 'bg-blue-50',
        tools: [
          {
            id: 401,
            name: '智能翻译',
            description: '精准多语言互译',
            icon: '../../assets/icons/tool-4.svg',
            url: '/pages/tools/language-translator/index',
            isNew: true
          }
        ]
      },
      {
        id: 5,
        name: '效率工具',
        icon: '../../assets/icons/category-productivity.svg',
        bgColor: 'bg-yellow-50',
        tools: [
          {
            id: 501,
            name: '文档分析',
            description: '智能分析文档内容',
            icon: '../../assets/icons/document-analysis.svg',
            url: '/pages/tools/document-analysis/index'
          },
          {
            id: 502,
            name: '日程规划',
            description: '智能规划每日日程',
            icon: '../../assets/icons/recent-4.svg',
            url: '/pages/tools/schedule-planner/index'
          }
        ]
      },
      {
        id: 6,
        name: '开发工具',
        icon: '../../assets/icons/category-development.svg',
        bgColor: 'bg-red-50',
        tools: [
          {
            id: 601,
            name: '智能代码生成',
            description: '生成高质量代码',
            icon: '../../assets/icons/code.svg',
            url: '/pages/tools/code-assistant/index'
          }
        ]
      },
      {
        id: 7,
        name: '数据工具',
        icon: '../../assets/icons/category-data.svg',
        bgColor: 'bg-indigo-50',
        tools: [
          {
            id: 701,
            name: '数据可视化',
            description: '将数据转为图表分析',
            icon: '../../assets/icons/data-chart.svg',
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
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeCategory: index
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
            categoryName: category.name
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