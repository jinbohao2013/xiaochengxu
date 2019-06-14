// pages/money/withdraw/cardlist/list.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doRequeset:true,//控制所有的数据请求不能连点
    ifCode:true,//走每一步都要短息验证--默认是true--需要
    show: false,//判断显示--短信验证的弹框
    show1: false,//判断显示--删除和设置默认的弹框
    show2: false,//判断显示--删除和设置默认的弹框
    timeCode:"获取验证码",//点击获取验证码的功能
    time:60,
    hideTel: "15836859549".substr(0, 3) + '****' + "15836859549".substr(7),//隐藏中间几位的手机号
    tel:"",//输入的手机号
    actions: [
      { name: '设置默认账户' },
      { name: '使用银行卡' },
      { name: '修改银行卡' },
      { name: '删除银行卡' }
    ],
    actions1: [
      { name: '设置默认账户' },
      { name: '删除微信钱包' }
    ],
  },
  changeAccount1(e){//银行卡
    console.log(e)
    if (e.currentTarget.id=="银行卡"){
      wx.showToast({
        title: '暂不支持提现至银行卡功能',
        icon:"none"
      })
      return 
    }
    if (this.data.ifCode){//如果没有短信验证--进入短信验证弹框
      this.setData({ show: !this.data.show });
      return false;
    }
    this.setData({ show1: !this.data.show1 });
  },
  toggleActionSheet1(e) {//银行卡
    console.log(e)
    try{
      if (e.detail.name == "设置默认账户") {

      } else if (e.detail.name == "使用银行卡") {

      } else if (e.detail.name == "修改银行卡") {

      } else if (e.detail.name == "删除银行卡") {

      }
    }catch(e){

    }
    
    this.setData({ show1: !this.data.show1 });
  },
  onClose() {
    this.setData({ show: !this.data.show });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  cancel() {
    console.log("取消")
  },
  confirm(){
    console.log("确认")

  },
  
  catchCode: function () {
    console.log("获取验证码")
    let _this = this;

    if (_this.data.time == 60&&this.data.doRequeset) {
      this.setData({
        doRequeset:false
      })
      _this.setData({
        interval: setInterval(function () {
          _this.setTime();
        }, 1000)
      })
      return;
      wx.request({//获取短信验证--金币支付

        url: app.data.hostAjax + "/api/user/v1/sms",
        data: {
          type: 3,
          account: wx.getStorageSync("phone")
        },
        method: "post",
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        success(res) {
          _this.setData({
            time: _this.data.time - 1,
            doRequeset: true
          })
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 2000
          })
          if (res.data.Code == 0) {

            _this.setData({
              interval: setInterval(function () {
                _this.setTime();
              }, 1000)
            })

          } else {
            clearInterval(_this.data.interval);
            _this.setData({
              time: 60
            })

          }
        }
      })
    }




  },
  setTime: function () {
    let _this = this;
    if (this.data.time == 60) {//倒计时开始
      this.setData({
        time: this.data.time - 1
      })
    } else if (this.data.time == 0) {//倒计时结束
      clearInterval(_this.data.interval);
      this.setData({
        time: 60
      })
    } else {
      this.setData({
        time: this.data.time - 1
      })
    }
  },
  skipe(e){
    if (e.currentTarget.dataset.index){
      this.setData({
        tel: this.data.tel + e.currentTarget.dataset.index
      })
    }else{//删除一位
      this.setData({
        tel:this.data.tel.substr(0,this.data.tel.length-1)
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})