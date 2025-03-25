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

interface PageData {
  isLoading: boolean;
  originalImage: string;
  processedImage: string;
  showResult: boolean;
  errorMessage: string;
  showError: boolean;
  isLoggedIn: boolean;
  apiKey: 'string';
  remainingCredits: number;
  animateIn: boolean;
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
    apiKey: 'tJWAwfKm5bLVGdzvwecWiKi7', // API 密钥
    remainingCredits: 0,
    animateIn: false
  },

  onLoad() {
    // 检查登录状态
    const app = getApp<IAppOption>();
    const isLoggedIn = app.checkAndNavigateToLogin('/pages/tools/background-remover/index');

    if (isLoggedIn) {
      this.setData({ isLoggedIn: true });
      // 加载用户的 API 使用情况
      this.loadApiUsage();
    }

    // 添加动画效果
    setTimeout(() => {
      this.setData({ animateIn: true });
    }, 100);
  },

  navigateBack() {
    wx.navigateBack();
  },

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
      },
      fail: (err) => {
        console.error('选择图片失败', err);
      }
    });
  },

  processImage() {
    if (!this.data.originalImage) {
      this.showError('请先选择一张图片');
      return;
    }

    this.setData({ isLoading: true });

    // 将图片转换为 base64
    wx.getFileSystemManager().readFile({
      filePath: this.data.originalImage,
      encoding: 'base64',
      success: (res) => {
        // 调用 remove.bg API
        this.callRemoveBgApi(res.data as string);
      },
      fail: (err) => {
        console.error('读取图片失败', err);
        this.showError('读取图片失败');
        this.setData({ isLoading: false });
      }
    });
  },

  callRemoveBgApi(base64Image: string) {
    // 添加振动反馈
    wx.vibrateShort({ type: 'medium' });

    wx.request({
      url: 'https://api.remove.bg/v1.0/removebg',
      method: 'POST',
      header: {
        'X-Api-Key': this.data.apiKey,
        'Content-Type': 'application/json'
      },
      data: {
        image_file_b64: base64Image,
        size: 'auto',
        type: 'auto',
        format: 'png',
        bg_color: null
      },
      responseType: 'arraybuffer',
      success: (res) => {
        if (res.statusCode === 200) {
          // 将返回的图片数据转换为临时文件
          this.saveProcessedImage(res.data);

          // 更新剩余积分
          const credits = res.header['X-Credits-Remaining'];
          if (credits) {
            this.setData({ remainingCredits: parseInt(credits) });
            wx.setStorageSync('removeBgCredits', parseInt(credits));
          }
        } else {
          // 处理错误
          this.handleApiError(res);
        }
      },
      fail: (err) => {
        console.error('API 请求失败', err);
        this.showError('网络请求失败，请检查网络连接');
        this.setData({ isLoading: false });
      }
    });
  },

  saveProcessedImage(arrayBuffer: ArrayBuffer) {
    const fs = wx.getFileSystemManager();
    const tempFilePath = `${wx.env.USER_DATA_PATH}/bg_removed_${Date.now()}.png`;

    fs.writeFile({
      filePath: tempFilePath,
      data: arrayBuffer,
      encoding: 'binary',
      success: () => {
        // 添加振动反馈
        wx.vibrateShort({ type: 'light' });

        this.setData({
          processedImage: tempFilePath,
          showResult: true,
          isLoading: false
        });

        // 保存到历史记录
        this.saveToHistory(tempFilePath);
      },
      fail: (err) => {
        console.error('保存图片失败', err);
        this.showError('保存图片失败');
        this.setData({ isLoading: false });
      }
    });
  },

  handleApiError(res: any) {
    let errorMessage = '处理图片失败';

    try {
      // 尝试解析错误消息
      const errorData = JSON.parse(new TextDecoder().decode(res.data));
      errorMessage = errorData.errors[0].title || errorMessage;
    } catch (e) {
      console.error('解析错误信息失败', e);
    }

    this.showError(errorMessage);
    this.setData({ isLoading: false });
  },

  showError(message: string) {
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

  saveToHistory(imagePath: string) {
    // 这里可以实现保存到历史记录的逻辑
    // 例如，将图片路径和时间戳保存到本地存储
    const history = wx.getStorageSync('bgRemovalHistory') || [];
    history.unshift({
      id: Date.now(),
      imagePath: imagePath,
      timestamp: Date.now()
    });

    // 只保留最近的 20 条记录
    const limitedHistory = history.slice(0, 20);
    wx.setStorageSync('bgRemovalHistory', limitedHistory);
  },

  loadApiUsage() {
    // 这里可以实现加载用户 API 使用情况的逻辑
    // 例如，从服务器获取用户的 API 使用情况
    // 或者从本地存储中获取
    const credits = wx.getStorageSync('removeBgCredits');
    if (credits) {
      this.setData({ remainingCredits: credits });
    }
  },

  resetImage() {
    this.setData({
      originalImage: '',
      processedImage: '',
      showResult: false
    });
    this.chooseImage();
  },

  onShareAppMessage() {
    return {
      title: '一键去除图片背景，效果超赞！',
      path: '/pages/tools/background-remover/index',
      imageUrl: this.data.processedImage || '../../../assets/images/share-cover.png'
    };
  }
});
