// pages/tools/schedule-planner/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        selectedDate: '',
        displayMonth: '',
        selectedDateDisplay: '',
        calendarDays: [],
        showEventForm: false,
        events: [],
        eventForm: {
            id: '',
            title: '',
            startTime: '',
            endTime: '',
            description: ''
        },
        isEditing: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const today = new Date();
        const dateString = this.formatDateString(today);

        // Set current date as selected
        this.setData({
            selectedDate: dateString,
            selectedDateDisplay: this.formatDisplayDate(dateString)
        });

        // Generate calendar
        this.generateCalendar(today.getFullYear(), today.getMonth() + 1);

        // Load events for today
        this.loadEvents(dateString);
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
        // Refresh calendar when returning to page
        this.generateCalendar(this.data.currentYear, this.data.currentMonth);

        // Refresh events for selected date
        if (this.data.selectedDate) {
            this.loadEvents(this.data.selectedDate);
        }
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
        // Refresh current view
        this.generateCalendar(this.data.currentYear, this.data.currentMonth);
        this.loadEvents(this.data.selectedDate);

        // Stop pull-down refreshing animation
        wx.stopPullDownRefresh();
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
        wx.navigateBack();
    },

    previousMonth() {
        let year = this.data.currentYear;
        let month = this.data.currentMonth - 1;

        if (month < 1) {
            month = 12;
            year -= 1;
        }

        this.generateCalendar(year, month);
    },

    nextMonth() {
        let year = this.data.currentYear;
        let month = this.data.currentMonth + 1;

        if (month > 12) {
            month = 1;
            year += 1;
        }

        this.generateCalendar(year, month);
    },

    // Format date as YYYY-MM-DD string
    formatDateString(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // Format date for display (e.g., "3月22日 星期六")
    formatDisplayDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[date.getDay()];

        return `${month}月${day}日 星期${weekday}`;
    },

    // Generate calendar for given year and month
    generateCalendar(year, month) {
        // Create date object for the first day of the month
        const firstDay = new Date(year, month - 1, 1);
        const firstDayWeekday = firstDay.getDay();

        // Get number of days in current month
        const daysInMonth = new Date(year, month, 0).getDate();

        // Get number of days in previous month
        const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

        let calendarDays = [];

        // Add days from previous month to fill first week
        for (let i = 0; i < firstDayWeekday; i++) {
            const prevMonthDay = daysInPrevMonth - firstDayWeekday + i + 1;
            let prevMonth = month - 1;
            let prevYear = year;

            if (prevMonth < 1) {
                prevMonth = 12;
                prevYear -= 1;
            }

            const dateString = `${prevYear}-${prevMonth.toString().padStart(2, '0')}-${prevMonthDay.toString().padStart(2, '0')}`;

            calendarDays.push({
                day: prevMonthDay,
                date: dateString,
                isCurrentMonth: false,
                isToday: this.isToday(dateString),
                hasEvents: this.hasEvents(dateString)
            });
        }

        // Add days for current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateString = `${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

            calendarDays.push({
                day: i,
                date: dateString,
                isCurrentMonth: true,
                isToday: this.isToday(dateString),
                hasEvents: this.hasEvents(dateString)
            });
        }

        // Add days from next month to complete grid (ensure 6 rows of 7 days)
        const totalDaysNeeded = 42; // 6 rows of 7 days
        const remainingDays = totalDaysNeeded - calendarDays.length;

        for (let i = 1; i <= remainingDays; i++) {
            let nextMonth = month + 1;
            let nextYear = year;

            if (nextMonth > 12) {
                nextMonth = 1;
                nextYear += 1;
            }

            const dateString = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

            calendarDays.push({
                day: i,
                date: dateString,
                isCurrentMonth: false,
                isToday: this.isToday(dateString),
                hasEvents: this.hasEvents(dateString)
            });
        }

        // Format Chinese month display
        const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

        this.setData({
            currentYear: year,
            currentMonth: month,
            displayMonth: `${year}年${month}月`,
            calendarDays: calendarDays
        });
    },

    // Check if date is today
    isToday(dateString) {
        const today = this.formatDateString(new Date());
        return dateString === today;
    },

    // Check if date has events (placeholder implementation)
    hasEvents(dateString) {
        // In real app, this would check against stored events
        // For this implementation, we'll just randomly mark some days
        const events = wx.getStorageSync('events') || {};
        return events[dateString] && events[dateString].length > 0;
    },

    selectDate(e) {
        const dateString = e.currentTarget.dataset.date;

        this.setData({
            selectedDate: dateString,
            selectedDateDisplay: this.formatDisplayDate(dateString)
        });

        this.loadEvents(dateString);
    },

    loadEvents(dateString) {
        // In a real app, this would load from storage or API
        let allEvents = wx.getStorageSync('events') || {};
        let dailyEvents = allEvents[dateString] || [];

        // If no events found and today's date, add mock events
        if (dailyEvents.length === 0 && this.isToday(dateString)) {
            dailyEvents = [
                {
                    id: '1',
                    title: '项目会议',
                    startTime: '09:00',
                    endTime: '10:30',
                    description: '讨论新功能开发计划'
                },
                {
                    id: '2',
                    title: '午餐',
                    startTime: '12:00',
                    endTime: '13:00',
                    description: '团队午餐'
                }
            ];

            // Save mock events
            allEvents[dateString] = dailyEvents;
            wx.setStorageSync('events', allEvents);
        }

        // Sort events by start time
        dailyEvents.sort((a, b) => {
            if (a.startTime < b.startTime) return -1;
            if (a.startTime > b.startTime) return 1;
            return 0;
        });

        this.setData({
            events: dailyEvents
        });
    },

    showAddEventForm() {
        this.setData({
            showEventForm: true,
            isEditing: false,
            eventForm: {
                id: '',
                title: '',
                startTime: '09:00',
                endTime: '10:00',
                description: ''
            }
        });
    },

    editEvent(e) {
        const eventId = e.currentTarget.dataset.id;
        const event = this.data.events.find(e => e.id === eventId);

        if (event) {
            this.setData({
                showEventForm: true,
                isEditing: true,
                eventForm: {...event}
            });
        }
    },

    deleteEvent(e) {
        const eventId = e.currentTarget.dataset.id;

        wx.showModal({
            title: '删除确认',
            content: '确定要删除这个事件吗？',
            success: (res) => {
                if (res.confirm) {
                    // Remove from events list
                    const updatedEvents = this.data.events.filter(e => e.id !== eventId);

                    // Update storage
                    let allEvents = wx.getStorageSync('events') || {};
                    allEvents[this.data.selectedDate] = updatedEvents;
                    wx.setStorageSync('events', allEvents);

                    // Update UI
                    this.setData({
                        events: updatedEvents
                    });

                    // Show success message
                    wx.showToast({
                        title: '事件已删除',
                        icon: 'success'
                    });

                    // Refresh calendar to update hasEvents indicators
                    this.generateCalendar(this.data.currentYear, this.data.currentMonth);
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
        const form = this.data.eventForm;

        // Validate form
        if (!form.title.trim()) {
            wx.showToast({
                title: '请输入事件标题',
                icon: 'none'
            });
            return;
        }

        if (!form.startTime) {
            wx.showToast({
                title: '请选择开始时间',
                icon: 'none'
            });
            return;
        }

        if (!form.endTime) {
            wx.showToast({
                title: '请选择结束时间',
                icon: 'none'
            });
            return;
        }

        // Compare start and end time
        if (form.startTime >= form.endTime) {
            wx.showToast({
                title: '结束时间必须晚于开始时间',
                icon: 'none'
            });
            return;
        }

        // Get all events
        let allEvents = wx.getStorageSync('events') || {};
        let dailyEvents = allEvents[this.data.selectedDate] || [];

        if (this.data.isEditing) {
            // Update existing event
            dailyEvents = dailyEvents.map(e => {
                if (e.id === form.id) {
                    return {...form};
                }
                return e;
            });
        } else {
            // Create new event with unique ID
            const newEvent = {
                ...form,
                id: new Date().getTime().toString()
            };
            dailyEvents.push(newEvent);
        }

        // Sort events by start time
        dailyEvents.sort((a, b) => {
            if (a.startTime < b.startTime) return -1;
            if (a.startTime > b.startTime) return 1;
            return 0;
        });

        // Save to storage
        allEvents[this.data.selectedDate] = dailyEvents;
        wx.setStorageSync('events', allEvents);

        // Update UI
        this.setData({
            events: dailyEvents,
            showEventForm: false
        });

        // Show success message
        wx.showToast({
            title: this.data.isEditing ? '事件已更新' : '事件已添加',
            icon: 'success'
        });

        // Refresh calendar to update hasEvents indicators
        this.generateCalendar(this.data.currentYear, this.data.currentMonth);
    }
})