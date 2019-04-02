//app.js
App({
  globalData: {
    
  },
  data:{
    // hostAjax: "http://218.28.235.114:20012", 
    hostAjax: "https://weixin.shengdaprint.com",
    statusBarHeight: wx.getSystemInfoSync()["statusBarHeight"],
    screenHeight: wx.getSystemInfoSync()["screenHeight"]
  },
  onLaunch: function () {
    if (wx.getStorageSync("token")) {//ifLogin
      wx.reLaunch({
        url: 'pages/logs/logs'
      })
      return false;
    }
    let _this=this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    
    
    wx.checkSession({
      success(e) {
        console.log(" session_key 未过期")

        // session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        console.log("登录")
        // session_key 已经失效，需要重新执行登录流程
        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log(res.code)
            wx.request({
              url: _this.data.hostAjax + "/api/Account/Code2Session",
              data: {
                jsCode: res.code
              },
              method: "get",
              header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              success(res) {
                console.log(JSON.parse(res.data.Data).openid)//小程序的openid
                wx.setStorage({
                  key: 'sessionKey',
                  data: JSON.parse(res.data.Data).session_key,
                })
                if (JSON.parse(res.data.Data) != undefined && JSON.parse(res.data.Data).openid != undefined) {
wx.request({
      url: _this.data.hostAjax + '/api/Account/AuthenticateByOpenId', // 令牌认证并获取Token(根据微信openid
      data: {
        openId: wx.getStorageSync("openid")
      },
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data.success) {
          wx.switchTab({
            url: '../logs/logs',
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
                } else {
                  wx.showToast({
                    title: '微信的接口出错，无法获取openid',
                    icon: 'none',
                    duration: 2000
                  })
                  return false;
                }
                wx.setStorage({
                  key: 'openid',
                  data: JSON.parse(res.data.Data).openid,
                })
                //用openid来登录 获取后台的手机号根据手机号来登录判断
                // wx.request({
                //   url: _this.data.hostAjax + "/api/user/v1/wxloginopenid",
                //   data: {
                //     openid: JSON.parse(res.data.Data).openid
                //   },
                //   method: "get",
                //   header: {
                //     'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                //   },
                //   success(res) {
                //     wx.setStorage({
                //       key: 'uid',
                //       data: res.data.Data.user_id,
                //     })
                //     wx.setStorage({
                //       key: 'phone',
                //       data: res.data.Data.phone,
                //     })
                //   }
                // })
              }
            })
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})