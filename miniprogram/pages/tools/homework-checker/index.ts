// homework-checker/index.ts
// 获取应用实例
// const app = getApp<IAppOption>() - 注释掉避免重复声明

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

// 作业检查工具逻辑

// 定义历史记录项接口
interface HistoryItem {
  id: number;
  type: string;
  date: string;
  score: number;
  imagePath: string;
  result: CheckResult;
}

// 定义检查问题接口
interface QuestionItem {
  id: number;
  number: string;
  content: string;
  userAnswer: string;
  correctAnswer: string;
  status: 'correct' | 'incorrect' | 'partial';
  explanation?: string;
  suggestion?: string;
  expanded: boolean;
}

// 定义检查内容设置
interface CheckContentSettings {
  correctness: boolean;
  steps: boolean;
  suggestions: boolean;
  [key: string]: boolean; // 索引签名，允许使用字符串索引
}

// 定义检查结果接口
interface CheckResult {
  score: number;
  correctCount: number;
  incorrectCount: number;
  partialCount: number;
  questions: QuestionItem[];
  overallFeedback: string;
}

// 作业类型映射
const typeNames: Record<string, string> = {
  'math': '数学',
  'chinese': '语文',
  'english': '英语',
  'physics': '物理',
  'chemistry': '化学'
};

// 从类型名称到键值的映射
const typeMap: Record<string, string> = {
  '数学': 'math',
  '语文': 'chinese',
  '英语': 'english',
  '物理': 'physics',
  '化学': 'chemistry'
};

