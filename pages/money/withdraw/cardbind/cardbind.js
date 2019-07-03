const util = require('../../../../utils/util.js');
var app = getApp();

import Toast from '../../../../dist/toast/toast';
Page({
  PickerChange(e) {
    console.log(e);
    console.log(this.data.arr1)
    this.setData({
      index: e.detail.value,
      bankname: this.data.arr1[e.detail.value],
      banknumber: this.data.arr2[e.detail.value]
    })
  },
  data: {
    arr1:[],//银行卡名称列表
    arr2:[],//银行卡编号列表
    bankname: "",//银行卡名称 ,
    banknumber: "",//银行卡编号
    cardnumber :"",//卡号
    phone :"",//手机号
    code:"",
    name:"",//持卡人姓名
    openerregion : "",
    addvalues: [],
    userbankid:0,//用于修改银行卡用
    index:null,
  },
  bindinputMobile(event) {
    this.setData({
      phone: event.detail.value
    });
  },
  bindinputName(event) {
    this.setData({
      name: event.detail.value
    });
  },
  bindcardnumber(event) {
    this.setData({
      cardnumber: event.detail.value
    });
  },
  bindadress(event) {
    this.setData({
      openerregion : event.detail.value
    });
  },
  
  onLoad: function (options) {
    console.log(options)
    this.setData({
      code: options.code
    })
    let that = this;
    util.request(app.data.hostAjax + "/api/my/v1/selectbankcard", {
      
    }).then(function (res) {
      if (res.Code == "200") {
       
        var arr1=[],arr2=[]
        for(var i=0;i<res.Data.list.length;i++){
          arr1.push(res.Data.list[i].bankname)
          arr2.push(res.Data.list[i].bankid)
        }
        that.setData({
          arr1: arr1,
          arr2:arr2,
        })
        if (options.userbankid) {
          // wx.showToast({
          //   title: '我进来了，查询准用id',
          // })
          //每次进来都查询默认
          util.request(app.data.hostAjax + '/api/my/v1/selectuserbank', {
            user_id: wx.getStorageSync("userid"),
            id: options.userbankid,//
          }).then(function (res) {
            if (res.Code == "200") {
              let a = that.data.arr1.indexOf(res.Data.list[0].bankname)
              console.log(a)
              that.setData({
                index: a,
                userbankid: options.userbankid,
                bankname: res.Data.list[0].bankname,
                banknumber: res.Data.list[0].banknumber,
                cardnumber: res.Data.list[0].cardnumber,
                name: res.Data.list[0].name,
                openerregion: res.Data.list[0].openerregion,
                phone: res.Data.list[0].phone,
              })
            } else {
              wx.showToast({
                title: '网络错误',
                icon: "none"
              })
            }
          });
        }
      }
    });
    
  },
  submit() {
    
    if (this.data.userbankid){
      this.modefy();
    }
    let that = this;
    util.request(app.data.hostAjax + "/api/my/v1/adduserbank", {
      user_id: wx.getStorageSync("userid"),
      bankname: this.data.bankname,//银行卡名称 ,
      banknumber: this.data.banknumber,//银行卡编号
      cardnumber: this.data.cardnumber,//卡号
      phone: this.data.phone,//手机号
      code: this.data.code,
      name: this.data.name,//持卡人姓名
      openerregion: this.data.openerregion,
      state: 2
    }, "post").then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: '绑卡成功',
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.Msg,
        })
      }
    });
  },
  modefy() {
    let that = this;
    util.request(app.data.hostAjax + "/api/my/v1/updateuserbank", {
      userbankid: that.data.userbankid,
      user_id: wx.getStorageSync("userid"),
      bankname: this.data.bankname,//银行卡名称 ,
      banknumber: this.data.banknumber,//银行卡编号
      cardnumber: this.data.cardnumber,//卡号
      phone: this.data.phone,//手机号
      code: this.data.code,
      name: this.data.name,//持卡人姓名
      openerregion: this.data.openerregion,
      state: 2
    }, "post").then(function (res) {
      if (res.Code == "200") {
        wx.showToast({
          title: '修改成功',
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.Msg,
        })
      }
    });
  },
  onCancel() {
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });
  },
  onConfirm(event) {
    const { values } = event.detail;

    this.data.address.full_region = values.map(item => item.name).join(',')

    this.setData({
      address: this.data.address,
      openSelectRegion: !this.data.openSelectRegion
    });
  },
  onReady: function () {

  },
  
  
  cancelAddress() {
    wx.navigateBack({
      delta: 1
    })
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})