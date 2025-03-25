interface UserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
}

interface GetUserProfileSuccessResult {
  userInfo: UserInfo;
  encryptedData: string;
  iv: string;
  cloudID: string;
  signature: string;
  rawData: string;
}

Page({
  data: {
    redirect: '', // 登录成功后重定向的路径
    isLoading: false
  },

  onLoad(options: any) {
    // 获取重定向路径
    if (options.redirect) {
      this.setData({
        redirect: decodeURIComponent(options.redirect)
      });
    }
  },

  // 获取用户信息
  getUserProfile() {
    const app = getApp<IAppOption>();

    // 显示加载状态
    this.setData({ isLoading: true });

    // 调用微信API获取用户信息
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res: GetUserProfileSuccessResult) => {
        console.log('获取用户信息成功', res);

        // 获取登录凭证
        wx.login({
          success: (loginRes: any) => {
            console.log('获取登录凭证成功', loginRes);

            // 调用后端登录接口
            this.loginWithServer(loginRes.code, res.userInfo);
          },
          fail: (err: any) => {
            console.error('获取登录凭证失败', err);
            this.showLoginError('获取登录凭证失败');
          }
        });
      },
      fail: (err: any) => {
        console.error('获取用户信息失败', err);
        this.showLoginError('获取用户信息失败');
      }
    });
  },

  // 与服务器交互进行登录
  loginWithServer(code: string, userInfo: UserInfo) {
    // 这里应该调用您的后端登录接口
    // 为了演示，我们直接模拟登录成功

    setTimeout(() => {
      // 保存用户信息和登录状态
      this.saveUserInfo(userInfo);

      // 登录成功提示
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 800
      });

      // 延迟后跳转
      setTimeout(() => {
        this.navigateAfterLogin();
      }, 800);
    }, 1000);
  },

  // 保存用户信息
  saveUserInfo(userInfo: UserInfo) {
    const app = getApp<IAppOption>();

    // 更新全局数据
    app.globalData.userInfo = userInfo;
    app.globalData.hasUserInfo = true;
    app.globalData.isLoggedIn = true;

    // 保存到本地存储
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('loginTime', Date.now());
    wx.setStorageSync('token', 'mock_token_' + Date.now()); // 实际项目中应该使用服务器返回的token

    // 隐藏加载状态
    this.setData({ isLoading: false });
  },

  // 登录后导航
  navigateAfterLogin() {
    if (this.data.redirect) {
      // 如果有重定向路径，则跳转到该路径
      wx.redirectTo({
        url: this.data.redirect,
        fail: () => {
          // 如果重定向失败，返回上一页
          wx.navigateBack();
        }
      });
    } else {
      // 否则返回上一页
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack();
      } else {
        // 如果没有上一页，则跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    }
  },

  // 显示登录错误
  showLoginError(message: string) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
    this.setData({ isLoading: false });
  },

  // 跳过登录
  skipLogin() {
    wx.showModal({
      title: '提示',
      content: '登录后才能使用完整功能，确定跳过登录吗？',
      confirmText: '确定跳过',
      cancelText: '返回登录',
      success: (res) => {
        if (res.confirm) {
          this.navigateAfterLogin();
        }
      }
    });
  },

  // 跳转到用户协议
  navigateToTerms() {
    wx.navigateTo({
      url: '/pages/terms/index'
    });
  },

  // 跳转到隐私政策
  navigateToPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/index'
    });
  }
});