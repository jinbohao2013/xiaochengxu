
var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    addressList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getAddress();
  },
  getAddress() {
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/my/v1/selectreceivingaddress',
      data: {
        user_id: wx.getStorageSync("userIdBuyGood")
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        if (res.data.Data.list.length) {
          _this.setData({
            addressList: res.data.Data.list
          })
        } else {
          _this.setData({
            addressList: ""
          })
          wx.showToast({
            title: '请添加收货地址',
            icon: 'none'
          })
        }
      }
    })
  },
  onShow: function () {
    // 页面显示
    this.getAddress();
  },
  getAddressList (){
    let that = this;
    util.request(api.AddressList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          addressList: res.data
        });
      }
    });
  },
  addressAddOrUpdate1 (event) {
    console.log(event)
    wx.navigateTo({
      url: '../addressAdd/addressAdd?id=' + event.currentTarget.dataset.userbankid
    })
  },
  addressAddOrUpdate(event) {
    console.log(event)
    wx.setStorageSync("addressid", event.currentTarget.dataset.addressId)
    wx.navigateBack({
      delta: 1
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})