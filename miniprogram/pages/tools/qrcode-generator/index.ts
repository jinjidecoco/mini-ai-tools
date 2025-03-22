// qrcode-generator/index.ts

interface QRCodeHistory {
  id: string;
  url: string;
  timestamp: number;
}

Page({
  data: {
    url: '',
    qrCodeImage: '',
    isGenerating: false,
    history: [] as QRCodeHistory[],
    showHistory: false,
    urlPrefix: 'https://',
    maxLength: 500
  },

  onLoad() {
    this.loadHistory();
  },

  loadHistory() {
    try {
      const historyString = wx.getStorageSync('qrcode_history');
      if (historyString) {
        this.setData({
          history: JSON.parse(historyString)
        });
      }
    } catch (e) {
      console.error('加载历史记录失败', e);
      wx.showToast({
        title: '加载历史记录失败',
        icon: 'none'
      });
    }
  },

  navigateBack() {
    wx.navigateBack();
  },

  toggleHistory() {
    this.setData({
      showHistory: !this.data.showHistory
    });
  },

  onUrlInput(e: any) {
    this.setData({
      url: e.detail.value
    });
  },

  clearInput() {
    this.setData({
      url: ''
    });
  },

  generateQRCode() {
    if (!this.validateUrl()) return;

    const formattedUrl = this.formatUrl(this.data.url);

    this.setData({
      isGenerating: true
    });

    // 模拟QR码生成
    this.simulateQRCodeGeneration(formattedUrl);
  },

  validateUrl() {
    if (!this.data.url.trim()) {
      wx.showToast({
        title: '请输入网址',
        icon: 'none'
      });
      return false;
    }
    return true;
  },

  formatUrl(url: string) {
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = this.data.urlPrefix + url;
    }
    return url;
  },

  simulateQRCodeGeneration(url: string) {
    // 在实际应用中，应该调用QR码生成API或库
    // 这里使用模拟延迟和占位图像
    setTimeout(() => {
      // 使用占位图像
      const qrCodeImage = '/assets/placeholders/qrcode_placeholder.svg';

      this.setData({
        qrCodeImage,
        isGenerating: false
      });

      // 添加到历史记录
      this.addToHistory(url);

    }, 1000);
  },

  addToHistory(url: string) {
    const newHistoryItem: QRCodeHistory = {
      id: Date.now().toString(),
      url,
      timestamp: Date.now()
    };

    let history = [...this.data.history];
    history.unshift(newHistoryItem);

    // 只保留最近10条记录
    if (history.length > 10) {
      history = history.slice(0, 10);
    }

    this.setData({ history });

    try {
      wx.setStorageSync('qrcode_history', JSON.stringify(history));
    } catch (e) {
      console.error('保存历史记录失败', e);
    }
  },

  saveQRCode() {
    wx.showLoading({ title: '保存中...' });

    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.doSaveQRCode();
            },
            fail: () => {
              wx.hideLoading();
              wx.showModal({
                title: '保存失败',
                content: '请授权访问相册后重试',
                showCancel: false
              });
            }
          });
        } else {
          this.doSaveQRCode();
        }
      }
    });
  },

  doSaveQRCode() {
    wx.downloadFile({
      url: this.data.qrCodeImage,
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
          fail: () => {
            wx.hideLoading();
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '下载图片失败',
          icon: 'none'
        });
      }
    });
  },

  shareQRCode() {
    // 分享图片，在小程序中可使用以下方式
    wx.showToast({
      title: '长按图片可保存或分享',
      icon: 'none',
      duration: 2000
    });
  },

  viewHistoryItem(e: any) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.history.find(h => h.id === id);

    if (item) {
      this.setData({
        url: item.url,
        showHistory: false
      });

      this.generateQRCode();
    }
  },

  deleteHistoryItem(e: any) {
    const id = e.currentTarget.dataset.id;
    const history = this.data.history.filter(h => h.id !== id);

    this.setData({ history });

    try {
      wx.setStorageSync('qrcode_history', JSON.stringify(history));
    } catch (e) {
      console.error('保存历史记录失败', e);
    }
  },

  clearHistory() {
    wx.showModal({
      title: '确认',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ history: [] });
          try {
            wx.setStorageSync('qrcode_history', '[]');
            wx.showToast({
              title: '已清空历史记录',
              icon: 'success'
            });
          } catch (e) {
            console.error('清空历史记录失败', e);
          }
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '二维码生成工具',
      path: '/pages/tools/qrcode-generator/index',
      imageUrl: this.data.qrCodeImage || undefined
    };
  }
});
