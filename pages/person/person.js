var app= getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    statusBarHeight: app.data.statusBarHeight,
    userInfo:null,
    consultant:false,
  },
  onLoad: function (options) {
    this.setData({
      usertype: wx.getStorageSync("usertype")
    })
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
            // _this.setData({
            //   hideBotom: false
            // })
          }
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
  onShow: function () {
    wx.getUserInfo({
      success: (data) => {
        _this.setData({
          hideBotom: false,//隐藏顶部的未登录状态
        })
        if (wx.getStorageSync("usertype") == 8) {//超管登录
          //更新data中的userInfo
          app.globalData.userInfo = data.userInfo
          app.login();
          wx.reLaunch({
            url: '/pages/administrator/index/person',
          })
          return
        }
        
        if (wx.getStorageSync("usertype") != 1) {
          wx.redirectTo({
            url: '/pages/home/home',
          })
        }
      },
      fail: () => {
        console.log("还没有授权登录！")
        _this.setData({
          hideBotom: true,//显示顶部的未登录状态
        })
      }
    })
    
    let _this=this;
    //会员等级
    util.request(app.data.hostAjax + '/api/dester/v1/getcurstormdester', { userid: wx.getStorageSync("userIdBuyGood") }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          grad: res.Data
        });
      }
    })
  },
  onGotUserInfo: function (e) {//判断登录跳转登录页
    app.checkauthorization(() => {
      if (e.currentTarget.dataset.url) {
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
        return
      }
    })
  }
})