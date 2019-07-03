var util = require('../../../utils/util.js');
const app = getApp()
// const WXAPI = require('../../wxapi/main')
Page({
  data: {
    statusType: ["全部", "待付款", "待发货", "待收货", "已完成", "退换货"],
    hasRefund: false,
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    orderList: [],
    pageindex:1,
   ajaxpageindex: 0,
    pagesize:20,
    hideLoading: true,//隐藏底部加载
    loading:true,
    searchtxt:"",
    hasOnShow: false
  },
  statusTap: function (e) {
    const curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    if (curType==0){
      this.setData({
        searchType: 100
      });
    }else{
      this.setData({
        searchType: parseInt(curType)-1
      });
    }
    this.setData({
      orderList: [],
      pageindex: 1,
      ajaxpageindex: 0,
      hideLoading: true,//隐藏底部加载
      loading: true,
      currentType: curType
    });
   
    this.onShow();
  },
  cancelOrderTap: function (e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          util.request(app.data.hostAjax + '/api/transaction/v1/deleteorderinfo',{
            user_id: wx.getStorageSync("userIdBuyGood"),
            orderid: orderId
            }).then(function (res) {
            if (res.Code == "200") {
              that.onShow();
            }
          })
        }
      }
    })
  },
  refundApply(e) {
    // 申请售后
    const orderId = e.currentTarget.dataset.id;
    const amount = e.currentTarget.dataset.amount;
    wx.navigateTo({
      url: "/pages/order/refundApply?id=" + orderId + "&amount=" + amount
    })
  },
  toPayTap: function (e) {
    const _this = this;
    const orderId = e.currentTarget.dataset.id;
    const total_fee = e.currentTarget.dataset.money;
    //调取提交订单接口--跳转到购物车结算页
    wx.navigateTo({
      url: '/pages/person/cart/carBuy/carBuy',
    })
  },
  _toPayTap: function (orderId, money) {
    return
    const _this = this
    if (money <= 0) {
      // 直接使用余额支付
      WXAPI.orderPay(orderId, wx.getStorageSync('token')).then(function (res) {
        _this.onShow();
      })
    } else {
      wxpay.wxpay('order', money, orderId, "/pages/order-list/index");
    }
  },
  scroll() {//滚动时触发

  },
  scrolltolower() {
    
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false

      })
      // setTimeout(function(){
      //   _this.setData({
      //     loading: true

      //   })
      // },1000)
      console.log("在我这里调取加载数据")
      if (!this.data.hideLoading) {
        return
      }
      this.setData({
        pageindex: this.data.pageindex + 1
      })
      this.onShow();
    }

  },
  onLoad: function (options) {
    this.setData({
      scroolHeight: app.data.windowHeight-40
    })
    if (options && options.type) {

      if (options.type == 100) {
        this.setData({
          hasRefund: false,
          currentType: options.type,
          searchType: parseInt(options.type)
        });
      } else {
        this.setData({
          hasRefund: false,
           currentType: options.type,
          searchType: parseInt(options.type)-1
        });
      }
    }else{
      this.setData({
        hasRefund: false,
        currentType: 0,
        searchType: 100
      });
    }
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  getOrder: function (pagesize) {
    // 获取订单列表
    var that = this;
    util.request(app.data.hostAjax + '/api/transaction/v1/curstormorderlist', {//用户订单列表
      userid: wx.getStorageSync("userIdBuyGood"),
      ordertype: this.data.searchType,
      pagesize: pagesize,
      pageindex: 1,
      searchtxt: this.data.searchtxt
    }).then(function (res) {
      console.log()
      if (res.Code == "200") {
        that.setData({
          orderList: res.Data.list,
          loading: true,
          ajaxpageindex: that.data.pageindex
        });
        if (res.Data.list.length < 10) {
          that.setData({
            hideLoading: false
          })
        }
      } else {
        that.setData({
          hideLoading: false
        })
      }
    });
  },
  onShow: function () {
    // 获取订单列表
    var that = this;
    util.request(app.data.hostAjax + '/api/transaction/v1/curstormorderlist',{//用户订单列表
      userid: wx.getStorageSync("userIdBuyGood"),
      ordertype:this.data.searchType,
      pagesize: this.data.pagesize,
      pageindex: this.data.pageindex,
      searchtxt: this.data.searchtxt
    }).then(function (res) {
      console.log()
      if (res.Code == "200") {
        var arr = that.data.orderList.concat(res.Data.list);
        console.log("that.data.pageindex=", that.data.pageindex )
        console.log(that.data.pageindex == that.data.ajaxpageindex)
        if (that.data.pageindex == that.data.ajaxpageindex) {
          that.getOrder(that.data.orderList.length)
          return;
        }
        that.setData({
          orderList: arr,
          loading: true,
          ajaxpageindex: that.data.pageindex
        });
        if (res.Data.list.length < 10) {
          that.setData({
            hideLoading: false
          })
        }
      } else {
        that.setData({
          hideLoading: false
        })
      }
    });
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  }
})