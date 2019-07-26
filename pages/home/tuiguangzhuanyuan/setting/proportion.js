// pages/home/dianzhang/proportion/proportion.js
const util = require('../../../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCard1: false,
    isCard2:false,
    id:0,
    shopid:0,
    distributor: "",
    shopowner: "",
    salaperson: "",
  },
  isCard1(e) {
    this.setData({
      isCard1: e.detail.value
    })
  },
  isCard2(e) {
    this.setData({
      isCard2: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// /api/user/v1/addsetpercents
      this.setData({
        shopid: options.id,
      })
    let _this = this;
    //获取推广专员权限
    util.request(app.data.hostAjax + '/api/user/v1/getmodifypermissions', {
      ids: this.data.shopid,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          salaperson: res.Data.percents,
          isCard1: res.Data.sendgoods =="1"?true:false,
          isCard2: res.Data.posaudi == "1" ? true : false,
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  submit: function () {
    if (this.data.posaudi=="") {
      wx.showToast({
        title: "请填写佣金比例",
        icon: "none",
        duration: 2000
      })
      return
    }
    let _this = this;
    //修改推广专员权限
    util.request(app.data.hostAjax + '/api/user/v1/updatemodifypermissions', {
      ids: this.data.shopid,
      percents: this.data.salaperson,
      sendgoods: this.data.isCard1 ? 1 : 0,
      posaudi: this.data.isCard2?1:0,
    }).then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: '设置成功'
        })
        wx.navigateBack({
          delta:1
        })
      } else {
        wx.showToast({
          title:res.Msg,
          icon:"none"
        })
      }
    });
  },
  salaperson(e) {
    this.setData({
      salaperson: e.detail.value
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