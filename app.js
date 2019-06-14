//app.js
const Promise = require('utils/promise.js');
App({
  readyCallback: null,
  
  globalData: {
    
  },
  data:{
    // hostAjax: "http://39.106.49.173:8084",
    hostAjax: "https://www.yqcoffee.cn:2019",
    statusBarHeight: wx.getSystemInfoSync()["statusBarHeight"],
    isIphoneX: (wx.getSystemInfoSync()["model"].indexOf('iPhone X')>=0?true:false),
    screenHeight: wx.getSystemInfoSync()["screenHeight"],
    windowHeight: wx.getSystemInfoSync()["windowHeight"],
    dalay:true,
    stop: false
  },
  onLaunch: function () {
    // if (wx.getStorageSync("token")) {//ifLogin
    //   wx.reLaunch({
    //     url: 'pages/logs/logs'
    //   })
    //   return false;
    // }
    return
    let _this=this;
   
    new Promise(function (resolve, reject){
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res.code);
          _this.getData("/api/Account/Code2Session", { jsCode: res.code }).then(res => {
            wx.setStorageSync("openid", res.result.openid);
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
      console.log(res.hasUpdate)
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
  globalData: {
    userInfo: null
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
  }
})