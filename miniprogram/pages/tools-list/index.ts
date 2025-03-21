Page({
  data: {
    categories: [
      {
        id: 1,
        name: '文本处理',
        icon: '/assets/icons/text-tool.svg',
        tools: [
          { id: 1, name: '文本生成', icon: '/assets/icons/text-tool.svg', color: '#EFF6FF', url: '/pages/tools/text-generation/index' },
          { id: 2, name: '语音转文字', icon: '/assets/icons/voice-tool.svg', color: '#F0FDF4', url: '/pages/tools/voice-to-text/index' }
        ]
      },
      {
        id: 2,
        name: '图像处理',
        icon: '/assets/icons/image-tool.svg',
        tools: [
          { id: 3, name: 'AI去水印', icon: '/assets/icons/watermark-remover.svg', color: '#F0F4FF', url: '/pages/tools/watermark-remover/index' },
          { id: 4, name: '背景去除', icon: '/assets/icons/bg-remover.svg', color: '#F0FDFA', url: '/pages/tools/background-remover/index' },
          { id: 5, name: '图像增强', icon: '/assets/icons/image-tool.svg', color: '#F0FDFA', url: '/pages/tools/image-enhancement/index' }
        ]
      },
      {
        id: 3,
        name: '实用工具',
        icon: '/assets/icons/more.svg',
        tools: [
          { id: 6, name: '二维码生成', icon: '/assets/icons/qrcode-tool.svg', color: '#F0F9FF', url: '/pages/tools/qrcode-generator/index' },
          { id: 7, name: '作业检查', icon: '/assets/icons/homework-check.svg', color: '#FEF3C7', url: '/pages/tools/homework-checker/index' }
        ]
      }
    ]
  },

  // 导航返回函数
  navigateBack() {
    wx.navigateBack();
  },

  // 工具点击处理函数
  handleToolClick(e: any) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url
      });
    }
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: 'Mini工具 - 实用工具集合',
      path: '/pages/index/index'
    };
  }
});