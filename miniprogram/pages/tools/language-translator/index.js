// language-translator/index.js
Page({
  data: {
    sourceText: '',
    translatedText: '',
    isTranslating: false,
    translationTime: 0,
    sourceLanguageIndex: 0, // Default to Chinese
    targetLanguageIndex: 1, // Default to English
    languages: [
      { code: 'zh', name: '中文' },
      { code: 'en', name: '英文' },
      { code: 'ja', name: '日文' },
      { code: 'ko', name: '韩文' },
      { code: 'fr', name: '法文' },
      { code: 'de', name: '德文' },
      { code: 'es', name: '西班牙文' },
      { code: 'it', name: '意大利文' },
      { code: 'ru', name: '俄文' },
      { code: 'pt', name: '葡萄牙文' },
      { code: 'ar', name: '阿拉伯文' },
      { code: 'th', name: '泰文' }
    ],
    commonPhrases: [
      '你好，很高兴认识你',
      '请问这个怎么用？',
      '请帮我翻译这段话',
      '谢谢你的帮助',
      '这个地方在哪里？',
      '我需要订一个房间'
    ],
    translationHistory: []
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    // 如果是从其他页面返回，可能需要刷新数据
    this.loadHistory();
  },

  goBack() {
    wx.navigateBack();
  },

  onSourceTextInput(e) {
    this.setData({
      sourceText: e.detail.value
    });
  },

  clearSourceText() {
    this.setData({
      sourceText: ''
    });
  },

  selectSourceLanguage(e) {
    // 如果源语言和目标语言相同，则交换
    const newIndex = parseInt(e.detail.value);
    if (newIndex === this.data.targetLanguageIndex) {
      this.setData({
        sourceLanguageIndex: newIndex,
        targetLanguageIndex: this.data.sourceLanguageIndex
      });
    } else {
      this.setData({
        sourceLanguageIndex: newIndex
      });
    }
  },

  selectTargetLanguage(e) {
    // 如果源语言和目标语言相同，则交换
    const newIndex = parseInt(e.detail.value);
    if (newIndex === this.data.sourceLanguageIndex) {
      this.setData({
        targetLanguageIndex: newIndex,
        sourceLanguageIndex: this.data.targetLanguageIndex
      });
    } else {
      this.setData({
        targetLanguageIndex: newIndex
      });
    }
  },

  switchLanguages() {
    this.setData({
      sourceLanguageIndex: this.data.targetLanguageIndex,
      targetLanguageIndex: this.data.sourceLanguageIndex,
      sourceText: this.data.translatedText,
      translatedText: this.data.sourceText
    });
  },

  useCommonPhrase(e) {
    const phrase = e.currentTarget.dataset.phrase;
    this.setData({
      sourceText: phrase
    });
  },

  async translateText() {
    if (!this.data.sourceText) {
      wx.showToast({
        title: '请输入要翻译的文本',
        icon: 'none'
      });
      return;
    }

    this.setData({ isTranslating: true });

    try {
      // 在实际项目中，这里应该调用云函数或API进行翻译
      await this.simulateTranslationApi();

      // 保存到历史记录
      this.saveToHistory();
    } catch (error) {
      console.error('翻译失败:', error);
      wx.showToast({
        title: '翻译失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ isTranslating: false });
    }
  },

  // 模拟翻译API调用，实际项目中应替换为真实API调用
  simulateTranslationApi() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sourceText = this.data.sourceText;
        const sourceLanguage = this.data.languages[this.data.sourceLanguageIndex].code;
        const targetLanguage = this.data.languages[this.data.targetLanguageIndex].code;

        // 简单的演示翻译逻辑
        let translatedText;
        if (sourceLanguage === 'zh' && targetLanguage === 'en') {
          // 中译英示例
          if (sourceText.includes('你好')) {
            translatedText = sourceText.replace(/你好/g, 'Hello');
          } else if (sourceText.includes('谢谢')) {
            translatedText = sourceText.replace(/谢谢/g, 'Thank you');
          } else {
            // 简单模拟翻译结果
            translatedText = `Translation of "${sourceText}" from Chinese to English`;
          }
        } else if (sourceLanguage === 'en' && targetLanguage === 'zh') {
          // 英译中示例
          if (sourceText.toLowerCase().includes('hello')) {
            translatedText = sourceText.replace(/hello/gi, '你好');
          } else if (sourceText.toLowerCase().includes('thank you')) {
            translatedText = sourceText.replace(/thank you/gi, '谢谢');
          } else {
            // 简单模拟翻译结果
            translatedText = `从英文翻译为中文："${sourceText}"`;
          }
        } else {
          // 其他语言组合的模拟翻译
          translatedText = `Translation from ${sourceLanguage} to ${targetLanguage}: "${sourceText}"`;
        }

        this.setData({
          translatedText: translatedText,
          translationTime: Date.now()
        });

        resolve();
      }, 1500); // 模拟1.5秒的翻译处理时间
    });
  },

  copyTranslation() {
    if (!this.data.translatedText) return;

    wx.setClipboardData({
      data: this.data.translatedText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  shareTranslation() {
    if (!this.data.translatedText) return;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  saveToHistory() {
    const history = [...this.data.translationHistory];
    const sourceLanguage = this.data.languages[this.data.sourceLanguageIndex].name;
    const targetLanguage = this.data.languages[this.data.targetLanguageIndex].name;

    const newItem = {
      id: Date.now(),
      sourceText: this.data.sourceText,
      translatedText: this.data.translatedText,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      timestamp: Date.now()
    };

    history.unshift(newItem);
    if (history.length > 20) {
      history.pop();
    }

    this.setData({ translationHistory: history });
    this.saveHistoryToStorage(history);
  },

  useHistoryItem(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.translationHistory.find(h => h.id === id);

    if (item) {
      // 获取语言索引
      const sourceLanguageIndex = this.data.languages.findIndex(l => l.name === item.sourceLanguage);
      const targetLanguageIndex = this.data.languages.findIndex(l => l.name === item.targetLanguage);

      this.setData({
        sourceText: item.sourceText,
        translatedText: item.translatedText,
        sourceLanguageIndex: sourceLanguageIndex >= 0 ? sourceLanguageIndex : 0,
        targetLanguageIndex: targetLanguageIndex >= 0 ? targetLanguageIndex : 1,
        translationTime: item.timestamp
      });

      // 滚动到顶部
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },

  clearHistory() {
    wx.showModal({
      title: '确认',
      content: '确定要清除所有翻译历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ translationHistory: [] });
          wx.setStorageSync('translationHistory', []);

          wx.showToast({
            title: '历史记录已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  saveHistoryToStorage(history) {
    wx.setStorageSync('translationHistory', history);
  },

  loadHistory() {
    const history = wx.getStorageSync('translationHistory') || [];
    this.setData({ translationHistory: history });
  },

  onShareAppMessage() {
    let title = 'AI语言翻译';
    let path = '/pages/tools/language-translator/index';

    // 如果有翻译结果，分享翻译结果
    if (this.data.translatedText) {
      title = `从${this.data.languages[this.data.sourceLanguageIndex].name}翻译为${this.data.languages[this.data.targetLanguageIndex].name}`;
      // 可以考虑将翻译内容加入分享路径参数
    }

    return {
      title: title,
      path: path,
      imageUrl: '../../../assets/images/share-cover.png'
    };
  },

  onShareTimeline() {
    let title = 'AI语言翻译';

    // 如果有翻译结果，分享翻译结果
    if (this.data.translatedText) {
      title = `${this.data.languages[this.data.sourceLanguageIndex].name} → ${this.data.languages[this.data.targetLanguageIndex].name}: ${this.data.sourceText.substring(0, 20)}${this.data.sourceText.length > 20 ? '...' : ''}`;
    }

    return {
      title: title,
      query: '',
      imageUrl: '../../../assets/images/share-cover.png'
    };
  }
});