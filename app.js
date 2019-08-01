//app.js
const Promise = require('utils/promise.js');
App({
  readyCallback: null,
  
  globalData: { 
    usertype:null
  },
  data:{
    hostAjax: "https://www.yqcoffee.cn:2021",
    statusBarHeight: wx.getSystemInfoSync()["statusBarHeight"],
    isIphoneX: (wx.getSystemInfoSync()["model"].indexOf('iPhone X')>=0?true:false),
    screenHeight: wx.getSystemInfoSync()["screenHeight"],
    windowHeight: wx.getSystemInfoSync()["windowHeight"],
    windowWidth: wx.getSystemInfoSync()["windowWidth"],
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
            if (!JSON.parse(res.Data).openid){
              console.log("请重新登录")
              return
            }
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
                  wx.setStorageSync("token", res.data.Data.token)
                  wx.setStorageSync("phone", res.data.Data.phone)
                  if (res.data.Data.usertype == 1) {
                    //1为普通用户 2为经销商 3为店长 4为分销员
                    //1--隐藏底部导航
                    _this.data.hideBotom=false;
                  }else{
                    //储存--用于购买支付的经销商的id、店长的id、分销员的id
                    wx.setStorageSync("userid", res.data.Data.user_id);
                    wx.setStorageSync("usertype", parseInt(res.data.Data.usertype));
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
    console.log("我从外面进来了哦")
    //获取新版本--进行更新--开始
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("请求完新版本信息的回调,1.9.17最新版", res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    //获取新版本--进行更新--结束
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
        wx.setStorageSync("isoverpay","");
        wx.setStorageSync("fenxiaoshangid", res.data.Data.salapersonid);//获取储存salapersonid
        if (type == 2 || type == 6) {//如果是分销商
          wx.setStorageSync("logo", res.data.Data.logimg);
        } else if (type == 3) {//如果是店长
          wx.setStorageSync("isoverpay", parseInt(res.data.Data.isoverpay));
          wx.setStorageSync("logo", res.data.Data.distributorlog);
        } else if (type == 4) {//如果是分销员
        }
        wx.setStorageSync("shopid", res.data.Data.shopid);//获取储存分享出去的店铺id
      }
    })
  },
  readyCallback:null,
  dateFmt:function(val){
    var date = new Date(val), Y , M , D , h , m , s;
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() > 9 ? date.getDate() + ' ' : '0' + date.getDate() + ' ';
    h = date.getHours() > 9 ? date.getHours() + ':' : '0' + date.getHours() + ":";
    m = date.getMinutes() > 9 ? date.getMinutes() + ':' : '0' + date.getMinutes() + ':';
    s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    return Y + M + D + h + m + s;
  },
  // 登录
  login: function (e,callback) {
    var that = this;
    wx.login({
      success: (res) => {
        console.log(res)
        wx.request({
          url: that.data.hostAjax + '/api/weixin/v1/jscode2session',
          data: {
            response_type: res.code,
          },
          method: "GET",
          success: (res) => {
            let ress = JSON.parse(res.data.Data)
            let openid = JSON.parse(res.data.Data).openid
            if (!JSON.parse(res.data.Data).openid) {
              console.log("请重新登录")
              return
            }else{
              if (e) {
                
              }else{
                wx.redirectTo({
                  url: '/pages/goods/index/index'
                })
              }
            }
            //获取用户的openid 
            console.log("用户的openid" + openid)
            that.globalData.openid = openid
            wx.request({
              url: that.data.hostAjax + '/api/user/v1/wxloginopenid',
              data: {
                openid: openid,
                imgurl: that.globalData.userInfo.avatarUrl,
                nickname: that.globalData.userInfo.nickName
              },
              success: (ress) => {
                
                let usertype = ress.data.Data.usertype
                that.globalData.usertype = ress.data.Data.usertype
                // that.globalData.usertype = '4'
                that.globalData.user_id = ress.data.Data.user_id
                that.globalData.token = ress.data.Data.token
                if(e){
                  callback()
                }else{
                  wx.removeStorageSync('saoma')
                  if (that.globalData.usertype == '2' || that.globalData.usertype == '3' || that.globalData.usertype == '4') {
                    wx.redirectTo({
                      url: '/pages/goods/index/index'
                    })
                  } else {
                    //用户进来要清楚用户以前的销售信息
                    wx.removeStorageSync('useridsaleman')
                    wx.removeStorageSync('shopid')
                    wx.redirectTo({
                      url: '/pages/goods/index/index',
                    })
                  }
                }
                
              }
            })
          }
        })
      }
    })
  }
  
})