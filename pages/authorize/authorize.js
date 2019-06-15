// pages/authorize/authorize.js
import config from '../../config'
const app = getApp()
Page({
  data: {
    isLogin: false
  },
  onLoad: function(options) {
    console.log(options)
  },
  getInfo:function(){
    this.onReady()
  },  
  onReady: function() {
    wx.getUserInfo({
      success: (data) => {
        console.log(data);
        //更新data中的userInfo
        app.globalData.userInfo = data.userInfo
        this.login()
      },
      fail: () => {
        this.setData({
          isLogin:true
        })
      }
    })

  },
  // 登录
  login: function() {
    wx.login({
      success: (res) => {
        console.log(res)
        wx.request({
          // url: 'https://api.weixin.qq.com/sns/jscode2session',
          url: config.apiHost + '/api/weixin/v1/jscode2session',
          data: {
            response_type: res.code,
          },
          method: "GET",
          success: (res) => {
            let ress = JSON.parse(res.data.Data)
            let openid = JSON.parse(res.data.Data).openid
            // console.log(res.data)
            //获取用户的openid 
            console.log("用户的openid" + openid)
            app.globalData.openid = openid
            wx.request({
              url: config.apiHost + '/api/user/v1/wxloginopenid',
              data: {
                openid: openid,
                imgurl: app.globalData.userInfo.avatarUrl,
                nickname: app.globalData.userInfo.nickName
              },
              success: (ress) => {
                console.log(ress)
                let usertype = ress.data.Data.usertype
                app.globalData.usertype = ress.data.Data.usertype
                // app.globalData.usertype = '4'
                app.globalData.user_id = ress.data.Data.user_id
                app.globalData.token = ress.data.Data.token
                if (app.globalData.usertype == '2' || app.globalData.usertype == '3' || app.globalData.usertype == '4'){
                  wx.redirectTo({
                    url: '/pages/home/home',
                  })
                }else{
                  wx.redirectTo({
                    url: '/pages/logon/logon',
                  })
                }
                // wx.redirectTo({
                //   url: '/pages/home/home',
                // })
                // wx.redirectTo({
                //   url: '/pages/bindingshop/bindingshop',
                // })
                // wx.redirectTo({
                //   url: '/pages/binding/binding',
                // })
                // wx.redirectTo({
                //   url: '/pages/invite/invite',
                // })
                // wx.redirectTo({
                //   url: '/pages/logon/logon',
                // })
              }
            })
          }
        })
      }
    })
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})