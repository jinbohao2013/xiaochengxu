//app.js
const Promise = require('utils/promise.js');
App({
  readyCallback: null,
  globalData: {
    
  },
  data:{
    // hostAjax: "http://218.28.235.114:20012", 
    hostAjax: "https://weixin.shengdaprint.com",
    statusBarHeight: wx.getSystemInfoSync()["statusBarHeight"],
    screenHeight: wx.getSystemInfoSync()["screenHeight"],
    dalay:true
  },
  onLaunch: function () {
    // if (wx.getStorageSync("token")) {//ifLogin
    //   wx.reLaunch({
    //     url: 'pages/logs/logs'
    //   })
    //   return false;
    // }
    let _this=this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 登录
    console.log("app1")
    new Promise(function (resolve, reject){
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res.code);
          _this.getData("/api/Account/Code2Session", { jsCode: res.code }).then(res => {
            wx.setStorageSync("openid", res.result.openid);
            _this.postData("/api/Account/AuthenticateByOpenId", { openId: wx.getStorageSync("openid") }).then(res => {
              
              if (res.success) {
                wx.setStorageSync("token", res.result);
                wx.switchTab({
                  url: '../logs/logs',
                })
              }
              if (_this.readyCallback) {
                _this.readyCallback();
              } else {
                // _this.data.dalay = false;
              }
            })

          })
          resolve()
          
          return false;
        }
      })
    }).then(res=>{
      console.log("app2")
    })
    console.log("app3")
  },
  globalData: {
    userInfo: null
  },
  postData: function (url, data) {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: that.data.hostAjax + url,
        data: data,
        method: "POST",
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        success: function (res) {
          resolve(res.data);
        },
        fail: function (res) {
          reject(res);
        },
      })
    });
  },
  getData: function (url, data) {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: that.data.hostAjax + url,
        data: data,
        method: "GET",
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        success: function (res) {
          resolve(res.data);
        },
        fail: function (res) {
          reject(res);
        },
      })
    });
  }
})