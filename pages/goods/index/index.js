// pages/money/index/index.js
const util = require('../../../utils/util.js');
import Toast from '../../../dist/toast/toast';
var app = getApp();
Page({
  skipNextPage(e){
    //点击图片跳转到详情
    wx.navigateTo({
      url: '../detail/detail?id='+e.currentTarget.dataset.id
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    modalshow:false,//优惠券的弹框-可以领取--当有优惠券的时候提示--分享人进来的时候判断是否分享成功
    true: true,
    bannerList: [],
    goodsValue:"",
    ajaxData: [],
    value1:1,//商品数量
    ajaxGood:null,//点击加号，获取商品详情中的口味
    isIphoneX: app.data.isIphoneX,
    scroolHeight:200,
    loading:true,
    hideLoading:true,//隐藏底部加载
    hideBotom: true,//隐藏底部导航
    personUrl:"",
    show: false,
    acticeInxex:null,//口味的index,从0开始
    pageindex:1,
    goodsValue:"",//搜索框的内容
    pagesize:10,//每页的商品数量
    firstId: 0,//上一次选择的商品id
  },
  changeIndex(e){
    this.setData({
      acticeInxex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.reLaunch({//重定向到登录页面
    //   url: '/pages/home/home'
    // })
    let _this = this;
    // console.log(JSON.stringify(options))
    var goodsId = JSON.stringify(options);
    if (goodsId!="{}") {
      //此时是从分享页面进来的?useridsaleman=0&shopid=0
      if (decodeURIComponent(options.q).split("?")[1].split("shopid=")[1].indexOf("&") >= 0) {
        wx.setStorageSync("shopid", decodeURIComponent(options.q).split("?")[1].split("shopid=")[1].split("&")[0])
      } else {
        wx.setStorageSync("shopid", decodeURIComponent(options.q).split("?")[1].split("shopid=")[1])
      }
      if (decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1].indexOf("&") >= 0) {
        wx.setStorageSync("useridsaleman", decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1].split("&")[0])
        //为了跟appjs的uid冲突，制作一个顶级的分享人的uid--但是顶级分享人会一直保留
        
      } else {
        wx.setStorageSync("useridsaleman", decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1])
      }
    }
    //如果不是客戶，進來
    wx.hideShareMenu({
      success: function () {
        console.log("禁止了分享按钮的现实！")
      }
    })
    
    this.setData({
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight  - 68 : app.data.windowHeight  - 51
    })
    //调取banner的接口
    util.request(app.data.hostAjax + '/api/other/v1/banner', {
      t:0
    }).then(function (res) {
      if (res.Code == "0") {
        _this.setData({
          bannerList: res.Data
        })
      } else {
        _this.setData({
          bannerList: []
        })
      }
    });
    //下面是调取列表接口--展示商品信息---现在换成banner接口
    wx.request({
      url: app.data.hostAjax + '/api/other/v1/banner', // 获取商品列表
      data: {
        t:1
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        
        if (res.data.Success) {
          let arr = _this.data.ajaxData;
          try {
            if (res.data.Data) {
              arr = arr.concat(res.data.Data)
            }
          } catch (e) {
            console.log("出错了");
          }
          _this.setData({
            ajaxData: arr
          })
          console.log(_this.data.ajaxData)
          if (res.data.Data.length<10){
            _this.setData({
              hideLoading:false
            })
          }
          // console.log("111111111111111111111",_this.data.hideLoading)
        } else {
          _this.setData({
            hideLoading: false
          })
          
        }
      }
    })
  },
  imageLoad(e){
    // console.log(e)
    this.setData({
      bannerHeight:e.detail.height
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    let _this=this;
    console.log("我进来了啊,111111111111111")
    //首先登录，获取用户的类型，判断是不是客户
    if (wx.getStorageSync("openid") == "") {
      console.log("我进来了啊,222222")
      //此时是页面加载早了，而微信appjs还没加载--导致openid为undefined
      app.readyCallback = (hostAjax) =>{
        wx.request({
          url: hostAjax + '/api/user/v1/wxloginopenid', // 微信openid登录
          data: {
            openid: wx.getStorageSync("openid"),
          },
          method: "get",
          header: {
            'content-type': 'application/json',
          },
          success(res) {
            if (res.data.Success) {
              wx.setStorageSync("userIdBuyGood", res.data.Data.user_id);//储存购买用户的id用来调取支付
              wx.setStorageSync("usertype", parseInt(res.data.Data.usertype));
              //在这里判断被分享人扫码进来的时候
              if (parseInt(res.data.Data.isticket) == 0) {//分享人进来时--未读消息时
                //弹出优惠券的框
                console.log("弹出优惠券的框");
                _this.setData({
                  modalshow: true
                })
              }
            }
          }
        })
      }
      return false;
    }
    console.log("我没进来", wx.getStorageSync("openid") == "")
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/wxloginopenid', // 微信openid登录
      data: {
        openid: wx.getStorageSync("openid"),
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        _this.setData({
          loading: true
        })
        if (res.data.Success) {
          wx.setStorageSync("userIdBuyGood", res.data.Data.user_id);//储存购买用户的id用来调取支付
          wx.setStorageSync("usertype", parseInt(res.data.Data.usertype));
          //在这里判断被分享人扫码进来的时候
          if (parseInt(res.data.Data.isticket) == 0) {//分享人进来时--未读消息时
            //弹出优惠券的框
            console.log("弹出优惠券的框");
            _this.setData({
              modalshow: true
            })
          }
          if (res.data.Data.usertype == 1) {
            //1为普通用户 2为经销商 3为店长 4为分销员
            //1--隐藏底部导航
            _this.setData({
              hideBotom: false,
              personUrl:"/pages/person/person"
            })
          }else{
            _this.setData({
              hideBotom: true,
              personUrl: "/pages/home/home"
            })
          }
        } else {

        }
      }
    })
  },

  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading()
    this.setData({
      show: false,
    })
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
  onChange(event) {
    // console.warn(`change: ${event.detail}`);
    this.setData({
      value1: event.detail[0]
    })
  },
  onSearch(e){
    this.setData({
      // ajaxData:[],
      hideLoading: true,
      goodsValue:e.detail
    })
    this.onLoad({});
  },
  onCancel() {//取消搜索搜索时触发
    this.setData({
      // ajaxData: [],
      hideLoading: true,
      goodsValue:""
    })
    this.onLoad({});
  },
  scroll() {//滚动时触发

  },
  onPullDownRefresh: function () {
    
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
      
    setTimeout(function () {

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
  },
  scrolltolower(){
    if(this.data.loading){
      let _this=this
      this.setData({
        loading:false

      })
      // setTimeout(function(){
      //   _this.setData({
      //     loading: true

      //   })
      // },1000)
      // console.log("在我这里调取加载数据")
      if (!this.data.hideLoading){
        return
      }
      this.setData({
        pageindex:this.data.pageindex+1
      })
      this.onLoad({});
    }
    
  },
  onGotUserInfo: function (e) {//点击下一步
  wx.showLoading({
    title: '稍等',
  })
    
    // console.log("登录信息获取，然后跳转到详情页面--调起支付")
    //判断口味是否选择
    // console.log("口味：", this.data.acticeInxex)
    // console.log(this.data.value1 * this.data.ajaxGood.e_price)
    if (this.data.acticeInxex!=null) {
      //提交到订单确认
      wx.navigateTo({
        url: '../payMent/pay?ajaxData=' + JSON.stringify({
          id: this.data.firstId,//商品id
          title: this.data.ajaxGood.englishname + this.data.ajaxGood.name,//标题
          desc: this.data.ajaxGood.synopsis,//描述
          img: this.data.ajaxGood.smallimg,
          price: this.data.ajaxGood.e_price,//单价
          num: this.data.value1,//数量
          taste: this.data.ajaxGood.tastename[this.data.acticeInxex].names,//口味名字
          tasteId: this.data.ajaxGood.tastename[this.data.acticeInxex].id,//口味id
          totle: this.data.value1 * this.data.ajaxGood.e_price * 100,//总金额=数量乘以单价==单位是分
        }),
      })
    } else {
      //提示选择口味
      wx.showToast({
        title: '请选择口味',
        icon: "none"
      })
      if (this.data.show) {
        return false
      }
      this.setData({ show: !this.data.show });
    }

  },
  onClose() {
    this.setData({ show: !this.data.show });
  },
  showBottomBuy(e){
    let _this=this;
    //初始化弹框的信息，先判断商品是否与上次点击不同
    if (e.currentTarget.dataset.id!=this.data.firstId){
      _this.setData({
        value1: 1,
        acticeInxex: null
      })
    }
    this.setData({
      firstId: e.currentTarget.dataset.id
    })
    //调取详情 接口--id--e.currentTarget.dataset.id
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/getgoodsdetail', // 获取商品详情
      data: {
        goods_id: e.currentTarget.dataset.id
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        wx.hideLoading();//关闭加载按钮--弹出口味选择--下一步点击下一步
        _this.onClose();
        if (res.data.Success) {
          // console.log(res.data);
          _this.setData({
            ajaxGood: res.data.Data
          })
          
          
          
        } else {
          
        }
        
      }
    })
    
  },
  hideModal(e) {//增加了优惠券分享的弹框
    this.setData({
      modalshow: !this.data.modalshow
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})