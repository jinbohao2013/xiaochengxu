var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    searchText:"",
  },
  onLoad: function (options) {
    this.setData({options: options})
    wx.setNavigationBarTitle({
      title: '当前页面'
    })
  },
  onShow: function () {

  },
  // 输入框
  changeInput: function (e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  doSearh(){

  }
})