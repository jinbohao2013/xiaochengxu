var util = require('../../../../utils/util.js');
var app = getApp();
var dataListX = [], dataListY = [];
var Chart = null;
Page({
  data: {
    userInfo: null,
    main1Date1: '',
    main1Date2: '',
    main1Date2GO: "",
    picker: ['支付笔数', '支付人数', '支付金额'],
    index: 0,
    ajaxMain1: null,////数据概览
    ajaxMain2: null,////详细概览
    ec: {
      lazyLoad: true // 延迟加载
    },
  },
  onLoadTow() {
    let _this = this;
    util.request(app.data.hostAjax + '/api/admin/v1/getadminpayinfo', {//数据统计
      userid: wx.getStorageSync("userid"),
      starttime: this.data.main1Date1,
      endtime: this.data.main1Date2,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxMain1: res.Data
        });
      }
    })
  },
  onLoad: function (options) {
    let _this = this;
    util.request(app.data.hostAjax + '/api/admin/v1/getadminpayinfo', {//数据统计
      userid: wx.getStorageSync("userid"),
      starttime: this.data.main1Date1,
      endtime: this.data.main1Date2,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxMain1: res.Data
        });
      }
    })
  },
  DateChange1(e) {
    this.setData({
      main1Date1: e.detail.value
    })
  },
  DateChange2(e) {
    this.setData({
      main1Date2: e.detail.value
    })
  }
})