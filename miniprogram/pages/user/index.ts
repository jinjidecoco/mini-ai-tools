interface UserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
}

Page({
  data: {
    isLoggedIn: false,
    userInfo: {} as UserInfo,
    userId: ''
  },

  onLoad() {
    // 页面加载时检查登录状态
    this.checkLoginStatus();
  },

  onShow() {
    // 每次页面显示时检查登录状态，以便在登录后刷新页面
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const app = getApp<IAppOption>();
    const isLoggedIn = app.globalData.isLoggedIn;
    const userInfo = app.globalData.userInfo;

    this.setData({
      isLoggedIn,
      userInfo: userInfo || {},
      userId: this.generateUserId(userInfo?.nickName || '')
    });
  },

  // 生成用户ID（实际应用中应该从服务器获取）
  generateUserId(nickname: string): string {
    if (!nickname) return '';
    // 简单示例：使用昵称首字母 + 随机数
    const firstChar = nickname.charAt(0).toUpperCase();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${firstChar}${randomNum}`;
  },

  // 导航到登录页
  navigateToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 导航到历史记录
  navigateToHistory() {
    if (this.checkLoginRequired()) {
      wx.navigateTo({
        url: '/pages/history/index'
      });
    }
  },

  // 导航到收藏
  navigateToFavorites() {
    if (this.checkLoginRequired()) {
      wx.navigateTo({
        url: '/pages/favorites/index'
      });
    }
  },

  // 导航到订阅
  navigateToSubscription() {
    wx.navigateTo({
      url: '/pages/subscription/index'
    });
  },

  // 导航到设置
  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/index'
    });
  },

  // 导航到帮助
  navigateToHelp() {
    wx.navigateTo({
      url: '/pages/help/index'
    });
  },

  // 导航到关于
  navigateToAbout() {
    wx.navigateTo({
      url: '/pages/about/index'
    });
  },

  // 检查是否需要登录
  checkLoginRequired(): boolean {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '该功能需要登录后使用，是否前往登录？',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.navigateToLogin();
          }
        }
      });
      return false;
    }
    return true;
  },

  // 处理退出登录
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      confirmColor: '#f43f5e',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.logout();
        }
      }
    });
  },

  // 退出登录
  logout() {
    // 清除登录信息
    const app = getApp<IAppOption>();
    app.globalData.userInfo = undefined;
    app.globalData.isLoggedIn = false;

    // 清除本地存储
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
    wx.removeStorageSync('loginTime');

    // 更新页面状态
    this.setData({
      isLoggedIn: false,
      userInfo: {},
      userId: ''
    });

    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    });
  }
});