// index.ts for voice transcription tool

// Define interfaces
interface TranscriptionMode {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
}

interface TranscriptionResult {
  id: number;
  audioUrl: string;
  text: string;
  duration: number;
  timestamp: number;
  language: string;
}

// Page implementation
Page({
  data: {
    // UI state
    isRecording: false,
    isPaused: false,
    isTranscribing: false,
    recordingTime: 0,
    tempFilePath: '',
    showError: false,
    errorMessage: '',
    showResults: false,
    showHistory: true,
    showSettings: false,
    showTips: true,

    // User selections
    prompt: '',
    selectedMode: 'standard',
    selectedLanguage: 'zh',
    enablePunctuation: true,
    selectedQuality: 'standard',

    // Content
    transcriptionModes: [
      {
        id: 'standard',
        name: '标准转录',
        description: '精确转录语音内容',
        icon: '../../../assets/icons/voice.svg'
      },
      {
        id: 'meeting',
        name: '会议转录',
        description: '识别多人对话并区分说话者',
        icon: '../../../assets/icons/transcript.svg'
      },
      {
        id: 'subtitle',
        name: '字幕生成',
        description: '生成带时间戳的字幕文件',
        icon: '../../../assets/icons/audio-wave.svg'
      }
    ],

    languages: [
      { code: 'zh', name: '中文' },
      { code: 'en', name: '英文' },
      { code: 'ja', name: '日文' },
      { code: 'ko', name: '韩文' }
    ],

    // Results
    currentAudioPath: '',
    audioDuration: 0,
    transcribedText: '',

    // History
    transcriptionHistory: [] as TranscriptionResult[],
    formattedTime: '00:00',
    selectedResult: null as TranscriptionResult | null,

    // Recorder instance
    recorderManager: null as WechatMiniprogram.RecorderManager | null,
    timer: null as number | null,
  },

  onLoad() {
    // 检查登录状态
    const app = getApp<IAppOption>();
    const isLoggedIn = app.checkAndNavigateToLogin('/pages/tools/voice-transcription/index');

    if (isLoggedIn) {
      // 用户已登录，继续加载页面
      this.initRecorderManager();
      this.loadHistory();
    }
  },

  onUnload() {
    // Clear intervals if any
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    // Stop recording if active
    if (this.data.isRecording && this.data.recorderManager) {
      this.data.recorderManager.stop();
    }
  },

  // Timer functions
  startTimer() {
    // Clear any existing timers
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    // Start a new timer
    const timer = setInterval(() => {
      const newTime = this.data.recordingTime + 1;
      this.setData({
        recordingTime: newTime,
        formattedTime: this.formatTime(newTime)
      });
    }, 1000);

    this.setData({ timer });
  },

  pauseTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  // Load transcription history from storage
  loadHistory() {
    try {
      const history = wx.getStorageSync('transcriptionHistory');
      if (history) {
        this.setData({
          transcriptionHistory: JSON.parse(history)
        });
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  },

  // Save transcription history to storage
  saveHistory() {
    try {
      wx.setStorageSync(
        'transcriptionHistory',
        JSON.stringify(this.data.transcriptionHistory)
      );
    } catch (e) {
      console.error('Failed to save history', e);
    }
  },

  // Navigation
  goBack() {
    wx.navigateBack();
  },

  // User interactions
  onPromptInput(e: any) {
    this.setData({
      prompt: e.detail.value
    });
  },

  selectMode(e: any) {
    this.setData({
      selectedMode: e.currentTarget.dataset.mode
    });
  },

  selectLanguage(e: any) {
    this.setData({
      selectedLanguage: e.currentTarget.dataset.lang
    });
  },

  setQuality(e: any) {
    this.setData({
      selectedQuality: e.currentTarget.dataset.quality
    });
  },

  togglePunctuation() {
    this.setData({
      enablePunctuation: !this.data.enablePunctuation
    });
  },

  // Settings panel
  toggleSettings() {
    this.setData({
      showSettings: !this.data.showSettings
    });
  },

  // Tips panel
  hideTips() {
    this.setData({
      showTips: false
    });
  },

  startRecording() {
    if (!this.data.recorderManager) {
      this.setData({
        showError: true,
        errorMessage: '录音功能初始化失败，请重启小程序'
      });
      return;
    }

    this.setData({
      isRecording: true,
      recordingTime: 0,
      formattedTime: '00:00',
      showError: false,
      errorMessage: '',
      showResults: false,
      transcribedText: ''
    });

    const options: WechatMiniprogram.RecorderManagerStartOption = {
      duration: 600000, // 10 minutes
      sampleRate: this.data.selectedQuality === 'high' ? 48000 : 16000,
      numberOfChannels: this.data.selectedQuality === 'high' ? 2 : 1,
      encodeBitRate: this.data.selectedQuality === 'high' ? 192000 : 48000,
      format: 'mp3',
      frameSize: 50
    };

    this.data.recorderManager.start(options);
  },

  pauseRecording() {
    if (this.data.recorderManager && this.data.isRecording && !this.data.isPaused) {
      this.data.recorderManager.pause();
    }
  },

  resumeRecording() {
    if (this.data.recorderManager && this.data.isRecording && this.data.isPaused) {
      this.data.recorderManager.resume();
    }
  },

  stopRecording() {
    if (this.data.recorderManager && this.data.isRecording) {
      this.data.recorderManager.stop();
      this.setData({ isTranscribing: true });
    }
  },

  toggleRecord() {
    if (this.data.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  },

  uploadAudio() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['mp3', 'wav', 'm4a'],
      success: (res) => {
        this.setData({
          tempFilePath: res.tempFiles[0].path,
          isTranscribing: true,
          showResults: false,
          transcribedText: ''
        });
        this.transcribeAudio();
      }
    });
  },

  async transcribeAudio() {
    if (!this.data.tempFilePath) {
      this.setData({
        showError: true,
        errorMessage: '没有可用的音频文件',
        isTranscribing: false
      });
      return;
    }

    this.setData({
      isTranscribing: true,
      showError: false
    });

    try {
      // In a real app, upload the file to server and get transcription
      // For demo, we'll simulate the API call
      await this.simulateApiCall();

      // Generate the transcription result
      const transcribedText = this.generateFakeTranscription(this.data.selectedLanguage);

      // Format and save the result
      const newResult: TranscriptionResult = {
        id: Date.now(),
        audioUrl: this.data.tempFilePath,
        text: transcribedText,
        duration: this.data.recordingTime || 30, // Default 30 seconds for uploaded files
        timestamp: Date.now(),
        language: this.data.selectedLanguage
      };

      // Update UI
      this.setData({
        isTranscribing: false,
        showResults: true,
        transcribedText,
        currentAudioPath: this.data.tempFilePath,
        audioDuration: this.data.recordingTime || 30,
        transcriptionHistory: [newResult, ...this.data.transcriptionHistory].slice(0, 50), // Keep max 50 items
        recordingTime: 0
      });

      // Save results
      this.saveHistory();
    } catch (error) {
      console.error('Transcription error:', error);
      this.setData({
        isTranscribing: false,
        showError: true,
        errorMessage: '转录失败，请重试'
      });
    }
  },

  simulateApiCall(): Promise<void> {
    // Simulate network delay
    return new Promise(resolve => setTimeout(resolve, 2000));
  },

  generateFakeTranscription(language: string): string {
    // Sample transcriptions based on language
    if (language === 'en') {
      return "This is a sample transcription in English. Voice-to-text technology can convert spoken language into written text. It has many applications including note-taking, accessibility features, and automated transcription services.";
    } else if (language === 'ja') {
      return "これは日本語のサンプル文字起こしです。音声テキスト変換技術は、話し言葉を書き言葉に変換できます。メモ取り、アクセシビリティ機能、自動文字起こしサービスなど、多くの用途があります。";
    } else if (language === 'ko') {
      return "이것은 한국어 샘플 필사입니다. 음성-텍스트 기술은 말로 된 언어를 텍스트로 변환할 수 있습니다. 메모, 접근성 기능, 자동 필사 서비스 등 많은 응용 분야가 있습니다.";
    } else {
      // Default to Chinese
      return "这是中文的示例转录。语音转文字技术可以将口语转换为书面文本。它有许多应用，包括笔记记录、无障碍功能和自动转录服务。通过使用先进的人工智能和机器学习算法，现代语音识别系统可以处理各种口音和语音模式。";
    }
  },

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  },

  viewHistoryItem(e: any) {
    const id = parseInt(e.currentTarget.dataset.id);
    const result = this.data.transcriptionHistory.find(item => item.id === id);

    if (result) {
      this.setData({
        selectedResult: result,
        showResults: true,
        transcribedText: result.text,
        currentAudioPath: result.audioUrl,
        audioDuration: result.duration
      });
    }
  },

  playAudio() {
    if (this.data.currentAudioPath) {
      const innerAudioContext = wx.createInnerAudioContext();
      innerAudioContext.src = this.data.currentAudioPath;
      innerAudioContext.play();
    }
  },

  copyText() {
    if (!this.data.transcribedText) {
      wx.showToast({
        title: '没有可复制的文本',
        icon: 'none'
      });
      return;
    }

    wx.setClipboardData({
      data: this.data.transcribedText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  exportAsFile() {
    if (!this.data.transcribedText) {
      wx.showToast({
        title: '没有可导出的文本',
        icon: 'none'
      });
      return;
    }

    wx.showToast({
      title: '导出功能暂未开放',
      icon: 'none'
    });
  },

  shareText() {
    // In a real app, this would open the share interface
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage() {
    return {
      title: '语音转文字 - 高效便捷的语音识别工具',
      path: '/pages/tools/voice-transcription/index'
    };
  },

  clearAudio() {
    this.setData({
      tempFilePath: '',
      showResults: false,
      transcribedText: '',
      currentAudioPath: '',
      audioDuration: 0,
      selectedResult: null
    });
  },

  deleteTranscription(e: any) {
    const id = parseInt(e.currentTarget.dataset.id);

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const newHistory = this.data.transcriptionHistory.filter(item => item.id !== id);
          this.setData({
            transcriptionHistory: newHistory
          });

          if (this.data.selectedResult && this.data.selectedResult.id === id) {
            this.setData({
              selectedResult: null,
              showResults: false,
              transcribedText: '',
              currentAudioPath: '',
              audioDuration: 0
            });
          }

          this.saveHistory();

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 清空历史记录
  clearHistory() {
    wx.showModal({
      title: '确认删除',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            transcriptionHistory: [],
            selectedResult: null,
            showResults: false,
            transcribedText: '',
            currentAudioPath: '',
            audioDuration: 0
          });

          try {
            wx.removeStorageSync('transcriptionHistory');
            wx.showToast({
              title: '历史已清空',
              icon: 'success'
            });
          } catch (e) {
            console.error('Failed to clear history:', e);
          }
        }
      }
    });
  },

  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}秒`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}分${remainingSeconds > 0 ? remainingSeconds + '秒' : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}小时${minutes > 0 ? minutes + '分' : ''}`;
    }
  },

  initRecorderManager() {
    // Initialize recorder
    const recorderManager = wx.getRecorderManager();

    recorderManager.onStart(() => {
      this.setData({
        isRecording: true,
        isPaused: false,
        errorMessage: ''
      });
      this.startTimer();
    });

    recorderManager.onPause(() => {
      this.setData({
        isPaused: true
      });
      this.pauseTimer();
    });

    recorderManager.onResume(() => {
      this.setData({
        isPaused: false
      });
      this.startTimer();
    });

    recorderManager.onStop((res) => {
      this.stopTimer();
      this.setData({
        isRecording: false,
        isPaused: false,
        tempFilePath: res.tempFilePath
      });
    });

    recorderManager.onError((res) => {
      this.stopTimer();
      this.setData({
        isRecording: false,
        isPaused: false,
        showError: true,
        errorMessage: `录音失败: ${res.errMsg}`
      });
    });

    this.setData({
      recorderManager
    });
  }
});