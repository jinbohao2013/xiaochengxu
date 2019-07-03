const app = getApp();
var util = require('../../../../utils/util.js');
Page({
  data: {
    usertype: 0,
    ismaiduan:  0,
    orderId: 0,
    goodsList: [],
    orderDetail:null,
    yunPrice: "0.00",
    appid: "",
    ifshow: false,//退款框--审批
    textareaAValue:"",//同意和驳回的原因
  },
  onLoad: function (e) {
    this.setData({
      e:e,
      usertype: wx.getStorageSync("usertype"),
      ismaiduan: wx.getStorageSync("isoverpay") == 1 ? 1 : 0
    })
    var orderId = e.id;
    this.data.orderId = orderId;
    this.setData({
      orderId: orderId
    });
    // 用户订单详情
    let that = this;
    util.request(app.data.hostAjax + '/api/transaction/v1/backorderinfo', { 
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
    var that = this;
    return
    that.setData({
      orderDetail: {
        orderInfo:{
          status:3,
          amount:888,
          amountLogistics:0.00,
          amountReal:"888"
        },
        statusStr:"请马上支付状态",
        logistics:{
          trackingNumber:13132464564,
          linkMan:"快递员",
          mobile:141654131,
          provinceStr:"河南省",
          cityStr:"郑州市",
          address:"地址家律师代快乐就好看了看"
        },
        
        goods:[{
          goodsName:"商品1",
          amount:122,
          property:"property",
          number:2,

        }],
      }
    });
    
    WXAPI.orderDetail(that.data.orderId, wx.getStorageSync('token')).then(function (res) {
      if (res.code != 0) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return;
      }
      that.setData({
        orderDetail: res.data
      });
    })
    var yunPrice = parseFloat(this.data.yunPrice);
    var allprice = 0;
    var goodsList = this.data.goodsList;
    for (var i = 0; i < goodsList.length; i++) {
      allprice += parseFloat(goodsList[0].price) * goodsList[0].number;
    }
    this.setData({
      allGoodsPrice: allprice,
      yunPrice: yunPrice
    });
  },
  hideModal(e) {
    this.setData({
      ifshow: !this.data.ifshow
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  hideModal1(e) {
    let _this = this;
    if (this.data.textareaAValue == "" && e.currentTarget.dataset.states=="2") {
      wx.showToast({
        title: '请填写驳回理由',
        icon: "none"
      })
    }
    util.request(app.data.hostAjax + '/api/transaction/v1/updatereturngoodsstates', {//退款申请---审批
      userid: wx.getStorageSync("userIdBuyGood"),
      ordernumber: e.currentTarget.dataset.id,
      remark: this.data.textareaAValue,
      states: e.currentTarget.dataset.states
    }).then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: '操作成功',
          icon: "none"
        })
        _this.onLoad(_this.data.e)
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
  tuihuo(){
    
  },
  confirmBtnTap: function (e) {
    let that = this;
    let orderId = this.data.orderId;
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    wx.showModal({
      title: '确认您已收到商品？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          WXAPI.orderDelivery(orderId, wx.getStorageSync('token')).then(function (res) {
            if (res.code == 0) {
              that.onShow();
              // 模板消息，提醒用户进行评价
              let postJsonString = {};
              postJsonString.keyword1 = { value: that.data.orderDetail.orderInfo.orderNumber, color: '#173177' }
              let keywords2 = '您已确认收货，期待您的再次光临！';
              if (app.globalData.order_reputation_score) {
                keywords2 += '立即好评，系统赠送您' + app.globalData.order_reputation_score + '积分奖励。';
              }
              postJsonString.keyword2 = { value: keywords2, color: '#173177' }
              WXAPI.sendTempleMsg({
                module: 'immediately',
                postJsonString: JSON.stringify(postJsonString),
                template_id: 'uJL7D8ZWZfO29Blfq34YbuKitusY6QXxJHMuhQm_lco',
                type: 0,
                token: wx.getStorageSync('token'),
                url: '/pages/order-details/index?id=' + orderId
              })
            }
          })
        }
      }
    })
  },
  submitReputation: function (e) {
    let that = this;
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    let postJsonString = {};
    postJsonString.token = wx.getStorageSync('token');
    postJsonString.orderId = this.data.orderId;
    let reputations = [];
    let i = 0;
    while (e.detail.value["orderGoodsId" + i]) {
      let orderGoodsId = e.detail.value["orderGoodsId" + i];
      let goodReputation = e.detail.value["goodReputation" + i];
      let goodReputationRemark = e.detail.value["goodReputationRemark" + i];

      let reputations_json = {};
      reputations_json.id = orderGoodsId;
      reputations_json.reputation = goodReputation;
      reputations_json.remark = goodReputationRemark;

      reputations.push(reputations_json);
      i++;
    }
    postJsonString.reputations = reputations;
    WXAPI.orderReputation({
      postJsonString: JSON.stringify(postJsonString)
    }).then(function (res) {
      if (res.code == 0) {
        that.onShow();
        // 模板消息，通知用户已评价
        let postJsonString = {};
        postJsonString.keyword1 = { value: that.data.orderDetail.orderInfo.orderNumber, color: '#173177' }
        let keywords2 = '感谢您的评价，期待您的再次光临！';
        if (app.globalData.order_reputation_score) {
          keywords2 += app.globalData.order_reputation_score + '积分奖励已发放至您的账户。';
        }
        postJsonString.keyword2 = { value: keywords2, color: '#173177' }
        WXAPI.sendTempleMsg({
          module: 'immediately',
          postJsonString: JSON.stringify(postJsonString),
          template_id: 'uJL7D8ZWZfO29Blfq34YbuKitusY6QXxJHMuhQm_lco',
          type: 0,
          token: wx.getStorageSync('token'),
          url: '/pages/order-details/index?id=' + that.data.orderId
        })
      }
    })
  }
})