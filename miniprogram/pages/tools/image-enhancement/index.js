Page({
  data: {
    originalImageUrl: '',
    enhancedImageUrl: '',
    isEnhancing: false,
    selectedEnhancement: 'upscale',
    currentEnhancementTitle: '超分辨率',
    enhancementTime: 0,
    enhancementHistory: [],
    enhancementOptions: [
      {
        id: 'upscale',
        title: '超分辨率',
        description: '提高图像清晰度和分辨率',
        icon: '../../../assets/icons/enhancement-upscale.svg'
      },
      {
        id: 'portrait',
        title: '人像美化',
        description: '增强人像细节与美颜效果',
        icon: '../../../assets/icons/enhancement-portrait.svg'
      },
      {
        id: 'restoration',
        title: '老照片修复',
        description: '修复老照片褪色和损坏',
        icon: '../../../assets/icons/enhancement-restoration.svg'
      },
      {
        id: 'background',
        title: '背景优化',
        description: '增强或虚化图像背景',
        icon: '../../../assets/icons/enhancement-background.svg'
      }
    ]
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    // 如果是从相册或其他页面返回，可能需要刷新数据
    this.loadHistory();
  },

  goBack() {
    wx.navigateBack();
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;

        // 检查图片大小和格式
        if (res.tempFiles[0].size > 10 * 1024 * 1024) {
          wx.showToast({
            title: '图片不能超过10MB',
            icon: 'none'
          });
          return;
        }

        this.setData({
          originalImageUrl: tempFilePath,
          enhancedImageUrl: '' // 清除之前的增强结果
        });
      }
    });
  },

  selectEnhancement(e) {
    const enhancementId = e.currentTarget.dataset.id;
    this.setData({
      selectedEnhancement: enhancementId,
      currentEnhancementTitle: this.getEnhancementTitle(enhancementId)
    });
  },

  getEnhancementTitle(enhancementId) {
    const option = this.data.enhancementOptions.find(function(o) {
      return o.id === enhancementId;
    });
    return option ? option.title : '';
  },

  async enhanceImage() {
    if (!this.data.originalImageUrl) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      });
      return;
    }

    this.setData({ isEnhancing: true });

    try {
      // 在实际项目中，这里应该调用云函数或API增强图像
      await this.simulateApiCall();

      // 保存到历史记录
      this.saveToHistory();

      wx.showToast({
        title: '增强成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('图像增强失败:', error);
      wx.showToast({
        title: '增强失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ isEnhancing: false });
    }
  },

  // 模拟API调用，实际项目中应替换为真实API调用
  simulateApiCall() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 生成随机示例图片URL
        const imageUrl = `https://images.unsplash.com/photo-167${Math.floor(Math.random() * 10000000)}?w=800&q=95`;

        this.setData({
          enhancedImageUrl: imageUrl,
          enhancementTime: Date.now()
        });
        resolve();
      }, 2000); // 模拟2秒的处理时间
    });
  },

  viewHistoryImage(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.enhancementHistory.find(h => h.id === id);

    if (item) {
      // 设置当前图像为选中的历史图像
      this.setData({
        originalImageUrl: item.originalUrl,
        enhancedImageUrl: item.enhancedUrl,
        selectedEnhancement: this.data.enhancementOptions.find(
          o => o.title === item.enhancementType
        ).id,
        enhancementTime: item.timestamp
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

  previewOriginalImage() {
    if (!this.data.originalImageUrl) return;

    wx.previewImage({
      urls: [this.data.originalImageUrl],
      current: this.data.originalImageUrl
    });
  },

  previewEnhancedImage() {
    if (!this.data.enhancedImageUrl) return;

    wx.previewImage({
      urls: [this.data.enhancedImageUrl],
      current: this.data.enhancedImageUrl
    });
  },

  saveImage() {
    if (!this.data.enhancedImageUrl) return;

    wx.showLoading({
      title: '正在保存...',
    });

    // 如果是本地文件路径，可以直接保存
    if (this.data.enhancedImageUrl.startsWith('wxfile://') ||
        this.data.enhancedImageUrl.startsWith('http://tmp/') ||
        this.data.enhancedImageUrl.startsWith('https://tmp/')) {
      this.saveImageToAlbum(this.data.enhancedImageUrl);
    } else {
      // 如果是网络图片，需要先下载
      wx.downloadFile({
        url: this.data.enhancedImageUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            this.saveImageToAlbum(res.tempFilePath);
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
    }
  },

  saveImageToAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
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
  },

  shareImage() {
    if (!this.data.enhancedImageUrl) return;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  clearImage() {
    this.setData({
      originalImageUrl: '',
      enhancedImageUrl: ''
    });
  },

  saveToHistory() {
    const history = [...this.data.enhancementHistory];

    const newItem = {
      id: Date.now(),
      originalUrl: this.data.originalImageUrl,
      enhancedUrl: this.data.enhancedImageUrl,
      enhancementType: this.data.currentEnhancementTitle,
      timestamp: Date.now()
    };

    history.unshift(newItem);
    if (history.length > 20) {
      history.pop();
    }

    this.setData({ enhancementHistory: history });
    this.saveHistoryToStorage(history);
  },

  saveHistoryToStorage(history) {
    wx.setStorageSync('imageEnhancementHistory', history);
  },

  loadHistory() {
    const history = wx.getStorageSync('imageEnhancementHistory') || [];
    this.setData({ enhancementHistory: history });
  },

  onShareAppMessage() {
    return {
      title: 'AI图像增强',
      path: '/pages/tools/image-enhancement/index',
      imageUrl: this.data.enhancedImageUrl || '../../../assets/images/share-cover.png'
    };
  },

  onShareTimeline() {
    return {
      title: 'AI图像增强',
      query: '',
      imageUrl: this.data.enhancedImageUrl || '../../../assets/images/share-cover.png'
    };
  }
});