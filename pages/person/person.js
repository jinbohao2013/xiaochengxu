// pages/person/person.js
var app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.data.statusBarHeight,
    userInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (!wx.getStorageSync("openid")) {
    //   wx.reLaunch({
    //     url: '/pages/index/index'
    //   })
    // }
    let _this=this;
    wx.request({
      url: app.data.hostAjax +'/api/Account/GetCurrentCustomer', // 获取用户信息
      data: {
        
      },
      method:"get",
      header: {
        'content-type': 'application/json',
        'Authorization':"Bearer "+wx.getStorageSync("token")
      },
      success(res) {
        console.log(res.data);
        if (res.data.success) {
          _this.setData({
            userInfo: res.data.result
          })
        } else {
          wx.showToast({
            title: res.data.error.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  logOut: function (options) {
    wx.removeStorageSync("token");
    wx.reLaunch({
      url: '../index/index?showM=1'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      path: '/pages/index/index?stop=1'
    }
  }
})