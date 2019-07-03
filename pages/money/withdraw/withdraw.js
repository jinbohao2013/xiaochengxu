// pages/money/withdraw/withdraw.js
var app=getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: "",//提现金额
    getMoney: 0,//可提现金额
    ajaxcard:null,//默认是微信，选择了银行卡优先
    cardlist:[],
  },
  setmoney(e){
    this.setData({
      money:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取可以 提现的金额 
    let _this=this;
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
              getMoney: res.data.Data.cashmonys||0
            })
        } else {

        }
      }
    })
  },
  submit(){
    //申请提现
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/transaction/v1/addapplicationcash',
      data: {
        userid: wx.getStorageSync("userid"),
        cashtype: this.data.cardlist.length==0?2:1,//提现类型 1为银行卡 2为钱包
        Cashmonys:this.data.money,
        cardid: this.data.cardlist.length == 0 ? undefined : wx.getStorageSync("userbankid")
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {

        if (res.data.Success) {
          _this.setData({
            money: "",//提现金额
            getMoney: 0,//可提现金额
          })
          _this.onLoad();
          wx.showToast({
            title: "提交成功",
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.Msg,
            icon:'none'
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
    let _this=this;
    //先判断选择使用的微信
    if (wx.getStorageSync("useweixin")){
      _this.setData({
        cardlist: []
      })
      return
    }
    //先查询选择的银行卡
    //每次进来都查询默认的账户-银行卡
    util.request(app.data.hostAjax + '/api/my/v1/selectuserbank', {
      user_id: wx.getStorageSync("userid"),
      id: wx.getStorageSync("userbankid")||0,//userbankid
      state: wx.getStorageSync("userbankid")?undefined:2
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          cardlist:res.Data.list
        })
        wx.setStorageSync("userbankid", res.Data.list[0].id)
      }
    });
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
  skipToAccount(){
    wx.navigateTo({
      url: 'cardlist/list',
    })
  },
  getAllMoney(){
    this.setData({
      money:this.data.getMoney
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})