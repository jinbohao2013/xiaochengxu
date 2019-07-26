import config from '../../../../config'
const app = getApp()
Page({
  data: {
    bindingImage: [
      "http://www.yqcoffee.cn/image/icon_API.png",
      "http://www.yqcoffee.cn/image/dizhi.png",
      "http://www.yqcoffee.cn/image/phone.png",
      "http://www.yqcoffee.cn/image/yanzheng.png"
    ],
    salaperson: "",//返佣比例
    isCard1: false,
    isCard2:false,
    name: "",
    phone:"",
  },
  salaperson(e) {
    this.setData({
      salaperson: e.detail.value
    })
  },
  isCard1(e) {
    this.setData({
      isCard1: e.detail.value
    })
  },
  isCard2(e) {
    this.setData({
      isCard2: e.detail.value
    })
  },
  // 
  bindingPhone: function () {
    let _this=this;
    if (this.data.name.length > 0) {
      if (this.data.phone.length > 0) {
        
        if (this.data.salaperson.length > 0) {
            if(this.data.ifskip){return}//如果是，那么不能点
            this.setData({
              ifskip:true
            })
            wx.request({
              url: config.apiHost + '/api/user/v1/addsubprivileges',
              method: "get",
              data: {
                distributorid: wx.getStorageSync("distributorid"),
                nickname: this.data.name, 
                phone: this.data.phone,
                percents: this.data.salaperson,
                sendgoods: this.data.isCard1?1:0,//发货状态 1开 0关
                posaudi: this.data.isCard2 ? 1 : 0,//pos审核状态 1开 0关
              },
              success: (res) => {
                if (res.data.Msg == '操作成功') {
                  wx.showToast({
                    title: '已添加',
                    icon: 'success',
                  })
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500)
                } else {
                  this.setData({
                    ifskip: false//出错了就打开限制，可以点击
                  })
                  wx.showToast({
                    title: res.data.Msg,
                    icon: 'none',
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '请填写返佣比例！',
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
        title: '请填写姓名！',
        icon: 'none'
      })
    }
  },
  // 输入框
  changeInput: function (e) {
    var types = e.currentTarget.dataset.types
    switch (types) {
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