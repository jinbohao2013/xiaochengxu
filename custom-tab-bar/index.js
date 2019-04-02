Component({
  data: {
    selected: 0,
    color: "#666",
    selectedColor: "#FDD000",
    list: [{
      pagePath: "/pages/logs/logs",
      iconPath: "/image/icon_component.png",
      selectedIconPath: "/image/icon_component_HL.png",
      text: "我的订单",
      icon: "iconorder_icon",
      iconsize:46
    }, {
        pagePath: "/pages/person/person",
      iconPath: "/image/icon_API.png",
      selectedIconPath: "/image/icon_API_HL.png",
        text: "个人中心",
        icon: "iconwode",
        iconsize:56
    }]
  },
  attached() {
    // console.log(this.data.selected)
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})