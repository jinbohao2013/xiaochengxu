// pages/component/toast_coupon/toast_coupon.js
const util = require('../../../utils/util.js');
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgurl:""
  },
  attached:function(){
    var that = this;
    util.request(app.data.hostAjax + '/api/my/v1/getticketcenter', {//领券中心
      userid: wx.getStorageSync("userIdBuyGood")
    }).then(function (res) {
      if (res.Code == "200") {
        var arr = res.Data.list;
        that.setData({
          orderList: arr,
        });
      } else {
      }
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getgoods(e) {
      
      // 确认收货
      let that = this;
      wx.showModal({
        title: '领取提示',
        content: '是否确定',
        success(res) {
          if (res.confirm) {
            util.request(app.data.hostAjax + '/api/my/v1/addmyallcoupon', {//全部领取优惠券
              userid: wx.getStorageSync("userIdBuyGood")
            }).then(function (res) {
              if (res.Code == "200") {
                wx.showToast({
                  title: '领取成功'
                })
                var myEventDetail = {} // detail对象，提供给事件监听函数
                var myEventOption = {} // 触发事件的选项
                that.triggerEvent('myevent', myEventDetail, myEventOption)
              } else {
                wx.showToast({
                  title: '网络错误，情稍后重试！',
                  icon: "none"
                })
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
})
