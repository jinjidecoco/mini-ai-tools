// pages/tools/text-generation/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        prompt: '',
        style: 'professional', // professional, casual, creative
        textLength: 'medium', // short, medium, long
        generatedContent: '',
        isGenerating: false,
        errorMessage: '',
        generatedTexts: [],
        selectedText: null,
        templates: [
            {
                id: 1,
                title: '营销文案',
                description: '推广产品或服务',
                icon: '../../../assets/icons/template-marketing.svg',
                prompt: '为一款新型智能手机编写简洁有力的营销文案，突出其AI摄影功能和长续航特点。'
            },
            {
                id: 2,
                title: '文章大纲',
                description: '创建内容结构',
                icon: '../../../assets/icons/template-outline.svg',
                prompt: '为一篇关于"人工智能在日常生活中的应用"的文章创建详细大纲。'
            },
            {
                id: 3,
                title: '社交媒体',
                description: '引人入胜的帖子',
                icon: '../../../assets/icons/template-social.svg',
                prompt: '撰写一条关于新推出的在线教育课程的社交媒体帖子，吸引年轻专业人士。'
            },
            {
                id: 4,
                title: '邮件模板',
                description: '专业电子邮件',
                icon: '../../../assets/icons/template-email.svg',
                prompt: '编写一封邀请客户参加产品发布会的专业邮件。'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // Load saved history
        const history = wx.getStorageSync('generatedTexts') || [];
        this.setData({ generatedTexts: history });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '智能文本生成 - AI写作助手',
            path: '/pages/tools/text-generation/index'
        };
    },

    goBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    onPromptInput(e) {
        this.setData({
            prompt: e.detail.value,
            errorMessage: ''
        });
    },

    selectLength(e) {
        this.setData({
            textLength: e.currentTarget.dataset.length
        });
    },

    selectStyle(e) {
        this.setData({
            style: e.currentTarget.dataset.style
        });
    },

    selectTemplate(e) {
        const templateId = parseInt(e.currentTarget.dataset.id);
        const template = this.data.templates.find(t => t.id === templateId);

        if (template) {
            this.setData({
                prompt: template.prompt
            });
        }
    },

    generateText() {
        if (!this.data.prompt) {
            this.setData({
                errorMessage: '请输入提示词'
            });
            return;
        }

        this.setData({
            isGenerating: true,
            errorMessage: ''
        });

        // Simulate API call delay
        setTimeout(() => {
            let generatedText = '';
            const wordCounts = {
                short: 100,
                medium: 200,
                long: 300
            };

            // Generate different text based on selected style
            switch (this.data.style) {
                case 'professional':
                    generatedText = this.generateProfessionalText(this.data.prompt, wordCounts[this.data.textLength]);
                    break;
                case 'casual':
                    generatedText = this.generateCasualText(this.data.prompt, wordCounts[this.data.textLength]);
                    break;
                case 'creative':
                    generatedText = this.generateCreativeText(this.data.prompt, wordCounts[this.data.textLength]);
                    break;
            }

            // Save to history
            const newText = {
                id: Date.now(),
                content: generatedText,
                timestamp: Date.now()
            };

            const history = [newText, ...this.data.generatedTexts.slice(0, 9)]; // Keep last 10
            wx.setStorageSync('generatedTexts', history);

            this.setData({
                generatedContent: generatedText,
                generatedTexts: history,
                isGenerating: false
            });
        }, 2000);
    },

    viewHistoryText(e) {
        const textId = parseInt(e.currentTarget.dataset.id);
        const text = this.data.generatedTexts.find(t => t.id === textId);

        if (text) {
            this.setData({
                selectedText: text,
                generatedContent: text.content
            });

            // Scroll to result
            wx.pageScrollTo({
                selector: '.result-section',
                duration: 300
            });
        }
    },

    copyText() {
        if (this.data.generatedContent) {
            wx.setClipboardData({
                data: this.data.generatedContent,
                success: () => {
                    wx.showToast({
                        title: '已复制到剪贴板',
                        icon: 'success'
                    });
                }
            });
        }
    },

    shareText() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    clearPrompt() {
        this.setData({
            prompt: '',
            errorMessage: ''
        });
    },

    generateProfessionalText(prompt, wordCount) {
        // This is a mock function - in a real app, this would call an AI API
        return `[专业风格文本] 基于您的提示: "${prompt}"\n\n这是一段生成的专业风格文本示例，内容根据您的提示词生成。在实际应用中，这里将由AI模型根据提示词生成相关的专业风格文本内容，包含正式的语言、精确的术语和结构化的段落。文本长度将根据您选择的长度选项进行调整，当前设置为${wordCount}字左右。`;
    },

    generateCasualText(prompt, wordCount) {
        // This is a mock function - in a real app, this would call an AI API
        return `[轻松风格文本] 基于您的提示: "${prompt}"\n\n嘿，这是一段生成的轻松风格文本示例！内容根据您的提示词生成。在实际应用中，这里将由AI模型生成更加口语化、亲切自然的内容，就像朋友间的对话一样。文本长度将根据您选择的选项调整，当前是${wordCount}字左右哦！`;
    },

    generateCreativeText(prompt, wordCount) {
        // This is a mock function - in a real app, this would call an AI API
        return `[创意风格文本] 基于您的提示: "${prompt}"\n\n✨ 这是一段生成的创意风格文本示例 ✨\n\n在星光闪烁的思想海洋中，您的提示词如同指引灯塔，启发了这段独特的创意内容。在实际应用中，AI将为您创造富有想象力、修辞手法丰富的内容，带给读者全新的视角和感受。文本篇幅将根据您的选择，当前约为${wordCount}字的灵感之旅。`;
    }
})