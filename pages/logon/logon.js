import config from '../../config'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logonImage: [
      "http://www.yqcoffee.cn/image/demo_1.jpg",
      "http://www.yqcoffee.cn/image/denglu.png",
      "http://www.yqcoffee.cn/image/mima.png"
    ],
    codeSubmit: false,
    phone: '',
    submitTimeNum: 0,
    times: null,
    submitTime: 60,
  },
  // 登录
  login:function(){
    wx.request({
      url: config.apiHost + '/api/user/v1/logincode',
      method: "GET",
      data: {
        phone: this.data.phone,
        code: this.data.code,
        openid: wx.getStorageSync("openid")
      },
      success: (res) => {
        console.log(res)
        if(res.data.Msg=='操作成功'){
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
          app.globalData.phone = res.data.Data.phone
          app.globalData.token = res.data.Data.token
          app.globalData.user_id = res.data.Data.user_id
          app.globalData.usertype = res.data.Data.usertype
          
          if (res.data.Data.usertype == 1) {
            //1为普通用户 2为经销商 3为店长 4为分销员
          } else {
            //储存--的经销商的用户id、店长的用户id、分销员的用户id--用于购买支付的id是分销员id不是用户id
            wx.setStorageSync("userid", res.data.Data.user_id);
            wx.setStorageSync("usertype", parseInt(res.data.Data.usertype));
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/home/home',
              })
            }, 1500)
          }
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon:'none'
          })
        }
        // wx.redirectTo({
        //   url: '/pages/home/home',
        // })
      }
    })
  },
  // 发送验证码
  sumbitCode: function() {
    var phone = this.data.phone
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/
    if (phone.length == 11 && myreg.test(phone)) {
      wx.request({
        url: config.apiHost + '/api/user/v1/sms',
        method: "POST",
        data: {
          type: 2,
          account: phone
        },
        success: (res) => {
          console.log(res)
          if (res.data.Msg == '发送成功') {
            wx.showToast({
              title: '验证码已发送',
              icon: 'none'
            })
            this.setData({
              codeSubmit: true,
              submitTimeNum: this.data.submitTimeNum + 1
            }, () => {
              clearInterval(this.data.times)
              this.data.times = setInterval(() => {
                this.setData({
                  submitTime: this.data.submitTime - 1
                }, () => {
                  if (this.data.submitTime == 0) {
                    clearInterval(this.data.times)
                    this.setData({
                      codeSubmit: false,
                      submitTime: 60,
                    })
                  }
                })
              }, 1000)
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
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
  },
  // 输入框
  changeInput: function(e) {
    console.log(e)
    var types = e.currentTarget.dataset.types
    if (types=='phone'){
      this.setData({
        phone: e.detail.value
      })
    }else if(types=='code'){
      this.setData({
        code: e.detail.value
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      usertype: app.globalData.usertype
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})