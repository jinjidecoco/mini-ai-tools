// image-enhancement/index.ts
// 获取应用实例
const appInstance = getApp<IAppOption>()

interface EnhancementOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface EnhancedImage {
  id: number;
  originalUrl: string;
  enhancedUrl: string;
  timestamp: number;
  enhancementType: string;
}

Page({
  data: {
    currentImage: '',
    isEnhancing: false,
    errorMessage: '',
    selectedEnhancement: '',
    enhancedImageUrl: '',
    enhancedImages: [] as EnhancedImage[],
    selectedHistoryImage: null as EnhancedImage | null,
    enhancementOptions: [
      {
        id: 'portrait',
        title: '人像美化',
        description: '智能美化人像，提升颜值',
        icon: '../../../assets/icons/enhancement-portrait.svg'
      },
      {
        id: 'upscale',
        title: '图像放大',
        description: '提升图像分辨率，保持清晰度',
        icon: '../../../assets/icons/enhancement-upscale.svg'
      },
      {
        id: 'restoration',
        title: '图像修复',
        description: '修复破损、模糊的图像',
        icon: '../../../assets/icons/enhancement-restoration.svg'
      },
      {
        id: 'background',
        title: '背景优化',
        description: '智能优化背景，突出主体',
        icon: '../../../assets/icons/enhancement-background.svg'
      },
      {
        id: 'style',
        title: '风格转换',
        description: '转换图像风格，如油画、素描等',
        icon: '../../../assets/icons/enhancement-style.svg'
      }
    ] as EnhancementOption[]
  },

  onLoad() {
    // Load historical enhancement records from local storage
    const enhancedImages = wx.getStorageSync('enhancedImages') || [];
    this.setData({ enhancedImages });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          currentImage: tempFilePath,
          errorMessage: '',
          enhancedImageUrl: ''
        });
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        this.setData({
          errorMessage: '选择图片失败，请重试'
        });
      }
    });
  },

  // 选择增强选项
  selectEnhancement(e: any) {
    const { id } = e.currentTarget.dataset;
    this.setData({ selectedEnhancement: id });
  },

  // 增强图片
  enhanceImage() {
    if (!this.data.currentImage) {
      this.setData({ errorMessage: '请先选择一张图片' });
      return;
    }

    if (!this.data.selectedEnhancement) {
      this.setData({ errorMessage: '请选择增强类型' });
      return;
    }

    this.setData({
      isEnhancing: true,
      errorMessage: ''
    });

    // Simulate API call
    this.simulateApiCall().then(() => {
      const enhancedImage: EnhancedImage = {
        id: Date.now(),
        originalUrl: this.data.currentImage,
        enhancedUrl: 'https://picsum.photos/800/600', // Replace with actual enhanced image URL
        timestamp: Date.now(),
        enhancementType: this.data.selectedEnhancement
      };

      const enhancedImages = [enhancedImage, ...this.data.enhancedImages];
      this.setData({
        enhancedImageUrl: enhancedImage.enhancedUrl,
        enhancedImages,
        isEnhancing: false
      });

      // Save to local storage
      wx.setStorageSync('enhancedImages', enhancedImages);
    }).catch(() => {
      this.setData({
        errorMessage: '图像增强失败，请重试',
        isEnhancing: false
      });
    });
  },

  simulateApiCall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  },

  // 查看历史记录中的图片
  viewHistoryImage(e: any) {
    const { id } = e.currentTarget.dataset;
    const selectedHistoryImage = this.data.enhancedImages.find(img => img.id === id);
    if (selectedHistoryImage) {
      this.setData({
        selectedHistoryImage,
        enhancedImageUrl: selectedHistoryImage.enhancedUrl
      });
    }
  },

  // 预览原始图片
  previewOriginalImage() {
    if (this.data.currentImage) {
      wx.previewImage({
        urls: [this.data.currentImage],
        current: this.data.currentImage
      });
    }
  },

  // 预览增强后的图片
  previewEnhancedImage() {
    if (this.data.enhancedImageUrl) {
      wx.previewImage({
        urls: [this.data.enhancedImageUrl],
        current: this.data.enhancedImageUrl
      });
    }
  },

  // 保存增强后的图片到相册
  saveImage() {
    if (!this.data.enhancedImageUrl) {
      wx.showToast({
        title: '请先生成增强图像',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '保存中...',
    });

    wx.downloadFile({
      url: this.data.enhancedImageUrl,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          },
          fail: (err) => {
            wx.hideLoading();
            if (err.errMsg.includes('auth deny')) {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存图片到相册',
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
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        });
      }
    });
  },

  // 分享图片
  shareImage() {
    if (!this.data.enhancedImageUrl) {
      wx.showToast({
        title: '请先生成增强图像',
        icon: 'none'
      });
      return;
    }

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 清除当前图片
  clearImage() {
    this.setData({
      currentImage: '',
      enhancedImageUrl: '',
      errorMessage: ''
    });
  },

  onShareAppMessage() {
    return {
      title: 'AI图像增强',
      path: '/pages/tools/image-enhancement/index',
      imageUrl: this.data.enhancedImageUrl
    };
  }
})