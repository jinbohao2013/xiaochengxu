var util = require('../../../../utils/util.js');
const app = getApp()
// const WXAPI = require('../../wxapi/main')
Page({
  data: {
    usertype: 0,
    ismaiduan: 0,
    data:{},
    hasRefund: false,
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    orderList: [],
    pageindex:1,
   ajaxpageindex: 0,
    pagesize:50,
    hideLoading: true,//隐藏底部加载
    loading:true,
    searchtxt:"",
  },
  
  shipname(e) {
    this.data.data["shipname" + e.currentTarget.dataset.id]=e.detail.value;
    this.setData({
      data: this.data.data
    })
    console.log(this.data.data)
  },
  shipnumber(e) {
    this.data.data["shipnumber" + e.currentTarget.dataset.id] = e.detail.value;
    this.setData({
      data: this.data.data
    })
    console.log(this.data.data)
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
      usertype: wx.getStorageSync("usertype") ,
      ismaiduan: wx.getStorageSync("isoverpay") == 1 ? 1 : 0,
      scroolHeight: app.data.windowHeight-40
    })
    
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  
  searchText(e) {
    this.setData({
      searchtxt: e.detail.value
    })
  },
  onShow: function () {
    // 经销商分销商列表
    var that = this;
    util.request(app.data.hostAjax + '/api/prom/v1/getpromdistributorlist', {//经销商分销商列表
      userid: wx.getStorageSync("userid"),
      pagesize: this.data.pagesize,
      pageindex: this.data.pageindex
    }).then(function (res) {
      if (res.Code == "200") {
        for (var i=0;i<res.Data.list.length;i++){
          
          that.data.orderList.push(res.Data.list[i])
        }
        var arr = that.data.orderList;
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
        if (res.Data.list.length < 50) {
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
  getOrder: function (pagesize) {
    var that = this;
    util.request(app.data.hostAjax + '/api/prom/v1/getpromdistributorlist', {
      userid: wx.getStorageSync("userid"),
      pagesize: pagesize,
      pageindex: 1
    }).then(function (res) {
      console.log()
      if (res.Code == "200") {
        that.setData({
          orderList: res.Data.list,
          loading: true,
          ajaxpageindex: that.data.pageindex
        });
        if (res.Data.list.length < 50) {
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