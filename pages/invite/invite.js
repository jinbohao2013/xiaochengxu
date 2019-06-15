import config from '../../config'
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteImage:[
      "../../image/yaoqing.jpg",
      "../../image/erweima.jpg"
    ],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shareUrl="";
    //判断店长和经销商的身份
    if (wx.getStorageSync("usertype")=="2") {
      //2为经销商 3为店长 4为分销员
      //申请店长的链接，后面的参数是分销商的id
      shareUrl ="https://www.yqcoffee.cn/userbind/?distributorid=1";
    } else if (wx.getStorageSync("usertype") == "3"){
      //申请分销员的链接，后面的参数是经销商的id和店长的id
      shareUrl = "https://www.yqcoffee.cn/usebind/?distributorid=1&shopid=2";
    } else if (wx.getStorageSync("usertype") == "4") {
      //分享商品列表---后面的参数是分销员的id和店铺的id
      shareUrl = "https://www.yqcoffee.cn/goods/?useridsaleman=19&shopid=7";
    }
    

    // 绘制图片到canvas中
    drawQrcode({
      width: 400 / 750 * wx.getSystemInfoSync().windowWidth,
      height: 400 / 750 * wx.getSystemInfoSync().windowWidth,
      canvasId: 'myQrcode',
      text: shareUrl,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
  onShareAppMessage: function () {
    
  }
})