// background-remover/index.ts
// 获取应用实例
const app = getApp<IAppOption>()

interface ImageInfo {
  id: number;
  path: string;
  size: string;
  timestamp: number;
}

interface ProcessedImage {
  id: number;
  originalPath: string;
  processedPath: string;
  timestamp: number;
  background?: string; // 可选的背景颜色或类型
}

Page({
  data: {
    isProcessing: false,
    currentImage: null as ImageInfo | null,
    processedImage: null as ProcessedImage | null,
    processedImages: [] as ProcessedImage[],
    errorMessage: '',
    precision: 'high', // high, medium, low
    resultFormat: 'png', // png, jpg
    transparentBg: true,
    customBgColor: '#ffffff',
    showSettings: true,
    processingProgress: 0,
    imageAnalysisComplete: false,
    showHistory: false
  },

  onLoad() {
    // 加载历史记录
    const history = wx.getStorageSync('backgroundRemoverHistory') || [];
    this.setData({
      processedImages: history
    });
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
        const tempFile = res.tempFiles[0];
        const sizeKB = (tempFile.size / 1024).toFixed(2);
        const sizeText = `${sizeKB} KB`;

        this.setData({
          currentImage: {
            id: Date.now(),
            path: tempFile.tempFilePath,
            size: sizeText,
            timestamp: Date.now()
          },
          errorMessage: '',
          processedImage: null,
          processingProgress: 0,
          imageAnalysisComplete: false
        });
      },
      fail: (err) => {
        console.error('选择图片失败', err);
        this.setData({
          errorMessage: '选择图片失败，请重试'
        });
      }
    });
  },

  selectPrecision(e: any) {
    const precision = e.currentTarget.dataset.precision;
    this.setData({
      precision
    });
  },

  selectFormat(e: any) {
    const format = e.currentTarget.dataset.format;
    this.setData({
      resultFormat: format
    });
  },

  toggleTransparent(e: any) {
    this.setData({
      transparentBg: e.detail.value
    });
  },

  onBgColorChange(e: any) {
    this.setData({
      customBgColor: e.detail.value
    });
  },

  toggleSettings() {
    this.setData({
      showSettings: !this.data.showSettings
    });
  },

  toggleHistory() {
    this.setData({
      showHistory: !this.data.showHistory
    });
  },

  processImage() {
    if (!this.data.currentImage) return;

    this.setData({
      isProcessing: true,
      processingProgress: 0,
      imageAnalysisComplete: false,
      errorMessage: ''
    });

    // 模拟处理进度
    this.simulateProcessingProgress();
  },

  // 模拟处理进度
  simulateProcessingProgress() {
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      this.setData({
        processingProgress: progress
      });

      if (progress === 50) {
        this.setData({
          imageAnalysisComplete: true
        });
      }

      if (progress >= 100) {
        clearInterval(progressInterval);

        // 模拟API调用延时
        setTimeout(() => {
          this.completeImageProcessing();
        }, 500);
      }
    }, 100);
  },

  // 完成图像处理
  completeImageProcessing() {
    const currentImage = this.data.currentImage;
    if (!currentImage) return;

    // 这里在实际应用中会得到API返回的处理后图片
    // 这里为了演示，我们使用原图作为处理后的图像
    const processedImage: ProcessedImage = {
      id: Date.now(),
      originalPath: currentImage.path,
      processedPath: currentImage.path, // 实际情况应该是处理后的图像路径
      timestamp: Date.now(),
      background: this.data.transparentBg ? 'transparent' : this.data.customBgColor
    };

    const processedImages = [processedImage, ...this.data.processedImages];
    if (processedImages.length > 20) {
      processedImages.pop();
    }

    this.setData({
      processedImage,
      processedImages,
      isProcessing: false
    });

    // 保存到本地存储
    wx.setStorageSync('backgroundRemoverHistory', processedImages);

    wx.showToast({
      title: '处理完成',
      icon: 'success'
    });
  },

  viewHistoryImage(e: any) {
    const id = e.currentTarget.dataset.id;
    const image = this.data.processedImages.find(item => item.id === id);

    if (image) {
      this.setData({
        showHistory: false,
        processedImage: image,
        currentImage: {
          id: image.id,
          path: image.originalPath,
          size: '', // 这里无法获取到原始大小，可以根据实际情况调整
          timestamp: image.timestamp
        }
      });
    }
  },

  deleteHistoryImage(e: any) {
    const id = e.currentTarget.dataset.id;
    const processedImages = this.data.processedImages.filter(item => item.id !== id);

    this.setData({
      processedImages
    });

    wx.setStorageSync('backgroundRemoverHistory', processedImages);

    wx.showToast({
      title: '已删除',
      icon: 'success'
    });
  },

  saveImage() {
    if (!this.data.processedImage) return;

    const filePath = this.data.processedImage.processedPath;

    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('保存图片失败', err);
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  shareImage() {
    if (!this.data.processedImage) return;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  clearImage() {
    this.setData({
      currentImage: null,
      processedImage: null,
      errorMessage: '',
      processingProgress: 0,
      imageAnalysisComplete: false
    });
  },

  onShareAppMessage() {
    return {
      title: '我使用AI工具轻松去除了图片背景',
      path: '/pages/tools/background-remover/index',
      imageUrl: this.data.processedImage ? this.data.processedImage.processedPath : ''
    };
  }
});
