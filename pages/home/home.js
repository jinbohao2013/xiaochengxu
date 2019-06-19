import config from '../../config'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Images: [
      "../../image/pic1.png",
      "../../image/pic2.png"
    ],
    userInfo: {}
  },
  // 去推广
  goPromotion:function(){
    wx.navigateTo({
      url: '/pages/invite/invite',
    })
  },
  //去立即提现
  gowithdrawal: function () {
    wx.navigateTo({
      url: '/pages/money/index/index',
    })
  },

  // 赚佣金
  earnCommission:function(){
    wx.navigateTo({
      url: '/pages/goods/index/index',
    })
  },
  // 获取店铺信息
  getShopData:function(v){
    wx.request({
      url: config.apiHost +'/api/dester/v1/getshopinfo',
      data: {
        shopid: v
      },
      success: (res) => {
        console.log(res)
        this.setData({
          shopName: res.data.Data.shopname
        })
      }
    })
  },
  // 数据加载
  getData: function(v,e,type){
    console.log(config.apiHost + v)
    wx.request({
      url: config.apiHost + v,
      data: {
        // userid: app.globalData.user_id
        userid: e
      },
      success: (res) => {
        console.log(res)
        if (type==2){//如果是分销商
          wx.setStorageSync("fenxiaoshangid", res.data.Data.qrurl.split("distributorid=")[1]);//获取储存分享出去的经销商id
        }else if (3) {//如果是店长
          wx.setStorageSync("fenxiaoshangid", res.data.Data.qrurl.split("distributorid=")[1]);//获取储存分享出去的经销商id
        } else {//如果是分销员
          
        }
        wx.setStorageSync("shopid", res.data.Data.shopid);//获取储存分享出去的店铺id
        this.getShopData(res.data.Data.shopid)
        this.setData({
          dataInfo:res.data.Data
        })
      }
    })
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取用户登录信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function(){
    this.setData({
      userInfo: app.globalData.userInfo,
      usertype: app.globalData.usertype
    })
    switch (app.globalData.usertype){
      case '3':
        this.getData('/api/dester/v1/getshopownerdester', app.globalData.user_id, app.globalData.usertype)
        break;
      case '2':
        this.getData('/api/dester/v1/getdistributordester', app.globalData.user_id, app.globalData.usertype)
        break;
      case '4':
        this.getData('/api/dester/v1/getsalespersondester', app.globalData.user_id, app.globalData.usertype)
        break;
      default:
        break;
    }
    console.log(app.globalData.usertype)
    console.log(app.globalData.user_id)
    // this.getData('/api/dester/v1/getdistributordester', 2)
    // this.getData('/api/dester/v1/getshopownerdester', 3)
    // this.getData('/api/dester/v1/getsalespersondester', 6)
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