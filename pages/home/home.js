import config from '../../config'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Images: [
      "http://www.yqcoffee.cn/image/pic1.png",
      "http://www.yqcoffee.cn/image/pic2.png",
      "http://www.yqcoffee.cn/image/pic3.png",
      "http://www.yqcoffee.cn/image/pic4.png",
    ],
    userInfo: {},
    userInfoImg:"",
    userInfoName: "",
    usertype:2,
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
  
  go_byout(){
    wx.navigateTo({
      url: '/pages/invite/invite?id=1',//买断店长
    })
  },
  godatastatistics: function () {
    wx.showToast({
      title: '暂未开放',
      icon:'none'
    })
    return
    wx.navigateTo({
      url: '/pages/goods/index/index',//数据统计
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
    wx.request({
      url: config.apiHost + v,
      data: {
        // userid: app.globalData.user_id
        userid: wx.getStorageSync("userid"),
      },
      success: (res) => {
        console.log(res)
        if (type==2){//如果是分销商
          wx.setStorageSync("fenxiaoshangid", res.data.Data.qrurl.split("distributorid=")[1]);//获取储存分享出去的经销商id
        } else if (type ==3) {//如果是店长
          wx.setStorageSync("fenxiaoshangid", res.data.Data.qrurl.split("distributorid=")[1]);//获取储存分享出去的经销商id
        } else if (type == 4){//如果是分销员
          wx.setStorageSync("fenxiaoshangid", res.data.Data.salapersonid);//获取储存分享出去的 分销员id
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
    
    let _this=this;
    //获取用户登录信息
    wx.request({
      url: config.apiHost + "/api/user/v1/info",
      data: {
        user_id: wx.getStorageSync("userid"),
        curr_id: wx.getStorageSync("userid"),
      },
      success: (res) => {
        console.log(res)
        try {
          _this.setData({
            userInfoName: res.data.Data.nickname,
            userInfoImg: res.data.Data.imgurl,
            usertype: res.data.Data.usertype,
          })
        } catch (e) {

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow:function(){
    var type = Number(wx.getStorageSync("usertype"))
    console.log(type)
    switch (type){
      case 3:
        this.getData('/api/dester/v1/getshopownerdester', app.globalData.user_id, app.globalData.usertype)
        break;
      case 2:
        this.getData('/api/dester/v1/getdistributordester', app.globalData.user_id, app.globalData.usertype)
        break;
      case 4:
        this.getData('/api/dester/v1/getsalespersondester', app.globalData.user_id, app.globalData.usertype)
        break;
      default:
        break;
    }
  }
})