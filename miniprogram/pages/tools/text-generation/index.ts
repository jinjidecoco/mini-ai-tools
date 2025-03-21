// text-generation/index.ts

// 定义类型
interface HistoryItem {
  id: string;
  prompt: string;
  content: string;
  date: number;
  type: string;
}

type TextType = 'article' | 'summary' | 'continue';
type TextLength = 'short' | 'medium' | 'long';
type TextStyle = 'formal' | 'casual' | 'professional';

Page({
  data: {
    // 输入相关数据
    promptText: '',
    resultText: '',

    // 模板数据
    templates: [
      { id: 1, name: '文章创作', icon: '../../../assets/icons/article.svg' },
      { id: 2, name: '内容续写', icon: '../../../assets/icons/continue.svg' },
      { id: 3, name: '摘要生成', icon: '../../../assets/icons/summary.svg' },
      { id: 4, name: '翻译助手', icon: '../../../assets/icons/translate.svg' },
      { id: 5, name: '邮件撰写', icon: '../../../assets/icons/email.svg' },
      { id: 6, name: '营销文案', icon: '../../../assets/icons/marketing.svg' },
      { id: 7, name: '创意故事', icon: '../../../assets/icons/story.svg' },
      { id: 8, name: '产品描述', icon: '../../../assets/icons/product.svg' }
    ],
    selectedTemplate: null as any,

    // 生成相关数据
    isGenerating: false,
    showSettings: false,
    textType: 'article' as TextType,
    textLength: 'medium' as TextLength,
    textStyle: 'formal' as TextStyle,

    // 历史记录
    history: [] as HistoryItem[]
  },

  onLoad() {
    // 初始化加载
    this.loadHistory();
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('textGenerationHistory') || [];
    this.setData({
      history
    });
  },

  // 导航返回函数
  navigateBack() {
    wx.navigateBack();
  },

  // 显示设置面板
  showSettings() {
    this.setData({
      showSettings: true
    });
  },

  // 隐藏设置面板
  hideSettings() {
    this.setData({
      showSettings: false
    });
  },

  // 输入框处理
  onPromptInput(e: WechatMiniprogram.Input) {
    this.setData({
      promptText: e.detail.value
    });
  },

  // 清空输入
  clearPrompt() {
    this.setData({
      promptText: ''
    });
  },

  // 选择模板
  selectTemplate(e: any) {
    const templateId = e.currentTarget.dataset.id;
    const template = this.data.templates.find((t: any) => t.id === templateId);

    this.setData({
      selectedTemplate: template
    });

    // 如果有模板预设的提示词，可以设置到输入框
    const templatePrompts: Record<number, string> = {
      1: '请创作一篇关于...',
      2: '请继续以下内容：...',
      3: '请为以下内容生成摘要：...',
      4: '请将以下内容翻译成...',
      5: '请撰写一封关于...的邮件',
      6: '请创作一段关于...的营销文案',
      7: '请创作一个关于...的故事',
      8: '请为...产品写一段产品描述'
    };

    if (templatePrompts[templateId]) {
      this.setData({
        promptText: templatePrompts[templateId]
      });
    }
  },

  // 设置文本类型
  setTextType(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      textType: e.currentTarget.dataset.type as TextType
    });
  },

  // 设置文本长度
  setTextLength(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      textLength: e.currentTarget.dataset.length as TextLength
    });
  },

  // 设置语言风格
  setTextStyle(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      textStyle: e.currentTarget.dataset.style as TextStyle
    });
  },

  // 使用示例提示
  usePromptExample(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      promptText: e.currentTarget.dataset.prompt as string
    });
  },

  // 生成文本
  generateText() {
    if (!this.data.promptText.trim()) {
      wx.showToast({
        title: '请输入提示内容',
        icon: 'none'
      });
      return;
    }

    // 设置生成中状态
    this.setData({
      isGenerating: true,
      resultText: ''
    });

    // 模拟API调用延迟
    setTimeout(() => {
      this.generateTextWithAI();
    }, 1500);
  },

  // 使用AI生成文本（模拟实现）
  generateTextWithAI() {
    const { promptText, textType, textLength, textStyle } = this.data;

    // 在实际应用中，这里会调用后端API
    // 这里使用模拟数据
    let result = '';

    // 根据文本类型生成不同内容
    if (textType === 'article') {
      result = this.generateArticle(promptText, textLength, textStyle);
    } else if (textType === 'summary') {
      result = this.generateSummary(promptText, textLength, textStyle);
    } else if (textType === 'continue') {
      result = this.generateContinue(promptText, textLength, textStyle);
    }

    // 更新状态
    this.setData({
      resultText: result,
      isGenerating: false
    });

    // 添加到历史记录
    this.addToHistory(promptText, result);
  },

  // 生成文章（模拟）
  generateArticle(prompt: string, length: TextLength, style: TextStyle): string {
    // 这里是模拟生成，实际应用中会调用AI接口
    const lengthFactor = length === 'short' ? 1 : length === 'medium' ? 2 : 3;
    const paragraphs = 2 * lengthFactor;

    let article = '';

    // 生成标题
    article += prompt + '\n\n';

    // 生成段落
    for (let i = 0; i < paragraphs; i++) {
      let paragraphLength = 200 + Math.random() * 100;
      article += this.generateParagraph(paragraphLength, style) + '\n\n';
    }

    return article.trim();
  },

  // 生成摘要（模拟）
  generateSummary(prompt: string, length: TextLength, style: TextStyle): string {
    // 模拟生成摘要
    const lengthFactor = length === 'short' ? 1 : length === 'medium' ? 1.5 : 2;
    const paragraphs = 1 * lengthFactor;

    let summary = '';

    // 生成内容
    for (let i = 0; i < paragraphs; i++) {
      let paragraphLength = 150 + Math.random() * 50;
      summary += this.generateParagraph(paragraphLength, style) + '\n\n';
    }

    return summary.trim();
  },

  // 生成续写内容（模拟）
  generateContinue(prompt: string, length: TextLength, style: TextStyle): string {
    // 模拟生成续写内容
    const lengthFactor = length === 'short' ? 1 : length === 'medium' ? 2 : 3;
    const paragraphs = 2 * lengthFactor;

    let continuedText = prompt + '\n\n';

    // 生成续写段落
    for (let i = 0; i < paragraphs; i++) {
      let paragraphLength = 180 + Math.random() * 90;
      continuedText += this.generateParagraph(paragraphLength, style) + '\n\n';
    }

    return continuedText.trim();
  },

  // 生成段落（模拟）
  generateParagraph(length: number, style: TextStyle): string {
    const formalWords = [
      '此外', '因此', '然而', '相应地', '值得注意的是', '综上所述',
      '从长远来看', '事实上', '据统计', '研究表明', '必须指出',
      '普遍认为', '总的来说', '客观来看', '根据分析'
    ];

    const casualWords = [
      '其实', '不过', '所以', '话说', '反正', '说真的', '说实话',
      '你知道的', '想想看', '总之', '不得不说', '说白了',
      '老实说', '简单来说', '坦白讲'
    ];

    const professionalWords = [
      '据研究显示', '经实证分析', '根据数据表明', '从理论层面',
      '从实践角度', '基于以上论述', '通过分析发现', '综合评估',
      '从专业视角', '依照标准规范', '参照行业标准', '根据科学依据'
    ];

    // 根据风格选择词汇
    let wordBank;
    if (style === 'formal') {
      wordBank = formalWords;
    } else if (style === 'casual') {
      wordBank = casualWords;
    } else {
      wordBank = professionalWords;
    }

    // 生成段落
    let paragraph = '';
    let currentLength = 0;

    while (currentLength < length) {
      // 随机选择一个连接词
      const connectorWord = wordBank[Math.floor(Math.random() * wordBank.length)];

      // 生成一个句子
      const sentenceLength = 20 + Math.floor(Math.random() * 40);
      const sentence = connectorWord + '，' + '这是一个AI生成的示例文本'.repeat(sentenceLength / 10) + '。';

      paragraph += sentence + ' ';
      currentLength += sentence.length;
    }

    return paragraph.trim();
  },

  // 添加到历史记录
  addToHistory(prompt: string, result: string) {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      prompt: prompt.substr(0, 30) + (prompt.length > 30 ? '...' : ''),
      content: result,
      date: Date.now(),
      type: this.data.textType
    };

    const history = [historyItem, ...this.data.history];

    // 限制历史记录数量，最多保存20条
    if (history.length > 20) {
      history.pop();
    }

    this.setData({
      history
    });

    // 保存到本地存储
    wx.setStorageSync('textGenerationHistory', history);
  },

  // 保存结果 - 添加的方法，在WXML中被引用
  saveToHistory() {
    if (!this.data.resultText) {
      return;
    }

    wx.showToast({
      title: '已保存',
      icon: 'success'
    });
  },

  // 复制结果
  copyResult() {
    if (!this.data.resultText) {
      return;
    }

    wx.setClipboardData({
      data: this.data.resultText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  // 清除结果
  clearResult() {
    this.setData({
      resultText: ''
    });
  },

  // 重新生成
  regenerateText() {
    this.generateText();
  },

  // 查看历史记录项
  viewHistoryItem(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    const item = this.data.history.find(item => item.id === id);

    if (item) {
      this.setData({
        promptText: item.prompt,
        resultText: item.content
      });
    }
  },

  // 删除历史记录项
  deleteHistoryItem(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    const history = this.data.history.filter(item => item.id !== id);

    this.setData({
      history
    });

    // 保存到本地存储
    wx.setStorageSync('textGenerationHistory', history);
  },

  // 清空历史记录
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            history: []
          });
          wx.setStorageSync('textGenerationHistory', []);
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  }
});