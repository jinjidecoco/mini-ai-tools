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

Page({
  data: {
    imageUrl: '',                      // 原始图片URL
    resultImageUrl: '',                // 处理后图片URL
    isProcessing: false,               // 是否处理中
    showSettings: false,               // 是否显示设置面板
    watermarkType: 'auto' as WatermarkType,         // 水印类型
    processingStrength: 'medium' as ProcessingStrength,   // 处理强度
    qualityPreservation: 'normal' as QualityPreservation, // 图片质量保留
    showTips: true,                    // 是否显示提示
    history: [] as HistoryItem[]       // 历史记录
  },

  onLoad() {
    // 加载历史记录
    this.loadHistory();
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

  // 切换设置面板
  toggleSettings() {
    this.setData({
      showSettings: !this.data.showSettings
    });
  },

  // 隐藏提示
  hideTips() {
    this.setData({
      showTips: false
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

        // 检查文件大小
        const fileSize = res.tempFiles[0].size;
        if (fileSize > 10 * 1024 * 1024) { // 10MB限制
          wx.showToast({
            title: '图片大小不能超过10MB',
            icon: 'none'
          });
          return;
        }

        this.setData({
          imageUrl: tempFilePath,
          resultImageUrl: ''
        });
      }
    });
  },

  // 设置水印类型
  setWatermarkType(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      watermarkType: e.currentTarget.dataset.type as WatermarkType
    });
  },

  // 设置处理强度
  setProcessingStrength(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      processingStrength: e.currentTarget.dataset.strength as ProcessingStrength
    });
  },

  // 设置质量保留
  setQualityPreservation(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      qualityPreservation: e.currentTarget.dataset.quality as QualityPreservation
    });
  },

  // 处理图片
  processImage() {
    if (!this.data.imageUrl) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }

    // 设置处理中状态
    this.setData({
      isProcessing: true,
      showSettings: false
    });

    // 模拟API调用延迟
    setTimeout(() => {
      this.removeWatermark();
    }, 2000);
  },

  // 去除水印（模拟实现）
  removeWatermark() {
    // 实际应用中，这里应该调用后端API或云函数进行处理
    // 这里仅作模拟

    // 模拟处理完成后的结果
    // 实际中应该接收服务器返回的新图片URL
    const resultImageUrl = this.data.imageUrl;

    // 更新状态
    this.setData({
      resultImageUrl,
      isProcessing: false
    });

    // 添加到历史记录
    this.addToHistory(this.data.imageUrl, resultImageUrl);
  },

  // 添加到历史记录
  addToHistory(originalUrl: string, resultUrl: string) {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      originalUrl,
      resultUrl,
      date: Date.now(),
      watermarkType: this.data.watermarkType
    };

    const history = [historyItem, ...this.data.history];

    // 限制历史记录数量，最多保存20条
    if (history.length > 20) {
      history.pop();
    }

    // 更新数据
    this.setData({
      history
    });

    // 保存到本地存储
    wx.setStorageSync('watermarkRemovalHistory', history);
  },

  // 重置图片
  resetImage() {
    this.setData({
      imageUrl: '',
      resultImageUrl: '',
      showSettings: false
    });
  },

  // 保存图片
  saveImage() {
    if (!this.data.resultImageUrl) {
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath: this.data.resultImageUrl,
      success: () => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
      },
      fail: (err) => {
        // 如果用户拒绝授权，显示提示引导用户打开授权
        if (err.errMsg.indexOf('auth deny') !== -1) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.writePhotosAlbum']) {
                      wx.showToast({
                        title: '授权成功，请重新保存',
                        icon: 'none'
                      });
                    } else {
                      wx.showToast({
                        title: '授权失败，无法保存图片',
                        icon: 'none'
                      });
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

  // 查看历史记录项
  viewHistoryItem(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    const item = this.data.history.find(item => item.id === id);

    if (item) {
      this.setData({
        imageUrl: item.originalUrl,
        resultImageUrl: item.resultUrl
      });
    }
  },

  // 分享图片
  shareImage() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 分享到朋友圈
  onShareAppMessage() {
    return {
      title: '我用AI去水印工具处理了图片，效果超赞！',
      path: '/pages/tools/watermark-remover/index'
    };
  }
});
