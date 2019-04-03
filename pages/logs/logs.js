//logs.js
const util = require('../../utils/util.js');
var app=getApp();
Page({
  data: {
    statusBarHeight: app.data.statusBarHeight,
    showLoade:true,
    orderLists:[],
    logs: [],
    productName:"",
    current: 'tab1', toggle2: false,
    showRight1: false,
    actions: [
      {
        name: '查看详情',
        color: '#fff',
        fontsize: '20',
        width: 100,
        background: '#FDD000'
      }
    ],
    pageSize:10,
    pageIndex:1,
    totleNum:0,
    productNum: 0,
    showBottom:false,
    hiddenload:true,
    doOnce: false,//到了底部只请求一次
  }, toggleRight1() {
    this.setData({
      showRight1: !this.data.showRight1
    });
  },
  onShow: function () {
    // this.allNum();
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  onLoad: function () {
    let _this=this;
    let ajaxDate = null, ajaxDate2 = null, ajaxDate3 = null;
    if (this.data.current =="tab1"){
      ajaxDate = {
        "category": 10,
        "productName": _this.data.productName,
        // "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        // "deliverGoodsStatus": 0,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
      ajaxDate2= {
        "category": 0,
        "productName": _this.data.productName,
        // "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        // "deliverGoodsStatus": 0,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
      ajaxDate3 = {
        "productName": _this.data.productName,
        // "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        // "deliverGoodsStatus": 0,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
    } else if (this.data.current == "tab2") {
      ajaxDate = {
        "category": 10,
        "productName": _this.data.productName,
        "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        // "deliverGoodsStatus": 0,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
      ajaxDate2 = {
        "category": 0,
        "productName": _this.data.productName,
        "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        // "deliverGoodsStatus": 0,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
      ajaxDate3 = {
        "productName": _this.data.productName,
        "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        // "deliverGoodsStatus": 0,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
    } else if (this.data.current == "tab3") {
      ajaxDate = {
        "category": 10,
        "productName": _this.data.productName,
        // "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        "deliverGoodsStatus": 1,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
      ajaxDate2 = {
        "category": 0,
        "productName": _this.data.productName,
        // "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        "deliverGoodsStatus": 1,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
      ajaxDate3 = {
        "productName": _this.data.productName,
        // "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        "deliverGoodsStatus": 1,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
    } else if (this.data.current == "tab4") {
      ajaxDate = {
        "category": 10,
        "productName": _this.data.productName,
        // "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        "deliverGoodsStatus": 2,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
      ajaxDate2 = {
        "category": 0,
        "productName": _this.data.productName,
        // "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        "deliverGoodsStatus": 2,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
      ajaxDate3 = {
        "productName": _this.data.productName,
        // "paymentStatus": 0,//支付状态 0 未付定金 1 已付定金 2已支付 ,
        "deliverGoodsStatus": 2,//1 未发货 2 已发货 ,
        "pageIndex": _this.data.pageIndex,
        "pageSize": _this.data.pageSize
      }
    }
    wx.request({
      url: app.data.hostAjax + '/api/Order/XyList', // 获取10不干胶订单
      data: ajaxDate,
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        
        let arr = _this.data.orderLists;
        console.log(typeof arr)
        arr= arr.concat(res.data.result.items)
        if (res.data.success) {
          _this.setData({
            orderLists: arr
          })
          console.log(_this.data.orderLists);
          let num1 = res.data.result.items.length+_this.data.productNum;
          if (_this.data.pageIndex==1){
            let num = res.data.result.totalCount + _this.data.totleNum
            _this.setData({
              totleNum: num
            })
          }
          _this.setData({
            productNum:num1
          })
        }
        //请求第二种订单
        wx.request({
          url: app.data.hostAjax + '/api/Order/XyList', // 获取0彩印订单
          data: ajaxDate2,
          method: "post",
          header: {
            'content-type': 'application/json',
            'Authorization': "Bearer " + wx.getStorageSync("token")
          },
          success(res) {
            let arr = _this.data.orderLists;
            console.log(typeof arr)
            arr = arr.concat(res.data.result.items)
            if (res.data.success) {
              _this.setData({
                orderLists: arr
              })
              let num1 = res.data.result.items.length + _this.data.productNum;
              if (_this.data.pageIndex == 1) {
                let num = res.data.result.totalCount + _this.data.totleNum
                _this.setData({
                  totleNum: num
                })
              }
              _this.setData({
                productNum: num1
              })
              
            }
            
            //请求第三种订单
            wx.request({
              url: app.data.hostAjax + '/api/Order/ErpList', // 获取0彩印订单
              data: ajaxDate3,
              method: "post",
              header: {
                'content-type': 'application/json',
                'Authorization': "Bearer " + wx.getStorageSync("token")
              },
              success(res) {
                let arr = _this.data.orderLists;
               try{
                 arr = arr.concat(res.data.result.items)
               } catch(e){
                 console.log("出错了");
                 if (_this.data.totleNum == 0) {
                   _this.setData({
                     hiddenload: false
                   });
                 }
                 if (_this.data.totleNum <= 10 || _this.data.totleNum == _this.data.productNum) {
                   _this.setData({
                     showLoade: false
                   });
                 }
               }
                
                if (res.data.success) {
                  _this.setData({
                    orderLists: arr
                  })
                  let num1 = res.data.result.items.length + _this.data.productNum;
                  if (_this.data.pageIndex == 1) {
                    let num = res.data.result.totalCount + _this.data.totleNum
                    _this.setData({
                      totleNum: num
                    })
                  }
                  _this.setData({
                    productNum: num1
                  })
                  console.log("订单的总数量：" + _this.data.totleNum);
                  if (_this.data.totleNum == 0) {
                    _this.setData({
                      hiddenload: false
                    });
                  }
                  if (_this.data.totleNum <= 10 || _this.data.totleNum == _this.data.productNum) {
                    _this.setData({
                      showLoade: false
                    });
                  }

                }
                _this.setData({
                  doOnce: true
                })
                if (_this.data.totleNum == _this.data.productNum) {
                  wx.createSelectorQuery().select('#theBottom').boundingClientRect(function (rect) {
                    console.log(rect)
                    if ((app.data.screenHeight - 48) < rect.top) {
                      _this.setData({
                        showBottom: true
                      });
                    } else {
                      _this.setData({
                        showBottom: false
                      });
                    }
                  }).exec()
                }

              }
              
            })
          }
        })
        //  else {
        //   wx.showToast({
        //     title: res.data.error.message,
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
      }
    })
    
  },
  onReachBottom(){
    
    let _this=this;
    if (_this.data.totleNum > _this.data.productNum){
      
      if(_this.data.doOnce){
        this.setData({
          doOnce: false
        })
        
        console.log("我到底了")
        this.setData({
          showLoade: true,

          pageIndex: (_this.data.pageIndex + 1)
        });
        this.onLoad();
      }
      
      
    }
    
  },
  doSearh: function () {
    this.setData({
      orderLists: [],
      totleNum: 0,
      productNum: 0,
      pageIndex: 1,
      showLoade: true,
      showBottom: false,
      doOnce: false,
      hiddenload: true
    });
    this.onLoad();
  },

  proName: function (e) {
    this.setData({
      productName: e.detail.value
    })
   
  },
  handleChange({ detail }) {
    // wx.startPullDownRefresh()
    let _this=this;
    this.setData({
      current: detail.key,
      orderLists:[],
      totleNum:0,
      productNum:0,
      pageIndex:1,
      showLoade:true,
      showBottom: false,
      doOnce: false,
      hiddenload: true
    });
    this.onLoad();
  },
  totop:function(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  handlerCloseButton() {
    this.setData({
      toggle2: this.data.toggle2 ? false : true
    });
  },
  change(e) {
    console.log(e);
    wx.navigateTo({
      url: 'orderDetail/orderDetail?data=' + JSON.stringify(e.currentTarget.dataset),
    })
  },
  allNum: function () {
    let _this=this;
    wx.request({
      url: app.data.hostAjax + '/api/Order/XyList',
      data: {
        pageSize: 10000
      },
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        // console.log("订单1的数量：" + res.data.result.items.length);
        if (res.data.success) {
          _this.setData({
            totleNum: res.data.result.items.length
          })
        }
        wx.request({
          url: app.data.hostAjax + '/api/Order/ErpList',
          data: {
            pageSize:10000
          },
          method: "post",
          header: {
            'content-type': 'application/json',
            'Authorization': "Bearer " + wx.getStorageSync("token")
          },
          success(res) {
            // console.log("订单2的数量：" + res.data.result.items.length);
            if (res.data.success) {
              let num = res.data.result.items.length + _this.data.totleNum
              _this.setData({
                totleNum: num
              })
              console.log("订单的总数量：" + num);
            }
           
          }
        })
      }
    })
  }
})
