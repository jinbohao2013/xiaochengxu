import config from '../../config'
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismaiduan: 0,
    xiugai: 0,
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
    allcustomer: 0,//累计客户
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
   
    wx.navigateTo({
      url: '/pages/home/statistical/statistical',//数据统计
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
    let _this=this;
    wx.request({
      url: config.apiHost + v,
      data: {
        // userid: app.globalData.user_id
        userid: wx.getStorageSync("userid"),
      },
      success: (res) => {
        wx.setStorageSync("isoverpay", "");
        wx.setStorageSync("fenxiaoshangid", res.data.Data.salapersonid);
        if (type==2){//如果是分销商
          wx.setStorageSync("logo", res.data.Data.logimg);
          wx.setStorageSync("distributorid", res.data.Data.distributorid);
        } else if (type ==3) {//如果是店长
          console.log("ismaiduan", res.data.Data.isoverpay)
          wx.setStorageSync("distributorid", res.data.Data.distributorid);
          _this.setData({
            ismaiduan: parseInt(res.data.Data.isoverpay)
          })
          wx.setStorageSync("isoverpay", parseInt(res.data.Data.isoverpay));
          wx.setStorageSync("logo", res.data.Data.distributorlog);
          // if (parseInt(res.data.Data.isoverpay)==1){
          //   //获取买断店长设置的比例
          //   util.request(app.data.hostAjax + '/api/user/v1/getshopownerpercents', {
          //     userid: wx.getStorageSync("userid"),
          //     shopid: wx.getStorageSync("shopid"),
          //   }).then(function (res) {
          //     if (res.Code == "200" && parseInt(res.Data.shopowner)!=0) {
          //       //已经设置过了
          //       _this.setData({
          //         xiugai: 1
          //       })
          //     }else{
          //       _this.setData({
          //         xiugai: 0
          //       })
          //     }
          //   });
          // }
        } else if (type == 4){//如果是分销员
        }
        wx.setStorageSync("shopid", res.data.Data.shopid);//获取储存分享出去的店铺id
        _this.getShopData(res.data.Data.shopid)
        _this.setData({
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
    
    // 获取订单列表
    var that = this;
    var type = Number(wx.getStorageSync("usertype"))
    console.log(type)
    switch (type){
      case 3:
        this.getData('/api/dester/v1/getshopownerdester', app.globalData.user_id, type)
        //店长查看新增代理
        util.request(app.data.hostAjax + '/api/dester/v1/getshopowneryesterdayadd', {
          userid: wx.getStorageSync("userid"),
        }).then(function (res) {
          if (res.Code == "200") {
            that.setData({
              sqsalespersonnums: res.Data.sqsalespersonnums,
              newsalaperson: res.Data.newsalaperson,
              newcustomer: res.Data.newcustomer,
            })
          }
        });
        break;
      case 2:
        this.getData('/api/dester/v1/getdistributordester', app.globalData.user_id, type)
        //经销商GET /api/dester/v1/getdistributoryesterdayadd 经销商查看新增代理
        util.request(app.data.hostAjax + '/api/dester/v1/getdistributoryesterdayadd', {
          userid: wx.getStorageSync("userid"),
        }).then(function (res) {
          if (res.Code == "200") {
            that.setData({
              newsalaperson: res.Data.newsalaperson,
              newshop: res.Data.newshop,
              sqshopownernums: res.Data.sqshopownernums,
            })
          } else {
            
          }
        });
        break;
      case 4:
        this.getData('/api/dester/v1/getsalespersondester', app.globalData.user_id, type)
        break;
      default:
        break;
    }
    util.request(app.data.hostAjax + '/api/dester/v1/getmycustomerlist', {//累计客户
      userid: wx.getStorageSync("userid"),
      usertype: wx.getStorageSync("usertype"),//用户角色 2为经销商 3为店长 4为分销员
      pagesize: 1111111,
      pageindex: 1,
    }).then(function (res) {
      if (res.Code == "200") {
        that.setData({
          allcustomer: res.Data.record
        });
      } else {
        that.setData({
          allcustomer: 0
        })
      }
    });

    
    util.request(app.data.hostAjax + '/api/transaction/v1/distributororderlist', {//订单列表
      userid: wx.getStorageSync("userid"),
      ordertype: 1,
      pagesize: 1111111,
      pageindex: 1,
      searchtxt: ""
    }).then(function (res) {
      if (res.Code == "200") {
        that.setData({
          ordernum2: res.Data.record
        });
      } else {
        that.setData({
          ordernum2: 0
        })
      }
    });
    util.request(app.data.hostAjax + '/api/transaction/v1/distributororderlist', {//订单列表
      userid: wx.getStorageSync("userid"),
      ordertype: 100,
      pagesize: 1111111,
      pageindex: 1,
      searchtxt: ""
    }).then(function (res) {
      if (res.Code == "200") {
        that.setData({
          ordernum1: res.Data.record
        });
      } else {
        that.setData({
          ordernum1: 0
        })
      }
    });
  }
})