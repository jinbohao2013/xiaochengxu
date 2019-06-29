
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
    let that=this;
    //获取订单列表ajaxData
    util.request(app.data.hostAjax + '/api/transaction/v1/curstormorderlist', {//用户订单列表
      userid: wx.getStorageSync("userIdBuyGood"),
      ordertype: 0,
    }).then(function (res) {
      console.log(res.Data.list)
      if (res.Code == "200") {
        that.setData({
          ajaxData: res.Data.list,
        });
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
          wx.showToast({
            title: '请选择收货地址',
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddress()
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
  onClickButton() {//提交订单--吊起支付
    let _this = this;
    this.setData({ loading: true });
     
                //调取提交订单接口
                wx.request({
                  url: app.data.hostAjax + '/api/transaction/v1/orderpayinfo',
                  data: {
                    userid: wx.getStorageSync("userIdBuyGood"),
                    orderid: _this.data.ajaxData[0].id,
                    total_fee: _this.data.ajaxData[0].sumprice,
                    addressid: _this.data.checked == 2 ? _this.data.addressid:0,//收货地址id 自提传0
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