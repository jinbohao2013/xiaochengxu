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
  checkname(e) {
    let _this = this;
    this.setData({
      goodname: e.currentTarget.dataset.name,
      showSelect: !this.data.showSelect,
      goodsid: e.currentTarget.dataset.id
    })
    util.request(app.data.hostAjax + '/api/user/v1/getshopownerpercents', {
      userid: wx.getStorageSync("userid"),
      shopid: this.data.shopid,
      goodsid: e.currentTarget.dataset.id
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          distributor: parseFloat(res.Data.distributor) || "",
          shopowner: parseFloat(res.Data.shopowner) || "",
          salaperson: parseFloat(res.Data.salaperson) || "",
          isCard: res.Data.ispos == "POS" ? true : false
        })
        if (parseFloat(res.Data.distributor) && wx.getStorageSync("usertype") == 6) {
          _this.setData({
            hadsetting: true
          })
        }
      }
    });
  },
  changgoods() {
    this.setData({
      showSelect: !this.data.showSelect
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        shopid: wx.getStorageSync("shopid")
      })
    let _this = this;
    //获取所有商品的名字和id，名字展示页面，id选取第一个调取查询分成比列接口
    util.request(app.data.hostAjax + '/api/user/v1/getgoodslist', {
      pageindex: 1,
      pagesize: 111,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          goodsLists: res.Data.list,
          goodname: res.Data.list[0].goodsabbreviation,
          goodsid: res.Data.list[0].id
        })
        util.request(app.data.hostAjax + '/api/user/v1/getshopownerpercents', {
          userid: wx.getStorageSync("userid"),
          shopid: _this.data.shopid,
          goodsid: res.Data.list[0].id
        }).then(function (res) {
          if (res.Code == "200") {
            _this.setData({
              // distributor: parseFloat(res.Data.distributor) || "",
              shopowner: parseFloat(res.Data.shopowner) || "",
              salaperson: parseFloat(res.Data.salaperson) || ""
            })
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  submit: function () {
    if(parseFloat(this.data.shopowner) + parseFloat(this.data.salaperson)!=100){
      wx.showToast({
        title: "分销员+店长的比例之和必须等于100%",
        icon: "none",
        duration:4000
      })
      return
    }
    let _this = this;
    //买断店长给分销员设置
    util.request(app.data.hostAjax + '/api/user/v1/addsetpercents', {
      userid: wx.getStorageSync("userid"),
      shopid: wx.getStorageSync("shopid"),
      distributor: 0,
      shopowner: this.data.shopowner,
      salaperson: this.data.salaperson,
      goodsid: _this.data.goodsid
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
  shopowner(e) {
    this.setData({
      shopowner: e.detail.value
    })
  },
  salaperson(e) {
    this.setData({
      salaperson: e.detail.value
    })
    this.settingauto()
  },
  settingauto() {//自动计算三者的比例
    this.setData({
      shopowner: 100 - parseFloat(this.data.salaperson).toFixed(2)
    })
    console.log(this.data.shopowner)
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