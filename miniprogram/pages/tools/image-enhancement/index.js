const app = getApp();

Page({
  data: {
    originalImageUrl: '',
    enhancedImageUrl: '',
    isEnhancing: false,
    selectedEnhancement: '',
    enhancementOptions: [
      {
        id: 'portrait',
        title: '人像美化',
        description: '智能美化人像，提升颜值',
        icon: '../../../assets/icons/enhancement-portrait.svg',
        usageCount: '1.8万'
      },
      {
        id: 'upscale',
        title: '图像放大',
        description: '提升图像分辨率，保持清晰度',
        icon: '../../../assets/icons/enhancement-upscale.svg',
        usageCount: '1.2万'
      },
      {
        id: 'restoration',
        title: '图像修复',
        description: '修复破损、模糊的图像',
        icon: '../../../assets/icons/enhancement-restoration.svg',
        usageCount: '9834'
      },
      {
        id: 'hdr',
        title: 'HDR增强',
        description: '提升图像动态范围和细节',
        icon: '../../../assets/icons/enhancement-hdr.svg',
        usageCount: '7629'
      },
      {
        id: 'artistic',
        title: '艺术风格',
        description: '应用艺术风格效果',
        icon: '../../../assets/icons/enhancement-artistic.svg',
        usageCount: '5487'
      },
      {
        id: 'background',
        title: '背景优化',
        description: '智能优化背景，突出主体',
        icon: '../../../assets/icons/enhancement-background.svg',
        usageCount: '4231'
      }
    ],
    enhancedImages: [],
    processingProgress: 0,
    currentStep: '',
    processingSteps: {
      portrait: ['分析人脸特征', '智能美化处理', '细节优化', '成像完成'],
      upscale: ['分析图像结构', '创建高分辨率细节', '边缘锐化', '成像完成'],
      restoration: ['识别损坏区域', '模式分析', '内容重建', '成像完成'],
      hdr: ['分析光线分布', '扩展动态范围', '细节增强', '成像完成'],
      artistic: ['分析图像结构', '提取风格特征', '风格融合', '成像完成'],
      background: ['主体分离', '背景识别', '智能增强', '成像完成']
    },
    showHistory: false
  },

  onLoad() {
    // 加载历史记录
    const enhancedImages = wx.getStorageSync('imageEnhancementHistory') || [];
    this.setData({ enhancedImages });
  },

  goBack() {
    wx.navigateBack();
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          originalImageUrl: res.tempFiles[0].tempFilePath,
          enhancedImageUrl: '',
          selectedEnhancement: '',
          processingProgress: 0,
          currentStep: ''
        });
      }
    });
  },

  previewOriginalImage() {
    if (this.data.originalImageUrl) {
      wx.previewImage({
        urls: [this.data.originalImageUrl],
        current: this.data.originalImageUrl
      });
    }
  },

  previewEnhancedImage() {
    if (this.data.enhancedImageUrl) {
      wx.previewImage({
        urls: [this.data.enhancedImageUrl],
        current: this.data.enhancedImageUrl
      });
    }
  },

  selectEnhancement(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      selectedEnhancement: id
    });
  },

  enhanceImage() {
    if (!this.data.originalImageUrl || !this.data.selectedEnhancement) {
      wx.showToast({
        title: '请先选择图片和增强类型',
        icon: 'none'
      });
      return;
    }

    this.setData({
      isEnhancing: true,
      processingProgress: 0,
      currentStep: this.data.processingSteps[this.data.selectedEnhancement][0]
    });

    // 模拟处理进度
    this.simulateProcessingProgress();
  },

  // 模拟处理进度
  simulateProcessingProgress() {
    const steps = this.data.processingSteps[this.data.selectedEnhancement];
    const stepTime = 2500 / steps.length;
    let currentStepIndex = 0;
    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += 2;

      // 更新当前步骤
      if (progress >= (currentStepIndex + 1) * (100 / steps.length) && currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        this.setData({
          currentStep: steps[currentStepIndex]
        });
      }

      this.setData({
        processingProgress: progress
      });

      if (progress >= 100) {
        clearInterval(progressInterval);
        // 模拟API调用延时
        setTimeout(() => {
          this.completeImageProcessing();
        }, 300);
      }
    }, 50);
  },

  // 完成图像处理
  completeImageProcessing() {
    // 在实际应用中，这里应该是调用后端API处理后的图片
    // 在这个演示中，我们简单地使用原图来模拟处理后的效果
    const enhancedImageUrl = this.data.originalImageUrl;

    // 保存到历史记录
    const newHistoryItem = {
      id: Date.now(),
      originalUrl: this.data.originalImageUrl,
      enhancedUrl: enhancedImageUrl,
      enhancementType: this.data.selectedEnhancement,
      timestamp: Date.now()
    };

    const enhancedImages = [newHistoryItem, ...this.data.enhancedImages];

    // 限制历史记录数量
    if (enhancedImages.length > 20) {
      enhancedImages.pop();
    }

    this.setData({
      enhancedImageUrl,
      enhancedImages,
      isEnhancing: false
    });

    // 保存到本地存储
    wx.setStorageSync('imageEnhancementHistory', enhancedImages);

    wx.showToast({
      title: '增强完成',
      icon: 'success'
    });
  },

  saveImage() {
    if (!this.data.enhancedImageUrl) return;

    wx.saveImageToPhotosAlbum({
      filePath: this.data.enhancedImageUrl,
      success: () => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
      },
      fail: (err) => {
        // 检查是否是因为用户拒绝授权导致的失败
        if (err.errMsg.indexOf('auth deny') >= 0) {
          wx.showModal({
            title: '提示',
            content: '需要授权保存图片到相册',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.writePhotosAlbum']) {
                      this.saveImage();
                    }
                  }
                });
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
      enhancedImageUrl: '',
      selectedEnhancement: '',
      processingProgress: 0,
      currentStep: ''
    });
  },

  toggleHistory() {
    this.setData({
      showHistory: !this.data.showHistory
    });
  },

  viewHistoryImage(e) {
    const id = e.currentTarget.dataset.id;
    const image = this.data.enhancedImages.find(item => item.id === id);

    if (image) {
      this.setData({
        showHistory: false,
        originalImageUrl: image.originalUrl,
        enhancedImageUrl: image.enhancedUrl,
        selectedEnhancement: image.enhancementType
      });
    }
  },

  deleteHistoryImage(e) {
    const id = e.currentTarget.dataset.id;
    const enhancedImages = this.data.enhancedImages.filter(item => item.id !== id);

    this.setData({
      enhancedImages
    });

    wx.setStorageSync('imageEnhancementHistory', enhancedImages);

    wx.showToast({
      title: '已删除',
      icon: 'success'
    });
  },

  onShareAppMessage() {
    return {
      title: '我用AI增强了这张图片，效果惊艳！',
      path: '/pages/tools/image-enhancement/index',
      imageUrl: this.data.enhancedImageUrl || ''
    };
  }
});