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

    // User selections
    prompt: '',
    selectedMode: 'standard',
    selectedLanguage: 'zh',

    // Content
    transcriptionModes: [
      {
        id: 'standard',
        name: '标准转录',
        description: '精确转录语音内容',
        icon: '../../../assets/icons/mode-standard.svg'
      },
      {
        id: 'meeting',
        name: '会议转录',
        description: '识别多人对话并区分说话者',
        icon: '../../../assets/icons/mode-meeting.svg'
      },
      {
        id: 'subtitle',
        name: '字幕生成',
        description: '生成带时间戳的字幕文件',
        icon: '../../../assets/icons/mode-subtitle.svg'
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
    timer: null as NodeJS.Timeout | null,
  },

  onLoad() {
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
        errorMessage: `录音失败: ${res.errMsg}`
      });
    });

    this.setData({
      recorderManager
    });

    // Load history from storage
    this.loadHistory();
  },

  onUnload() {
    // Clear intervals if any
    if (this.timer) {
      clearInterval(this.timer);
    }

    // Stop recording if active
    if (this.data.isRecording) {
      this.recorderManager.stop();
    }
  },

  // Setup recorder event handlers
  setupRecorderEvents() {
    const recorderManager = this.recorderManager;

    // When recording starts
    recorderManager.onStart(() => {
      console.log('Recording started');

      // Start timer for recording duration
      this.timer = setInterval(() => {
        this.setData({
          recordingTime: this.data.recordingTime + 1
        });
      }, 1000);
    });

    // When recording stops
    recorderManager.onStop((res: any) => {
      console.log('Recording stopped', res);

      // Clear timer
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      // Get duration and file path
      const { tempFilePath, duration } = res;

      // Update UI
      this.setData({
        isRecording: false,
        tempFilePath: tempFilePath,
        audioDuration: Math.floor(duration / 1000),
        isTranscribing: true
      });

      // Start transcription
      this.transcribeAudio();
    });

    // Error handling
    recorderManager.onError((error: any) => {
      console.error('Recorder error:', error);

      this.setData({
        isRecording: false,
        showError: true,
        errorMessage: '录音出错，请重试。'
      });

      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    });
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
    const modeId = e.currentTarget.dataset.id;
    this.setData({
      selectedMode: modeId
    });
  },

  selectLanguage(e: any) {
    const language = e.currentTarget.dataset.language;
    this.setData({
      selectedLanguage: language
    });
  },

  startRecording() {
    // Reset error state
    this.setData({
      showError: false,
      errorMessage: '',
      recordingTime: 0
    });

    // Check permissions
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        // Start recording
        this.recorderManager.start({
          duration: 600000, // 10 minutes max
          sampleRate: 44100,
          numberOfChannels: 1,
          encodeBitRate: 192000,
          format: 'aac'
        });

        // Update UI
        this.setData({
          isRecording: true,
          showResults: false
        });
      },
      fail: () => {
        this.setData({
          showError: true,
          errorMessage: '请授予录音权限以使用此功能。'
        });
      }
    });
  },

  pauseRecording() {
    const { recorderManager } = this.data;
    recorderManager.pause();
  },

  resumeRecording() {
    const { recorderManager } = this.data;
    recorderManager.resume();
  },

  stopRecording() {
    if (this.data.isRecording) {
      this.recorderManager.stop();
    }
  },

  async transcribeAudio() {
    const { tempFilePath, selectedLanguage } = this.data;

    if (!tempFilePath) {
      this.setData({
        errorMessage: '请先录制音频'
      });
      return;
    }

    this.setData({
      isTranscribing: true,
      errorMessage: ''
    });

    try {
      // In a real app, you would upload the audio file to your server or API
      // and get the transcription result back
      await this.simulateApiCall();

      // Generate fake transcription text based on selected language
      const transcribedText = this.generateFakeTranscription(selectedLanguage);

      // Create transcription result
      const result: TranscriptionResult = {
        id: Date.now(),
        audioUrl: tempFilePath,
        text: transcribedText,
        duration: this.data.recordingTime,
        timestamp: Date.now(),
        language: this.data.languages.find(l => l.code === selectedLanguage)?.name || '中文'
      };

      // Update history and save to storage
      const updatedHistory = [result, ...this.data.transcriptionHistory];
      wx.setStorageSync('transcriptionHistory', updatedHistory);

      this.setData({
        transcribedText,
        transcriptionHistory: updatedHistory,
        isTranscribing: false
      });
    } catch (error) {
      this.setData({
        errorMessage: '转写失败，请重试',
        isTranscribing: false
      });
    }
  },

  simulateApiCall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000); // Simulate 2-second API call
    });
  },

  generateFakeTranscription(language: string): string {
    const zhText = '这是一个人工智能语音转文字的示例。我们的技术可以准确识别各种语言的语音并转换为文字。您可以使用这个功能来记录会议内容、创建备忘录或者快速捕捉想法。';
    const enText = 'This is an example of AI voice transcription. Our technology can accurately recognize speech in various languages and convert it to text. You can use this feature to record meeting content, create memos, or quickly capture ideas.';
    const jaText = 'これは AI 音声文字起こしの例です。当社の技術は、さまざまな言語の音声を正確に認識し、テキストに変換できます。この機能を使用して、会議の内容を記録したり、メモを作成したり、アイデアをすばやくキャプチャしたりできます。';
    const koText = '이것은 AI 음성 텍스트 변환의 예입니다. 우리의 기술은 다양한 언어의 음성을 정확하게 인식하고 텍스트로 변환할 수 있습니다. 이 기능을 사용하여 회의 내용을 기록하거나, 메모를 작성하거나, 아이디어를 빠르게 캡처할 수 있습니다.';

    switch (language) {
      case 'zh': return zhText;
      case 'en': return enText;
      case 'ja': return jaText;
      case 'ko': return koText;
      default: return zhText;
    }
  },

  // Format seconds to MM:SS
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  formatTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  },

  // Handle view history item
  viewHistoryItem(e: any) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.transcriptionHistory.find(h => h.id === id);

    if (item) {
      this.setData({
        currentAudioPath: item.audioUrl,
        audioDuration: item.duration,
        transcribedText: item.text,
        selectedMode: this.data.selectedMode,
        selectedLanguage: this.data.selectedLanguage,
        showResults: true
      });
    }
  },

  // Play audio
  playAudio() {
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = this.data.currentAudioPath;
    innerAudioContext.play();
  },

  // Copy transcribed text
  copyText() {
    wx.setClipboardData({
      data: this.data.transcribedText,
      success: () => {
        wx.showToast({
          title: '文本已复制',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  // Export as file
  exportAsFile() {
    // In a real app, this would save the text to a file
    // For this demo, we'll just show a toast
    wx.showToast({
      title: '文件已导出',
      icon: 'success',
      duration: 2000
    });
  },

  // Share text
  shareText() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // For sharing as a message
  onShareAppMessage() {
    return {
      title: 'AI语音转文字',
      path: '/pages/tools/voice-transcription/index',
      imageUrl: 'https://images.unsplash.com/photo-1590499065425-5d159b3f2c77?q=80&w=500&auto=format&fit=crop'
    };
  },

  clearAudio() {
    this.setData({
      tempFilePath: '',
      transcribedText: '',
      selectedResult: null,
      errorMessage: ''
    });
  },

  deleteTranscription(e: any) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除此记录吗？',
      success: (res) => {
        if (res.confirm) {
          const filteredHistory = this.data.transcriptionHistory.filter(item => item.id !== id);

          wx.setStorageSync('transcriptionHistory', filteredHistory);

          this.setData({
            transcriptionHistory: filteredHistory,
            selectedResult: this.data.selectedResult?.id === id ? null : this.data.selectedResult,
            transcribedText: this.data.selectedResult?.id === id ? '' : this.data.transcribedText
          });

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
  },
});