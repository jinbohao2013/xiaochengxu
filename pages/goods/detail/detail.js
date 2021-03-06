
const util = require('../../../utils/util.js');
import Toast from '../../../dist/toast/toast';
import drawQrcode from '../../../utils/weapp.qrcode.esm.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalshow: false,//优惠券的弹框-可以领取--当有优惠券的时候提示--分享人进来的时候判断是否分享成功
    shareid:"",//分享人的id
    isLogin: false,
    windowHeight:null,//可用窗口的高度
    value1:1,//购买数量
    true: true,
    goodsValue: "",
    ajaxData: null,
    isIphoneX: app.data.isIphoneX,
    scroolHeight: 200,
    show: false,//选择口味的弹出层
    show1:false,//保存图片的弹出层
    goodsid:0,
    imgUrls: [
      
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    current:0,
    // allcurrent:3,
    circular:true,
    // goodsnum:0,
    // tastArr:[],
    // tasteId:null,//口味id
    acticeInxex: null,//口味的顺序index值0开始
    widthCord:195 / 750 * wx.getSystemInfoSync().windowWidth,//二维码的px值（转换之后的）
    // productName:"SNOW＋橘子汽水",
    loading:false,//保存按钮的加载动画
    openset: false,//打开设置的判断
    // hideBotom: true,//此时为了隐藏分享按钮，当时普通用户的时候
    buyType:2,//1为加入购物车，2为购买
    goodLength:""
  },
  changeIndex(e) {
    console.log(e)
    this.setData({
      acticeInxex: e.currentTarget.dataset.index
    })
    // this.//设置传递到递交订单页的口味
  },
  changeSwiper(e){
    this.setData({
      current:e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.reLaunch({//重定向到登录页面
    //   url: '/pages/home/home'
    // })
    let _this=this;
    var goodsId = options.id;
    if (!goodsId){
      //此时是从分享页面进来的?useridsaleman=0&goodsid=2471&shopid=0
      //2471&shopid=0
      if (decodeURIComponent(options.q).split("?")[1].split("goodsid=")[1].indexOf("&")>=0){
        goodsId = decodeURIComponent(options.q).split("?")[1].split("goodsid=")[1].split("&")[0]
      }else{
        goodsId = decodeURIComponent(options.q).split("?")[1].split("goodsid=")[1]
      }
      if (decodeURIComponent(options.q).indexOf("shopid")>0){
        if (decodeURIComponent(options.q).split("?")[1].split("shopid=")[1].indexOf("&") >= 0) {
          wx.setStorageSync("salemanshopid", decodeURIComponent(options.q).split("?")[1].split("shopid=")[1].split("&")[0])
        } else {
          wx.setStorageSync("salemanshopid", decodeURIComponent(options.q).split("?")[1].split("shopid=")[1])
        }
      }
      if (decodeURIComponent(options.q).indexOf("useridsaleman") > 0){
        if (decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1].indexOf("&") >= 0) {
          wx.setStorageSync("useridsaleman", decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1].split("&")[0])
          //为了跟appjs的uid冲突，制作一个顶级的分享人的uid
        } else {
          wx.setStorageSync("useridsaleman", decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1])
        }
      }
      if (decodeURIComponent(options.q).indexOf("shareid") > 0){
        if (decodeURIComponent(options.q).split("?")[1].split("shareid=")[1].indexOf("&") >= 0) {
          _this.setData({
            shareid: decodeURIComponent(options.q).split("?")[1].split("shareid=")[1].split("&")[0]
          })
        } else {
          _this.setData({
            shareid: decodeURIComponent(options.q).split("?")[1].split("shareid=")[1]
          })
        }
        // wx.setStorageSync("saoma", true)//后期去掉了自提和地址的限制
      }
    }
    console.log("传过来的商品id是:---" + goodsId)

    this.setData({
      goodsid: goodsId,
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight - 59 - 68 : app.data.windowHeight - 59 - 51
    })
    
    //下面是调取详情接口--展示商品信息
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/getgoodsdetail', // 获取商品详情
      data: {
        goods_id: goodsId
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        
        if (res.data.Success) {
          console.log(res.data);
          _this.setData({
            ajaxData: res.data.Data
          })
          _this.drawImg(goodsId);
        } else {
          wx.showToast({
            title: "数据信息展示失败",
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    
    //下面就是画图--分享商品图
    wx.hideShareMenu({
      success:function(){
        console.log("禁止了分享按钮的现实！")
      }
    })
    
  },
  drawImg(goodsId){
    let _this=this;
    //禁止页面分享
    var w = 451 / 750 * wx.getSystemInfoSync().windowWidth;
    var h = 753 / 750 * wx.getSystemInfoSync().windowWidth;
    var a = 43 / 750 * wx.getSystemInfoSync().windowWidth;
    var b = 625 / 750 * wx.getSystemInfoSync().windowWidth;
    var c = 45 / 750 * wx.getSystemInfoSync().windowWidth;
    var d = 360 / 750 * wx.getSystemInfoSync().windowWidth;
    var e = 45 / 750 * wx.getSystemInfoSync().windowWidth;
    var f = 443 / 750 * wx.getSystemInfoSync().windowWidth;
    var ss = 22 / 750 * wx.getSystemInfoSync().windowWidth;
    var s = 30 / 750 * wx.getSystemInfoSync().windowWidth;
    const ctx = wx.createCanvasContext('myQrcode')
    //画板的背景
    var shareImg = _this.data.ajaxData.imgurl.split("|")[0].replace("http://39.106.49.173:8088","https://www.yqcoffee.cn:2019");
    console.log(shareImg)
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, w, h)
    ctx.setFillStyle('#000')
    //加入图片到canvas中
    var imgUrl;
    if (wx.getStorageSync("usertype")==1){
      imgUrl = 'https://www.yqcoffee.cn/goods/detail/?goodsid=' + goodsId + '&shareid=' + wx.getStorageSync("userIdBuyGood")
    }else{
      imgUrl = 'https://www.yqcoffee.cn/goods/detail/?useridsaleman=' + wx.getStorageSync("fenxiaoshangid") + '&goodsid=' + goodsId + '&shopid=' + wx.getStorageSync("shopid") + '&shareid=' + wx.getStorageSync("userIdBuyGood")
    }
    
    console.log(imgUrl)
    wx.downloadFile({
      url: shareImg,
      success:(res)=>{
        shareImg=res.tempFilePath;
        ctx.drawImage(shareImg, c, 38 / 750 * wx.getSystemInfoSync().windowWidth, d, d)
        //加入商品名字到canvas中
        ctx.setFontSize(s)
        if (_this.data.ajaxData.name.length>11){
          var str=_this.data.ajaxData.name.substr(0, 11)
          ctx.fillText(str + "..." , e, f)
        }else{
          ctx.fillText(_this.data.ajaxData.name , e, f)
        }
        
        //加入价钱到canvas中
        ctx.setFontSize(ss)
        ctx.fillText('￥', a, b)
        ctx.setFontSize(s)
        ctx.fillText(_this.data.ajaxData.e_price, a + 15, b)
        // 绘制图片到canvas中
        drawQrcode({
          x: 211 / 750 * wx.getSystemInfoSync().windowWidth,
          y: 479 / 750 * wx.getSystemInfoSync().windowWidth,
          width: _this.data.widthCord,
          height: _this.data.widthCord,
          canvasId: 'myQrcode',
          ctx: ctx,
          text: imgUrl,
        })
      }
    })
    
  },
  saveImgBtn(){
    let _this = this;
    wx.getSetting({
      success: function (res) { 
        // console.log(res.authSetting['scope.writePhotosAlbum'])
        if (res.authSetting['scope.writePhotosAlbum']){
          _this.setData({
            openset: false
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    if (this.data.openset){
      wx.openSetting({
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    if(this.data.loading){return}
    this.setData({
      loading:true
    })
    
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.writePhotosAlbum'])
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.canvasToTempFilePath({
                canvasId: 'myQrcode',
                success: (res) => {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (res) => {
                      console.log(res)
                      _this.setData({
                        show1: false,
                        loading: false
                      })
                    },
                    fail: (err) => {
                      _this.setData({
                        loading: false
                      })
                    }
                  })
                },
                fail: (err) => {
                  wx.openSetting()
                  _this.setData({
                    loading: false
                  })
                }
              }, this)
            },
            fail: (err) => {
              _this.setData({
                loading: false,
                openset:true
              })
              console.log('我进来额')
              wx.openSetting()
            }
          })
        }else{
          wx.canvasToTempFilePath({
            canvasId: 'myQrcode',
            success: (res) => {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: (res) => {
                  console.log(res)
                  _this.setData({
                    show1:false,
                    loading: false
                  })
                },
                fail: (err) => {
                  _this.setData({
                    loading: false
                  })
                }
              })
            },
            fail: (err) => {
              _this.setData({
                loading: false
              })
            }
          }, this)
        }
      }
    })
    
  },
  onShow: function () {
    this.getInfo();
this.setData({
  autoplay: true,
})
    let _this = this;
    wx.getSetting({
      success: function (res) {
        // console.log(res.authSetting['scope.writePhotosAlbum'])
        if (res.authSetting['scope.writePhotosAlbum']) {
          _this.setData({
            openset: false
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    
  },
  onHide: function () {
    this.setData({
      show: false,
      autoplay: false,
      acticeInxex: null,
    })
  },
  onChange(event) {
    console.warn(`change: ${event.detail[0]}`);
    console.log(event.detail[0])
    this.setData({
      value1:  event.detail[0]
    })
  },
  onSearch(e) {
    console.log(e.detail)
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
  scrolltolower() {
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false

      })
      setTimeout(function () {
        _this.setData({
          loading: true

        })
      }, 1000)
      console.log("在我这里调取加载数据")
    }

  },
  onClose() {
    this.setData({ show: !this.data.show });
  },
  togglePopup() {
    app.checkauthorization(() =>{
      this.setData({ show1: !this.data.show1 });
    })
  },
  onGotUserInfo: function (e) {
    app.checkauthorization(()=>{
      if (e.currentTarget.dataset.url) {
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
        return
      }
      this.setData({
        buyType: e.currentTarget.dataset.index
      })
      this.onClickButton()
    })
  },
  onClickButton() {//立即购买
  let _this =this;
    //判断口味是否选择
    console.log("口味：",this.data.acticeInxex)
    console.log(this.data.value1 * this.data.ajaxData.e_price)
    if (this.data.acticeInxex != null){
      if(parseInt(this.data.buyType)==1){
        //如果是加入购物车
        console.log("在这里加入购物车")
        util.request(app.data.hostAjax + '/api/transaction/v1/addshoppingcart', { userid: wx.getStorageSync("userIdBuyGood"),
          goodsid: this.data.goodsid,
          num: this.data.value1,
          tasteid:this.data.ajaxData.tastename[this.data.acticeInxex].id

         }).then(function (res) {
           console.log(res)
           if(res.Code=="200"){
             wx.showToast({
               title: "已加入购物车",
               icon: 'none',
               duration: 2000
             })
             util.request(app.data.hostAjax + '/api/transaction/v1/myshoppingcart', { user_id: wx.getStorageSync("userIdBuyGood") }).then(function (res) {
               if (res.Code == "200") {
                 _this.setData({
                   goodLength: res.Data.list.length == 0 ? "" : res.Data.list.length
                 })
               } else {
                 _this.setData({
                   goodLength: ""
                 })
               }
             });
           }else{
             wx.showToast({
               title: res.Msg,
               icon: 'none',
               duration: 2000
             })
           }
          
        });
        return
      }
      //提交到订单确认
      wx.navigateTo({
        url: '../payMent/pay?ajaxData='+JSON.stringify({
                                          id: this.data.ajaxData.id,//商品id
          title: this.data.ajaxData.englishname+this.data.ajaxData.name,//标题
          desc: this.data.ajaxData.synopsis,//描述
          img: this.data.ajaxData.smallimg,
          price: this.data.ajaxData.e_price,//单价
                                          num: this.data.value1,//数量
          taste: this.data.ajaxData.tastename[this.data.acticeInxex].names,//口味名字
          tasteId: this.data.ajaxData.tastename[this.data.acticeInxex].id,//口味id
          totle: this.data.value1 * this.data.ajaxData.e_price*100,//总金额=数量乘以单价==单位是分
                                        }),
      })
    }else{
      //提示选择口味
      wx.showToast({
        title: '请选择口味',
        icon:"none"
      })
      if(this.data.show){
        return false
      }
      this.setData({ show: !this.data.show });
    }
    
  },
  hideModal(e) {//增加了优惠券分享的弹框
    this.setData({
      modalshow: !this.data.modalshow
    })
  },
  getInfo: function () {
    let _this=this;
    wx.getUserInfo({
      success: (data) => {
        console.log(data);
        //更新data中的userInfo
        app.globalData.userInfo = data.userInfo
        app.login(1,function(){
          _this.setData({
            isLogin: false
          })
          //首先登录，获取用户的类型，判断是不是客户--储存购买用户的id
          wx.request({
            url: app.data.hostAjax + '/api/user/v1/wxloginopenid', // 微信openid登录
            data: {
              openid: wx.getStorageSync("openid"),
              fxuserid:_this.data.shareid||0
            },
            method: "get",
            header: {
              'content-type': 'application/json',
            },
            success(res) {
              if (res.data.Success) {
                wx.setStorageSync("userIdBuyGood", res.data.Data.user_id);//储存购买用户的id用来调取支付
                _this.drawImg(_this.data.goodsid);
                if (res.data.Data.usertype == 1) {
                  //1为普通用户 2为经销商 3为店长 4为分销员
                  //1--隐藏底部导航
                  
                } else {
                  //，，专门为扫码进来的分销商、店长、分销员、制作分享页--帮助分享
                }
                // console.log("商品详情中的购买人id", res.data.Data.user_id);
                //在这里判断被分享人扫码进来的时候
                if (_this.data.shareid && parseInt(res.data.Data.isnewuser) == 1 && parseInt(res.data.Data.isticket) == 0){//新用户 
                  //弹出优惠券的框
                  console.log("弹出优惠券的框");
                  _this.setData({
                    modalshow: true
                  })
                }
                if (_this.data.shareid){
                  //绑定专属顾问--扫码进来
                  util.request(app.data.hostAjax + '/api/dester/v1/addmyadviser', { userid: res.data.Data.user_id, salapersonid: wx.getStorageSync("useridsaleman") }).then(function (res) {
                    if (res.Code == "200") {
                     
                    }
                  });
                }
                
                util.request(app.data.hostAjax + '/api/transaction/v1/myshoppingcart', { user_id: res.data.Data.user_id }).then(function (res) {
                  if (res.Code == "200") {
                    _this.setData({
                      goodLength: res.Data.list.length == 0 ? "" : res.Data.list.length
                    })
                  } else {
                    _this.setData({
                      goodLength: ""
                    })
                  }
                });
              }
            }
          })
          
        })
      },
      fail: () => {
        this.setData({
          isLogin: true
        })
      }
    })
  }
})