Page({
  data: {
    // UI状态
    imagePath: '',
    isProcessing: false,
    processingStep: 0,
    showResults: false,
    showSettings: false,
    showTips: true,
    showHistory: true,

    // 用户选择
    selectedType: 'math',
    checkLevel: 'standard',
    checkContent: {
      correctness: true,
      steps: true,
      suggestions: true
    } as CheckContentSettings,

    // 检查结果
    checkResult: {
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      partialCount: 0,
      questions: [] as QuestionItem[],
      overallFeedback: ''
    } as CheckResult,

    // 历史记录
    checkHistory: [] as HistoryItem[]
  },

  onLoad() {
    // 加载历史记录
    this.loadHistory();
  },

  // 加载历史记录
  loadHistory() {
    try {
      const historyData = wx.getStorageSync('homework_checker_history');
      if (historyData) {
        this.setData({
          checkHistory: JSON.parse(historyData)
        });
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  },

  // 保存历史记录
  saveHistory() {
    try {
      wx.setStorageSync(
        'homework_checker_history',
        JSON.stringify(this.data.checkHistory)
      );
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  },

  // 导航返回
  goBack() {
    wx.navigateBack();
  },

  // 切换设置面板
  toggleSettings() {
    this.setData({
      showSettings: !this.data.showSettings
    });
  },

  // 隐藏提示
  hideTips() {
    this.setData({
      showTips: false
    });
  },

  // 选择作业类型
  selectType(e: any) {
    this.setData({
      selectedType: e.currentTarget.dataset.type
    });
  },

  // 选择检查等级
  selectLevel(e: any) {
    this.setData({
      checkLevel: e.currentTarget.dataset.level
    });
  },

  // 切换检查内容选项
  toggleCheckContent(e: any) {
    const content = e.currentTarget.dataset.content;
    const checkContent = { ...this.data.checkContent } as CheckContentSettings;
    checkContent[content] = !checkContent[content];

    this.setData({
      checkContent
    });
  },

  // 选择或拍摄作业图片
  chooseImage() {
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: (res) => {
        const sourceType: ('camera' | 'album')[] = res.tapIndex === 0 ? ['camera'] : ['album'];

        wx.chooseImage({
          count: 1,
          sourceType,
          success: (res) => {
            this.setData({
              imagePath: res.tempFilePaths[0]
            });
          }
        });
      }
    });
  },

  // 开始处理
  startProcessing() {
    if (!this.data.imagePath) {
      wx.showToast({
        title: '请先上传作业图片',
        icon: 'none'
      });
      return;
    }

    this.setData({
      isProcessing: true,
      processingStep: 0,
      showResults: false
    });

    // 模拟处理步骤
    this.simulateProcessing();
  },

  // 模拟处理过程（实际项目中应替换为真实API调用）
  simulateProcessing() {
    const totalSteps = 4;
    let currentStep = 0;

    // 模拟进度更新
    const progressInterval = setInterval(() => {
      currentStep++;
      this.setData({
        processingStep: currentStep
      });

      // 处理完成后显示结果
      if (currentStep >= totalSteps) {
        clearInterval(progressInterval);

        // 生成模拟结果
        this.generateMockResult();
      }
    }, 1000);
  },

  // 生成模拟检查结果
  generateMockResult() {
    // 根据作业类型生成不同的模拟问题
    const questions: QuestionItem[] = [];
    let correctCount = 0;
    let incorrectCount = 0;
    let partialCount = 0;

    // 数学作业示例问题
    if (this.data.selectedType === 'math') {
      // 添加10道数学题
      for (let i = 1; i <= 10; i++) {
        const status = this.getRandomStatus();
        questions.push({
          id: i,
          number: i.toString(),
          content: this.getMathQuestion(i),
          userAnswer: this.getMathUserAnswer(i, status),
          correctAnswer: this.getMathCorrectAnswer(i),
          status,
          explanation: status !== 'correct' ? this.getMathExplanation(i) : '',
          suggestion: status === 'incorrect' ? this.getMathSuggestion(i) : '',
          expanded: false
        });

        // 统计正确/错误/部分正确数量
        if (status === 'correct') correctCount++;
        else if (status === 'incorrect') incorrectCount++;
        else partialCount++;
      }
    }
    // 其他学科
    else {
      // 添加5道题目
      for (let i = 1; i <= 5; i++) {
        const status = this.getRandomStatus();
        questions.push({
          id: i,
          number: i.toString(),
          content: `${this.data.selectedType}作业题目${i}`,
          userAnswer: `学生的${this.data.selectedType}答案${i}`,
          correctAnswer: `标准${this.data.selectedType}答案${i}`,
          status,
          explanation: status !== 'correct' ? `这道题的解析说明...` : '',
          suggestion: status === 'incorrect' ? `改进建议：注意...` : '',
          expanded: false
        });

        // 统计正确/错误/部分正确数量
        if (status === 'correct') correctCount++;
        else if (status === 'incorrect') incorrectCount++;
        else partialCount++;
      }
    }

    // 计算得分（满分100分）
    const score = Math.round(
      (correctCount * 10 + partialCount * 5) /
      Math.max(1, questions.length) * 10
    );

    // 设置检查结果
    const checkResult: CheckResult = {
      score,
      correctCount,
      incorrectCount,
      partialCount,
      questions,
      overallFeedback: this.generateOverallFeedback(score, this.data.selectedType)
    };

    setTimeout(() => {
      this.setData({
        isProcessing: false,
        showResults: true,
        checkResult
      });

      // 添加到历史记录
      this.addToHistory(checkResult);
    }, 500);
  },

  // 获取随机状态（用于模拟）
  getRandomStatus(): 'correct' | 'incorrect' | 'partial' {
    const rand = Math.random();
    if (rand < 0.6) return 'correct';
    if (rand < 0.9) return 'incorrect';
    return 'partial';
  },

  // 生成数学题目（用于模拟）
  getMathQuestion(index: number): string {
    const questions = [
      '计算 2x + 5 = 13 中的 x 值',
      '如果 f(x) = x² - 3x + 2，求 f(4)',
      '三角形的三边长分别为 3cm、4cm 和 5cm，求其面积',
      '化简表达式：(2x + 3)(x - 1)',
      '计算 ∫₀¹ 2x dx',
      '求方程 x² - 7x + 12 = 0 的解',
      '若 logₐ 8 = 3，求 a 的值',
      '一个圆的周长是 10π cm，求其面积',
      '简化： sin²θ + cos²θ',
      '解不等式：2x - 3 > 5x + 2'
    ];
    return questions[index - 1] || `计算问题 ${index}`;
  },

  // 生成数学用户答案（用于模拟）
  getMathUserAnswer(index: number, status: 'correct' | 'incorrect' | 'partial'): string {
    if (status === 'correct') {
      const answers = [
        'x = 4',
        'f(4) = 6',
        '面积 = 6 cm²',
        '2x² + x - 3',
        '∫₀¹ 2x dx = x² |₀¹ = 1',
        'x = 3 或 x = 4',
        'a = 2',
        '面积 = 25π cm²',
        '1',
        'x < -5/3'
      ];
      return answers[index - 1] || '正确答案';
    } else if (status === 'incorrect') {
      const answers = [
        'x = 3',
        'f(4) = 8',
        '面积 = 5 cm²',
        '2x² - 2x - 3',
        '∫₀¹ 2x dx = 2x |₀¹ = 2',
        'x = 3 或 x = 3',
        'a = 3',
        '面积 = 5π cm²',
        '0',
        'x > -5/3'
      ];
      return answers[index - 1] || '错误答案';
    } else {
      const answers = [
        'x = 4（计算过程有错）',
        'f(4) = 6（但计算过程不完整）',
        '面积 = 6 cm²（公式使用不正确）',
        '2x² + x - 3（漏写了步骤）',
        '∫₀¹ 2x dx = 1（积分过程不完整）',
        'x = 3 或 x = 4（因式分解有错）',
        'a = 2（方程列写有误）',
        '面积 = 25π cm²（但使用了错误公式）',
        '1（过程不完整）',
        'x < -5/3（解法不够规范）'
      ];
      return answers[index - 1] || '部分正确答案';
    }
  },

  // 生成数学正确答案（用于模拟）
  getMathCorrectAnswer(index: number): string {
    const answers = [
      'x = 4',
      'f(4) = 6',
      '面积 = 6 cm²',
      '2x² + x - 3',
      '∫₀¹ 2x dx = x² |₀¹ = 1',
      'x = 3 或 x = 4',
      'a = 2',
      '面积 = 25π cm²',
      '1',
      'x < -5/3'
    ];
    return answers[index - 1] || '标准答案';
  },

  // 生成数学解释（用于模拟）
  getMathExplanation(index: number): string {
    const explanations = [
      '正确解法：2x + 5 = 13, 2x = 8, x = 4',
      '正确计算：f(4) = 4² - 3*4 + 2 = 16 - 12 + 2 = 6',
      '使用海伦公式：p = (3+4+5)/2 = 6, 面积 = √(6(6-3)(6-4)(6-5)) = √(6*3*2*1) = √36 = 6 cm²',
      '使用分配律：(2x + 3)(x - 1) = 2x(x - 1) + 3(x - 1) = 2x² - 2x + 3x - 3 = 2x² + x - 3',
      '使用积分基本公式：∫ 2x dx = x², ∫₀¹ 2x dx = x² |₀¹ = 1² - 0² = 1',
      '标准解法：x² - 7x + 12 = 0, (x - 3)(x - 4) = 0, 所以 x = 3 或 x = 4',
      '由 logₐ 8 = 3 可知，a³ = 8, 所以 a = 2',
      '周长 = 2πr = 10π, 所以 r = 5, 面积 = πr² = π*5² = 25π cm²',
      '三角函数基本恒等式：sin²θ + cos²θ = 1',
      '2x - 3 > 5x + 2, -3x > 5, x < -5/3'
    ];
    return explanations[index - 1] || '解题步骤说明...';
  },

  // 生成数学建议（用于模拟）
  getMathSuggestion(index: number): string {
    const suggestions = [
      '注意等式两边移项的符号变化',
      '代入函数表达式时需要先计算幂，再进行乘法和加减',
      '使用海伦公式计算三角形面积，注意代入数值的准确性',
      '进行多项式乘法时，要使用分配律将每一项乘以另一多项式',
      '使用积分基本公式，并注意代入上下限',
      '解二次方程时，可以先尝试因式分解',
      '对于指数方程，两边取对数是常用方法',
      '计算圆的面积时，要先从周长计算出半径',
      '记住三角函数的基本恒等式',
      '解不等式时，乘以负数需要变号'
    ];
    return suggestions[index - 1] || '改进建议...';
  },

  // 生成总体评价（用于模拟）
  generateOverallFeedback(score: number, type: string): string {
    let feedback = '';

    if (score >= 90) {
      feedback = `这份${this.getTypeName(type)}作业完成得非常优秀！绝大多数题目都做对了，思路清晰，解题步骤规范。`;
      if (this.data.checkLevel === 'detailed') {
        feedback += '您对知识点的掌握很扎实，能够熟练应用公式和解题技巧。继续保持这种良好的学习状态！';
      }
    } else if (score >= 70) {
      feedback = `这份${this.getTypeName(type)}作业完成得不错，大部分题目都正确。`;
      if (this.data.checkLevel === 'detailed') {
        feedback += '但仍有一些小错误需要注意，建议重点复习那些做错的题目，加深对相关知识点的理解。多做一些同类型的练习题会有所帮助。';
      }
    } else if (score >= 50) {
      feedback = `这份${this.getTypeName(type)}作业完成得一般，有一些题目做对了，但也有不少错误。`;
      if (this.data.checkLevel === 'detailed') {
        feedback += '需要加强基础知识点的学习，建议回顾教材和笔记，重新做一遍错题，理解解题思路和方法。如有不明白的地方，可以请教老师或同学。';
      }
    } else {
      feedback = `这份${this.getTypeName(type)}作业需要大幅改进，存在较多错误。`;
      if (this.data.checkLevel === 'detailed') {
        feedback += '建议从基础知识开始复习，掌握基本概念和解题方法。可以尝试先做一些简单的题目，逐步提高难度。定期复习和练习是提高成绩的关键。';
      }
    }

    return feedback;
  },

  // 获取作业类型名称
  getTypeName(type: string): string {
    return typeNames[type] || type;
  },

  // 添加到历史记录
  addToHistory(result: CheckResult) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 创建历史记录项
    const historyItem: HistoryItem = {
      id: Date.now(),
      type: this.getTypeName(this.data.selectedType),
      date: dateStr,
      score: result.score,
      imagePath: this.data.imagePath,
      result
    };

    // 更新数据和存储
    const newHistory = [historyItem, ...this.data.checkHistory].slice(0, 50); // 限制最多50条记录
    this.setData({
      checkHistory: newHistory
    });

    this.saveHistory();
  },

  // 查看历史记录项
  viewHistoryItem(e: any) {
    const id = parseInt(e.currentTarget.dataset.id);
    const item = this.data.checkHistory.find(item => item.id === id);

    if (item) {
      this.setData({
        imagePath: item.imagePath,
        showResults: true,
        checkResult: item.result,
        selectedType: this.getTypeKey(item.type)
      });
    }
  },

  // 从类型名称获取类型键值
  getTypeKey(typeName: string): string {
    return typeMap[typeName] || 'math';
  },

  // 删除历史记录项
  deleteHistoryItem(e: any) {
    const id = parseInt(e.currentTarget.dataset.id);

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          const newHistory = this.data.checkHistory.filter(item => item.id !== id);

          this.setData({
            checkHistory: newHistory
          });

          this.saveHistory();
        }
      }
    });
  },

  // 清空历史记录
  clearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            checkHistory: []
          });

          wx.removeStorageSync('homework_checker_history');
        }
      }
    });
  },

  // 切换问题详情展开状态
  toggleQuestion(e: any) {
    const id = parseInt(e.currentTarget.dataset.id);
    const questions = this.data.checkResult.questions.map(q => {
      if (q.id === id) {
        return { ...q, expanded: !q.expanded };
      }
      return q;
    });

    this.setData({
      'checkResult.questions': questions
    });
  },

  // 保存检查报告
  saveReport() {
    wx.showToast({
      title: '报告已保存',
      icon: 'success'
    });
  },

  // 开始新的检查
  newCheck() {
    this.setData({
      imagePath: '',
      showResults: false,
      showHistory: true
    });
  }
});
