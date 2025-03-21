// settings.ts
// 获取应用实例
const settingsApp = getApp<IAppOption>()

interface SettingsItem {
  id: number;
  title: string;
  type: 'switch' | 'navigation' | 'button';
  value?: boolean;
  url?: string;
  isDestructive?: boolean;
}

interface SettingsGroup {
  id: number;
  title: string;
  items: SettingsItem[];
}

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    settingsGroups: [
      {
        id: 1,
        title: '通用设置',
        items: [
          {
            id: 101,
            title: '深色模式',
            type: 'switch',
            value: false
          },
          {
            id: 102,
            title: '消息通知',
            type: 'switch',
            value: true
          },
          {
            id: 103,
            title: '语言设置',
            type: 'navigation',
            url: '/pages/settings/language/language'
          }
        ]
      },
      {
        id: 2,
        title: '隐私与安全',
        items: [
          {
            id: 201,
            title: '隐私政策',
            type: 'navigation',
            url: '/pages/settings/privacy/privacy'
          },
          {
            id: 202,
            title: '用户协议',
            type: 'navigation',
            url: '/pages/settings/terms/terms'
          },
          {
            id: 203,
            title: '清除缓存',
            type: 'button'
          }
        ]
      },
      {
        id: 3,
        title: '账户',
        items: [
          {
            id: 301,
            title: '修改个人资料',
            type: 'navigation',
            url: '/pages/settings/profile-edit/profile-edit'
          },
          {
            id: 302,
            title: '退出登录',
            type: 'button',
            isDestructive: true
          }
        ]
      }
    ] as SettingsGroup[]
  },

  onLoad() {
    // 检查用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    }
  },

  // 导航到相应页面
  navigateTo(e: any) {
    const { url } = e.currentTarget.dataset
    if (!url) return

    wx.navigateTo({
      url
    })
  },

  // 处理开关变化
  handleSwitchChange(e: any) {
    const { value } = e.detail
    const { groupId, itemId } = e.currentTarget.dataset

    // 更新开关状态
    const settingsGroups = [...this.data.settingsGroups]
    const groupIndex = settingsGroups.findIndex(group => group.id === groupId)

    if (groupIndex !== -1) {
      const itemIndex = settingsGroups[groupIndex].items.findIndex(item => item.id === itemId)

      if (itemIndex !== -1) {
        settingsGroups[groupIndex].items[itemIndex].value = value

        this.setData({
          settingsGroups
        })

        // 如果是深色模式开关
        if (itemId === 101) {
          this.toggleDarkMode(value)
        }

        // 如果是通知开关
        if (itemId === 102) {
          this.toggleNotifications(value)
        }
      }
    }
  },

  // 处理按钮点击
  handleButtonTap(e: any) {
    const { itemId } = e.currentTarget.dataset

    // 清除缓存
    if (itemId === 203) {
      this.clearCache()
    }

    // 退出登录
    if (itemId === 302) {
      this.logout()
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 切换深色模式
  toggleDarkMode(value: boolean) {
    // 这里实现深色模式的切换逻辑
    console.log('深色模式:', value)
  },

  // 切换通知
  toggleNotifications(value: boolean) {
    // 这里实现通知的切换逻辑
    console.log('通知:', value)
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？',
      confirmColor: '#3B82F6',
      success: (res) => {
        if (res.confirm) {
          // 模拟清除缓存
          wx.showLoading({
            title: '正在清除...',
          })

          setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
              title: '清除成功',
              icon: 'success'
            })
          }, 1500)
        }
      }
    })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          wx.removeStorageSync('userInfo')

          // 更新状态
          this.setData({
            userInfo: {},
            hasUserInfo: false
          })

          // 返回到个人中心
          wx.switchTab({
            url: '/pages/profile/profile'
          })
        }
      }
    })
  }
})