// pages/money/index/index.js
const util = require('../../../utils/util.js');
import Toast from '../../../dist/toast/toast';
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
  },
  changeIndex(e) {
    console.log(e)
    this.setData({
      acticeInxex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.reLaunch({//重定向到登录页面
    //   url: '/pages/index/index'
    // })
    console.log(app.data.windowHeight)
    this.setData({
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight - 59 - 68 : app.data.windowHeight //- 59 - 51
    })
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/dester/v1/getapplicationcashinfo', // 提现记录
      data: {
        userid: wx.getStorageSync("userid"),
        pageindex: this.data.pageindex,
        pagesize: this.data.pagesize,
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        _this.setData({
          loading: true
        })
        if (res.data.Success) {
          console.log(res.data);
          let arr = _this.data.ajaxData;
          try {
            if (res.data.Data.list) {
              arr = arr.concat(res.data.Data.list)
            }

          } catch (e) {
            console.log("出错了");
          }

          _this.setData({
            ajaxData: arr
          })
          if (res.data.Data.list.length < 10) {
            _this.setData({
              hideLoading: false
            })
          }
          console.log("111111111111111111111", _this.data.hideLoading)
        } else {
          _this.setData({
            hideLoading: false
          })
        }
      }
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
  onChange(event) {
    console.warn(`change: ${event.detail}`);
    this.setData({
      value1: event.detail
    })
  },
  onSearch(e) {
    this.setData({
      ajaxData: [],
      hideLoading: true,
      goodsValue: e.detail
    })
    this.onLoad();
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
      
      console.log("在我这里调取加载数据")
      if (!this.data.hideLoading) {
        return
      }
      this.setData({
        pageindex: this.data.pageindex + 1
      })
      this.onLoad();
    }

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