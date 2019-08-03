// pages/person/person.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.data.statusBarHeight,
    userInfo: {
      nickname: "",
      phone: "",
      sex: "",
      birthday: "",
    },
    timecode: 60,//增加的手机验证码
  },
  time: function () {
    let _this = this;
    if (this.data.userInfo.phone.length!=11){
      wx.showToast({
        title: "请填写完整的手机号",
        icon: 'none',
        duration: 2500
      })
      return
    }
    //第三步时,此时第一步已经确认了手机号等信息。可以直接获取短信
    if (_this.data.timecode == 60) {
      _this.setData({
        timecode: _this.data.timecode - 1
      })
      wx.request({//获取短信验证
        url: app.data.hostAjax + "/api/user/v1/sms",
        data: {
          type:5,
          account: this.data.userInfo.phone
        },
        method: "post",
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res)
          if (res.data.Code==200) {
            _this.setData({
              interval: setInterval(function () {
                _this.setTime();
              }, 1000)
            })
          } else {
            clearInterval(_this.data.interval);
            _this.setData({
              timecode: 60
            })
            wx.showToast({
              title: res.data.Msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        error(res) {
          clearInterval(_this.data.interval);
          _this.setData({
            timecode: 60
          })
        }
      })
    }
  },
  setTime: function () {
    let _this = this;
    if (this.data.timecode == 60) {//倒计时开始
      this.setData({
        timecode: this.data.time - 1
      })
    } else if (this.data.timecode == 0) {//倒计时结束
      clearInterval(_this.data.interval);
      this.setData({
        timecode: 60
      })
    } else {
      this.setData({
        timecode: this.data.timecode - 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (!wx.getStorageSync("openid")) {
    //   wx.reLaunch({
    //     url: '/pages/index/index'
    //   })
    // }
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/info', // 获取用户信息
      data: {
        user_id: wx.getStorageSync("userIdBuyGood"),
        curr_id: wx.getStorageSync("userIdBuyGood"),
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        
        if (res.data.Success) {
          var a = (res.data.Data.createdAt.split("Date(")[1].split(")")[0])
          _this.setData({
            userInfo: res.data.Data,
            time: app.dateFmt(parseInt(a))
          })
        } else {
          
        }
      }
    })
  },
  logOut: function (options) {
    //修改信息
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/user/v1/modifyinfo', // 微信openid登录
      data: {
        user_id: wx.getStorageSync("userIdBuyGood"),
        token :wx.getStorageSync("token"),
        nickname: this.data.userInfo.nickname,
        phone: this.data.userInfo.phone,
        sex: this.data.userInfo.sex,
        birthday: this.data.userInfo.birthday,
        imgurl: this.data.userInfo.imgurl,
        autograph:"",
      },
      method: "post",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        
        if (res.data.Success) {
          wx.navigateBack({
            delta: 1
          })

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  editUser() {
    //信息修改的
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  binname: function (e) {
    console.log(e)
    this.data.userInfo.nickname=e.detail.value
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  binphone: function (e) {
    console.log(e)
    this.data.userInfo.phone = e.detail.value
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  binsex: function (e) {
    console.log(e)
    this.data.userInfo.sex = e.detail.value
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  binbirthday: function (e) {
    console.log(e)
    this.data.userInfo.birthday = e.detail.value
    this.setData({
      userInfo: this.data.userInfo
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
  }
})