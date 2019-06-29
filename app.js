//app.js
const Promise = require('utils/promise.js');
App({
  readyCallback: null,
  
  globalData: {
    usertype:null
  },
  data:{
    hostAjax: "https://www.yqcoffee.cn:2020",
    // hostAjax: "https://www.yqcoffee.cn:2019",
    statusBarHeight: wx.getSystemInfoSync()["statusBarHeight"],
    isIphoneX: (wx.getSystemInfoSync()["model"].indexOf('iPhone X')>=0?true:false),
    screenHeight: wx.getSystemInfoSync()["screenHeight"],
    windowHeight: wx.getSystemInfoSync()["windowHeight"],
    dalay:true,
    stop: false,
    hideBotom: true,////隐藏底部导航
  },
  onLaunch: function () {
    // if (wx.getStorageSync("token")) {//ifLogin
    //   wx.reLaunch({
    //     url: 'pages/logs/logs'
    //   })
    //   return false;
    // }
    // return
    let _this=this;
   
    new Promise(function (resolve, reject){
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // console.log(res.code);
          _this.getData("/api/weixin/v1/jscode2session", { response_type: res.code }).then(res => {
           
            wx.setStorage({
              key: 'sessionKey',
              data: JSON.parse(res.Data).session_key,
            })
            wx.setStorageSync("openid", JSON.parse(res.Data).openid);
            if (_this.readyCallback) {//如果是那边（index.js）先发生
            //执行那边传过来的函数
              _this.readyCallback(_this.data.hostAjax);
            }
            
            //首先登录，获取用户的类型，判断是不是客户
            wx.request({
              url: _this.data.hostAjax + '/api/user/v1/wxloginopenid', // 微信openid登录
              data: {
                openid: wx.getStorageSync("openid"),
              },
              method: "get",
              header: {
                'content-type': 'application/json',
              },
              success(res) {
                if (res.data.Success) {
                  
                  if (res.data.Data.usertype == 1) {
                    //1为普通用户 2为经销商 3为店长 4为分销员
                    //1--隐藏底部导航
                    _this.data.hideBotom=false;
                  }else{
                    //储存--用于购买支付的经销商的id、店长的id、分销员的id
                    wx.setStorageSync("userid", res.data.Data.user_id);
                    wx.setStorageSync("usertype", res.data.Data.usertype);
                    //后续可能会在这里调取每个人的shopid用于分享
                    var type = Number(res.data.Data.usertype)
                    switch (type) {
                      case 3:
                        _this.getfenxiaoid('/api/dester/v1/getshopownerdester', type)
                        break;
                      case 2:
                        _this.getfenxiaoid('/api/dester/v1/getdistributordester', type)
                        break;
                      case 4:
                        _this.getfenxiaoid('/api/dester/v1/getsalespersondester', type)
                        break;
                      default:
                        break;
                    }
                  }
                  
                } else {

                }
              }
            })
          })
          resolve()
          
          return false;
        }
      })
    }).then(res=>{
      console.log("app2")
    })
    console.log("app3")
  },
  onShow:function(){
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate()
      // wx.showModal({
      //   title: '更新提示',
      //   content: '新版本已经准备好，是否重启应用？',
      //   success(res) {
      //     if (res.confirm) {
      //       // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
           
      //     }
      //   }
      // })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  postData: function (url, data) {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: that.data.hostAjax + url,
        data: data,
        method: "POST",
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        success: function (res) {
          resolve(res.data);
        },
        fail: function (res) {
          reject(res);
        },
      })
    });
  },
  getData: function (url, data) {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: that.data.hostAjax + url,
        data: data,
        method: "GET",
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        success: function (res) {
          resolve(res.data);
        },
        fail: function (res) {
          reject(res);
        },
      })
    });
  },
  getfenxiaoid: function (v, type) {
    wx.request({
      url: this.data.hostAjax + v,
      data: {
        userid: wx.getStorageSync("userid"),
      },
      success: (res) => {
        // console.log(res)
        if (type == 2) {//如果是分销商
          wx.setStorageSync("fenxiaoshangid", res.data.Data.qrurl.split("distributorid=")[1]);//获取储存分享出去的经销商id
        } else if (type == 3) {//如果是店长
          wx.setStorageSync("fenxiaoshangid", res.data.Data.qrurl.split("distributorid=")[1]);//获取储存分享出去的经销商id
        } else if (type == 4) {//如果是分销员
          wx.setStorageSync("fenxiaoshangid", res.data.Data.salapersonid);//获取储存分享出去的 分销员id
        }
        wx.setStorageSync("shopid", res.data.Data.shopid);//获取储存分享出去的店铺id
      }
    })
  },
  readyCallback:null
  
})