// homework-checker/index.ts
// 获取应用实例
const app = getApp<IAppOption>()

interface HomeworkCheck {
  id: number;
  content: string;
  subject: string;
  timestamp: number;
  result?: HomeworkResult;
}

interface HomeworkResult {
  score: number;
  feedback: string;
  corrections: Correction[];
  summary: string;
}

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

Page({
  data: {
    isChecking: false,
    homeworkContent: '',
    subject: 'math', // math, chinese, english, physics, chemistry, biology
    homeworkCheck: null as HomeworkCheck | null,
    homeworkHistory: [] as HomeworkCheck[],
    errorMessage: '',
    showTips: true,
    detailedFeedback: true
  },

  onLoad() {
    // 加载历史记录
    const history = wx.getStorageSync('homeworkCheckerHistory') || [];
    this.setData({
      homeworkHistory: history
    });
  },

  goBack() {
    wx.navigateBack();
  },

  onContentInput(e: any) {
    this.setData({
      homeworkContent: e.detail.value,
      errorMessage: ''
    });
  },

  selectSubject(e: any) {
    const subject = e.currentTarget.dataset.subject;
    this.setData({
      subject
    });
  },

  toggleTips() {
    this.setData({
      showTips: !this.data.showTips
    });
  },

  toggleDetailedFeedback() {
    this.setData({
      detailedFeedback: !this.data.detailedFeedback
    });
  },

  chooseFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['doc', 'docx', 'pdf', 'txt'],
      success: (res) => {
        // 在实际应用中，这里应该解析文件内容
        // 这里我们简单展示文件名
        this.setData({
          homeworkContent: `从文件导入: ${res.tempFiles[0].name}`,
          errorMessage: ''
        });
      },
      fail: () => {
        this.setData({
          errorMessage: '选择文件失败，请重试'
        });
      }
    });
  },

  scanHomework() {
    wx.scanCode({
      scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
      success: () => {
        // 在实际应用中，这里应该解析扫描结果
        // 这里我们简单模拟扫描结果
        this.setData({
          homeworkContent: '通过扫描导入的作业内容示例',
          errorMessage: ''
        });
      },
      fail: () => {
        this.setData({
          errorMessage: '扫描失败，请重试'
        });
      }
    });
  },

  checkHomework() {
    if (!this.data.homeworkContent.trim()) {
      this.setData({
        errorMessage: '请输入作业内容'
      });
      return;
    }

    this.setData({
      isChecking: true,
      errorMessage: ''
    });

    // 模拟处理延迟
    setTimeout(() => {
      // 创建新的作业检查记录
      const newCheck: HomeworkCheck = {
        id: Date.now(),
        content: this.data.homeworkContent,
        subject: this.data.subject,
        timestamp: Date.now(),
        result: this.generateHomeworkResult(this.data.subject)
      };

      // 更新历史记录
      const updatedHistory = [newCheck, ...this.data.homeworkHistory].slice(0, 10);
      wx.setStorageSync('homeworkCheckerHistory', updatedHistory);

      this.setData({
        homeworkCheck: newCheck,
        homeworkHistory: updatedHistory,
        isChecking: false
      });
    }, 2000);
  },

  viewHistoryCheck(e: any) {
    const checkId = e.currentTarget.dataset.id;
    const selectedCheck = this.data.homeworkHistory.find(check => check.id === checkId);
    if (selectedCheck) {
      this.setData({
        homeworkCheck: selectedCheck,
        homeworkContent: selectedCheck.content,
        subject: selectedCheck.subject
      });
    }
  },

  copyFeedback() {
    if (this.data.homeworkCheck?.result) {
      const feedback = this.data.homeworkCheck.result.feedback;
      wx.setClipboardData({
        data: feedback,
        success: () => {
          wx.showToast({
            title: '已复制反馈',
            icon: 'success'
          });
        }
      });
    }
  },

  clearContent() {
    this.setData({
      homeworkContent: '',
      homeworkCheck: null,
      errorMessage: ''
    });
  },

  // 生成作业检查结果（模拟）
  generateHomeworkResult(subject: string): HomeworkResult {
    // 根据不同学科生成不同的反馈
    let corrections: Correction[] = [];
    let summary = '';
    let score = 0;
    let feedback = '';

    switch (subject) {
      case 'math':
        corrections = [
          {
            original: '2x + 3 = 7, x = 2',
            corrected: '2x + 3 = 7, x = 2',
            explanation: '解法正确，但请注意解释每一步。'
          },
          {
            original: '3^2 + 4^2 = 5^2',
            corrected: '3^2 + 4^2 = 9 + 16 = 25 = 5^2',
            explanation: '答案正确，但需要列出计算步骤。'
          }
        ];
        summary = '数学作业整体完成得不错，但需要更详细地展示解题步骤。';
        score = 85;
        feedback = '作业完成得很好，准确率较高。建议在解答题时展示完整的步骤。特别是在处理方程和几何证明时，请清晰标注每个步骤。';
        break;

      case 'chinese':
        corrections = [
          {
            original: '他不但学习好，而且还很有礼貌。',
            corrected: '他不但学习好，而且很有礼貌。',
            explanation: '不当重复副词"还"，"不但...而且..."结构中不需要再加"还"。'
          },
          {
            original: '这本书的内容很生动，引人入胜。',
            corrected: '这本书的内容很生动，引人入胜。',
            explanation: '用词恰当，表达流畅。'
          }
        ];
        summary = '语文作业整体表达流畅，有少量语法错误需要注意。';
        score = 88;
        feedback = '作文结构清晰，语言表达丰富。建议注意某些成语的使用场景，并避免复杂句式中的冗余词语。阅读理解部分回答详尽，但可以更加精准地针对问题给出答案。';
        break;

      case 'english':
        corrections = [
          {
            original: 'I have went to the park yesterday.',
            corrected: 'I went to the park yesterday.',
            explanation: '时态错误。"yesterday"表示过去时间，应使用一般过去时态"went"而不是现在完成时态"have gone"。'
          },
          {
            original: 'She is more prettier than her sister.',
            corrected: 'She is prettier than her sister.',
            explanation: '比较级形式错误。应使用"prettier"而不是"more prettier"，避免双重比较。'
          }
        ];
        summary = '英语作业有一些语法错误，特别是时态和比较级的使用。';
        score = 78;
        feedback = '词汇运用多样，但有几处语法错误需要注意。重点关注时态一致性、冠词使用和比较级形式。阅读理解回答内容相关，但部分题目需要更精确的答案。建议复习不规则动词变化和基本语法规则。';
        break;

      default:
        corrections = [
          {
            original: '示例错误内容',
            corrected: '示例修正内容',
            explanation: '这是一个示例修正说明。'
          }
        ];
        summary = '作业整体完成情况良好，有少量需要改进的地方。';
        score = 80;
        feedback = '这是一个通用的作业反馈示例。在实际应用中，会根据具体学科和作业内容给出更详细的反馈。';
    }

    return {
      score,
      feedback,
      corrections,
      summary
    };
  }
});
