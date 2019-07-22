var util = require('../../../utils/util.js');
const app = getApp()
// const WXAPI = require('../../wxapi/main')
Page({
  data: {
    hasRefund: false,
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    orderList: [],
    pageindex:1,
   ajaxpageindex: 0,
    pagesize:20,
    hideLoading: true,//隐藏底部加载
    loading:true,
    searchtxt:"",
    hasOnShow: false
  },
  statusTap: function (e) {
    console.log(e)
    var curType
    if(e){
       curType = e.currentTarget.dataset.index;
      this.data.currentType = curType
      if (curType == 0) {
        this.setData({
          searchType: 100
        });
      } else {
        this.setData({
          searchType: parseInt(curType) - 1
        });
      }
    }else{

    }
    
    this.setData({
      orderList: [],
      pageindex: 1,
      ajaxpageindex: 0,
      hideLoading: true,//隐藏底部加载
      loading: true,
      // currentType: curType
    });
   
    this.onShow();
  },
  
  scroll() {//滚动时触发

  },
  scrolltolower() {
    this.setData({
      hideLoading:false
    })
    return
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false

      })
      // setTimeout(function(){
      //   _this.setData({
      //     loading: true
      //   })
      // },1000)
      console.log("在我这里调取加载数据")
      if (!this.data.hideLoading) {
        return
      }
      this.setData({
        pageindex: this.data.pageindex + 1
      })
      this.onShow();
    }

  },
  onLoad: function (options) {
    this.setData({
      scroolHeight: app.data.windowHeight
    })
    if (options && options.type) {

      if (options.type == 100) {
        this.setData({
          hasRefund: false,
          currentType: options.type,
          searchType: parseInt(options.type)
        });
      } else {
        this.setData({
          hasRefund: false,
           currentType: options.type,
          searchType: parseInt(options.type)-1
        });
      }
    }else{
      this.setData({
        hasRefund: false,
        currentType: 0,
        searchType: 100
      });
    }
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  getOrder: function (pagesize) {
    var that = this;
    util.request(app.data.hostAjax + '/api/my/v1/getticketcenter', {//领券中心
      userid: wx.getStorageSync("userIdBuyGood")
    }).then(function (res) {
      if (res.Code == "200") {
        that.setData({
          orderList: res.Data.list,
          loading: true,
          ajaxpageindex: that.data.pageindex
        });
        if (res.Data.list.length < 10) {
          that.setData({
            hideLoading: false
          })
        }
      } else {
        that.setData({
          hideLoading: false
        })
      }
    });
  },
  onShow: function () {
    var that = this;
    util.request(app.data.hostAjax + '/api/my/v1/getticketcenter', {//领券中心
      userid: wx.getStorageSync("userIdBuyGood")
    }).then(function (res) {
      if (res.Code == "200") {
        var arr = that.data.orderList.concat(res.Data.list);
        console.log("that.data.pageindex=", that.data.pageindex )
        console.log(that.data.pageindex == that.data.ajaxpageindex)
        if (that.data.pageindex == that.data.ajaxpageindex) {
          that.getOrder(that.data.orderList.length)
          return;
        }
        that.setData({
          orderList: arr,
          loading: true,
          ajaxpageindex: that.data.pageindex
        });
        if (res.Data.list.length < 20) {
          that.setData({
            hideLoading: false
          })
        }
      } else {
        that.setData({
          hideLoading: false
        })
      }
    });
  },
  getgoods(e) {
    // 确认收货
    let that = this;
    wx.showModal({
      title: '领取提示',
      content: '是否确定',
      success(res) {
        if (res.confirm) {
          util.request(app.data.hostAjax + '/api/my/v1/addmycoupon', {
            userid: wx.getStorageSync("userIdBuyGood"),
            couponid: e.currentTarget.dataset.id,
          }).then(function (res) {
            if (res.Code == "200") {
              wx.showToast({
                title: '领取成功'
              })
              that.statusTap()
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
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  }
})