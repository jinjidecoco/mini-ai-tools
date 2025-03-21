Page({
  data: {
    prompt: '',
    isGenerating: false,
    generatedImageUrl: '',
    generationTime: 0,
    selectedStyle: 'realistic',
    selectedRatio: '1:1',
    imageHistory: [],
    imageStyles: [
      {
        id: 'realistic',
        name: '写实风格',
        description: '逼真细腻的照片级效果',
        icon: '../../../assets/icons/style-realistic.svg'
      },
      {
        id: 'anime',
        name: '动漫风格',
        description: '日式二次元动漫效果',
        icon: '../../../assets/icons/style-anime.svg'
      },
      {
        id: 'watercolor',
        name: '水彩风格',
        description: '柔和的水彩绘画效果',
        icon: '../../../assets/icons/style-watercolor.svg'
      },
      {
        id: 'oil',
        name: '油画风格',
        description: '厚重质感的油画效果',
        icon: '../../../assets/icons/style-oil.svg'
      },
      {
        id: '3d',
        name: '3D渲染',
        description: '3D建模渲染效果',
        icon: '../../../assets/icons/style-3d.svg'
      }
    ],
    ratios: [
      { id: '1:1', name: '1:1' },
      { id: '4:3', name: '4:3' },
      { id: '16:9', name: '16:9' }
    ]
  },

  onLoad() {
    // 加载历史记录
    this.loadHistory();
  },

  onShow() {
    // 如果是从图库或其他页面返回，可能需要刷新数据
    this.loadHistory();
  },

  goBack() {
    wx.navigateBack();
  },

  onPromptInput(e) {
    this.setData({
      prompt: e.detail.value
    });
  },

  selectStyle(e) {
    const styleId = e.currentTarget.dataset.id;
    this.setData({
      selectedStyle: styleId
    });
  },

  selectRatio(e) {
    const ratioId = e.currentTarget.dataset.id;
    this.setData({
      selectedRatio: ratioId
    });
  },

  clearPrompt() {
    this.setData({
      prompt: ''
    });
  },

  async generateImage() {
    if (!this.data.prompt) {
      wx.showToast({
        title: '请输入图像描述',
        icon: 'none'
      });
      return;
    }

    this.setData({ isGenerating: true });

    try {
      // 在实际项目中，这里应该调用云函数或API生成图像
      await this.simulateApiCall();

      // 保存到历史记录
      this.saveToHistory();
    } catch (error) {
      console.error('图像生成失败:', error);
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ isGenerating: false });
    }
  },

  // 模拟API调用，实际项目中应替换为真实API调用
  simulateApiCall() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 生成随机示例图片URL
        const imageId = Math.floor(Math.random() * 10) + 1;
        const imageUrl = `https://images.unsplash.com/photo-167${Math.floor(Math.random() * 10000000)}?w=600&q=80`;

        this.setData({
          generatedImageUrl: imageUrl,
          generationTime: Date.now()
        });
        resolve();
      }, 2000); // 模拟2秒的处理时间
    });
  },

  saveToHistory() {
    const history = [...this.data.imageHistory];
    const styleName = this.data.imageStyles.find(s => s.id === this.data.selectedStyle).name;

    const newItem = {
      id: Date.now(),
      prompt: this.data.prompt,
      style: styleName,
      ratio: this.data.selectedRatio,
      imageUrl: this.data.generatedImageUrl,
      timestamp: Date.now()
    };

    history.unshift(newItem);
    if (history.length > 20) {
      history.pop();
    }

    this.setData({ imageHistory: history });
    this.saveHistoryToStorage(history);
  },

  saveHistoryToStorage(history) {
    wx.setStorageSync('imageGenerationHistory', history);
  },

  loadHistory() {
    const history = wx.getStorageSync('imageGenerationHistory') || [];
    this.setData({ imageHistory: history });
  },

  viewHistoryImage(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.imageHistory.find(h => h.id === id);

    if (item) {
      // 设置当前图像为选中的历史图像
      this.setData({
        prompt: item.prompt,
        generatedImageUrl: item.imageUrl,
        selectedStyle: this.data.imageStyles.find(s => s.name === item.style).id,
        selectedRatio: item.ratio,
        generationTime: item.timestamp
      });

      // 滚动到顶部
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },

  viewAllHistory() {
    // 这里可以跳转到专门的历史记录页面
    wx.showToast({
      title: '查看全部历史功能开发中',
      icon: 'none'
    });
  },

  previewImage() {
    if (!this.data.generatedImageUrl) return;

    wx.previewImage({
      urls: [this.data.generatedImageUrl],
      current: this.data.generatedImageUrl
    });
  },

  saveImage() {
    if (!this.data.generatedImageUrl) return;

    wx.showLoading({
      title: '正在保存...',
    });

    wx.downloadFile({
      url: this.data.generatedImageUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.hideLoading();
              wx.showToast({
                title: '已保存到相册',
                icon: 'success'
              });
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('保存失败', err);

              if (err.errMsg.indexOf('auth deny') !== -1) {
                wx.showModal({
                  title: '提示',
                  content: '需要您授权保存图片到相册',
                  confirmText: '去授权',
                  success: (res) => {
                    if (res.confirm) {
                      wx.openSetting();
                    }
                  }
                });
              } else {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                });
              }
            }
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '下载失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        });
      }
    });
  },

  shareImage() {
    if (!this.data.generatedImageUrl) return;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage() {
    return {
      title: 'AI文本生成图像',
      path: '/pages/tools/text-to-image/index',
      imageUrl: this.data.generatedImageUrl || '../../../assets/images/share-cover.png'
    };
  },

  onShareTimeline() {
    return {
      title: 'AI文本生成图像',
      query: '',
      imageUrl: this.data.generatedImageUrl || '../../../assets/images/share-cover.png'
    };
  }
});