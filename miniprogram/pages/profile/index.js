/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-21 10:09:32
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-03-21 13:24:09
 * @FilePath: /mini-tools/miniprogram/pages/profile/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// profile/index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {
      avatarUrl: '/assets/icons/logo.png',
      nickName: '用户名称',
      userType: '普通用户'
    },
    statistics: {
      usedTools: 25,
      favorites: 8,
      usageCount: 128
    },
    hasFeedbackResponse: true // 是否有反馈响应
  },

  onLoad() {
    // 页面加载时执行的操作
    this.getUserInfo();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
  },

  // 获取用户信息
  getUserInfo() {
    // 这里可以从服务器或缓存获取用户信息
    // 示例代码使用模拟数据
    console.log('获取用户信息');
  },

  // 页面导航
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url
    });
  },

  // 升级到VIP
  upgradeToPremium() {
    wx.navigateTo({
      url: '/pages/premium/index'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 执行退出登录操作
          console.log('用户确认退出登录');
          // 清除用户信息
          // app.globalData.userInfo = null;
          // 返回登录页
          // wx.redirectTo({
          //   url: '/pages/login/index'
          // });

          // 模拟效果
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  }
})