// watermark-remover/index.ts
// 获取应用实例
const app = getApp<IAppOption>()

interface ImageInfo {
  id: number;
  path: string;
  size: string;
  timestamp: number;
  processed?: boolean;
}

interface ProcessedImage {
  id: number;
  originalPath: string;
  processedPath: string;
  timestamp: number;
}

// 水印去除工具逻辑

// 定义类型
interface HistoryItem {
  id: string;
  originalUrl: string;
  resultUrl: string;
  date: number;
  watermarkType: WatermarkType;
}

type WatermarkType = 'auto' | 'text' | 'image' | 'complex';
type ProcessingStrength = 'low' | 'medium' | 'high';
type QualityPreservation = 'normal' | 'high';

interface PageData {
  isLoading: boolean;
  originalImage: string;
  processedImage: string;
  showResult: boolean;
  errorMessage: string;
  showError: boolean;
  isLoggedIn: boolean;
  remainingCredits: number;
  watermarkType: string;
  quality: string;
  showTips: boolean;
  progressPercent: number;
}

Page<PageData>({
  data: {
    isLoading: false,
    originalImage: '',
    processedImage: '',
    showResult: false,
    errorMessage: '',
    showError: false,
    isLoggedIn: false,
    remainingCredits: 10,
    watermarkType: 'auto',
    quality: 'high',
    showTips: true,
    progressPercent: 0
  },

  onLoad() {
    // 检查登录状态
    const app = getApp<IAppOption>();
    const isLoggedIn = app.checkAndNavigateToLogin('/pages/tools/watermark-remover/index');

    if (isLoggedIn) {
      this.setData({ isLoggedIn: true });
      this.loadApiUsage();
    }

    // 检查是否需要显示使用技巧
    const tipsShown = wx.getStorageSync('watermarkTipsShown');
    if (tipsShown) {
      this.setData({ showTips: false });
    }
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('watermarkRemovalHistory') || [];
    this.setData({
      history
    });
  },

  // 导航返回
  navigateBack() {
    wx.navigateBack();
  },

  // 隐藏使用技巧
  hideTips() {
    this.setData({ showTips: false });
    wx.setStorageSync('watermarkTipsShown', true);
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];

        // 显示原始图片
        this.setData({
          originalImage: tempFilePath,
          processedImage: '',
          showResult: false
        });

        // 检查图片大小
        wx.getFileInfo({
          filePath: tempFilePath,
          success: (fileInfo) => {
            const sizeInMB = fileInfo.size / (1024 * 1024);
            if (sizeInMB > 5) {
              this.showError('图片大小超过5MB，可能会影响处理速度');
            }
          }
        });
      }
    });
  },

  // 设置水印类型
  setWatermarkType(e) {
    this.setData({
      watermarkType: e.currentTarget.dataset.type
    });
  },

  // 处理图片
  processImage() {
    if (!this.data.originalImage) {
      this.showError('请先选择一张图片');
      return;
    }

    // 设置加载状态
    this.setData({ isLoading: true });

    // 添加振动反馈
    wx.vibrateShort({ type: 'medium' });

    // 模拟进度
    this.simulateProgress();

    // 模拟API调用
    setTimeout(() => {
      // 实际应用中，这里应调用百度AI的inpainting API

      // 模拟处理结果 - 实际项目中应替换为真实API调用
      this.handleProcessResult();
    }, 3000);
  },

  // 模拟进度
  simulateProgress() {
    let progress = 0;
    const timer = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        clearInterval(timer);
        progress = 100;
      }
      this.setData({
        progressPercent: Math.min(Math.floor(progress), 95)
      });
    }, 200);
  },

  // 处理结果（模拟）
  handleProcessResult() {
    // 实际项目中，这里应处理API返回结果

    // 为了演示，我们简单复制原图作为结果
    const tempFilePath = this.data.originalImage;

    this.setData({
      processedImage: tempFilePath,
      showResult: true,
      isLoading: false
    });

    // 添加振动反馈
    wx.vibrateShort({ type: 'light' });
  },

  // 显示错误信息
  showError(message) {
    // 添加振动反馈
    wx.vibrateShort({ type: 'heavy' });

    this.setData({
      errorMessage: message,
      showError: true
    });

    setTimeout(() => {
      this.setData({ showError: false });
    }, 3000);
  },

  // 保存到相册
  saveToAlbum() {
    if (!this.data.processedImage) {
      this.showError('没有可保存的图片');
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath: this.data.processedImage,
      success: () => {
        // 添加振动反馈
        wx.vibrateShort({ type: 'light' });

        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('保存到相册失败', err);
        this.showError('保存到相册失败，请检查权限设置');
      }
    });
  },

  // 重置图片
  resetImage() {
    this.setData({
      originalImage: '',
      processedImage: '',
      showResult: false
    });
    this.chooseImage();
  },

  // 加载API使用情况
  loadApiUsage() {
    const credits = wx.getStorageSync('watermarkRemoverCredits');
    if (credits !== undefined && credits !== null) {
      this.setData({ remainingCredits: credits });
    } else {
      // 初始积分
      wx.setStorageSync('watermarkRemoverCredits', this.data.remainingCredits);
    }
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '一键去除图片水印，效果超赞！',
      path: '/pages/tools/watermark-remover/index',
      imageUrl: this.data.processedImage || '../../../assets/images/share-cover.png'
    };
  }
});
