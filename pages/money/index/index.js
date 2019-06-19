// pages/money/index/index.js
const util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    isIphoneX: app.data.isIphoneX,
    getMoney:0.00,
  },
  onLoad:function(){
    //获取可以 提现的金额 
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/dester/v1/getsettlementcenter',
      data: {
        userid: wx.getStorageSync("userid"),
        usertype: wx.getStorageSync("usertype"),//角色类型 2为经销商 3为店长 4为分销员
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {

        if (res.data.Success) {
          _this.setData({
            getMoney: parseFloat(res.data.Data.cashmonys||0.00).toFixed(2)
          })
        } else {

        }
      }
    })
  }
})