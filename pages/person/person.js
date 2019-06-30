// pages/person/person.js
var app= getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.data.statusBarHeight,
    userInfo:null,
    consultant:false,
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
      url: app.data.hostAjax + '/api/user/v1/wxloginopenid', // 微信openid登录
      data: {
        openid: wx.getStorageSync("openid"),
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        _this.setData({
          loading: true
        })
        if (res.data.Success) {
          wx.setStorageSync("userIdBuyGood", res.data.Data.user_id);//储存购买用户的id用来调取支付
          if (res.data.Data.usertype == 1) {
            //1为普通用户 2为经销商 3为店长 4为分销员
            //1--隐藏底部导航
            _this.setData({
              hideBotom: false
            })
          }
        } else {
          wx.redirectTo({
            url: '/pages/home/home',
          })
        }
      }
    })
    util.request(app.data.hostAjax + '/api/dester/v1/getmyadviser', { userid: wx.getStorageSync("userIdBuyGood")}).then(function (res) {
      if(res.Code=="200"){
        _this.setData({
          consultant:true
        });
      }
      
    })
    util.request(app.data.hostAjax + '/api/user/v1/info', {
      user_id: wx.getStorageSync("userIdBuyGood"),
      curr_id: wx.getStorageSync("userIdBuyGood"), }).then(function (res) {
      if (res.Code == "200") {
        var a = (res.Data.createdAt.split("Date(")[1].split(")")[0])
        _this.setData({
          time: app.dateFmt(parseInt(a))
        });
        
        console.log(app.dateFmt(parseInt(a)))
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
  editUser(){
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
  go_order(){
    wx.navigateTo({
      url: '/pages/person/order/order',
    })
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