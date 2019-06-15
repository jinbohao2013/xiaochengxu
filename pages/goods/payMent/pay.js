
const util = require('../../../utils/util.js');
import Toast from '../../../dist/toast/toast';
import drawQrcode from '../../../utils/weapp.qrcode.esm.js'
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: null,//可用窗口的高度
    value1: 1,//购买数量
    ajaxData: {
      id:"",
      title: "snow+",//标题
      desc: "",//描述
      img:"/image/demo_1.jpg",
      price: "39.00",//单价
      num: "2",//数量
      taste: "甜甜的口味",//口味
      tasteId: null,//口味id
      totle: 3900,//总金额
    },
    isIphoneX: app.data.isIphoneX,
    loading: false,
    show: false,//选择口味的弹出层
    show1: false,//保存图片的弹出层
    acticeInxex: null,//口味的顺序index值0开始SystemInfoSync().windowWidth,//二维码的px值（转换之后的）
  },
  changeIndex(e) {
    console.log(e)
    this.setData({
      acticeInxex: e.currentTarget.dataset.index
    })
  },
  changeSwiper(e) {
    this.setData({
      current: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.reLaunch({//重定向到登录页面
    //   url: '/pages/index/index'
    // })
    let _this = this;
    try{
      console.log(options.ajaxData)
      this.setData({
        ajaxData: JSON.parse(options.ajaxData)
      })
    }catch(e){

    }
    
    this.setData({
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight - 59 - 68 : app.data.windowHeight - 59 - 51
    })
    // 绘制图片到canvas中
    drawQrcode({
      width: _this.data.widthCord,
      height: _this.data.widthCord,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: 'https://github.com/yingye',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu({
      success: function () {
        console.log("禁止了分享按钮的现实！")
      }
    })
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
  onChange(event) {
    console.warn(`change: ${event.detail}`);
  },
  onSearch(e) {
    console.log(e.detail)
  },
  onCancel() {//取消搜索搜索时触发

  },
  scroll() {//滚动时触发

  },
  onPullDownRefresh: function () {

    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载

    setTimeout(function () {

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
  },
  scrolltolower() {
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false

      })
      setTimeout(function () {
        _this.setData({
          loading: true

        })
      }, 1000)
      console.log("在我这里调取加载数据")
    }

  },
  onClose() {
    this.setData({ show: !this.data.show });
  },
  togglePopup() {
    this.setData({ show1: !this.data.show1 });
  },
  onClickButton() {//提交订单--吊起支付
    let _this=this;
    this.setData({ loading: true });
    wx.request({
      url: app.data.hostAjax + "/api/transaction/v1/orderpayinfo",
      data: {
        userid: wx.getStorageSync("uid"),
        goodsid: _this.data.goodsId,
        salapersonid: wx.getStorageSync("couponsName").split('&')[1],//分销员id
        // shopid:"",//店铺id
        num: parseFloat(_this.data.needPay),
        tasteid: this.data.tasteid,//商品口味
      },
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success(res) {
        try{
          console.log(JSON.parse(res.data.Data));
          wx.requestPayment({
            timeStamp: JSON.parse(res.data.Data).timeStamp,
            nonceStr: JSON.parse(res.data.Data).nonceStr,
            package: JSON.parse(res.data.Data).package,
            signType: 'MD5',
            paySign: JSON.parse(res.data.Data).paySign,
            success(res) {//支付成功
              //消除优惠券
              wx.removeStorageSync("couponsName");
              wx.removeStorageSync("couponPrice");
              //展示支付成功的界面
              _this.setData({
                testFloat1: false
              })
            },
            fail(res) { console.log(res) }
          })
        }catch(e){

        }
        
        _this.setData({ loading: false });
      }
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})