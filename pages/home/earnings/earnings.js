// pages/money/index/index.js
const util = require('../../../utils/util.js');
import Toast from '../../../dist/toast/toast';
let yesterday = new Date().getTime() - 24 * 60 * 60 * 1000
let day7 = new Date().getTime() - 24 * 60 * 60 * 1000 * 7
var app = getApp();
Page({
  skipNextPage(e) {
    //点击图片跳转到详情
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  chooseT(event){
    var index;
    if(typeof event == "number"){
      index = event
    }else{
      index = event.currentTarget.dataset.id 
    }
    this.setData({
      chooseid: index
    })
    if (index==1){
      this.setData({
        starttime: new Date(yesterday).toLocaleDateString(),
        endtime: new Date(yesterday).toLocaleDateString(),
      })
    } else if (index == 2){
      this.setData({
        starttime: new Date(day7).toLocaleDateString(),
        endtime: new Date().toLocaleDateString(),
      })
    }else{
      this.setData({
        starttime: "",
        endtime: "",
      })
    }
  },
  selecttime(event) {
    this.setData({
      selecttime: event.currentTarget.dataset.time
    })
  },
   onInput(event) {
    const { detail, currentTarget } = event;
    const result = this.getResult(detail, currentTarget.dataset.type);
     if (this.data.selecttime =="starttime"){
       this.setData({
         starttime: result
       })
     } else if(this.data.selecttime == "endtime"){
       this.setData({
         endtime: result
       })
     }
     
  },
  getResult(time, type) {
    const date = new Date(time);
    switch(type) {
      case 'datetime':
    return date.toLocaleString();
    case 'date':
    return date.toLocaleDateString();
    case 'year-month':
    return `${date.getFullYear()}/${date.getMonth() + 1}`;
    case 'time':
    return time;
    default:
        return '';
  }
  },
  confirm(e){
    if (!this.data.starttime){
      Toast("请选择开始时间")
      return
    }
    if (!this.data.endtime) {
      Toast("请选择结束时间")
      return
    }
    let yesterday = new Date().getTime() - 24 * 60 * 60 * 1000
    let day7 = new Date().getTime() - 24 * 60 * 60 * 1000 * 7
    if (new Date(yesterday).toLocaleDateString() == this.data.starttime && new Date(yesterday).toLocaleDateString() == this.data.endtime) {
      this.setData({
        chooseid: 1
      })
    } else if (new Date(day7).toLocaleDateString() == this.data.starttime && new Date().toLocaleDateString() == this.data.endtime) {
      this.setData({
        chooseid: 2
      })
    } else {
      this.setData({
        chooseid: 0
      })
    }
    this.showtop();
  },
  showtop(){
    this.setData({
      topsearch:!this.data.topsearch
    })
  },
  data: {
    selecttime: "",//选择时间时的名字starttime or endtime
    starttime: "",
    endtime:"",
    topsearch:false,//自定义时间
    chooseid:3,//1-昨天，2,-近七天，3-全部
    ismaiduan:0,
    true: true,
    ajaxData: [],
    isIphoneX: app.data.isIphoneX,
    scroolHeight: 200,
    loading: true,
    hideLoading: true,//隐藏底部加载
    hideBotom: true,//隐藏底部导航
    show: false,
    pageindex: 1,
    pagesize: 10,//每页的商品数量
    minDate: new Date(2018, 0, 1).getTime(),
    maxDate: new Date(2029, 10, 1).getTime(),
    currentDate2: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },
  changeIndex(e) {
    console.log(e)
    this.setData({
      acticeInxex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.chooseT(1)
    this.setData({
      ismaiduan: wx.getStorageSync("isoverpay") == 1 ? 1 : 0
    })
    console.log(wx.getStorageSync("isoverpay"))
    let _this = this;
    //经销商GET /api/dester/v1/getdistributoryesterdayadd 店长查看新增代理
    util.request(app.data.hostAjax + '/api/dester/v1/getshopowneryesterdayadd', {
      userid: wx.getStorageSync("userid"),
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxData: res.Data.list,
          sqsalespersonnums: res.Data.sqsalespersonnums,
          newsalaperson: res.Data.newsalaperson,
          newcustomer: res.Data.newcustomer,
        })
      } else {
        _this.setData({
          ajaxData:[],
          sqsalespersonnums: 0,
          newsalaperson: 0,
          newcustomer: 0,
        })
      }
    });
    return
    this.setData({
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight - 59 : app.data.windowHeight //- 59 - 51
    })
    
    wx.request({
      url: app.data.hostAjax + '/api/dester/v1/getdetailedinfo', // 收支明细
      data: {
        userid: wx.getStorageSync("userid"),
        pageindex: this.data.pageindex,
        pagesize: this.data.pagesize,
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        _this.setData({
          loading: true
        })
        if (res.data.Success) {
          console.log(res.data);
          let arr = _this.data.ajaxData;
          try {
            if (res.data.Data.list) {
              arr = arr.concat(res.data.Data.list)
            }

          } catch (e) {
            console.log("出错了");
          }

          _this.setData({
            ajaxData: arr
          })
          if (res.data.Data.list.length < 10) {
            _this.setData({
              hideLoading: false
            })
          }
          console.log("111111111111111111111", _this.data.hideLoading)
        } else {
          _this.setData({
            hideLoading: false
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading()
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
  onChange(event) {
    console.warn(`change: ${event.detail}`);
    this.setData({
      value1: event.detail
    })
  },
  onSearch(e) {
    this.setData({
      ajaxData: [],
      hideLoading: true,
      goodsValue: e.detail
    })
    this.onLoad();
  },
  onCancel() {//取消搜索搜索时触发

  },
  scroll() {//滚动时触发

  },
  onPullDownRefresh: function () {

    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载

    setTimeout(function () {

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
  },
  scrolltolower() {
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false

      })
      // setTimeout(function () {
      //   _this.setData({
      //     loading: true
      //   })
      // }, 1000)
      console.log("在我这里调取加载数据")
      if (!this.data.hideLoading) {
        return
      }
      this.setData({
        pageindex: this.data.pageindex + 1
      })
      this.onLoad();
    }

  },
  onGotUserInfo: function (e) {//点击下一步
    wx.showLoading({
      title: '稍等',
    })
    console.log(e)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    console.log("登录信息获取，然后跳转到详情页面--调起支付")
    //判断口味是否选择
    console.log("口味：", this.data.acticeInxex)
    console.log(this.data.value1 * this.data.ajaxGood.e_price)
    if (this.data.acticeInxex != null) {
      //提交到订单确认
      wx.navigateTo({
        url: '../payMent/pay?ajaxData=' + JSON.stringify({
          id: this.data.firstId,//商品id
          title: this.data.ajaxGood.englishname + this.data.ajaxData.name,//标题
          desc: this.data.ajaxGood.synopsis,//描述
          img: this.data.ajaxGood.smallimg,
          price: this.data.ajaxGood.e_price,//单价
          num: this.data.value1,//数量
          taste: this.data.ajaxGood.tastename[this.data.acticeInxex].names,//口味名字
          tasteId: this.data.ajaxGood.tastename[this.data.acticeInxex].id,//口味id
          totle: this.data.value1 * this.data.ajaxGood.e_price * 100,//总金额=数量乘以单价==单位是分
        }),
      })
    } else {
      //提示选择口味
      wx.showToast({
        title: '请选择口味',
        icon: "none"
      })
      if (this.data.show) {
        return false
      }
      this.setData({ show: !this.data.show });
    }

  },
  onClose() {
    this.setData({ show: !this.data.show });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})