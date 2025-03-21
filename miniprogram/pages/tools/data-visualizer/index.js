// pages/tools/data-visualizer/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputData: '',
        chartType: 'bar',
        chartData: null,
        isVisualizing: false,
        errorMessage: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // Page initialization
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
            title: 'AI数据可视化工具',
            path: '/pages/tools/data-visualizer/index'
        };
    },

    goBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    onDataInput(e) {
        this.setData({
            inputData: e.detail.value,
            errorMessage: ''
        });
    },

    selectChartType(e) {
        this.setData({
            chartType: e.currentTarget.dataset.type
        });
    },

    visualizeData() {
        if (!this.data.inputData) {
            this.setData({
                errorMessage: '请输入数据'
            });
            return;
        }

        this.setData({
            isVisualizing: true,
            errorMessage: ''
        });

        // Try to parse the input data
        try {
            let parsedData;
            if (this.data.inputData.trim().startsWith('[')) {
                // Attempt to parse as JSON
                parsedData = JSON.parse(this.data.inputData);
            } else {
                // Attempt to parse as CSV
                parsedData = this.parseCSV(this.data.inputData);
            }

            // Simulate chart generation
            setTimeout(() => {
                this.setData({
                    chartData: {
                        type: this.data.chartType,
                        data: parsedData
                    },
                    isVisualizing: false
                });
            }, 1500);
        } catch (error) {
            console.error('Data parsing error:', error);
            this.setData({
                errorMessage: '数据格式错误，请检查后重试',
                isVisualizing: false
            });
        }
    },

    parseCSV(csvText) {
        // Simple CSV parser implementation
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index];
            });
            return obj;
        });
    },

    saveAsImage() {
        // In a real implementation, this would generate and save a chart image
        wx.showToast({
            title: '图表已保存到相册',
            icon: 'success'
        });
    },

    shareChart() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    }
})