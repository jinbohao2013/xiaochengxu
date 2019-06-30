// pages/person/person.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.data.statusBarHeight,
    userInfo: {
      nickname: "",
      phone: "",
      sex: "",
      birthday: "",
    },
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
    let _this = this;
    
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/info', // 获取用户信息
      data: {
        user_id: wx.getStorageSync("userIdBuyGood"),
        curr_id: wx.getStorageSync("userIdBuyGood"),
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        
        if (res.data.Success) {
          var a = (res.data.Data.createdAt.split("Date(")[1].split(")")[0])
          _this.setData({
            userInfo: res.data.Data,
            time: app.dateFmt(parseInt(a))
          })
        } else {
          
        }
      }
    })
  },
  logOut: function (options) {
    //修改信息
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/modifyinfo', // 微信openid登录
      data: {
        user_id: wx.getStorageSync("userIdBuyGood"),
        token :wx.getStorageSync("token"),
        nickname: this.data.userInfo.nickname,
        phone: this.data.userInfo.phone,
        sex: this.data.userInfo.sex,
        birthday: this.data.userInfo.birthday,
        imgurl: this.data.userInfo.imgurl,
        autograph:"",
      },
      method: "post",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        
        if (res.data.Success) {
          wx.navigateBack({
            delta: 1
          })

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  editUser() {
    //信息修改的
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
  binname: function (e) {
    console.log(e)
    this.data.userInfo.nickname=e.detail.value
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  binphone: function (e) {
    console.log(e)
    this.data.userInfo.phone = e.detail.value
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  binsex: function (e) {
    console.log(e)
    this.data.userInfo.sex = e.detail.value
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  binbirthday: function (e) {
    console.log(e)
    this.data.userInfo.birthday = e.detail.value
    this.setData({
      userInfo: this.data.userInfo
    })
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