import config from '../../config'
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteImage:[
      "http://www.yqcoffee.cn/image/yaoqing.jpg",
      "http://www.yqcoffee.cn/image/xuejia.png"
    ],
    userInfo: {},
    options:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
    var shareUrl="";
    //判断店长和经销商的身份
    if (wx.getStorageSync("usertype") == "2" || wx.getStorageSync("usertype") == 6 || wx.getStorageSync("usertype") == 5) {
      //2为经销商 3为店长 4为分销员
      //申请店长的链接，后面的参数是分销商的id
      shareUrl = "https://www.yqcoffee.cn/userbind1/?distributorid=" + wx.getStorageSync("distributorid") + "&state=1" + "&uid=" + wx.getStorageSync("userid");
    } else if (wx.getStorageSync("usertype") == "3"){
      //申请分销员的链接，后面的参数是经销商的id和店长的id
      shareUrl = "https://www.yqcoffee.cn/usebind1/?distributorid=" + wx.getStorageSync("distributorid") + "&shopid=" + wx.getStorageSync("shopid") + "&uid=" + wx.getStorageSync("userid");
    } else if (wx.getStorageSync("usertype") == "4") {
      //分享商品列表---后面的参数是分销员的id和店铺的id
      shareUrl = "https://www.yqcoffee.cn/goods1/?useridsaleman=" + wx.getStorageSync("fenxiaoshangid")+"&shopid=" + wx.getStorageSync("shopid");
    }
    if (options.id){
      console.log("买断店长mm")
      wx.setNavigationBarTitle({
        title: '买断推广'
      })
      shareUrl = "https://www.yqcoffee.cn/userbind1/?distributorid=" + wx.getStorageSync("distributorid") + "&state=3" + "&uid=" + wx.getStorageSync("userid");
    }
    console.log("shareUrl:", shareUrl) 
    if (wx.getStorageSync("logo")){
      const img111 = (wx.getStorageSync("logo").replace("http://39.106.49.173:8085", "https://www.yqcoffee.cn:2021")) 
      
      var w= 400 / 750 * wx.getSystemInfoSync().windowWidth;
      const ctx = wx.createCanvasContext('myQrcode')
      wx.downloadFile({
        url: img111,
        success: (res) => {
          // ctx.drawImage(shareImg, 0, 0, w, w)
          console.log(res.tempFilePath)
          // 绘制图片到canvas中
          drawQrcode({
            width: 400 / 750 * wx.getSystemInfoSync().windowWidth,
            height: 400 / 750 * wx.getSystemInfoSync().windowWidth,
            canvasId: 'myQrcode',
            ctx: ctx,
            text: shareUrl,
            image: {
              imageResource: res.tempFilePath,
              dx: 150 / 750 * wx.getSystemInfoSync().windowWidth,
              dy: 150 / 750 * wx.getSystemInfoSync().windowWidth,
              dWidth: 100 / 750 * wx.getSystemInfoSync().windowWidth,
              dHeight: 100 / 750 * wx.getSystemInfoSync().windowWidth
            }
          })
        }
      })
    }else{
      var w = 400 / 750 * wx.getSystemInfoSync().windowWidth;
      const ctx = wx.createCanvasContext('myQrcode')
      wx.downloadFile({
        url: shareUrl,
        success: (res) => {
          // ctx.drawImage(shareImg, 0, 0, w, w)
          console.log(res.tempFilePath)
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
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
     
    })
    this.onLoad(this.data.options);
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
    this.onLoad(this.data.options);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.onLoad(this.data.options);
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