// pages/home/dianzhang/proportion/proportion.js
const util = require('../../../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    shopid:0,
    distributor: "",
    shopowner: "",
    salaperson: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// /api/user/v1/addsetpercents
      this.setData({
        shopid: options.shopid,
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  submit: function () {
    if (parseFloat(this.data.shopowner) + parseFloat(this.data.salaperson) + parseFloat(this.data.distributor) != 100) {
      wx.showToast({
        title: "经销员+店长+经销商的比例之和必须等于100%",
        icon: "none",
        duration: 4000
      })
      return
    }
    let _this = this;
    //分销商给店长设置
    util.request(app.data.hostAjax + '/api/user/v1/addsetpercents', {
      userid: wx.getStorageSync("userid"), 
      shopid: this.data.shopid,
      distributor: this.data.distributor,
      shopowner: this.data.shopowner,
      salaperson: this.data.salaperson,
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
  distributor(e){
    //e.detail.value
    this.setData({
      distributor: e.detail.value
    })
  },
  shopowner(e) {
    this.setData({
      shopowner: e.detail.value
    })
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