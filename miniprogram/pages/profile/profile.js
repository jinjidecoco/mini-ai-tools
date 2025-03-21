// profile.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    isVip: false,
    vipExpireDate: '2024-12-31',
    userStats: [
      {
        id: 1,
        title: '已使用工具',
        value: '8'
      },
      {
        id: 2,
        title: '保存记录',
        value: '32'
      },
      {
        id: 3,
        title: '我的收藏',
        value: '12'
      }
    ],
    quickActions: [
      {
        id: 1,
        title: '开通VIP',
        icon: '../../assets/icons/vip.svg',
        url: ''
      },
      {
        id: 2,
        title: '分享给朋友',
        icon: '../../assets/icons/share.svg',
        url: ''
      },
      {
        id: 3,
        title: '意见反馈',
        icon: '../../assets/icons/feedback.svg',
        url: '/pages/feedback/feedback'
      }
    ],
    menuOptions: [
      {
        id: 1,
        title: '我的收藏',
        icon: '../../assets/icons/favorite.svg',
        url: '/pages/favorite/favorite',
        showArrow: true
      },
      {
        id: 2,
        title: '使用历史',
        icon: '../../assets/icons/history.svg',
        url: '/pages/history/history',
        showArrow: true
      },
      {
        id: 3,
        title: '帮助中心',
        icon: '../../assets/icons/help.svg',
        url: '/pages/help/help',
        showArrow: true
      },
      {
        id: 4,
        title: '关于我们',
        icon: '../../assets/icons/about.svg',
        url: '/pages/about/about',
        showArrow: true
      }
    ]
  },

  onLoad() {
    // 检查是否可以使用 getUserProfile
    if (typeof wx.getUserProfile === 'function') {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    // 检查是否已有用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
  },

  navigateTo(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },

  handleShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  handleUpgradeVip() {
    wx.navigateTo({
      url: '/pages/subscription/subscription'
    })
  },

  onPullDownRefresh() {
    // 模拟刷新数据
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  getVipBadge() {
    if (this.data.isVip) {
      return '../../assets/icons/vip-badge.svg'
    }
    return ''
  }
})