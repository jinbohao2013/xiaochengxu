// pages/money/index/index.js
const util = require('../../utils/util.js');
import Toast from '../../dist/toast/toast';
var app = getApp();
Page({
  skipNextPage(e) {
    //点击图片跳转到详情
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    true: true,
    ajaxData: [],
    isIphoneX: app.data.isIphoneX,
    scroolHeight: 200,
    loading: true,
    hideLoading: true,//隐藏底部加载
    hideBotom: true,//隐藏底部导航
    show: false,
    pageindex: 1,
    pagesize: 10,//每页的商品数量
    tab_bur:["teb1","teb2"]
  },
  changeIndex(e) {
    console.log(e)
    this.setData({
      acticeInxex: e.currentTarget.dataset.index
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    util.request(app.data.hostAjax + '/api/user/v1/getshopownerauditlist', {
      userid: wx.getStorageSync("userid"),
      pageindex: this.data.pageindex,
      pagesize: 30,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxData: res.Data.list
        })
      } else {
        _this.setData({
          ajaxData: []
        })
      }
    });
  },
  noagree(e){
    let _this = this;
    util.request(app.data.hostAjax + '/api/user/v1/updateapplicationlist', {
      ids: e.currentTarget.dataset.id,
      auditype: 3,
      states: 0,
    }).then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: '已拒绝',
          icon: "none"
        })
        _this.onLoad();
      } else {
        
      }
    });
  },
  agree(e) {
    let _this = this;
    util.request(app.data.hostAjax + '/api/user/v1/updateapplicationlist', {
      ids: e.currentTarget.dataset.id,
      auditype: 3,
      states: 1,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.onLoad();
        wx.showToast({
          title: '已通过'
        })
      } else {
        
      }
    });
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading()
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
  onCancel() {//取消搜索搜索时触发

  },
  scroll() {//滚动时触发

  },
  onClose() {
    this.setData({ show: !this.data.show });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})