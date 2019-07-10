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
        app.login()
      },
      fail: () => {
        this.setData({
          isLogin:true
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