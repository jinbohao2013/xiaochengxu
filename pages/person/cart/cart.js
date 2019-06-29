
var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    cartGoods: [],
    loading: false,
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数


  },
  onReady: function () {
    // 页面渲染完成
    // this.setData({
    //   cartGoods:[{
    //     checked:false,
    //     list_pic_url:"http://www.yqcoffee.cn/image/show_iogo.png",
    //     goods_name:"我是行频沙隆达加法拉盛记李将军了",
    //     number:2,
    //     isEditCart:false,
    //     goods_specifition_name_value:"11111111",
    //     retail_price:22
    //   }],
    //   cartTotal: 200
    // });
  },
  onShow: function () {
    this.setData({
      loading: false
    })
    // 页面显示
    let that = this;
    util.request(app.data.hostAjax + '/api/transaction/v1/myshoppingcart', { user_id: wx.getStorageSync("userIdBuyGood") }).then(function (res) {
      if(res.Code=="200"){
        that.setData({
          cartGoods: res.Data.list,
          cartTotal: res.Data.sumprice * 100
        })
      }else{
        that.setData({
          cartGoods: [],
          cartTotal:0
        })
      }
      
    });
  },
  onClickButton() {//购物车结算//提交订单--吊起支付
    let _this = this;
    this.setData({ loading: true });
    wx.request({
      url: app.data.hostAjax + "/api/transaction/v1/setorder",
      data: {
        userid: wx.getStorageSync("userIdBuyGood"),
        salapersonid: wx.getStorageSync("useridsaleman") || wx.getStorageSync("fenxiaoshangid") || 0,//分销商的id分销员id
        shopid: wx.getStorageSync("shopid") || 0,//店铺id--每个人都有一个店铺
      },
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success(res) {
        if (res.data.Success) {
          //订单确认
          wx.request({
            url: app.data.hostAjax + '/api/transaction/v1/confirmationorder',
            data: {
              user_id: wx.getStorageSync("userIdBuyGood"),
            },
            method: "get",
            header: {
              'content-type': 'application/json',
            },
            success(res) {
              
              if (res.data.Success) {
                wx.navigateTo({
                  url: 'carBuy/carBuy',
                })
                return
                //调取提交订单接口
                wx.request({
                  url: app.data.hostAjax + '/api/transaction/v1/orderpayinfo',
                  data: {
                    userid: wx.getStorageSync("userIdBuyGood"),
                    orderid: res.data.Data.orderid,
                    total_fee: res.data.Data.sumprice,
                    addressid: 0,//收货地址id 自提传0
                  },
                  method: "get",
                  header: {
                    'content-type': 'application/json',
                  },
                  success(res) {

                    if (res.data.Success) {
                      try {
                        console.log(JSON.parse(res.data.Data));
                        wx.requestPayment({
                          timeStamp: JSON.parse(res.data.Data).timeStamp,
                          nonceStr: JSON.parse(res.data.Data).nonceStr,
                          package: JSON.parse(res.data.Data).package,
                          signType: 'MD5',
                          paySign: JSON.parse(res.data.Data).paySign,
                          success(res) {//支付成功
                            //展示支付成功的界面
                            console.log(res)
                            // _this.onClose();
                          },
                          fail(res) {
                            console.log(res)
                            if (res.errMsg == "requestPayment:fail cancel") {
                              wx.showToast({
                                title: "支付已取消",
                                icon: 'none'
                              })
                              wx.redirectTo({
                                url: '/pages/person/order/order',
                              })
                            }
                          }
                        })
                        _this.setData({ loading: false });
                      } catch (e) {
                        _this.setData({ loading: false });
                      }

                    } else {
                      wx.showToast({
                        title: res.data.Msg,
                        icon: 'none'
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.Msg,
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none'
          })
        }
      }
    })

  },
  onchange(event){
   
    let _this = this, add ="reduce";
    console.warn(`change: ${event.detail[0]}`);
    console.log(event.detail)
    // if (event.detail[0] == 0) {
    //   util.request(app.data.hostAjax + '/api/transaction/v1/updateshoppingcart', { userid: wx.getStorageSync("userIdBuyGood"), optiontype: "delete", id: event.currentTarget.dataset.id }).then(function (res) {

    //     _this.onShow();
    //   })
    // }else
    if(event.detail[1]){
      add = "add"
    }
    util.request(app.data.hostAjax + '/api/transaction/v1/updateshoppingcart', { userid: wx.getStorageSync("userIdBuyGood"), optiontype: add, id: event.currentTarget.dataset.id }).then(function (res) {

         _this.onShow();
       })
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;

    if (!this.data.isEditCart) {
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex){
          element.checked = !element.checked;
        }
        
        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  getCheckedGoodsCount: function(){
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },
  checkedAll: function () {
    let that = this;

    if (!this.data.isEditCart) {
      var productIds = this.data.cartGoods.map(function (v) {
        return v.product_id;
      });
      util.request(api.CartChecked, { productIds: productIds.join(','), isChecked: that.isCheckedAll() ? 0 : 1 }, 'POST').then(function (res) {
        if (res.errno === 0) {
          console.log(res.data);
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus;
        return v;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  updateCart: function (productId, goodsId, number, id) {
    let that = this;

    util.request(api.CartUpdate, {
      productId: productId,
      goodsId: goodsId,
      number: number,
      id: id
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          //cartGoods: res.data.cartList,
          //cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });

  },
  cutNumber: function (event) {

    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = cartItem.number + 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);

  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;

    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }


    wx.navigateTo({
      url: 'carBuy/carBuy'
    })
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this;

    let productIds = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (productIds.length <= 0) {
      return false;
    }

    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.product_id;
      }
    });


    util.request(api.CartDelete, {
      productIds: productIds.join(',')
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        let cartList = res.data.cartList.map(v => {
          console.log(v);
          v.checked = false;
          return v;
        });

        that.setData({
          cartGoods: cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  }
})