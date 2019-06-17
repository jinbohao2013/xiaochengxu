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
      shareUrl ="https://www.yqcoffee.cn/userbind/?distributorid=9";
    } else if (wx.getStorageSync("usertype") == "3"){
      //申请分销员的链接，后面的参数是经销商的id和店长的id
      shareUrl = "https://www.yqcoffee.cn/usebind/?distributorid=9&shopid=25";
    } else if (wx.getStorageSync("usertype") == "4") {
      //分享商品列表---后面的参数是分销员的id和店铺的id
      shareUrl = "https://www.yqcoffee.cn/goods/?useridsaleman=9&shopid=25";
    }
    var w= 400 / 750 * wx.getSystemInfoSync().windowWidth;
    const ctx = wx.createCanvasContext('myQrcode')
    wx.downloadFile({
      url: shareUrl,
      success: (res) => {
        // ctx.drawImage(shareImg, 0, 0, w, w)
        console.log(res)
        // 绘制图片到canvas中
        drawQrcode({
          width: 400 / 750 * wx.getSystemInfoSync().windowWidth,
          height: 400 / 750 * wx.getSystemInfoSync().windowWidth,
          canvasId: 'myQrcode',
          ctx: ctx,
          text: shareUrl,
        })
      }
    })

    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
     
    })
    this.onLoad();
    let _this = this;
    //获取用户登录信息
    wx.request({
      url: config.apiHost + "/api/user/v1/info",
      data: {
        user_id: wx.getStorageSync("userid"),
        curr_id: wx.getStorageSync("userid"),
      },
      success: (res) => {
        try {
          _this.setData({
            userInfo: res.data.Data
          })
        } catch (e) {

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.onLoad();
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