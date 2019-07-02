var util = require('../../../utils/util.js');
const app = getApp()
// const WXAPI = require('../../wxapi/main')
Page({
  data: {
    usertype: 0,
    ismaiduan: 0,
    data:{},
    statusType: ["全部", "待付款", "待发货", "已发货", "已完成", "退换货"],
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
  },
  statusTap: function (e) {
    const curType = e.currentTarget ? e.currentTarget.dataset.index : e;
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
              wx.showToast({
                title: '删除成功',
                icon: "none"
              })
            }else{
              wx.showToast({
                title: res.Msg,
                icon: "none"
              })
            }
          })
        }
      }
    })
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
  fahuo(e){
    var that = this;
    //调取发货
    if (this.data.data["shipname" + e.currentTarget.dataset.id]){

    }else{
      wx.showToast({
        title: '请填写快递公司',
        icon:"none"
      })
      return
    }
    if (this.data.data["shipnumber" + e.currentTarget.dataset.id]) {

    } else {
      wx.showToast({
        title: '请填写快递单号',
        icon: "none"
      })
      return
    }
    util.request(app.data.hostAjax + '/api/transaction/v1/adddelivergoods', {
      userid: wx.getStorageSync("userIdBuyGood"),
      ordernumber: e.currentTarget.dataset.ordernumber,
      shipnumber: this.data.data["shipnumber" + e.currentTarget.dataset.id],
      shipname: this.data.data["shipname" + e.currentTarget.dataset.id]
    }).then(function (res) {
      if (res.Code == "200") {
        that.statusTap(2);
        wx.showToast({
          title: '发货成功',
          icon: "none"
        })
      } else {
        wx.showToast({
          title: res.Msg,
          icon: "none"
        })
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
      usertype: wx.getStorageSync("usertype") ,
      ismaiduan: wx.getStorageSync("isoverpay") == 1 ? 1 : 0,
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
  getOrderStatistics: function () {
    var that = this;
    WXAPI.orderStatistics(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        var tabClass = that.data.tabClass;
        if (res.data.count_id_no_pay > 0) {
          tabClass[0] = "red-dot"
        } else {
          tabClass[0] = ""
        }
        if (res.data.count_id_no_transfer > 0) {
          tabClass[1] = "red-dot"
        } else {
          tabClass[1] = ""
        }
        if (res.data.count_id_no_confirm > 0) {
          tabClass[2] = "red-dot"
        } else {
          tabClass[2] = ""
        }
        if (res.data.count_id_no_reputation > 0) {
          tabClass[3] = "red-dot"
        } else {
          tabClass[3] = ""
        }
        if (res.data.count_id_success > 0) {
          //tabClass[4] = "red-dot"
        } else {
          //tabClass[4] = ""
        }

        that.setData({
          tabClass: tabClass,
        });
      }
    })
  },
  searchText(e) {
    this.setData({
      searchtxt: e.detail.value
    })
  },
  onShow: function () {
    
    // 获取订单列表
    var that = this;
    
    util.request(app.data.hostAjax + '/api/transaction/v1/distributororderlist',{//用户订单列表
      userid: wx.getStorageSync("userid"),
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