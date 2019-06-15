// pages/bindingshop/bindingshop.js
import config from '../../config'
const app = getApp()
Page({
  data: {
    bindingImage: [
      "../../image/dianpu.png",
      "../../image/dizhi.png",
      "../../image/phone.png",
      "../../image/yanzheng.png"
    ],
    submitTimeNum: 0,
    times: null,
    submitTime: 60,
    phone: '',
    name: '',
    code: '',
    address: '',
    isLogin: false
  },
  // 登录
  login: function () {
    wx.login({
      success: (res) => {
        console.log(res)
        wx.request({
          url: config.apiHost + '/api/weixin/v1/jscode2session',
          data: {
            response_type: res.code,
          },
          method: "GET",
          success: (res) => {
            let ress = JSON.parse(res.data.Data)
            let openid = JSON.parse(res.data.Data).openid
            // console.log(res.data)
            //获取用户的openid 
            console.log("用户的openid" + openid)
            app.globalData.openid = openid
            wx.request({
              url: config.apiHost + '/api/user/v1/wxloginopenid',
              data: {
                openid: openid,
                imgurl: app.globalData.userInfo.avatarUrl,
                nickname: app.globalData.userInfo.nickName
              },
              success: (ress) => {
                console.log(ress)
                let usertype = ress.data.Data.usertype
                app.globalData.usertype = ress.data.Data.usertype
                app.globalData.user_id = ress.data.Data.user_id
                app.globalData.token = ress.data.Data.token 
              }
            })
          }
        })
      }
    })
  },
  // 绑定手机号
  bindingPhone:function(){
    if (this.data.name.length>0){
      if (this.data.address.length > 0) {
        if (this.data.phone.length > 0) {
          if (this.data.code.length > 0) {
            console.log('开始绑定')
            wx.request({
              url: config.apiHost + '/api/user/v1/addshopowner_manager',
              method: "POST",
              data: {
                distributorid: 1,
                phone: this.data.phone,
                code: this.data.code,
                shopname: this.data.name,
                openid: app.globalData.openid,
                Address: this.data.address
              },
              success: (res) => {
                console.log(res)
                if(res.data.Msg == '操作成功'){
                  wx.showToast({
                    title: '绑定成功',
                    icon: 'success',
                  })
                  setTimeout(()=>{
                    wx.redirectTo({
                      url: '/pages/home/home',
                    })
                    app.globalData.user_id = res.data.Data.user_id
                  },1500)
                }else{
                  wx.showToast({
                    title: res.data.Msg,
                    icon: 'none',
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '请填写验证码！',
              icon: 'none'
            })
          }  
        } else {
          wx.showToast({
            title: '请填写手机号！',
            icon: 'none'
          })
        }  
      } else {
        wx.showToast({
          title: '请填写店铺地址！',
          icon: 'none'
        })
      }  
    }else{
      wx.showToast({
        title: '请填写店铺名称！',
        icon:'none'
      })
    }    
  },
  // 发送验证码
  sumbitCode: function () {
    var phone = this.data.phone
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/
    if (phone.length == 11 && myreg.test(phone)) {
      wx.request({
        url: config.apiHost + '/api/user/v1/sms',
        method: "POST",
        data: {
          type: 0,
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
  changeInput: function (e) {
    console.log(e)
    var types = e.currentTarget.dataset.types
    switch (types){
      case 'name':
        this.setData({
          name: e.detail.value
        })
        break;
      case 'address':
        this.setData({
          address: e.detail.value
        })
        break;
      case 'phone':
        this.setData({
          phone: e.detail.value
        })
        break;
      case 'code':
        this.setData({
          code: e.detail.value
        })
        break;
      default:
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getUserInfo({
      success: (data) => {
        console.log(data);
        //更新data中的userInfo
        app.globalData.userInfo = data.userInfo
        this.login()
      },
      fail: () => {
        this.setData({
          isLogin: true
        })
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
  onShareAppMessage: function () {

  }
})