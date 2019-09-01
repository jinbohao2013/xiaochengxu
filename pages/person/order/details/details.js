const app = getApp();
var util = require('../../../../utils/util.js');
Page({
  data: {
    e:null,
    orderId: 0,
    goodsList: [],
    orderDetail:null,
    yunPrice: "0.00",
    appid: "",
    ifshow:false,//退款框
    ifshow1: false,//换货
    textareaAValue:"",//退款str
    textareaAValue1: "",//换货理由
    shipnumber:"",
    shipname: "",
    modalshow: false,//优惠券的弹框-可以领取--当有优惠券的时候提示--分享人进来的时候判断是否分享成功
  },
  onLoad: function (e) {
    var orderId = e.id;
    this.data.orderId = orderId;
    this.setData({
      e:e,
      orderId: orderId
    });
    // 用户订单详情
    let that = this;
    util.request(app.data.hostAjax + '/api/transaction/v1/orderinfo', { 
      userid: wx.getStorageSync("userIdBuyGood") ,
      orderid: orderId,
      }).then(function (res) {
      if (res.Code == "200") {
        that.setData({
          orderDetail: res.Data
        })
      } else {
        that.setData({
          orderDetail: []
        })
        wx.showToast({
          title: '网络错误，情稍后重试！',
          icon:"none"
        })
      }
    });
  },
  onShow: function () {
  },
  hideModalcoupon(){
    this.setData({
      modalshow: !this.data.modalshow
    })
  },
  getgoods() {
    // 确认收货
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定',
      success(res) {
        if (res.confirm) {
          util.request(app.data.hostAjax + '/api/transaction/v1/addbuyerreceiving', {
            userid: wx.getStorageSync("userIdBuyGood"),
            ordernumber: that.data.orderDetail.ordernumber,
          }).then(function (res) {
            if (res.Code == "200") {
              wx.showToast({
                title: '收货成功'
              })
              that.onLoad(that.data.e)
              util.request(app.data.hostAjax + '/api/user/v1/wxloginopenid', {//判断是否有未读优惠券
                openid: wx.getStorageSync("openid"),
              }).then(function (res) {
                if (res.Code == "200" && parseInt(res.Data.isticket) == 0) {
                  //弹出优惠券的框
                  console.log("弹出优惠券的框");
                  that.setData({
                    modalshow: true
                  })
                }
              });
              
            } else {
              wx.showToast({
                title: '网络错误，情稍后重试！',
                icon: "none"
              })
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  huanhuo(e) {
    this.setData({
      ifshow1: !this.data.ifshow1
    })
  },
  hideModal(e) {
    this.setData({
      ifshow: !this.data.ifshow
    })
  },
  hideModal1(e) {
    let _this = this;
    if (this.data.textareaAValue==""){
      wx.showToast({
        title: '请填写退款原因',
        icon: "none"
      })
      return
    }
    _this.setData({
      ifshow: false
    })
    util.request(app.data.hostAjax + '/api/transaction/v1/addreturnmoneys', {//退款申请
      userid: wx.getStorageSync("userIdBuyGood"),
      ordernumber: e.currentTarget.dataset.id,
      reason:this.data.textareaAValue,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.onLoad(_this.data.e)
        wx.showToast({
          title: '提交成功'
        })
      } else {
        
        wx.showToast({
          title: res.Msg,
          icon: "none"
        })
      }
    });
  },
  huanhuo1(e) {//换货-确认
    let _this = this;
    util.request(app.data.hostAjax + '/api/transaction/v1/addreturngoods', {
      userid: wx.getStorageSync("userIdBuyGood"),
      ordernumber: e.currentTarget.dataset.id,
      reason: this.data.textareaAValue,
      imgurl: ""
    }).then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: '提交成功',
          icon: "none"
        })
        _this.setData({
          ifshow: false
        })
      } else {

        wx.showToast({
          title: res.Msg,
          icon: "none"
        })
      }
    });
  },
  shipname(e) {
    this.setData({
      shipname: e.detail.value
    })
  },
  shipnumber(e) {
    this.setData({
      shipnumber: e.detail.value
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  textareaAInput1(e) {
    this.setData({
      textareaAValue1: e.detail.value
    })
  }
})