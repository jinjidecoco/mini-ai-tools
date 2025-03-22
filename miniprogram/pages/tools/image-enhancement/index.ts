// image-enhancement/index.ts
// 获取应用实例
// const appInstance = getApp<IAppOption>()

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
    originalImageUrl: '',
    isEnhancing: false,
    errorMessage: '',
    selectedEnhancement: '',
    enhancedImageUrl: '',
    enhancementHistory: [] as EnhancedImage[],
    selectedHistoryImage: null as EnhancedImage | null,
    currentEnhancementTitle: '',
    enhancementTime: 0,
    enhancementTips: '',
    showHelpModal: false,
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
      },
      {
        id: 'hdr',
        title: 'HDR效果',
        description: '增强图像动态范围和色彩表现',
        icon: '../../../assets/icons/enhancement-hdr.svg'
      }
    ] as EnhancementOption[]
  },

  onLoad() {
    // 加载历史增强记录
    const enhancementHistory = wx.getStorageSync('enhancementHistory') || [];
    this.setData({ enhancementHistory });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 显示帮助信息
  showHelp() {
    wx.showModal({
      title: 'AI图像增强使用帮助',
      content: '1. 上传图片：点击上传或拍摄照片\n2. 选择增强类型：根据您的需求选择适合的增强模式\n3. 开始增强：点击按钮开始AI增强处理\n4. 保存结果：增强完成后可以保存或分享结果',
      showCancel: false,
      confirmText: '知道了'
    });
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
          originalImageUrl: tempFilePath,
          errorMessage: '',
          enhancedImageUrl: '',
          selectedEnhancement: ''
        });
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        if (err.errMsg.indexOf('cancel') === -1) {
          this.setData({
            errorMessage: '选择图片失败，请重试'
          });
        }
      }
    });
  },

  // 重新拍照/选择图片
  retakeImage() {
    this.chooseImage();
  },

  // 选择增强选项
  selectEnhancement(e: any) {
    const { id } = e.currentTarget.dataset;
    this.setData({
      selectedEnhancement: id,
      errorMessage: ''
    });

    // 添加触感反馈
    if (wx.vibrateShort) {
      wx.vibrateShort({
        type: 'light'
      });
    }
  },

  // 获取增强类型标题
  getEnhancementTitle(typeId: string): string {
    const option = this.data.enhancementOptions.find(opt => opt.id === typeId);
    return option ? option.title : '';
  },

  // 增强图片
  enhanceImage() {
    if (!this.data.originalImageUrl) {
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

    // 模拟API调用
    this.simulateApiCall().then(() => {
      const currentTime = Date.now();
      const enhancementType = this.data.selectedEnhancement;
      const currentEnhancementTitle = this.getEnhancementTitle(enhancementType);

      // 生成随机的示例增强图片URL (实际项目中应替换为真实API返回的URL)
      const demoImageUrls = [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        'https://images.unsplash.com/photo-1521119989659-a83eee488004',
        'https://images.unsplash.com/photo-1596510914215-7754ffc0573b',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
      ];
      const randomImageUrl = demoImageUrls[Math.floor(Math.random() * demoImageUrls.length)];

      const enhancedImage: EnhancedImage = {
        id: currentTime,
        originalUrl: this.data.originalImageUrl,
        enhancedUrl: randomImageUrl,
        timestamp: currentTime,
        enhancementType
      };

      // 生成对应的增强提示
      let enhancementTips = '';
      switch(enhancementType) {
        case 'portrait':
          enhancementTips = '人像美化完成，面部特征自然增强，肤色更加均匀';
          break;
        case 'upscale':
          enhancementTips = '图像分辨率提升至原图的4倍，细节更加清晰';
          break;
        case 'restoration':
          enhancementTips = '图像修复完成，已移除噪点和模糊，修复受损区域';
          break;
        case 'background':
          enhancementTips = '背景优化完成，主体更加突出，色彩更加和谐';
          break;
        case 'style':
          enhancementTips = '风格转换完成，已应用艺术风格滤镜';
          break;
        case 'hdr':
          enhancementTips = 'HDR效果应用完成，动态范围扩展，暗部细节增强';
          break;
      }

      const enhancementHistory = [enhancedImage, ...this.data.enhancementHistory];
      // 只保留最近的20条记录
      const limitedHistory = enhancementHistory.slice(0, 20);

      this.setData({
        enhancedImageUrl: enhancedImage.enhancedUrl,
        enhancementHistory: limitedHistory,
        isEnhancing: false,
        currentEnhancementTitle,
        enhancementTime: currentTime,
        enhancementTips
      });

      // 保存到本地存储
      wx.setStorageSync('enhancementHistory', limitedHistory);

      // 显示成功提示
      wx.showToast({
        title: '增强成功',
        icon: 'success',
        duration: 1500
      });
    }).catch(() => {
      this.setData({
        errorMessage: '图像增强失败，请重试',
        isEnhancing: false
      });

      wx.showToast({
        title: '增强失败',
        icon: 'error',
        duration: 1500
      });
    });
  },

  // 模拟API调用
  simulateApiCall(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 随机成功率为95%
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject();
        }
      }, 2000);
    });
  },

  // 查看历史记录中的图片
  viewHistoryImage(e: any) {
    const { id } = e.currentTarget.dataset;
    const selectedHistoryImage = this.data.enhancementHistory.find(img => img.id === id);
    if (selectedHistoryImage) {
      this.setData({
        originalImageUrl: selectedHistoryImage.originalUrl,
        enhancedImageUrl: selectedHistoryImage.enhancedUrl,
        selectedEnhancement: selectedHistoryImage.enhancementType,
        currentEnhancementTitle: this.getEnhancementTitle(selectedHistoryImage.enhancementType),
        enhancementTime: selectedHistoryImage.timestamp
      });

      // 滚动到顶部
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },

  // 删除历史记录项
  deleteHistoryItem(e: any) {
    const { id } = e.currentTarget.dataset;

    // 阻止冒泡，防止触发viewHistoryImage
    e.stopPropagation();

    wx.showModal({
      title: '删除确认',
      content: '确定要删除这条增强记录吗？',
      success: (res) => {
        if (res.confirm) {
          const updatedHistory = this.data.enhancementHistory.filter(item => item.id !== id);
          this.setData({
            enhancementHistory: updatedHistory
          });

          // 更新本地存储
          wx.setStorageSync('enhancementHistory', updatedHistory);

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看所有历史
  viewAllHistory() {
    // 在实际应用中，这里可以跳转到专门的历史记录页面
    wx.showToast({
      title: '查看全部历史记录',
      icon: 'none'
    });
  },

  // 预览原始图片
  previewOriginalImage() {
    if (this.data.originalImageUrl) {
      wx.previewImage({
        urls: [this.data.originalImageUrl],
        current: this.data.originalImageUrl
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

  // 另存为新图片
  saveAsNew() {
    if (!this.data.enhancedImageUrl) {
      wx.showToast({
        title: '没有可用的增强图像',
        icon: 'none'
      });
      return;
    }

    wx.showActionSheet({
      itemList: ['保存到相册', '重新增强此图'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.saveImage();
        } else if (res.tapIndex === 1) {
          // 设置当前图片为增强图，让用户可以再次增强
          this.setData({
            originalImageUrl: this.data.enhancedImageUrl,
            enhancedImageUrl: '',
            selectedEnhancement: ''
          });
        }
      }
    });
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

    // 如果是网络图片，需要先下载
    if (this.data.enhancedImageUrl.startsWith('http')) {
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
    } else {
      // 本地图片直接保存
      this.saveImageToAlbum(this.data.enhancedImageUrl);
    }
  },

  // 保存图片到相册
  saveImageToAlbum(filePath: string) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        wx.hideLoading();
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('保存失败:', err);

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
      originalImageUrl: '',
      enhancedImageUrl: '',
      errorMessage: '',
      selectedEnhancement: ''
    });
  },

  onShareAppMessage() {
    return {
      title: 'AI图像增强',
      path: '/pages/tools/image-enhancement/index',
      imageUrl: this.data.enhancedImageUrl || ''
    };
  },

  onShareTimeline() {
    return {
      title: 'AI图像增强 - 一键提升图片质量',
      imageUrl: this.data.enhancedImageUrl || ''
    };
  }
})