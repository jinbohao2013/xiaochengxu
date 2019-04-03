//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    ifHide1:app.data.dalay,
    albumDisabled: true,
    bindDisabled: false,
    statusBarHeight: app.data.statusBarHeight,
    time:60,
    interval: null,
    ifqq:false,
    iftel: false,
    ifpass:false,
    qqtext: "",
    teltext: "",
    codetext:"",
    passtext: "",
    ifHide:false,
    ifActive: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    current: 'tab1',
    current_scroll: 'tab1',
    visible3: false,
    actions3: [
      {
        name: '否',
        color: '#e5433e',
      },
      {
        name: '确定',
        color: '#19be6b'
      }
    ],
    showM:false
  },
  changeActive: function(index) {
    wx.hideToast()
    if (index.currentTarget.dataset.item == "false"){
      this.setData({
        ifActive: false
      })
    }else{
      this.setData({
        ifActive: true
      })
    }
    
  },
  handleClick3({ detail }) {
    const index = detail.index;
    let _this=this;
    if (index === 0) {
      console.log('用户点击取消');
      wx.switchTab({
        url: '../logs/logs',
      })
    } else if (index === 1) {
      _this.updateOPenid();
    }
    this.setData({
      visible3: false
    });
  },
  updateOPenid:function(){
    wx.request({
      url: app.data.hostAjax + '/api/Account/UpdateWechatOpenId', // 更新openid
      data: {
        openId: wx.getStorageSync("openid")
      },
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        if (res.data.success) {
          wx.switchTab({
            url: '../logs/logs',
          })
        } else {
          wx.showToast({
            title: res.data.error.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  bindViewTap: function() {
    this.setData({
      visible3: true
    })
  },
  onLoad: function (options) {
    console.log("index")
    if (options.showM){
      this.setData({
        showM:true
      })
    }
    this.setData({
      ifHide: true
    })
    wx.setNavigationBarTitle({
      title: "登录"
    })
    if(!wx.getStorageSync("token")){
      this.setData({
        ifHide:true
      })
      wx.setNavigationBarTitle({
        title: "登录"
      })
    }
    if (!app.data.dalay) {//index后
      app.data.dalay = false;
      this.setData({
        ifHide1: false
      })
    } else {//index 先
      app.readyCallback = () => {
        app.data.dalay = false;
        console.log("我只行了")
        this.setData({
          ifHide1: false
        })
      };
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    wx.showTabBar()
  },
  qqinput: function(e) {
    this.setData({
      qqtext: e.detail.value
    })
  },
  clearqq: function (e) {
    this.setData({
      qqtext: ""
    })
    console.log(this.data.qqtext)
  },
  codeinput: function (e) {
    this.setData({
      codetext: e.detail.value
    })
  },
  telinput: function (e) {
    this.setData({
      teltext: e.detail.value
    })
  },
  cleartel: function (e) {
    this.setData({
      teltext: ""
    })
    console.log(this.data.teltext)
  },
  passinput: function (e) {
    this.setData({
      passtext: e.detail.value
    })
  },
  clearpass: function (e) {
    this.setData({
      passtext: ""
    })
  },
  changeifpass: function (e) {
    let _this=this;
    this.setData({
      ifpass: !_this.data.ifpass
    })
    // console.log(_this.data.ifpass)
  },
  changeifqq: function (e) {
    let _this = this;
    this.setData({
      ifqq: !_this.data.ifqq
    })
    // console.log(_this.data.ifqq)
  },
  changeiftel: function (e) {
    let _this = this;
    this.setData({
      iftel: !_this.data.iftel
    })
    // console.log(_this.data.iftel)
  },
  time:function(){
    let _this = this;
    if (this.data.teltext == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.teltext.length != 11) {
      wx.showToast({
        title: "请输入完整手机号",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (_this.data.time == 60) {
      _this.setData({
        time: _this.data.time - 1
      })
      wx.request({//获取短信验证

        url: app.data.hostAjax + "/api/Account/SendSMSValidateCode",
        data: {
          mobilePhone: this.data.teltext
        },
        method: "post",
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res)
          if (res.data.result.isSuccess) {
            _this.setData({
              interval: setInterval(function () {
                _this.setTime();
              }, 1000)
            })
          } else {
            clearInterval(_this.data.interval);
            _this.setData({
              time: 60
            })
            wx.showToast({
              title: res.data.result.message,
              icon: 'none',
              duration: 2000
            })
          }
        },
        error(res){
          clearInterval(_this.data.interval);
          _this.setData({
            time: 60
          })
        }
      })
    }
  },
  submit:function(){
    let _this=this;
    if (this.data.ifActive){//手机号登录
      if (this.data.teltext==""){
        wx.showToast({
          title: "请输入手机号",
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (this.data.teltext.length != 11) {
        wx.showToast({
          title: "请输入完整手机号",
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (this.data.codetext == "") {
        wx.showToast({
          title: "请输入验证码",
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      wx.request({
        url: app.data.hostAjax + '/api/Account/Authenticate', 
        data: {
          username: this.data.teltext,
          password: this.data.codetext
        },
        method: "post",
        header: {
          'content-type': 'application/json' 
        },
        success(res) {
          if (res.data.success) {
            wx.setStorageSync("token", res.data.result);
            if (_this.data.showM) {//提示默认登录
              _this.bindViewTap();
            } else {
              _this.updateOPenid();
            }
          } else {
            wx.showToast({
              title: res.data.error.message,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
      return false;
    }
    wx.request({
      url: app.data.hostAjax + '/api/Account/Authenticate', // 获取token--储存-作为用户登录的凭证
      data: {
        username: this.data.qqtext,
        password: this.data.passtext
      },
      method: "post",
      header: {
        'content-type': 'application/json' 
      },
      success(res) {
        if(res.data.success){
          wx.setStorageSync("token", res.data.result);
          if(_this.data.showM){//提示默认登录
            _this.bindViewTap();
          }else{
            _this.updateOPenid();
          }
         
          
        }else{
          wx.showToast({
            title: res.data.error.message,
            icon: 'none',
            duration: 2000
          })
        }
       
      }
    })
    
  },

  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },
  setTime: function () {
    let _this = this;
    if (this.data.time == 15) {//倒计时开始
      this.setData({
        time: this.data.time - 1
      })
    } else if (this.data.time == 0) {//倒计时结束
      clearInterval(_this.data.interval);
      this.setData({
        time: 15
      })
      _this.setData({

        testfloat2: false,
      })
      _this.submit();
    } else {
      this.setData({
        time: this.data.time - 1
      })
    }
  }
})
