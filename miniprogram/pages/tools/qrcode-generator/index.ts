// qrcode-generator/index.ts

interface QRCodeHistory {
  id: string;
  content: string;
  timestamp: number;
  type: string;
  colorDark: string;
  logo?: string;
}

Page({
  data: {
    content: '',
    qrCodeImage: '',
    isGenerating: false,
    qrCodeSize: 200, // Default size
    colorDark: '#000000', // Default color
    colorLight: '#ffffff',
    correctLevel: 'H', // H - high, M - medium, L - low
    margin: 10,
    enableLogo: false,
    logoImage: '',
    qrCodeType: 'text', // text, url, wifi, etc.
    history: [] as QRCodeHistory[],
    showHistory: false,
    wifiData: {
      ssid: '',
      password: '',
      encryption: 'WPA', // WPA, WEP, None
    },
    contactData: {
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    urlPrefix: 'https://',
    contentMaxLength: 500,
    showAdvancedOptions: false
  },

  onLoad() {
    this.loadHistory();
  },

  loadHistory() {
    const history = wx.getStorageSync('qrCodeHistory') || [];
    this.setData({ history });
  },

  toggleAdvancedOptions() {
    this.setData({
      showAdvancedOptions: !this.data.showAdvancedOptions
    });
  },

  toggleHistory() {
    this.setData({
      showHistory: !this.data.showHistory
    });
  },

  // Main input for text or URL QR codes
  onContentInput(e: any) {
    const content = e.detail.value;
    this.setData({ content });
  },

  // WIFI inputs
  onWifiSSIDInput(e: any) {
    const ssid = e.detail.value;
    this.setData({
      ['wifiData.ssid']: ssid
    });
  },

  onWifiPasswordInput(e: any) {
    const password = e.detail.value;
    this.setData({
      ['wifiData.password']: password
    });
  },

  onWifiEncryptionChange(e: any) {
    const encryption = e.detail.value;
    this.setData({
      ['wifiData.encryption']: encryption
    });
  },

  // Contact data inputs
  onContactNameInput(e: any) {
    const name = e.detail.value;
    this.setData({
      ['contactData.name']: name
    });
  },

  onContactPhoneInput(e: any) {
    const phone = e.detail.value;
    this.setData({
      ['contactData.phone']: phone
    });
  },

  onContactEmailInput(e: any) {
    const email = e.detail.value;
    this.setData({
      ['contactData.email']: email
    });
  },

  onContactAddressInput(e: any) {
    const address = e.detail.value;
    this.setData({
      ['contactData.address']: address
    });
  },

  clearInput() {
    if (this.data.qrCodeType === 'text' || this.data.qrCodeType === 'url') {
      this.setData({ content: '' });
    } else if (this.data.qrCodeType === 'wifi') {
      this.setData({
        wifiData: {
          ssid: '',
          password: '',
          encryption: 'WPA'
        }
      });
    } else if (this.data.qrCodeType === 'contact') {
      this.setData({
        contactData: {
          name: '',
          phone: '',
          email: '',
          address: ''
        }
      });
    }
  },

  // Color picker for QR code
  onColorChange(e: any) {
    const colorDark = e.detail.value;
    this.setData({ colorDark });
  },

  // Select QR code type
  selectQRCodeType(e: any) {
    const qrCodeType = e.currentTarget.dataset.type;
    this.setData({ qrCodeType });
    // Clear the QR code when switching types
    this.setData({ qrCodeImage: '' });
  },

  // Logo upload
  toggleLogoOption() {
    this.setData({
      enableLogo: !this.data.enableLogo,
      logoImage: '' // Clear the logo when toggling
    });
  },

  chooseLogoImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          logoImage: res.tempFiles[0].tempFilePath
        });
      }
    });
  },

  // QR Code Generation
  generateQRCode() {
    // Check if content is provided
    if (!this.validateContent()) {
      return;
    }

    this.setData({ isGenerating: true });

    // Prepare the QR code content based on type
    let qrContent = this.prepareQRContent();

    // In a real implementation, you would call a cloud function or use a plugin
    // For this example, we'll simulate QR code generation with a timeout
    setTimeout(() => {
      // In a real implementation, this would be where we get the generated QR code
      // Since we don't have an actual QR code generator here, we'll use a placeholder
      this.simulateQRCodeGeneration(qrContent);
    }, 1500);
  },

  validateContent(): boolean {
    let isValid = false;
    let errorMsg = '';

    switch (this.data.qrCodeType) {
      case 'text':
      case 'url':
        isValid = this.data.content.trim().length > 0;
        errorMsg = '请输入内容';
        break;
      case 'wifi':
        isValid = this.data.wifiData.ssid.trim().length > 0;
        errorMsg = '请输入WiFi名称';
        break;
      case 'contact':
        isValid = this.data.contactData.name.trim().length > 0 &&
                 (this.data.contactData.phone.trim().length > 0 ||
                  this.data.contactData.email.trim().length > 0);
        errorMsg = '请至少输入联系人姓名和电话或邮箱';
        break;
    }

    if (!isValid) {
      wx.showToast({
        title: errorMsg,
        icon: 'none'
      });
    }

    return isValid;
  },

  prepareQRContent(): string {
    let content = '';

    switch (this.data.qrCodeType) {
      case 'text':
        content = this.data.content;
        break;
      case 'url':
        content = this.data.content.startsWith('http') ?
                  this.data.content :
                  this.data.urlPrefix + this.data.content;
        break;
      case 'wifi':
        // Format: WIFI:T:WPA;S:SSID;P:PASSWORD;;
        const encryption = this.data.wifiData.encryption === 'None' ? '' : this.data.wifiData.encryption;
        content = `WIFI:T:${encryption};S:${this.data.wifiData.ssid};P:${this.data.wifiData.password};;`;
        break;
      case 'contact':
        // Format a simplified vCard
        content = `BEGIN:VCARD\nVERSION:3.0\nN:${this.data.contactData.name}\nTEL:${this.data.contactData.phone}\nEMAIL:${this.data.contactData.email}\nADR:${this.data.contactData.address}\nEND:VCARD`;
        break;
    }

    return content;
  },

  simulateQRCodeGeneration(content: string) {
    // In a real application, we would generate a QR code here
    // For this demo, we'll simulate success and use a placeholder image
    // In production, you would use a QR code generation library or call a cloud function

    // Simulate generating a QR code and getting the image path
    const qrCodeImage = '../../../assets/placeholder/qrcode-placeholder.png';

    // Add to history
    const historyItem: QRCodeHistory = {
      id: Date.now().toString(),
      content: content,
      timestamp: Date.now(),
      type: this.data.qrCodeType,
      colorDark: this.data.colorDark,
      logo: this.data.enableLogo ? this.data.logoImage : undefined
    };

    const history = [historyItem, ...this.data.history];
    if (history.length > 20) {
      history.pop(); // Keep only the most recent 20 items
    }

    this.setData({
      qrCodeImage,
      isGenerating: false,
      history
    });

    // Save to storage
    wx.setStorageSync('qrCodeHistory', history);

    wx.showToast({
      title: '二维码生成成功',
      icon: 'success'
    });
  },

  // Save QR code to photo album
  saveQRCode() {
    if (!this.data.qrCodeImage) return;

    wx.saveImageToPhotosAlbum({
      filePath: this.data.qrCodeImage,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('保存失败', err);
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片',
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

  // Share QR code
  shareQRCode() {
    if (!this.data.qrCodeImage) return;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // View history item
  viewHistoryItem(e: any) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.history.find(h => h.id === id);

    if (item) {
      // Set the appropriate content
      if (item.type === 'text' || item.type === 'url') {
        this.setData({
          content: item.content,
          qrCodeType: item.type
        });
      } else if (item.type === 'wifi') {
        // Parse the WiFi string
        // Format: WIFI:T:WPA;S:SSID;P:PASSWORD;;
        const match = {
          encryption: item.content.match(/T:([^;]*);/) ? item.content.match(/T:([^;]*);/)![1] : 'WPA',
          ssid: item.content.match(/S:([^;]*);/) ? item.content.match(/S:([^;]*);/)![1] : '',
          password: item.content.match(/P:([^;]*);/) ? item.content.match(/P:([^;]*);/)![1] : ''
        };

        this.setData({
          qrCodeType: 'wifi',
          wifiData: {
            encryption: match.encryption || 'WPA',
            ssid: match.ssid || '',
            password: match.password || ''
          }
        });
      } else if (item.type === 'contact') {
        // Parse the vCard
        const nameMatch = item.content.match(/N:([^\n]*)/);
        const phoneMatch = item.content.match(/TEL:([^\n]*)/);
        const emailMatch = item.content.match(/EMAIL:([^\n]*)/);
        const addrMatch = item.content.match(/ADR:([^\n]*)/);

        this.setData({
          qrCodeType: 'contact',
          contactData: {
            name: nameMatch ? nameMatch[1] : '',
            phone: phoneMatch ? phoneMatch[1] : '',
            email: emailMatch ? emailMatch[1] : '',
            address: addrMatch ? addrMatch[1] : ''
          }
        });
      }

      // Set color and logo
      this.setData({
        colorDark: item.colorDark,
        enableLogo: !!item.logo,
        logoImage: item.logo || '',
        qrCodeImage: '', // Clear the current QR code
        showHistory: false // Close history panel
      });

      // Re-generate QR code
      this.generateQRCode();
    }
  },

  // Delete history item
  deleteHistoryItem(e: any) {
    const id = e.currentTarget.dataset.id;
    const history = this.data.history.filter(item => item.id !== id);

    this.setData({ history });
    wx.setStorageSync('qrCodeHistory', history);

    wx.showToast({
      title: '已删除',
      icon: 'success'
    });
  },

  // Clear all history
  clearHistory() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ history: [] });
          wx.setStorageSync('qrCodeHistory', []);
          wx.showToast({
            title: '已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // Navigation
  goBack() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: '二维码生成工具',
      path: '/pages/tools/qrcode-generator/index',
      imageUrl: this.data.qrCodeImage || undefined
    };
  }
});
