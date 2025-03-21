// index.ts

// Get app instance
const appInstance = getApp<IAppOption>();

// Define interfaces
interface ImageStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface GeneratedImage {
  id: number;
  prompt: string;
  style: string;
  ratio: string;
  imageUrl: string;
  timestamp: number;
}

Page({
  data: {
    prompt: '',
    isGenerating: false,
    showError: false,
    errorMessage: '',
    selectedStyle: 'realistic',
    selectedRatio: '1:1',
    generatedImage: null as GeneratedImage | null,
    generationHistory: [] as GeneratedImage[],
    styles: [
      {
        id: 'realistic',
        name: '写实风格',
        description: '照片般的真实感图像',
        icon: '../../../assets/icons/style-realistic.svg'
      },
      {
        id: 'anime',
        name: '动漫风格',
        description: '日式动漫插画风格',
        icon: '../../../assets/icons/style-anime.svg'
      },
      {
        id: 'watercolor',
        name: '水彩画',
        description: '柔和的水彩艺术效果',
        icon: '../../../assets/icons/style-watercolor.svg'
      },
      {
        id: 'oil',
        name: '油画',
        description: '经典油画艺术风格',
        icon: '../../../assets/icons/style-oil.svg'
      },
      {
        id: '3d',
        name: '3D渲染',
        description: '3D建模渲染效果',
        icon: '../../../assets/icons/style-3d.svg'
      },
    ] as ImageStyle[],
    aspectRatios: [
      { id: '1:1', name: '正方形', width: 512, height: 512 },
      { id: '4:3', name: '横版', width: 576, height: 432 },
      { id: '3:4', name: '竖版', width: 432, height: 576 },
      { id: '16:9', name: '宽屏', width: 640, height: 360 },
    ]
  },

  onLoad() {
    // 加载历史生成记录
    const history = wx.getStorageSync('imageGenerationHistory');
    if (history) {
      this.setData({
        generationHistory: JSON.parse(history)
      });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  onPromptInput(e: any) {
    this.setData({
      prompt: e.detail.value,
      showError: false
    });
  },

  selectStyle(e: any) {
    const styleId = e.currentTarget.dataset.id;
    this.setData({
      selectedStyle: styleId
    });
  },

  selectRatio(e: any) {
    const ratioId = e.currentTarget.dataset.id;
    this.setData({
      selectedRatio: ratioId
    });
  },

  clearPrompt() {
    this.setData({
      prompt: '',
      showError: false
    });
  },

  async generateImage() {
    if (!this.data.prompt.trim()) {
      this.setData({
        showError: true,
        errorMessage: '请输入图像描述'
      });
      return;
    }

    // Start generation
    this.setData({ isGenerating: true });

    try {
      // 获取选择的宽高比
      const selectedRatio = this.data.aspectRatios.find(r => r.id === this.data.selectedRatio);

      // 这里是模拟API调用，实际项目中应调用真实的AI服务API
      await this.simulateApiCall();

      // 创建一个随机图像地址（实际项目中应使用API返回的实际图像URL）
      // 以下使用占位图，实际应用中替换为真实API返回的图像URL
      const imageWidth = selectedRatio?.width || 512;
      const imageHeight = selectedRatio?.height || 512;
      const randomImageId = Math.floor(Math.random() * 1000);
      const imageUrl = `https://picsum.photos/${imageWidth}/${imageHeight}?random=${randomImageId}`;

      // 创建生成的图像对象
      const generatedImage: GeneratedImage = {
        id: Date.now(),
        prompt: this.data.prompt,
        style: this.data.selectedStyle,
        ratio: this.data.selectedRatio,
        imageUrl: imageUrl,
        timestamp: Date.now()
      };

      // 更新界面并保存历史记录
      const updatedHistory = [generatedImage, ...this.data.generationHistory].slice(0, 20);
      this.setData({
        generatedImage: generatedImage,
        generationHistory: updatedHistory,
        isGenerating: false
      });

      // 保存到本地存储
      wx.setStorageSync('imageGenerationHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      this.setData({
        isGenerating: false,
        showError: true,
        errorMessage: '图像生成失败，请重试'
      });
    }
  },

  // 模拟API调用的函数，加入延迟以模拟真实网络请求
  simulateApiCall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000); // 3秒延迟模拟生成过程
    });
  },

  viewHistoryImage(e: any) {
    const imageId = e.currentTarget.dataset.id;
    const selectedImage = this.data.generationHistory.find(img => img.id === imageId);
    if (selectedImage) {
      this.setData({
        generatedImage: selectedImage
      });
    }
  },

  previewImage() {
    if (this.data.generatedImage) {
      wx.previewImage({
        urls: [this.data.generatedImage.imageUrl],
        current: this.data.generatedImage.imageUrl
      });
    }
  },

  saveImage() {
    if (!this.data.generatedImage) return;

    wx.showLoading({ title: '保存中...' });

    wx.downloadFile({
      url: this.data.generatedImage.imageUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.hideLoading();
              wx.showToast({
                title: '已保存到相册',
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
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '下载图片失败',
            icon: 'none'
          });
        }
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

  shareImage() {
    if (this.data.generatedImage) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
  },

  onShareAppMessage() {
    if (this.data.generatedImage) {
      return {
        title: `AI生成图像: ${this.data.generatedImage.prompt.substring(0, 20)}...`,
        imageUrl: this.data.generatedImage.imageUrl,
        path: '/pages/tools/text-to-image/index'
      };
    }
    return {
      title: 'AI文本生成图像',
      path: '/pages/tools/text-to-image/index'
    };
  }
})