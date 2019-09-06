var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    searchText:"",
    paginationIndex: 1,//分页
    maxLength: 1,//分页
    pagesize: 10,
  },
  onLoad: function (options, isSearch) {
    this.setData({ options: options, main1Date1: options.main1Date1, main1Date2: options.main1Date2})
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
    this.getData(url,isSearch); //获取数据
  },
  onShow: function () {

  },
  doSearh(){
    this.onLoad(this.data.options,true)
  },
  getData(url, isSearch){
    let _this = this;
    util.request(app.data.hostAjax + url, {
      userid: wx.getStorageSync("userid"),
      search: this.data.searchText,
      starttime: this.data.main1Date1,
      endtime: this.data.main1Date2,
      pageindex: 1,
      pagesize:11111,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxMain1: res.Data,
          maxLength: Math.ceil(parseInt(res.Data.record) / _this.data.pagesize)
        });
      }else{
        _this.setData({
          ajaxMain1: null
        });
        if (isSearch){
          wx.showToast({
            title: '没有您查询的数据',
            icon:"none"
          })
        }
      }
    })
  },
  // 输入框
  changeInput: function (e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  clickpagin: function (e) {
    this.setData({
      paginationIndex: parseInt(e.currentTarget.dataset.id)
    })
  },
  addpagin: function (e) {
    let _this = this;
    this.setData({
      paginationIndex: parseInt(_this.data.paginationIndex + 1) >= _this.data.maxLength ? _this.data.maxLength : (_this.data.paginationIndex + 1)
    })
  },
  delpagin: function (e) {
    let _this = this;
    this.setData({
      paginationIndex: (_this.data.paginationIndex - 1) <= 0 ? 1 : (_this.data.paginationIndex - 1)
    })
  },
})