// pages/person/person.js
var app= getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    userInfo:null,
    main1Date1: '2018-12-25',
    main1Date2: '2018-12-25',
    picker: ['支付笔数', '支付人数', '支付数量', '提现金额'],
    index:0,
  },
  onLoad: function (options) {
    let _this=this;
    util.request(app.data.hostAjax + '/api/user/v1/info', {
      user_id: wx.getStorageSync("userIdBuyGood"),
      curr_id: wx.getStorageSync("userIdBuyGood"), }).then(function (res) {
      if (res.Code == "200") {
        var a = (res.Data.createdAt.split("Date(")[1].split(")")[0])
        _this.setData({
          time: app.dateFmt(parseInt(a))
        });
        
        console.log(app.dateFmt(parseInt(a)))
      }

    })
  },
  onShow: function () {
    
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
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
})