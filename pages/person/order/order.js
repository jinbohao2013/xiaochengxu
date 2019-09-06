var util = require('../../../utils/util.js');
const app = getApp()
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
    var curType
    if(e){
       curType = e.currentTarget.dataset.index;
      this.data.currentType = curType
      if (curType == 0) {
        this.setData({
          searchType: 100
        });
      } else {
        this.setData({
          searchType: parseInt(curType) - 1
        });
      }
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
              that.statusTap();
            }
          })
        }
      }
    })
  },
  toPayTap: function (e) {
    const _this = this;
    const orderId = e.currentTarget.dataset.id;
    const total_fee = e.currentTarget.dataset.money;
    //调取提交订单接口--跳转到购物车结算页
    wx.redirectTo({
      url: '/pages/person/cart/carBuy/carBuy',
    })
  },
  scrolltolower() {
    
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false

      })
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
  getOrder: function (pagesize) {
    // 获取订单列表
    var that = this;
    that.setData({
      orderList: [],
    })
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
  getgoods(e) {
    // 确认收货
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定',
      success(res) {
        if (res.confirm) {
          util.request(app.data.hostAjax + '/api/transaction/v1/addbuyerreceiving', {
            userid: wx.getStorageSync("userIdBuyGood"),
            ordernumber: e.currentTarget.dataset.ordernumber,
          }).then(function (res) {
            if (res.Code == "200") {
              wx.showToast({
                title: '收货成功'
              })
              that.onLoad(that.data.e)
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
  }
})