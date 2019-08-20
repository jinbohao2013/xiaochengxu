// pages/authorize/authorize.js
import config from '../../config'
const app = getApp()
Page({
  data: {
    isLogin: false,
    gooo:null,
    s1:"",
    s2: ""
  },
  checkboxChange: function (e) {
    this.setData({
      s1: e.detail.value
    })
  },
  checkboxChange1: function (e) {
    this.setData({
      s2: e.detail.value
    })
  },
  showt(){
    wx.showToast({
      title: '请确定已成年阅读并勾选',
      icon:"none"
    })
  },
  onLoad: function(options) {
    console.log(options)
  },
  getInfo:function(){
    wx.getUserInfo({
      success: (data) => {
        console.log(data);
        //更新data中的userInfo
        app.globalData.userInfo = data.userInfo
        // clearTimeout(this.data.gooo)
        app.login()
        wx.navigateBack({
          delta: 1
        })
      },
      fail: () => {
        this.setData({
          isLogin: true
        })
      }
    })
  },  
  goback(){
    wx.navigateBack({
      delta: 1
    })
  },
  onReady: function() {
    if (!this.data.gooo){
      // this.data.gooo = setTimeout(function () {
      //   wx.redirectTo({
      //     url: '/pages/goods/index/index'
      //   })
      // }, 10000)
    }
   
    
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