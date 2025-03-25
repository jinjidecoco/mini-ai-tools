// app.ts
import tailwind from './utils/tailwind';

// Define extended global data interface
interface IGlobalData {
  tailwind: typeof tailwind;
  userInfo: WechatMiniprogram.UserInfo | null;
  hasUserInfo: boolean;
  canIUseGetUserProfile: boolean;
  isLoggedIn: boolean;
}

interface UserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
}

interface IAppOption {
  globalData: {
    userInfo?: UserInfo;
    hasUserInfo: boolean;
    canIUseGetUserProfile: boolean;
    isLoggedIn: boolean;
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
  checkLoginStatus: () => void;
  clearLoginInfo: () => void;
  navigateToLogin: (redirectPath?: string) => void;
  checkAndNavigateToLogin: (redirectPath?: string) => boolean;
}

App<IAppOption>({
  globalData: {
    tailwind: tailwind,
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    isLoggedIn: false
  },

  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();

    // 检查是否支持 getUserProfile
    if (wx.canIUse('getUserProfile')) {
      this.globalData.canIUseGetUserProfile = true;
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    const token = wx.getStorageSync('token');
    const loginTime = wx.getStorageSync('loginTime');

    // 检查是否有用户信息和token
    if (userInfo && token) {
      // 检查登录是否过期（这里设置为7天）
      console.log('检查登录状态');
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (loginTime && now - loginTime < sevenDays) {
        // 登录有效
        this.globalData.userInfo = userInfo;
        this.globalData.hasUserInfo = true;
        this.globalData.isLoggedIn = true;
      } else {
        // 登录已过期，清除登录信息
        this.clearLoginInfo();
      }
    } else {
      // 未登录
      console.log('用户未登录');
      this.globalData.isLoggedIn = false;
      this.globalData.hasUserInfo = false;
    }
  },

  // 清除登录信息
  clearLoginInfo() {
    this.globalData.userInfo = null;
    this.globalData.hasUserInfo = false;
    this.globalData.isLoggedIn = false;
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
    wx.removeStorageSync('loginTime');
  },

  // 导航到登录页面
  navigateToLogin(redirectPath?: string) {
    const currentPages = getCurrentPages();
    const currentRoute = currentPages[currentPages.length - 1]?.route || '';

    // 如果当前已经在登录页，则不再跳转
    if (currentRoute === 'pages/login/index') {
      return;
    }

    // 跳转到登录页
    let url = '/pages/login/index';

    // 如果提供了重定向路径，添加到登录页URL中
    if (redirectPath) {
      url += `?redirect=${encodeURIComponent(redirectPath)}`;
    }

    wx.navigateTo({
      url: url
    });
  },

  // 检查登录状态并根据需要跳转到登录页
  // 返回值: true - 已登录, false - 未登录
  checkAndNavigateToLogin(redirectPath?: string) {
    // 检查登录状态
    this.checkLoginStatus();

    // 如果未登录，跳转到登录页
    if (!this.globalData.isLoggedIn) {
      this.navigateToLogin(redirectPath);
      return false;
    }

    return true;
  }
})