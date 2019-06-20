// pages/money/withdraw/withdraw.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0,//提现金额
    getMoney: 0,//可提现金额
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
        usertype: wx.getStorageSync("usertype"),//角色类型 2为经销商 3为店长 4为分销员
        Cashmonys:this.data.money
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {

        if (res.data.Success) {
          _this.setData({
            money: 0,//提现金额
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