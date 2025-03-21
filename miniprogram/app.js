// app.js
const tailwind = require('./utils/tailwind');

App({
  globalData: {
    tailwind: tailwind,
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })

    // 检查是否可以使用 getUserProfile
    if (typeof wx.getUserProfile === 'function') {
      this.globalData.canIUseGetUserProfile = true
    }
  },
})