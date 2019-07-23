// pages/authorize/authorize.js
import config from '../../config'
const app = getApp()
Page({
  data: {
    isLogin: false,
    gooo:null
  },
  onLoad: function(options) {
    console.log(options)
  },
  getInfo:function(){
    this.onReady()
  },  
  onReady: function() {
    if (!this.data.gooo){
      // this.data.gooo = setTimeout(function () {
      //   wx.redirectTo({
      //     url: '/pages/goods/index/index'
      //   })
      // }, 10000)
    }
   
    wx.getUserInfo({
      success: (data) => {
        console.log(data);
        //更新data中的userInfo
        app.globalData.userInfo = data.userInfo
        // clearTimeout(this.data.gooo)
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