// pages/tools/document-analysis/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileInfo: null,
        analysisResults: null,
        isAnalyzing: false,
        errorMessage: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // Page initialization
    },

    /**
     * 返回上一页
     */
    goBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    /**
     * 选择文件
     */
    chooseFile() {
        const that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            extension: ['pdf', 'doc', 'docx', 'txt'],
            success(res) {
                const file = res.tempFiles[0];
                that.setData({
                    fileInfo: {
                        name: file.name,
                        size: (file.size / 1024).toFixed(2),
                        path: file.path
                    },
                    errorMessage: ''
                });
            },
            fail(err) {
                console.error('Choose file failed:', err);
                that.setData({
                    errorMessage: '选择文件失败，请重试'
                });
            }
        });
    },

    /**
     * 分析文档
     */
    analyzeDocument() {
        if (!this.data.fileInfo) {
            this.setData({
                errorMessage: '请先选择文件'
            });
            return;
        }

        this.setData({
            isAnalyzing: true,
            errorMessage: ''
        });

        // Simulate API call for document analysis
        setTimeout(() => {
            // Mock results
            const results = [
                { key: '文档类型', value: 'PDF文档' },
                { key: '页数', value: '5页' },
                { key: '字数统计', value: '约2,500字' },
                { key: '主要主题', value: '人工智能应用' },
                { key: '关键词', value: 'AI, 机器学习, 深度学习, 应用场景' },
                { key: '文档摘要', value: '本文档介绍了人工智能在各行业的应用场景，重点分析了机器学习和深度学习技术的实际应用案例。' }
            ];

            this.setData({
                analysisResults: results,
                isAnalyzing: false
            });
        }, 2000);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        // 页面初次渲染完成
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 页面显示
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        // 页面隐藏
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        // 页面卸载
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
            title: 'AI文档分析工具',
            path: '/pages/tools/document-analysis/index'
        };
    }
})