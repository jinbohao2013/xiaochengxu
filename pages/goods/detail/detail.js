
const util = require('../../../utils/util.js');
import Toast from '../../../dist/toast/toast';
import drawQrcode from '../../../utils/weapp.qrcode.esm.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    hideBotom: true,//此时为了隐藏分享按钮，当时普通用户的时候
    buyType:2,//1为加入购物车，2为购买
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
      _this.setData({
        hideBotom: false
      })
      //此时是从分享页面进来的?useridsaleman=0&goodsid=2471&shopid=0
      //2471&shopid=0
      if (decodeURIComponent(options.q).split("?")[1].split("goodsid=")[1].indexOf("&")>=0){
        goodsId = decodeURIComponent(options.q).split("?")[1].split("goodsid=")[1].split("&")[0]
      }else{
        goodsId = decodeURIComponent(options.q).split("?")[1].split("goodsid=")[1]
      }
      if (decodeURIComponent(options.q).split("?")[1].split("shopid=")[1].indexOf("&") >= 0) {
        wx.setStorageSync("shopid", decodeURIComponent(options.q).split("?")[1].split("shopid=")[1].split("&")[0])
      } else {
        wx.setStorageSync("shopid", decodeURIComponent(options.q).split("?")[1].split("shopid=")[1])
      }
      if (decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1].indexOf("&") >= 0) {
        wx.setStorageSync("useridsaleman", decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1].split("&")[0])
        //为了跟appjs的uid冲突，制作一个顶级的分享人的uid
        
      } else {
        wx.setStorageSync("useridsaleman", decodeURIComponent(options.q).split("?")[1].split("useridsaleman=")[1])
      }
    }
    console.log("传过来的商品id是:---" + goodsId)

    this.setData({
      goodsid: goodsId,
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight - 59 - 68 : app.data.windowHeight - 59 - 51
    })
    //首先登录，获取用户的类型，判断是不是客户--储存购买用户的id
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
        if (res.data.Success) {
          wx.setStorageSync("userIdBuyGood", res.data.Data.user_id);//储存购买用户的id用来调取支付
          if (res.data.Data.usertype == 1) {
            //1为普通用户 2为经销商 3为店长 4为分销员
            //1--隐藏底部导航
            _this.setData({
              hideBotom: false
            })
          }else{
            //2019-6-16，，专门为扫码进来的分销商、店长、分销员、制作分享页--帮助分享
          }
          console.log("22222222我是商品的储存22222222", _this.data.hideBotom)
        }
      }
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
    const imgUrl = 'https://www.yqcoffee.cn/goods/detail/?useridsaleman=' + wx.getStorageSync("fenxiaoshangid") + '&goodsid=' + goodsId + '&shopid=' + wx.getStorageSync("shopid")
    wx.downloadFile({
      url: shareImg,
      success:(res)=>{ 
        shareImg=res.tempFilePath;
        ctx.drawImage(shareImg, c, 38 / 750 * wx.getSystemInfoSync().windowWidth, d, d)
        //加入商品名字到canvas中
        ctx.setFontSize(s)
        if (_this.data.ajaxData.name.length>11){
          var str=_this.data.ajaxData.name.substr(1, 11)
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      autoplay: false,
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
    console.warn(`change: ${event.detail[0]}`);
    console.log(event.detail[0])
    this.setData({
      value1:  event.detail[0]
    })
  },
  onSearch(e) {
    console.log(e.detail)
  },
  onCancel() {//取消搜索搜索时触发

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
    this.setData({ show1: !this.data.show1 });
  },
  onGotUserInfo: function (e) {
    console.log(e.currentTarget)
    this.setData({
      buyType: e.currentTarget.dataset.index
    })
    this.onClickButton()
  },
  onClickButton() {//立即购买
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})