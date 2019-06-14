var app = getApp();
const { $Message } = require('../../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifActive:true,
    statusBarHeight: app.data.statusBarHeight,
    orderLists: [1, 2, 3],
    ajaxData: null,
    showLoad: false,
    expresscompany: "",
    expressnumber: "",
    numList: [{
      name: '验证方式'
    }, {
      name: '重置密码'
    }, {
      name: '完成'
    }],
    num: 0,
    time: 60,
    interval: null,
    teltext:"",
    codetext: "",
    passtext: "",
    repasstext: "",
    qqtext: "",
    timeout:5,
    timeOutInterv:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (!wx.getStorageSync("token")) {
    //   wx.reLaunch({
    //     url: '../../../pages/index/index'
    //   })
    // }
    return false;
    console.log(JSON.parse(options.data))
    this.setData({
      expresscompany: JSON.parse(options.data).expresscompany,
      expressnumber: JSON.parse(options.data).expressnumber,
    })
    console.log(this.data.expressnumber)
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/Order/Detail',
      data: {
        orderNum: JSON.parse(options.data).id,
        companyCode: JSON.parse(options.data).code
      },
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        console.log(res.data.result.makeTime);
        if (res.data.success) {
          _this.setData({
            ajaxData: res.data.result,
            showLoad: true
          });
        }

      }
    })
  },
  return: function () {
    if(this.data.num==1){
      this.setData({
        num: this.data.num - 1
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
    
  },
  addnum: function (e) {
    if(e){
      this.setData({
        num: this.data.num + 1,
        ifActive: e.currentTarget.dataset.id
      })
    }else{
      this.setData({
        num: this.data.num + 1
      })
    }
    
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

  },
  timeout:function(){
    let _this = this; 
    this.setData({
      timeOutInterv: setInterval(function () {
        if (_this.data.timeout > 1) {
          _this.setData({
            timeout: _this.data.timeout - 1
          })
          console.log(_this.data.timeout)
        } else {
          clearInterval(_this.data.timeOutInterv);
          wx.navigateBack({
            delta: 1
          })
        }

      }, 1000)
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timeOutInterv);
    // if (this.data.num != 0) {
    //   this.setData({
    //     num: this.data.num - 1
    //   })
    //   wx.navigateTo({
    //     url: 'setPasswords/setPasswords',
    //   })
    // } else {
      
    // }
    
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
  telinput: function (e) {
    this.setData({
      teltext: e.detail.value
    })
  },
  qqinput: function (e) {
    this.setData({
      qqtext: e.detail.value
    })
  },
  codeinput: function (e) {
    this.setData({
      codetext: e.detail.value
    })
  },
  passinput: function (e) {
    this.setData({
      passtext: e.detail.value
    })
  },
  repassinput: function (e) {
    this.setData({
      repasstext: e.detail.value
    })
  },
  handleSuccess() {
    $Message({
      content: '邮件发送成功',
      type: 'success',
      duration: 5
    });
  },
  time: function () {
    
    let _this = this;
    if (this.data.ifActive == 'true'){
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
          error(res) {
            clearInterval(_this.data.interval);
            _this.setData({
              time: 60
            })
          }
        })
      }
    }else{
      if (this.data.qqtext == "") {
        wx.showToast({
          title: '请输入QQ',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (_this.data.time == 60) {
        _this.setData({
          time: _this.data.time - 1
        })
        wx.request({//获取邮箱验证

          url: app.data.hostAjax + "/api/Account/SendMailValidateCode",
          data: {
            email: this.data.qqtext+"@qq.com"
          },
          method: "post",
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            console.log(res)
            if (res.data.result.isSuccess) {
              _this.handleSuccess()
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
          error(res) {
            clearInterval(_this.data.interval);
            _this.setData({
              time: 60
            })
          }
        })
      }
    }
    
    
  },
  submit: function () {
    // this.addnum();
    // this.timeout();
    let _this = this;
    if (this.data.ifActive=='true') {//手机号重置
      if (this.data.teltext == "") {
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
      if (this.data.passtext == "" || this.data.repasstext == "") {
        wx.showToast({
          title: "请输入密码和重复密码",
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (this.data.passtext != this.data.repasstext) {
        wx.showToast({
          title: "两次密码输入不相同",
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      wx.request({
        url: app.data.hostAjax + '/api/Account/ResetPasswordByMobilePhone',
        data: {
          mobilePhone: this.data.teltext,
          validateCode: this.data.codetext,
          password: this.data.passtext
        },
        method: "post",
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          if (res.data.result.isSuccess) {//重置密码成功
            _this.addnum();
            _this.timeout();
          } else {
            wx.showToast({
              title: res.data.result.message,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
      return false;
    }
    // ifActive ==="false"
    if (this.data.qqtext == "") {
      wx.showToast({
        title: "请输入QQ",
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
    if (this.data.passtext == "" || this.data.repasstext == "") {
      wx.showToast({
        title: "请输入密码和重复密码",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.passtext != this.data.repasstext) {
      wx.showToast({
        title: "两次密码输入不相同",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.request({
      url: app.data.hostAjax + '/api/Account/ResetPasswordByEmail',//邮箱重置
      data: {
        email: this.data.qqtext,
        validateCode: this.data.codetext,
        password: this.data.passtext
      },
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data.result.isSuccess) {//重置密码成功
          _this.addnum();
          _this.timeout();
        } else {
          wx.showToast({
            title: res.data.result.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      path: '/pages/index/index?stop=1'
    }
  },
  setTime: function () {
    let _this = this;
    if (this.data.time == 60) {//倒计时开始
      this.setData({
        time: this.data.time - 1
      })
    } else if (this.data.time == 0) {//倒计时结束
      clearInterval(_this.data.interval);
      this.setData({
        time: 60
      })
    } else {
      this.setData({
        time: this.data.time - 1
      })
    }
  }
})