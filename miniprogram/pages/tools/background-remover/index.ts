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
    showSettings: true
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
          processedImage: null
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

  toggleTransparent() {
    this.setData({
      transparentBg: !this.data.transparentBg
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

  processImage() {
    if (!this.data.currentImage) {
      this.setData({
        errorMessage: '请先选择图片'
      });
      return;
    }

    this.setData({
      isProcessing: true,
      errorMessage: ''
    });

    // 模拟处理延迟
    setTimeout(() => {
      const originalPath = this.data.currentImage!.path;

      // 模拟处理后的图片路径（实际应用中，这里应该是经过AI处理后的图片）
      // 这里我们简单复用原图，实际应用中需要替换成处理后的图片
      const processedPath = originalPath;

      const background = this.data.transparentBg ? 'transparent' : this.data.customBgColor;

      // 创建新的处理记录
      const newProcessedImage: ProcessedImage = {
        id: Date.now(),
        originalPath,
        processedPath,
        timestamp: Date.now(),
        background
      };

      // 更新历史记录
      const updatedHistory = [newProcessedImage, ...this.data.processedImages].slice(0, 10);
      wx.setStorageSync('backgroundRemoverHistory', updatedHistory);

      this.setData({
        processedImage: newProcessedImage,
        processedImages: updatedHistory,
        isProcessing: false
      });

      wx.showToast({
        title: '背景去除成功',
        icon: 'success'
      });
    }, 2000);
  },

  viewHistoryImage(e: any) {
    const imageId = e.currentTarget.dataset.id;
    const selectedImage = this.data.processedImages.find(img => img.id === imageId);
    if (selectedImage) {
      this.setData({
        processedImage: selectedImage,
        currentImage: {
          id: selectedImage.id,
          path: selectedImage.originalPath,
          size: '查看历史记录',
          timestamp: selectedImage.timestamp
        },
        transparentBg: selectedImage.background === 'transparent',
        customBgColor: selectedImage.background !== 'transparent' ? selectedImage.background || '#ffffff' : '#ffffff'
      });
    }
  },

  saveImage() {
    if (this.data.processedImage) {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.processedImage.processedPath,
        success: () => {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
        },
        fail: (err) => {
          console.error('保存图片失败', err);
          this.setData({
            errorMessage: '保存图片失败，请重试'
          });
        }
      });
    }
  },

  shareImage() {
    if (this.data.processedImage) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
  },

  clearImage() {
    this.setData({
      currentImage: null,
      processedImage: null,
      errorMessage: ''
    });
  }
});
