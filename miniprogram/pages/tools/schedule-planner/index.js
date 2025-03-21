// pages/tools/schedule-planner/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentMonth: '2023年3月',
        selectedDate: '2023-03-15',
        events: [],
        showEventForm: false,
        eventForm: {
            id: null,
            title: '',
            startTime: '09:00',
            endTime: '10:00',
            description: ''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // Page initialization
        this.loadEvents();
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
            title: 'AI日程规划工具',
            path: '/pages/tools/schedule-planner/index'
        };
    },

    goBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    previousMonth() {
        // Handle month navigation
        wx.showToast({
            title: '切换至上个月',
            icon: 'none'
        });
    },

    nextMonth() {
        // Handle month navigation
        wx.showToast({
            title: '切换至下个月',
            icon: 'none'
        });
    },

    selectDate(e) {
        const date = e.currentTarget.dataset.date;
        this.setData({
            selectedDate: date
        });
        this.loadEvents();
    },

    loadEvents() {
        // Mock events loading based on selected date
        const events = [
            {
                id: 1,
                title: '项目会议',
                startTime: '09:00',
                endTime: '10:30',
                description: '讨论新功能开发计划'
            }
        ];

        this.setData({ events });
    },

    showAddEventForm() {
        // Reset form and show
        this.setData({
            showEventForm: true,
            eventForm: {
                id: null,
                title: '',
                startTime: '09:00',
                endTime: '10:00',
                description: ''
            }
        });
    },

    editEvent(e) {
        const eventId = e.currentTarget.dataset.id;
        const event = this.data.events.find(event => event.id === eventId);

        if (event) {
            this.setData({
                showEventForm: true,
                eventForm: {
                    id: event.id,
                    title: event.title,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    description: event.description
                }
            });
        }
    },

    deleteEvent(e) {
        const eventId = e.currentTarget.dataset.id;

        wx.showModal({
            title: '确认删除',
            content: '确定要删除这个事件吗？',
            success: (res) => {
                if (res.confirm) {
                    // Remove event from array
                    const events = this.data.events.filter(event => event.id !== eventId);
                    this.setData({ events });

                    wx.showToast({
                        title: '事件已删除',
                        icon: 'success'
                    });
                }
            }
        });
    },

    onEventTitleInput(e) {
        this.setData({
            'eventForm.title': e.detail.value
        });
    },

    onStartTimeChange(e) {
        this.setData({
            'eventForm.startTime': e.detail.value
        });
    },

    onEndTimeChange(e) {
        this.setData({
            'eventForm.endTime': e.detail.value
        });
    },

    onEventDescriptionInput(e) {
        this.setData({
            'eventForm.description': e.detail.value
        });
    },

    cancelEventForm() {
        this.setData({
            showEventForm: false
        });
    },

    saveEvent() {
        const { id, title, startTime, endTime, description } = this.data.eventForm;

        if (!title) {
            wx.showToast({
                title: '请输入事件标题',
                icon: 'none'
            });
            return;
        }

        // Clone current events
        const events = [...this.data.events];

        if (id) {
            // Update existing event
            const index = events.findIndex(event => event.id === id);
            if (index !== -1) {
                events[index] = {
                    id,
                    title,
                    startTime,
                    endTime,
                    description
                };
            }
        } else {
            // Add new event
            events.push({
                id: Date.now(), // Simple ID generation
                title,
                startTime,
                endTime,
                description
            });
        }

        this.setData({
            events,
            showEventForm: false
        });

        wx.showToast({
            title: id ? '事件已更新' : '事件已添加',
            icon: 'success'
        });
    }
})