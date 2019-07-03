const util = require('../../../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userbankid:0,//银行卡id--用作于处理银行卡的业务
    type:"",//我是type，控制接受短信的类型
    doRequeset:true,//控制所有的数据请求不能连点
    ifCode:true,//走每一步都要短息验证--默认是true--需要
    show: false,//判断显示--短信验证的弹框
    show1: false,//判断显示--删除和设置默认的弹框
    show2: false,//判断显示--删除和设置默认的弹框
    timeCode:"获取验证码",//点击获取验证码的功能
    time:60,
    hideTel: "15836859549".substr(0, 3) + '****' + "15836859549".substr(7),//隐藏中间几位的手机号
    tel:"",//输入的手机号
    actions: [
      { name: '设置默认账户' },
      { name: '使用银行卡' },
      { name: '修改银行卡' },
      { name: '删除银行卡' }
    ],
    actions1: [
      { name: '设置默认账户' },
      { name: '使用微信钱包' }
    ],
    weixinshow: false,//默认是不显示微信钱包默认-只有银行卡没有默认时才显示
    cardlist:[],//获取银行卡的列表显示
    selectid:false,//用于判断选择的银行卡id--默认是微信，--如果银行卡是默认-就设置银行卡的id
  },
  changeAccount1(e){//银行卡--选择银行卡处理的类型
    console.log(e.currentTarget.dataset.name)
    
    if (this.data.ifCode){//如果没有短信验证--进入短信验证弹框
      this.onClose(e.currentTarget.dataset.name)
      return false;
    }
    this.setData({ show1: !this.data.show1 });
  },
  toggleActionSheet1(e) {//银行卡
  
    
    try{
      console.log(e.detail.name)
      if (e.currentTarget.dataset.name == "银行卡处理") {
        this.setData({
          userbankid: e.currentTarget.dataset.id,
        })
      }
      if (e.detail.name == "设置默认账户") {
        this.onClose(e.detail.name)
      } else if (e.detail.name == "使用银行卡") {
        this.onClose(e.detail.name)
      } else if (e.detail.name == "修改银行卡") {
        this.onClose(e.detail.name)
      } else if (e.detail.name == "删除银行卡") {
        this.onClose(e.detail.name)
      }
    }catch(e){

    }
    this.setData({ show1: !this.data.show1 });
  },
  toggleActionSheet2(e) {//微信账户
    console.log(e)
    try {
      if (e.detail.name == "设置默认账户") {
        this.onClose("微信设置默认账户")
      } else if (e.detail.name == "使用微信钱包") {
        this.onClose("使用微信钱包")
      }
    } catch (e) {

    }
    this.setData({ show2: !this.data.show2 });
  },
  onClose(typename) {
    this.setData({ 
      show: !this.data.show
    });
    if (typename){
      this.setData({
        type: typename,//银行卡添加
      });
    }
  },
  changeAccount2(){
    this.setData({ show2: !this.data.show2 });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: wx.getStorageSync("phone")
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
    this.setData({
      selectid: wx.getStorageSync("userbankid")
    })
    console
    let _this = this;
    //每次进来都查询银行卡列表
    util.request(app.data.hostAjax + '/api/my/v1/selectuserbank', {
      user_id: wx.getStorageSync("userid"),
      // id: 0,//state为2时银行卡id传0查询默认绑定银行卡
      // state: 2,//默认的银行卡，要是没有
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          cardlist: res.Data.list
        })
      } else {
        _this.setData({
          weixinshow: true
        })
      }
    });
    //每次进来都查询默认
    util.request(app.data.hostAjax + '/api/my/v1/selectuserbank', {
      user_id: wx.getStorageSync("userid"),
      id: 0,//state为2时银行卡id传0查询默认绑定银行卡
      state: 2,//默认的银行卡，要是没有
    }).then(function (res) {
      if (res.Data.list.length !=0) {
        
      }else{
        if (wx.getStorageSync("useweixin")){
          _this.setData({
            weixinshow: true
          })
        }else{
          
        }
        
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  delet: function () {
    let _this = this;
    util.request(app.data.hostAjax + '/api/my/v1/deleteuserbank', {
      user_id: wx.getStorageSync("userid"),
      userbankid: this.data.userbankid,//	银行卡id
    }).then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: "删除成功",
        })
        _this.onShow();
      } else {
        wx.showToast({
          title: res.Msg,
          icon:"none"
        })
      }
    });
  },
  carddefault: function () {
    let _this = this;
    util.request(app.data.hostAjax + '/api/my/v1/defaultuserbank', {
      user_id: wx.getStorageSync("userid"),
      userbankid: this.data.userbankid,//	银行卡id
    }).then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: "设置成功",
        })
        _this.onShow();
      } else {
        wx.showToast({
          title: res.Msg,
          icon: "none"
        })
      }
    });
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
  cancel() {
    console.log("取消")
  },
  confirm(){
    let _this=this;
    util.request(app.data.hostAjax + '/api/my/v1/verificationcode', {
      code: this.data.tel,
      phone: this.data.phone,//	银行卡id
    }, ).then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: "验证成功",
        })
        if (_this.data.type == "银行卡添加") {
          wx.navigateTo({
            url: '../cardbind/cardbind?code=' + _this.data.tel,
          })
        } else if (_this.data.type == "设置默认账户") {
          _this.carddefault();
        } else if (_this.data.type == "使用银行卡") {
          wx.setStorageSync("userbankid", _this.data.userbankid);//用作于提现页面的使用
          _this.onShow();
        } else if (_this.data.type == "修改银行卡") {
          wx.navigateTo({
            url: '../cardbind/cardbind?code=' + _this.data.tel + "&userbankid=" + _this.data.userbankid,
          })
        } else if (_this.data.type == "删除银行卡") {
          _this.delet();
        } else if (_this.data.type == "使用微信钱包") {
          wx.setStorageSync("useweixin", "yes");
          wx.removeStorageSync("userbankid");//删除之后刷新一下，默认的就是微信钱包
          _this.onShow();
        } else if (_this.data.type == "微信设置默认账户") {
          wx.removeStorageSync("userbankid");//
          _this.onShow();
        } 
      } else {
        wx.showToast({
          title: res.Msg,
          icon: "none"
        })
      }
    });
    console.log(this.data.type)
    this.onClose();
    
    this.setData({
      tel: "",
    })
    
  },
  
  catchCode: function () {
    console.log("获取验证码")
    let _this = this;

    if (_this.data.time == 60&&this.data.doRequeset) {
      this.setData({
        doRequeset:false
      })
      wx.request({//获取短信验证

        url: app.data.hostAjax + "/api/user/v1/sms",
        data: {
          type: 4,
          account: wx.getStorageSync("phone")
        },
        method: "post",
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        success(res) {
          _this.setData({
            time: _this.data.time - 1,
            doRequeset: true
          })
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 2000
          })
          if (res.data.Code == 200) {
            _this.setData({
              interval: setInterval(function () {
                _this.setTime();
              }, 1000)
            })
          } else {
            clearInterval(_this.data.interval);
            _this.setData({
              time: 60
            })
          }
        }
      })
    }




  },
  setTime: function () {
    let _this = this;
    if (this.data.time == 60) {//倒计时开始
      this.setData({
        time: this.data.time - 1
      })
    } else if (this.data.time == 0) {//倒计时结束
      clearInterval(_this.data.interval);
      this.setData({
        time: 60
      })
    } else {
      this.setData({
        time: this.data.time - 1
      })
    }
  },
  skipe(e){
    if (e.currentTarget.dataset.index){
      this.setData({
        tel: this.data.tel + e.currentTarget.dataset.index
      })
    }else{//删除一位
      this.setData({
        tel:this.data.tel.substr(0,this.data.tel.length-1)
      })
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})