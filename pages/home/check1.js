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
    ismaiduan:0,
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
    tab_bur: ["teb1", "teb2"],
    ifshow: false,
    textareaAValue: "",//同意和驳回的原因

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
    this.setData({
      ismaiduan: wx.getStorageSync("isoverpay")==1?1:0
    })
    let _this = this;
    util.request(app.data.hostAjax + '/api/user/v1/getsalespersonauditlist', {
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
  see(){
    wx.showToast({
      title: '暂时不支持查看',
      icon: "none"
    })
  },
  hideModal(e) {
    this.setData({
      ifshow: !this.data.ifshow
    })
    if (e.currentTarget.dataset.id) {
      this.setData({
        ids: e.currentTarget.dataset.id
      })
    }
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  noagree(e){
    let _this = this;
    if (this.data.textareaAValue == "") {
      wx.showToast({
        title: '请填写驳回理由',
        icon: "none"
      })
    }
    util.request(app.data.hostAjax + '/api/user/v1/updateapplicationlist', {
      ids: this.data.ids,
      auditype: 4,
      states: 0,
      reason: _this.data.textareaAValue
    }).then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: '已拒绝',
          icon: "none"
        })
        _this.setData({
          ifshow: false
        })
        _this.onLoad();
      } else {
        
      }
    });
  },
  agree(e) {
    let _this = this;
    wx.showModal({
      title: '',
      content: '是否确定同意',
      success(res) {
        if (res.confirm) {
          util.request(app.data.hostAjax + '/api/user/v1/updateapplicationlist', {
            ids: e.currentTarget.dataset.id,
            auditype: 4,
            states: 1,
          }).then(function (res) {
            if (res.Code == "200") {
              _this.onLoad();
              wx.showToast({
                title: '已通过'
              })
              //判断时候设置过比例--跳转设置页
              if (e.currentTarget.dataset.percentstates != "已设置" && _this.data.ismaiduan==1){
                wx.navigateTo({
                  url: '/pages/home/fenxiaoyuan/proportion/proportion',
                })
              }
              
            } else {

            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
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