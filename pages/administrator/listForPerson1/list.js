var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    searchText:"",
  },
  onLoad: function (options) {
    this.setData({ options: options })
    var url = "/api/admin/v1/getdistributorlist";//经销商列表
    if (options.type == "1") {
      wx.setNavigationBarTitle({ title: '经销商列表' })
      this.setData({ chartNameTypeControl: "经销商列表" });
    } else if (options.type == "2") {
      wx.setNavigationBarTitle({ title: '推广专员列表' }); url = "/api/admin/v1/getpromdistributorlist"; 
      this.setData({ chartNameTypeControl: "推广专员列表" });
    } else if (options.type == "3") {
      wx.setNavigationBarTitle({ title: '店长列表' }); url = "/api/admin/v1/getadminshoplist"; 
      this.setData({ chartNameTypeControl: "店长列表" });
    } else if (options.type == "4") { wx.setNavigationBarTitle({ title: '分销员列表' }); url = "/api/admin/v1/getadminsalapersonlist"; this.setData({ chartNameTypeControl: "分销员列表" });}
    this.getData(url); //获取数据
  },
  onShow: function () {

  },
  doSearh(){
    this.onLoad(this.data.options)
  },
  getData(url){
    let _this = this;
    util.request(app.data.hostAjax + url, {
      userid: wx.getStorageSync("userid"),
      search: this.data.searchText,
      pageindex: 1,
      pagesize:11111,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxMain1: res.Data
        });
      }
    })
  },
  // 输入框
  changeInput: function (e) {
    this.setData({
      searchText: e.detail.value
    })
  }
})