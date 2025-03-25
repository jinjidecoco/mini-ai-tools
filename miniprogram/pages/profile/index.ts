/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-21 10:09:32
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-03-21 13:24:09
 * @FilePath: /mini-tools/miniprogram/pages/profile/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// profile/index.ts
// 获取应用实例
const appInstance = getApp();

interface UserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
}

interface Statistics {
  usedTools: number;
  favorites: number;
  usageCount: number;
}

interface PageData {
  userInfo: UserInfo;
  statistics: Statistics;
  hasFeedbackResponse: boolean;
}

Page({
  data: {
    isLoggedIn: false,
    userInfo: {} as UserInfo,
    userId: '',
    usageStats: {
      totalUsage: 0,
      remainingQuota: 0,
      premiumStatus: false
    }
  },

  onLoad() {
    // 页面加载时检查登录状态
    this.checkLoginStatus();
    this.loadUsageStats();
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

  // 加载使用统计
  loadUsageStats() {
    // 这里应该从服务器获取用户的使用统计数据
    // 为了演示，我们使用模拟数据
    this.setData({
      usageStats: {
        totalUsage: 28,
        remainingQuota: 72,
        premiumStatus: false
      }
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
    const app = getApp<IAppOption>();
    app.navigateToLogin('/pages/profile/index');
  },

  // 导航到历史记录
  navigateToHistory() {
    if (this.checkLoginRequired()) {
      wx.navigateTo({
        url: '/pages/history/index',
        fail: (err) => {
          console.error('导航到历史记录失败:', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }
  },

  // 导航到收藏
  navigateToFavorites() {
    if (this.checkLoginRequired()) {
      wx.navigateTo({
        url: '/pages/favorites/index',
        fail: (err) => {
          console.error('导航到收藏失败:', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }
  },

  // 导航到订阅
  navigateToSubscription() {
    wx.navigateTo({
      url: '/pages/subscription/index',
      fail: (err) => {
        console.error('导航到订阅失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 导航到设置
  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/index',
      fail: (err) => {
        console.error('导航到设置失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 导航到帮助与反馈
  navigateToHelp() {
    wx.navigateTo({
      url: '/pages/help/index',
      fail: (err) => {
        console.error('导航到帮助失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 导航到关于我们
  navigateToAbout() {
    wx.navigateTo({
      url: '/pages/about/index',
      fail: (err) => {
        console.error('导航到关于我们失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 检查是否需要登录
  checkLoginRequired() {
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
    app.clearLoginInfo();

    // 更新页面状态
    this.setData({
      isLoggedIn: false,
      userInfo: {},
      userId: ''
    });

    wx.showToast({
      title: '已退出登录',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 延迟跳转到登录页
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/login/index'
          });
        }, 1500);
      }
    });
  },

  // 升级到专业版
  upgradeToPremium() {
    wx.navigateTo({
      url: '/pages/subscription/index'
    });
  }
})