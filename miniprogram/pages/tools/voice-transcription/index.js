// voice-transcription/index.js
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    recordingDuration: 0,
    currentAudioUrl: '',
    isTranscribing: false,
    transcriptionResult: '',
    selectedMode: 'standard',
    selectedLanguage: 'zh',
    transcriptionModes: [
      {
        id: 'standard',
        name: '标准模式',
        description: '适合一般对话场景',
        icon: '../../../assets/icons/standard.svg'
      },
      {
        id: 'meeting',
        name: '会议模式',
        description: '适合多人会议场景',
        icon: '../../../assets/icons/meeting.svg'
      },
      {
        id: 'interview',
        name: '采访模式',
        description: '适合一对一采访场景',
        icon: '../../../assets/icons/interview.svg'
      }
    ],
    languages: [
      { id: 'zh', name: '中文' },
      { id: 'en', name: '英文' },
      { id: 'ja', name: '日文' },
      { id: 'ko', name: '韩文' }
    ],
    transcriptionHistory: [],
    selectedItem: null,
    timer: null
  },

  onLoad() {
    // 初始化录音管理器
    this.initRecorderManager();
    // 加载历史记录
    this.loadHistory();
  },

  onUnload() {
    // 清理定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    // 停止录音
    if (this.data.isRecording) {
      this.stopRecording();
    }
  },

  initRecorderManager() {
    recorderManager.onStart(() => {
      console.log('录音开始');
      this.setData({ isRecording: true });
      this.startTimer();
    });

    recorderManager.onPause(() => {
      console.log('录音暂停');
      this.setData({ isPaused: true });
      this.pauseTimer();
    });

    recorderManager.onResume(() => {
      console.log('录音继续');
      this.setData({ isPaused: false });
      this.startTimer();
    });

    recorderManager.onStop((res) => {
      console.log('录音结束', res);
      this.setData({
        isRecording: false,
        isPaused: false,
        currentAudioUrl: res.tempFilePath,
        recordingDuration: this.data.recordingTime
      });
      this.stopTimer();
    });

    recorderManager.onError((res) => {
      console.error('录音错误', res);
      wx.showToast({
        title: '录音出错，请重试',
        icon: 'none'
      });
    });
  },

  startRecording() {
    const options = {
      duration: 600000, // 最长录音时间，单位ms
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    };
    recorderManager.start(options);
  },

  pauseRecording() {
    recorderManager.pause();
  },

  resumeRecording() {
    recorderManager.resume();
  },

  stopRecording() {
    recorderManager.stop();
  },

  startTimer() {
    const timer = setInterval(() => {
      this.setData({
        recordingTime: this.data.recordingTime + 1
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

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  selectMode(e) {
    const modeId = e.currentTarget.dataset.id;
    this.setData({ selectedMode: modeId });
  },

  selectLanguage(e) {
    const languageId = e.currentTarget.dataset.id;
    this.setData({ selectedLanguage: languageId });
  },

  async transcribeAudio() {
    if (!this.data.currentAudioUrl) {
      wx.showToast({
        title: '请先录制音频',
        icon: 'none'
      });
      return;
    }

    this.setData({ isTranscribing: true });

    try {
      // 上传音频文件
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath: `audio/${Date.now()}.mp3`,
        filePath: this.data.currentAudioUrl
      });

      // 调用云函数进行转写
      const { result } = await wx.cloud.callFunction({
        name: 'transcribeAudio',
        data: {
          fileID: uploadRes.fileID,
          language: this.data.selectedLanguage,
          mode: this.data.selectedMode
        }
      });

      if (result.success) {
        this.setData({
          transcriptionResult: result.text,
          isTranscribing: false
        });

        // 保存到历史记录
        this.saveToHistory(result.text);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('转写失败:', error);
      wx.showToast({
        title: '转写失败，请重试',
        icon: 'none'
      });
      this.setData({ isTranscribing: false });
    }
  },

  saveToHistory(text) {
    const history = this.data.transcriptionHistory;
    const newItem = {
      id: Date.now(),
      text,
      language: this.data.languages.find(l => l.id === this.data.selectedLanguage).name,
      timestamp: Date.now()
    };

    history.unshift(newItem);
    if (history.length > 10) {
      history.pop();
    }

    this.setData({ transcriptionHistory: history });
    this.saveHistoryToStorage(history);
  },

  saveHistoryToStorage(history) {
    wx.setStorageSync('transcriptionHistory', history);
  },

  loadHistory() {
    const history = wx.getStorageSync('transcriptionHistory') || [];
    this.setData({ transcriptionHistory: history });
  },

  viewHistoryItem(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.transcriptionHistory.find(h => h.id === id);
    if (item) {
      this.setData({
        selectedItem: item,
        transcriptionResult: item.text,
        selectedLanguage: this.data.languages.find(l => l.name === item.language).id
      });
    }
  },

  copyText() {
    if (!this.data.transcriptionResult) return;

    wx.setClipboardData({
      data: this.data.transcriptionResult,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  exportAsFile() {
    if (!this.data.transcriptionResult) return;

    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/transcription_${Date.now()}.txt`;

    fs.writeFile({
      filePath,
      data: this.data.transcriptionResult,
      encoding: 'utf8',
      success: () => {
        wx.shareFileMessage({
          filePath,
          success: () => {
            wx.showToast({
              title: '导出成功',
              icon: 'success'
            });
          }
        });
      }
    });
  },

  shareText() {
    if (!this.data.transcriptionResult) return;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  goBack() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: 'AI语音转文字',
      path: '/pages/tools/voice-transcription/index',
      imageUrl: '../../../assets/images/share-cover.png'
    };
  },

  onShareTimeline() {
    return {
      title: 'AI语音转文字',
      query: '',
      imageUrl: '../../../assets/images/share-cover.png'
    };
  }
});