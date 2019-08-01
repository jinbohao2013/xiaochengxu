
const util = require('../../../../utils/util.js');
import Toast from '../../../../dist/toast/toast';
import drawQrcode from '../../../../utils/weapp.qrcode.esm.js'
var app = getApp();
Page({
  returnGoodsList() {
    wx.reLaunch({
      url: '/pages/goods/index/index?'
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    consultant: true,
    windowHeight: null,//可用窗口的高度
    value1: 1,//购买数量
    ajaxData: [{
      id: "2471",
      title: "snow+",//标题
      desc: "",//描述
      img: "",
      price: "39.00",//单价
      num: 2,//数量
      taste: "甜甜的口味",//口味
      tasteId: 17,//口味id
      totle: 3900,//总金额
    }],
    isIphoneX: app.data.isIphoneX,
    loading: false,
    show: false,//支付结束弹框
    checked: 2,//
    address: null,//获取默认地址
    addressid:0,//
    saoma: false
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      checked: parseInt(e.detail.value)
    })
    console.log(this.data.checked)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.reLaunch({//重定向到登录页面
    //   url: '/pages/index/index'
    // })
    let _this = this;
    try {
      console.log(options.ajaxData)
      this.setData({
        ajaxData: JSON.parse(options.ajaxData)
      })
    } catch (e) {

    }

    this.setData({
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight - 59 - 68 : app.data.windowHeight - 59 - 51
    })
    this.getAddress();
    util.request(app.data.hostAjax + '/api/dester/v1/getmyadviser', { userid: wx.getStorageSync("userIdBuyGood") }).then(function (res) {
      if (res.Code == "200" && wx.getStorageSync("usertype") == 1) {//专属顾问，没有就不能自提--仅仅对普通用户限制
        _this.setData({
          consultant: true
        });
      } else if (wx.getStorageSync("usertype") != 1){
        _this.setData({
          consultant: true
        });
      }
    })
    let that=this;
    //获取确认订单信息
    util.request(app.data.hostAjax + '/api/transaction/v1/confirmationorder', {//获取确认订单信息
      user_id: wx.getStorageSync("userIdBuyGood"),
    }).then(function (res) {
      console.log(res)
      if (res.Code == "200") {
        that.setData({
          ajaxData: res.Data,
          totleprice: res.Data.sumprice,
        });
        wx.setStorageSync("couponid", res.Data.list[0].couponid)
        wx.setStorageSync("couponprice", res.Data.list[0].e_price)
        that.onShow()
      } else {
        that.setData({
          ajaxData: null,
          logisticsMap: {},
          goodsMap: {}
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getAddress() {
    let _this = this, ajaxData = {
      user_id: wx.getStorageSync("userIdBuyGood"),
      id: 0,//state为2时收货地址id传0查询默认地址
      state: 2
    };
    //获取默认地址，如果没有默认地址就
    if (wx.getStorageSync("addressid")) {
      ajaxData = {
        user_id: wx.getStorageSync("userIdBuyGood"),
        id: wx.getStorageSync("addressid")
      };
    }
    wx.request({
      url: app.data.hostAjax + '/api/my/v1/selectreceivingaddress',
      data: ajaxData,
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        if (res.data.Data.list.length) {
          _this.setData({
            address: res.data.Data.list[0],
            addressid: res.data.Data.list[0].id
          })
        } else {
          _this.setData({
            address: null
          })
          if (_this.data.checked == 2) {
            wx.showToast({
              title: '请选择收货地址',
              icon: 'none'
            })
            return
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    this.setData({
      ifchoose: wx.getStorageSync("couponid") ? true : false,
      couponprice: wx.getStorageSync("couponprice")
    })
    // 扫码进来只能自提
    if (wx.getStorageSync("saoma") && wx.getStorageSync("usertype") == 1){
      this.setData({
        checked: 1,
        saoma: true
      })
    }
    console.log(this.data.totleprice)
    if (wx.getStorageSync("couponprice")) {
      let price = this.data.totleprice  - this.data.couponprice
      this.setData({
        newprice: price.toFixed(2),
      })
    }else{
      this.setData({
        newprice: "",
      })
    }
    this.getAddress()
    wx.hideShareMenu({
      success: function () {
        console.log("禁止了分享按钮的现实！")
      }
    })
    util.request(app.data.hostAjax + '/api/my/v1/getmycoupon', {//我的券
      userid: wx.getStorageSync("userIdBuyGood"),
      types: 1
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          hascoupon: true
        })
      } else {
        _this.setData({
          hascoupon: false
        })
      }
    });
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
    wx.removeStorageSync('couponid');
    wx.removeStorageSync('couponprice');
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
  onClickButton() {//提交订单--吊起支付
    console.log("wx.getStorageSync(shopid)", wx.getStorageSync("shopid"))
    console.log("wx.getStorageSync(useridsaleman)", wx.getStorageSync("useridsaleman"))
    let _this = this;
    if (_this.data.checked == 2 && !_this.data.address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    this.setData({ loading: true });
     
                //调取提交订单接口
                wx.request({
                  url: app.data.hostAjax + '/api/transaction/v1/orderpayinfo',
                  data: {
                    userid: wx.getStorageSync("userIdBuyGood"),
                    orderid: _this.data.ajaxData.orderid,
                    total_fee: _this.data.newprice || _this.data.totleprice,//res.data.Data.sumprice,
                    addressid: _this.data.checked == 2 ? _this.data.address.id : 0,//收货地址id 自提传0
                    couponid: wx.getStorageSync("couponid") || 0
                  },
                  method: "get",
                  header: {
                    'content-type': 'application/json',
                  },
                  success(res) {
                    if (res.data.Success) {
                      try {
                        console.log(JSON.parse(res.data.Data));
                        wx.requestPayment({
                          timeStamp: JSON.parse(res.data.Data).timeStamp,
                          nonceStr: JSON.parse(res.data.Data).nonceStr,
                          package: JSON.parse(res.data.Data).package,
                          signType: 'MD5',
                          paySign: JSON.parse(res.data.Data).paySign,
                          success(res) {//支付成功
                            wx.removeStorageSync('couponid');
                            wx.removeStorageSync('couponprice');
                            //展示支付成功的界面
                            wx.redirectTo({
                              url: '/pages/person/order/order',
                            })
                            // _this.onClose();
                          },
                          fail(res) {
                            console.log(res)
                            if (res.errMsg == "requestPayment:fail cancel") {
                              wx.showToast({
                                title: "支付已取消",
                                icon: 'none'
                              })
                              wx.redirectTo({
                                url: '/pages/person/order/order',
                              })
                            }
                          }
                        })
                        _this.setData({ loading: false });
                      } catch (e) {
                        _this.setData({ loading: false });
                      }

                    } else {
                      wx.showToast({
                        title: res.data.Msg,
                        icon: 'none'
                      })
                    }
                  }
                })
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})