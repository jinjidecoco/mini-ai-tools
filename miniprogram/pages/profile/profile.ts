// profile.ts
// 获取应用实例
const profileApp = getApp<IAppOption>()

interface MenuOption {
  id: number;
  title: string;
  icon: string;
  url: string;
  showArrow?: boolean;
  isButton?: boolean;
}

interface UserStat {
  id: number;
  title: string;
  value: string;
}

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    isVip: false,
    vipExpireDate: '2023-12-31',
    userStats: [
      {
        id: 1,
        title: '收藏工具',
        value: '8'
      },
      {
        id: 2,
        title: '历史记录',
        value: '26'
      },
      {
        id: 3,
        title: '消费积分',
        value: '1280'
      }
    ] as UserStat[],
    menuOptions: [
      {
        id: 1,
        title: '我的收藏',
        icon: '../../assets/icons/favorite.svg',
        url: '/pages/favorites/favorites',
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
        title: '消息通知',
        icon: '../../assets/icons/notification.svg',
        url: '/pages/notifications/notifications',
        showArrow: true
      },
      {
        id: 4,
        title: '账户设置',
        icon: '../../assets/icons/settings.svg',
        url: '/pages/settings/settings',
        showArrow: true
      },
      {
        id: 5,
        title: '帮助中心',
        icon: '../../assets/icons/help.svg',
        url: '/pages/help/help',
        showArrow: true
      },
      {
        id: 6,
        title: '关于我们',
        icon: '../../assets/icons/about.svg',
        url: '/pages/about/about',
        showArrow: true
      }
    ] as MenuOption[],
    quickActions: [
      {
        id: 1,
        title: '升级会员',
        icon: '../../assets/icons/vip.svg',
        url: '/pages/subscription/subscription',
        isButton: true
      },
      {
        id: 2,
        title: '分享给好友',
        icon: '../../assets/icons/share.svg',
        url: '',
        isButton: true
      },
      {
        id: 3,
        title: '意见反馈',
        icon: '../../assets/icons/feedback.svg',
        url: '/pages/feedback/feedback',
        isButton: true
      }
    ] as MenuOption[]
  },

  onLoad() {
    // 检查是否可以使用 getUserProfile
    if (typeof wx.getUserProfile === 'function') {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    // 检查用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    }
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        console.log(res)
        // 保存用户信息到本地存储
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  // 导航到相应页面
  navigateTo(e: any) {
    const { url } = e.currentTarget.dataset
    if (!url) return

    wx.navigateTo({
      url
    })
  },

  // 处理分享
  handleShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 处理升级会员
  handleUpgradeVip() {
    wx.navigateTo({
      url: '/pages/subscription/subscription'
    })
  },

  // 刷新
  onPullDownRefresh() {
    // 模拟加载数据
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  // 生成会员图标
  getVipBadge() {
    if (this.data.isVip) {
      return '../../assets/icons/vip-badge.svg'
    }
    return ''
  }
})