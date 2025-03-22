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
    ],
    commonPhrases: [
      '你好，很高兴认识你',
      '请问这个怎么用？',
      '请帮我翻译这段话',
      '谢谢你的帮助',
      '这个地方在哪里？',
      '我需要订一个房间'
    ],
    translationHistory: [],
    // New AI features
    isDetectingLanguage: false,
    detectedLanguage: null,
    isRecording: false,
    isSpeaking: false,
    showStyleOptions: false,
    showContextOptions: false,
    selectedStyle: 'standard',
    selectedContext: 'general',
    styles: [
      { id: 'standard', name: '标准' },
      { id: 'formal', name: '正式' },
      { id: 'casual', name: '随意' },
      { id: 'professional', name: '专业' },
      { id: 'simplified', name: '简化' }
    ],
    contexts: [
      { id: 'general', name: '通用' },
      { id: 'business', name: '商务' },
      { id: 'technical', name: '技术' },
      { id: 'medical', name: '医疗' },
      { id: 'legal', name: '法律' },
      { id: 'travel', name: '旅游' },
      { id: 'academic', name: '学术' }
    ],
    // AI confidence score
    confidenceScore: 0,
    alternativeTranslations: [],
    showAlternatives: false,
    recorderManager: null
  },

  onLoad() {
    this.loadHistory();
    // Initialize recorder manager for voice input
    this.initRecorderManager();
  },

  onShow() {
    // 如果是从其他页面返回，可能需要刷新数据
    this.loadHistory();
  },

  initRecorderManager() {
    const recorderManager = wx.getRecorderManager();

    recorderManager.onStart(() => {
      console.log('Recorder started');
    });

    recorderManager.onStop((res) => {
      const { tempFilePath } = res;
      console.log('Recorder stopped', tempFilePath);

      this.setData({
        isRecording: false
      });

      // Simulate speech recognition with a delay
      wx.showLoading({
        title: '识别中...'
      });

      setTimeout(() => {
        wx.hideLoading();
        // Simulate speech recognition result
        const recognizedText = this.getSimulatedRecognitionText();
        this.setData({
          sourceText: recognizedText
        });

        // Auto detect language based on the recognized text
        this.detectLanguage(recognizedText);
      }, 1500);
    });

    recorderManager.onError((error) => {
      console.error('Recorder error:', error);
      this.setData({
        isRecording: false
      });
      wx.showToast({
        title: '录音出错',
        icon: 'none'
      });
    });

    this.recorderManager = recorderManager;
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
      sourceText: '',
      detectedLanguage: null
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

    // Auto detect language when common phrase is selected
    this.detectLanguage(phrase);
  },

  toggleStyleOptions() {
    this.setData({
      showStyleOptions: !this.data.showStyleOptions,
      // Close context options if style options is toggled
      showContextOptions: false
    });
  },

  toggleContextOptions() {
    this.setData({
      showContextOptions: !this.data.showContextOptions,
      // Close style options if context options is toggled
      showStyleOptions: false
    });
  },

  selectStyle(e) {
    const styleId = e.currentTarget.dataset.id;
    this.setData({
      selectedStyle: styleId,
      showStyleOptions: false
    });

    // If there's already a translation, retranslate with the new style
    if (this.data.translatedText) {
      this.translateText();
    }
  },

  selectContext(e) {
    const contextId = e.currentTarget.dataset.id;
    this.setData({
      selectedContext: contextId,
      showContextOptions: false
    });

    // If there's already a translation, retranslate with the new context
    if (this.data.translatedText) {
      this.translateText();
    }
  },

  startVoiceInput() {
    // Check if the recorder manager is initialized
    if (!this.recorderManager) {
      wx.showToast({
        title: '录音功能初始化失败',
        icon: 'none'
      });
      return;
    }

    // Request authorization for recording
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        this.setData({
          isRecording: true
        });

        // Start recording
        this.recorderManager.start({
          duration: 60000, // Maximum duration: 60s
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 48000,
          format: 'mp3'
        });
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '需要您授权录音权限',
          showCancel: false
        });
      }
    });
  },

  stopVoiceInput() {
    if (this.recorderManager) {
      this.recorderManager.stop();
    }
  },

  // Generate a simulated recognition text based on language
  getSimulatedRecognitionText() {
    const phrases = {
      zh: [
        '你好，今天天气真不错',
        '我想学习一门新的语言',
        '请问这附近有好的餐厅吗',
        '我需要预订一张机票',
        '我明天有一个重要的会议'
      ],
      en: [
        'Hello, the weather is nice today',
        'I want to learn a new language',
        'Are there any good restaurants nearby',
        'I need to book a flight ticket',
        'I have an important meeting tomorrow'
      ]
    };

    const langPhrases = phrases[this.data.languages[this.data.sourceLanguageIndex].code] || phrases.en;
    return langPhrases[Math.floor(Math.random() * langPhrases.length)];
  },

  detectLanguage(text) {
    if (!text) return;

    this.setData({
      isDetectingLanguage: true
    });

    // In a real app, you would call an API for language detection
    setTimeout(() => {
      let detectedCode;

      // Simple simulation of language detection
      const hasChineseChar = /[\u4e00-\u9fa5]/.test(text);
      const hasJapaneseChar = /[\u3040-\u30ff]/.test(text);
      const hasKoreanChar = /[\uac00-\ud7a3]/.test(text);

      if (hasChineseChar) {
        detectedCode = 'zh';
      } else if (hasJapaneseChar) {
        detectedCode = 'ja';
      } else if (hasKoreanChar) {
        detectedCode = 'ko';
      } else {
        // Default to English for Latin script
        detectedCode = 'en';
      }

      const langIndex = this.data.languages.findIndex(lang => lang.code === detectedCode);

      if (langIndex >= 0 && langIndex !== this.data.sourceLanguageIndex) {
        this.setData({
          detectedLanguage: this.data.languages[langIndex].name,
          isDetectingLanguage: false
        });
      } else {
        this.setData({
          detectedLanguage: null,
          isDetectingLanguage: false
        });
      }
    }, 1000);
  },

  useDetectedLanguage() {
    const detectedCode = this.data.languages.find(lang =>
      lang.name === this.data.detectedLanguage
    )?.code;

    if (detectedCode) {
      const langIndex = this.data.languages.findIndex(lang => lang.code === detectedCode);

      // If target language is the same as the detected language, swap them
      if (langIndex === this.data.targetLanguageIndex) {
        this.setData({
          sourceLanguageIndex: langIndex,
          targetLanguageIndex: this.data.sourceLanguageIndex,
          detectedLanguage: null
        });
      } else {
        this.setData({
          sourceLanguageIndex: langIndex,
          detectedLanguage: null
        });
      }
    }
  },

  async translateText() {
    if (!this.data.sourceText) {
      wx.showToast({
        title: '请输入要翻译的文本',
        icon: 'none'
      });
      return;
    }

    this.setData({
      isTranslating: true,
      showAlternatives: false
    });

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
        const style = this.data.selectedStyle;
        const context = this.data.selectedContext;

        // Generate translation and confidence score
        const {
          translatedText,
          confidenceScore,
          alternatives
        } = this.generateTranslation(sourceText, sourceLanguage, targetLanguage, style, context);

        this.setData({
          translatedText,
          confidenceScore,
          alternativeTranslations: alternatives,
          translationTime: Date.now()
        });

        resolve();
      }, 1500); // 模拟1.5秒的翻译处理时间
    });
  },

  generateTranslation(text, srcLang, tgtLang, style, context) {
    // This is a simulation function - in a real app, this would call an AI translation API
    let translatedText = '';
    let confidenceScore = 0;
    let alternatives = [];

    // Base translations for common phrases
    const translations = {
      'zh-en': {
        '你好，很高兴认识你': 'Hello, nice to meet you',
        '请问这个怎么用？': 'How do I use this?',
        '请帮我翻译这段话': 'Please help me translate this paragraph',
        '谢谢你的帮助': 'Thank you for your help',
        '这个地方在哪里？': 'Where is this place?',
        '我需要订一个房间': 'I need to book a room',
        '你好，今天天气真不错': 'Hello, the weather is really nice today',
        '我想学习一门新的语言': 'I want to learn a new language',
        '请问这附近有好的餐厅吗': 'Are there any good restaurants nearby?',
        '我需要预订一张机票': 'I need to book a flight ticket',
        '我明天有一个重要的会议': 'I have an important meeting tomorrow'
      },
      'en-zh': {
        'Hello, nice to meet you': '你好，很高兴认识你',
        'How do I use this?': '请问这个怎么用？',
        'Please help me translate this paragraph': '请帮我翻译这段话',
        'Thank you for your help': '谢谢你的帮助',
        'Where is this place?': '这个地方在哪里？',
        'I need to book a room': '我需要订一个房间',
        'Hello, the weather is really nice today': '你好，今天天气真不错',
        'I want to learn a new language': '我想学习一门新的语言',
        'Are there any good restaurants nearby?': '请问这附近有好的餐厅吗？',
        'I need to book a flight ticket': '我需要预订一张机票',
        'I have an important meeting tomorrow': '我明天有一个重要的会议'
      }
    };

    // Translation key
    const translationKey = `${srcLang}-${tgtLang}`;

    // Check if we have a direct translation
    if (translations[translationKey] && translations[translationKey][text]) {
      translatedText = translations[translationKey][text];
      confidenceScore = 0.95; // High confidence for known phrases
    } else {
      // For unknown phrases, generate a simulated translation
      if (translationKey === 'zh-en') {
        translatedText = `Translation of: "${text}"`;
      } else if (translationKey === 'en-zh') {
        translatedText = `翻译: "${text}"`;
      } else {
        translatedText = `[${tgtLang}] ${text}`;
      }
      confidenceScore = 0.7 + Math.random() * 0.2; // Random confidence between 0.7 and 0.9
    }

    // Apply style modifications
    switch (style) {
      case 'formal':
        if (tgtLang === 'en') {
          translatedText = translatedText.replace(/Hello/g, 'Greetings')
                                         .replace(/nice to/g, 'pleased to')
                                         .replace(/need to/g, 'would like to')
                                         .replace(/want to/g, 'would like to');
        } else if (tgtLang === 'zh') {
          translatedText = translatedText.replace(/你好/g, '您好')
                                         .replace(/谢谢/g, '非常感谢');
        }
        break;
      case 'casual':
        if (tgtLang === 'en') {
          translatedText = translatedText.replace(/Hello/g, 'Hey')
                                         .replace(/nice to meet you/g, 'good to see ya')
                                         .replace(/Thank you/g, 'Thanks');
        } else if (tgtLang === 'zh') {
          translatedText = translatedText.replace(/您好/g, '嗨')
                                         .replace(/非常感谢/g, '谢啦');
        }
        break;
      case 'professional':
        if (tgtLang === 'en') {
          translatedText = translatedText.replace(/Hello/g, 'Greetings')
                                         .replace(/nice to meet you/g, 'pleased to make your acquaintance')
                                         .replace(/Thank you/g, 'I appreciate your assistance');
        } else if (tgtLang === 'zh') {
          translatedText = translatedText.replace(/你好/g, '尊敬的您好')
                                         .replace(/谢谢/g, '诚挚感谢您');
        }
        break;
      case 'simplified':
        // Create a simpler version by removing some detailed parts
        translatedText = translatedText.split(',')[0]; // Just keep the first part
        break;
    }

    // Apply context modifications
    if (context !== 'general') {
      // Add context-specific terminology and phrasing
      const contextPrefixes = {
        'business': {
          'en': '[Business context] ',
          'zh': '[商务场合] '
        },
        'technical': {
          'en': '[Technical context] ',
          'zh': '[技术场合] '
        },
        'medical': {
          'en': '[Medical context] ',
          'zh': '[医疗场合] '
        },
        'legal': {
          'en': '[Legal context] ',
          'zh': '[法律场合] '
        },
        'travel': {
          'en': '[Travel context] ',
          'zh': '[旅游场合] '
        },
        'academic': {
          'en': '[Academic context] ',
          'zh': '[学术场合] '
        }
      };

      const prefix = contextPrefixes[context][tgtLang] || '';
      translatedText = prefix + translatedText;
    }

    // Generate alternative translations
    alternatives = this.generateAlternativeTranslations(translatedText, tgtLang, 3);

    return { translatedText, confidenceScore, alternatives };
  },

  generateAlternativeTranslations(mainTranslation, targetLang, count) {
    const alternatives = [];

    // Generate variants by slightly modifying the main translation
    for (let i = 0; i < count; i++) {
      let altText = mainTranslation;

      // Replace certain words or add/remove punctuation
      if (targetLang === 'en') {
        switch (i) {
          case 0:
            altText = altText.replace(/Hello/g, 'Hi').replace(/nice/g, 'good');
            break;
          case 1:
            altText = altText.replace(/need to/g, 'have to').replace(/want to/g, 'wish to');
            break;
          case 2:
            altText = altText.replace(/Thank you/g, 'Thanks').replace(/Please/g, 'Kindly');
            break;
        }
      } else if (targetLang === 'zh') {
        switch (i) {
          case 0:
            altText = altText.replace(/你好/g, '您好').replace(/谢谢/g, '感谢');
            break;
          case 1:
            altText = altText.replace(/需要/g, '想要').replace(/请问/g, '请');
            break;
          case 2:
            altText = altText.replace(/这个/g, '那个').replace(/吗/g, '呢');
            break;
        }
      }

      // Only add if it's different from the main translation
      if (altText !== mainTranslation) {
        alternatives.push({
          text: altText,
          confidence: Math.round((0.5 + Math.random() * 0.3) * 100) / 100
        });
      }
    }

    return alternatives;
  },

  toggleAlternatives() {
    this.setData({
      showAlternatives: !this.data.showAlternatives
    });
  },

  useAlternativeTranslation(e) {
    const index = e.currentTarget.dataset.index;
    const altText = this.data.alternativeTranslations[index].text;

    this.setData({
      translatedText: altText,
      showAlternatives: false
    });
  },

  speakText(e) {
    const type = e.currentTarget.dataset.type;
    const text = type === 'source' ? this.data.sourceText : this.data.translatedText;
    const lang = type === 'source'
      ? this.data.languages[this.data.sourceLanguageIndex].code
      : this.data.languages[this.data.targetLanguageIndex].code;

    if (!text) return;

    this.setData({ isSpeaking: true });

    // In a real app, you would use the text-to-speech API
    // For this simulation, we just wait and show a toast
    setTimeout(() => {
      this.setData({ isSpeaking: false });

      wx.showToast({
        title: '朗读已完成',
        icon: 'none'
      });
    }, 2000);
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
      style: this.data.selectedStyle,
      context: this.data.selectedContext,
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
        selectedStyle: item.style || 'standard',
        selectedContext: item.context || 'general',
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