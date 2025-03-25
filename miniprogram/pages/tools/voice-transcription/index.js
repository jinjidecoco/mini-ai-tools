// voice-transcription/index.js
Page({
  data: {
    isRecording: false,
    isTranscribing: false,
    recordTime: '00:00',
    transcriptText: '',
    showSettings: false,
    showTips: true,
    language: 'zh',
    quality: 'standard',
    punctuation: true,
    history: []
  },

  onLoad: function() {
    // 加载历史记录
    this.loadHistory();
  },

  loadHistory: function() {
    const historyStr = wx.getStorageSync('transcriptHistory') || '[]';
    try {
      const history = JSON.parse(historyStr);
      this.setData({
        history: history
      });
    } catch (e) {
      console.error('解析历史记录失败', e);
    }
  },

  goBack: function() {
    wx.navigateBack();
  },

  toggleSettings: function() {
    this.setData({
      showSettings: !this.data.showSettings
    });
  },

  hideTips: function() {
    this.setData({
      showTips: false
    });
    wx.setStorageSync('transcriptTipsShown', true);
  },

  setLanguage: function(e) {
    const lang = e.currentTarget.dataset.lang;
    this.setData({
      language: lang
    });
  },

  setQuality: function(e) {
    const quality = e.currentTarget.dataset.quality;
    this.setData({
      quality: quality
    });
  },

  togglePunctuation: function() {
    this.setData({
      punctuation: !this.data.punctuation
    });
  },

  toggleRecording: function() {
    if (this.data.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  },

  startRecording: function() {
    const recorderManager = wx.getRecorderManager();

    recorderManager.onStart(() => {
      console.log('录音开始');
      this.setData({
        isRecording: true
      });

      // 开始计时
      this.startTimer();
    });

    recorderManager.onError((res) => {
      console.error('录音失败', res);
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      });
      this.setData({
        isRecording: false
      });
    });

    const options = {
      duration: 600000, // 最长10分钟
      sampleRate: this.data.quality === 'high' ? 44100 : 16000,
      numberOfChannels: this.data.quality === 'high' ? 2 : 1,
      encodeBitRate: this.data.quality === 'high' ? 192000 : 48000,
      format: 'mp3'
    };

    recorderManager.start(options);
  },

  stopRecording: function() {
    const recorderManager = wx.getRecorderManager();

    recorderManager.onStop((res) => {
      console.log('录音结束', res);
      this.setData({
        isRecording: false
      });

      // 停止计时
      this.stopTimer();

      // 开始转录
      this.transcribeAudio(res.tempFilePath);
    });

    recorderManager.stop();
  },

  startTimer: function() {
    let seconds = 0;
    this.timer = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const formattedTime =
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

      this.setData({
        recordTime: formattedTime
      });
    }, 1000);
  },

  stopTimer: function() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  chooseAudioFile: function() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['mp3', 'wav', 'm4a'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].path;
        const size = res.tempFiles[0].size;

        // 检查文件大小，限制为10MB
        if (size > 10 * 1024 * 1024) {
          wx.showToast({
            title: '文件大小超过10MB限制',
            icon: 'none'
          });
          return;
        }

        // 开始转录
        this.transcribeAudio(tempFilePath);
      }
    });
  },

  transcribeAudio: function(filePath) {
    this.setData({
      isTranscribing: true
    });

    // 模拟转录过程
    setTimeout(() => {
      // 实际应用中，这里应该调用语音识别API
      const mockTranscriptText = "这是一段示例转录文本。在实际应用中，这里应该显示从语音识别API返回的真实转录结果。语音识别可以将语音内容转换为文字，方便用户进行记录和分享。";

      this.setData({
        isTranscribing: false,
        transcriptText: mockTranscriptText
      });
    }, 3000);
  },

  copyText: function() {
    wx.setClipboardData({
      data: this.data.transcriptText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板'
        });
      }
    });
  },

  clearResult: function() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除当前转录结果吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            transcriptText: ''
          });
        }
      }
    });
  },

  saveTranscript: function() {
    // 生成唯一ID
    const id = Date.now().toString();
    const title = this.data.transcriptText.substring(0, 20) + (this.data.transcriptText.length > 20 ? '...' : '');
    const date = new Date().getTime();

    const newTranscript = {
      id: id,
      title: title,
      content: this.data.transcriptText,
      date: date,
      language: this.data.language
    };

    // 获取现有历史记录
    const historyStr = wx.getStorageSync('transcriptHistory') || '[]';
    let history = [];

    try {
      history = JSON.parse(historyStr);
    } catch (e) {
      console.error('解析历史记录失败', e);
    }

    // 添加新记录到开头
    history.unshift(newTranscript);

    // 限制历史记录数量为20条
    if (history.length > 20) {
      history = history.slice(0, 20);
    }

    // 保存到本地存储
    wx.setStorageSync('transcriptHistory', JSON.stringify(history));

    // 更新页面数据
    this.setData({
      history: history
    });

    wx.showToast({
      title: '保存成功'
    });
  },

  newTranscription: function() {
    this.setData({
      transcriptText: '',
      recordTime: '00:00'
    });
  },

  viewHistoryItem: function(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.history.find(h => h.id === id);

    if (item) {
      this.setData({
        transcriptText: item.content
      });
    }
  },

  deleteHistoryItem: function(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 过滤掉要删除的记录
          const newHistory = this.data.history.filter(item => item.id !== id);

          // 更新本地存储
          wx.setStorageSync('transcriptHistory', JSON.stringify(newHistory));

          // 更新页面数据
          this.setData({
            history: newHistory
          });

          wx.showToast({
            title: '删除成功'
          });
        }
      }
    });
  },

  clearHistory: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清空本地存储
          wx.setStorageSync('transcriptHistory', '[]');

          // 更新页面数据
          this.setData({
            history: []
          });

          wx.showToast({
            title: '已清空历史记录'
          });
        }
      }
    });
  }
});