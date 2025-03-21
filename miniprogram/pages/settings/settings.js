// settings.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    settingsGroups: [
      {
        id: 1,
        title: '个人设置',
        items: [
          {
            id: 101,
            title: '个人资料',
            type: 'navigation',
            url: '/pages/profile-edit/profile-edit'
          },
          {
            id: 102,
            title: '账号安全',
            type: 'navigation',
            url: '/pages/security/security'
          }
        ]
      },
      {
        id: 2,
        title: '通用设置',
        items: [
          {
            id: 201,
            title: '深色模式',
            type: 'switch',
            value: false
          },
          {
            id: 202,
            title: '消息通知',
            type: 'switch',
            value: true
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
        title: '关于',
        items: [
          {
            id: 301,
            title: '隐私政策',
            type: 'navigation',
            url: '/pages/privacy/privacy'
          },
          {
            id: 302,
            title: '用户协议',
            type: 'navigation',
            url: '/pages/terms/terms'
          },
          {
            id: 303,
            title: '关于我们',
            type: 'navigation',
            url: '/pages/about/about'
          }
        ]
      },
      {
        id: 4,
        title: '账号',
        items: [
          {
            id: 401,
            title: '退出登录',
            type: 'button',
            isDestructive: true
          }
        ]
      }
    ]
  },

  onLoad() {
    // 从本地存储获取应用设置状态
    try {
      const darkMode = wx.getStorageSync('darkMode') || false
      const notifications = wx.getStorageSync('notifications') || true

      this.updateSettingValue(2, 201, darkMode)
      this.updateSettingValue(2, 202, notifications)
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  },

  navigateTo(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },

  handleSwitchChange(e) {
    const { groupId, itemId } = e.currentTarget.dataset
    const value = e.detail.value

    // 更新设置项的值
    this.updateSettingValue(groupId, itemId, value)

    // 根据切换的设置项执行相应的操作
    switch(itemId) {
      case 201: // 深色模式
        this.toggleDarkMode(value)
        break
      case 202: // 消息通知
        this.toggleNotifications(value)
        break
      default:
        break
    }
  },

  updateSettingValue(groupId, itemId, value) {
    const groups = [...this.data.settingsGroups]

    const groupIndex = groups.findIndex(g => g.id === groupId)
    if (groupIndex !== -1) {
      const itemIndex = groups[groupIndex].items.findIndex(i => i.id === itemId)
      if (itemIndex !== -1) {
        groups[groupIndex].items[itemIndex].value = value

        this.setData({
          settingsGroups: groups
        })
      }
    }
  },

  handleButtonTap(e) {
    const { itemId } = e.currentTarget.dataset

    switch(itemId) {
      case 203: // 清除缓存
        this.clearCache()
        break
      case 401: // 退出登录
        this.logout()
        break
      default:
        break
    }
  },

  goBack() {
    wx.navigateBack()
  },

  toggleDarkMode(value) {
    // 保存设置到本地存储
    wx.setStorageSync('darkMode', value)
    // 这里可以添加切换深色模式的逻辑
  },

  toggleNotifications(value) {
    // 保存设置到本地存储
    wx.setStorageSync('notifications', value)
    // 这里可以添加切换消息通知的逻辑
  },

  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有缓存数据吗？这将清除历史记录、搜索记录等临时数据。',
      success: (res) => {
        if (res.confirm) {
          // 执行清除缓存的操作
          try {
            // 清除相关存储数据
            wx.removeStorageSync('history')
            wx.removeStorageSync('searchHistory')
            wx.removeStorageSync('generationHistory')
            wx.removeStorageSync('enhancementHistory')
            wx.removeStorageSync('transcriptionHistory')
            wx.removeStorageSync('translationHistory')

            wx.showToast({
              title: '缓存已清除',
              icon: 'success'
            })
          } catch (e) {
            console.error('Failed to clear cache:', e)
            wx.showToast({
              title: '清除失败',
              icon: 'error'
            })
          }
        }
      }
    })
  },

  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 执行退出登录的操作
          wx.removeStorageSync('userInfo')

          // 重置全局数据
          const appInstance = getApp()
          appInstance.globalData.userInfo = null
          appInstance.globalData.hasUserInfo = false

          // 返回到首页
          wx.switchTab({
            url: '/pages/index/index'
          })

          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})