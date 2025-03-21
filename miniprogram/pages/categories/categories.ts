// categories.ts
// 获取应用实例
const categoriesApp = getApp<IAppOption>()

interface ToolCategory {
  id: number;
  name: string;
  icon: string;
  bgColor: string;
  tools: Tool[];
}

interface Tool {
  id: number;
  name: string;
  description: string;
  icon: string;
  url: string;
  isHot?: boolean;
  isNew?: boolean;
  categoryName?: string;
}

Page({
  data: {
    activeCategory: 0,
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
            description: '智能创作各类文案与文章',
            icon: '../../assets/icons/tool-1.svg',
            url: '/pages/tools/text-generation/index',
            isHot: true
          },
          {
            id: 102,
            name: '文章润色',
            description: '优化文章结构与表达',
            icon: '../../assets/icons/recent-1.svg',
            url: '/pages/tools/text-generation/index'
          },
          {
            id: 103,
            name: 'AI文案助手',
            description: '生成高质量营销文案',
            icon: '../../assets/icons/tool-1.svg',
            url: '/pages/tools/text-generation/index'
          }
        ]
      },
      {
        id: 2,
        name: '图像处理',
        icon: '../../assets/icons/category-image.svg',
        bgColor: 'bg-green-50',
        tools: [
          {
            id: 201,
            name: '图像增强',
            description: '提升图片清晰度与质量',
            icon: '../../assets/icons/tool-2.svg',
            url: '/pages/tools/image-enhancement/index',
            isHot: true
          },
          {
            id: 202,
            name: '人像美化',
            description: '智能美化人物照片',
            icon: '../../assets/icons/recent-2.svg',
            url: '/pages/tools/image-enhancement/index'
          },
          {
            id: 203,
            name: '背景移除',
            description: '智能去除图片背景',
            icon: '../../assets/icons/tool-2.svg',
            url: '/pages/tools/image-enhancement/index',
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
            description: '将语音内容转为文字',
            icon: '../../assets/icons/tool-3.svg',
            url: '/pages/tools/voice-transcription/index',
            isHot: true
          },
          {
            id: 302,
            name: '会议记录',
            description: '自动记录会议内容',
            icon: '../../assets/icons/recent-3.svg',
            url: '/pages/tools/voice-transcription/index'
          }
        ]
      },
      {
        id: 4,
        name: '效率工具',
        icon: '../../assets/icons/category-productivity.svg',
        bgColor: 'bg-yellow-50',
        tools: [
          {
            id: 401,
            name: '智能翻译',
            description: '支持多语言智能翻译',
            icon: '../../assets/icons/tool-4.svg',
            url: '/pages/tools/language-translator/index'
          },
          {
            id: 402,
            name: '日程规划',
            description: '智能规划每日任务',
            icon: '../../assets/icons/recent-4.svg',
            url: '/pages/tools/schedule-planner/index',
            isNew: true
          }
        ]
      },
      {
        id: 5,
        name: '开发助手',
        icon: '../../assets/icons/category-development.svg',
        bgColor: 'bg-red-50',
        tools: [
          {
            id: 501,
            name: '智能代码生成',
            description: '生成多语言代码',
            icon: '../../assets/icons/tool-1.svg',
            url: '/pages/tools/code-assistant/index',
            isHot: true
          },
          {
            id: 502,
            name: '代码优化',
            description: '优化代码结构与性能',
            icon: '../../assets/icons/tool-1.svg',
            url: '/pages/tools/code-assistant/index'
          }
        ]
      },
      {
        id: 6,
        name: '数据分析',
        icon: '../../assets/icons/category-data.svg',
        bgColor: 'bg-indigo-50',
        tools: [
          {
            id: 601,
            name: '数据可视化',
            description: '生成数据分析图表',
            icon: '../../assets/icons/tool-2.svg',
            url: '/pages/tools/data-visualizer/index'
          }
        ]
      }
    ],
    searchValue: '',
    isSearching: false,
    searchResults: [] as Tool[]
  },

  onLoad() {
    // 初始化数据
  },

  // 切换分类标签
  switchCategory(e: any) {
    const { id } = e.currentTarget.dataset;
    this.setData({
      activeCategory: id
    });
  },

  // 导航到工具页面
  navigateToTool(e: any) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({
      url
    });
  },

  // 搜索相关方法
  onSearchInput(e: any) {
    const value = e.detail.value;
    this.setData({
      searchValue: value,
      isSearching: value.length > 0
    });

    if (value.length > 0) {
      // 搜索所有工具
      const results: Tool[] = [];
      this.data.categories.forEach((category: ToolCategory) => {
        category.tools.forEach((tool: Tool) => {
          if (tool.name.includes(value) || tool.description.includes(value)) {
            results.push({...tool, categoryName: category.name});
          }
        });
      });

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
    // 模拟刷新
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
})