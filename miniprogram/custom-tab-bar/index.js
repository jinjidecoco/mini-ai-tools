Component({
  data: {
    selected: 0,
    color: "#6B7280",
    selectedColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "../assets/icons/home.png",
        selectedIconPath: "../assets/icons/home-active.png"
      },
      {
        pagePath: "/pages/categories/index",
        text: "分类",
        iconPath: "../assets/icons/category.png",
        selectedIconPath: "../assets/icons/category-active.png"
      },
      {
        pagePath: "/pages/profile/index",
        text: "我的",
        iconPath: "../assets/icons/profile.png",
        selectedIconPath: "../assets/icons/profile-active.png"
      }
    ]
  },
  attached() {
    // Get the current page route
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      if (currentPage && currentPage.route) {
        // Find which tab the current page belongs to
        const tabIndex = this.data.list.findIndex(item => {
          return item.pagePath === currentPage.route;
        });

        if (tabIndex !== -1) {
          this.setData({
            selected: tabIndex
          });
        }
      }
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;

      wx.switchTab({
        url: url
      });

      this.setData({
        selected: data.index
      });
    }
  }
});