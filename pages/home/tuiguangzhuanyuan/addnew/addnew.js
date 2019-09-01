import config from '../../../../config'
const util = require('../../../../utils/util.js');
var app = getApp();

import Toast from '../../../../dist/toast/toast';
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
    s1: "",
    address: {
      id: 0,
      province_id: 0,
      city_id: 0,
      district_id: 0,
      address: '',
      full_region: '',
      name: '',
      mobile: '',
      is_default: 0
    },
    addressStr:"",
    code:"",
    addvalues: [],
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [
      { id: 0, name: '省份', parent_id: 1, type: 1 },
      { id: 0, name: '城市', parent_id: 1, type: 2 },
      { id: 0, name: '区县', parent_id: 1, type: 3 }
    ],
    regionType: 1,
    regionList: [],
    selectRegionDone: false
  },
  checkboxChange: function (e) {
    this.setData({
      s1: e.detail.value
    })
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
        if (this.data.s1 == ""){
          Toast("请选择收款方")
          return
        }
        
            if(this.data.ifskip){return}//如果是，那么不能点
            this.setData({
              ifskip:true
            })
            wx.request({
              url: config.apiHost + '/api/prom/v1/addpromdistributor',
              method: "get",
              data: {
                distributorid: wx.getStorageSync("distributorid"),
                nickname: this.data.name, 
                phone: this.data.phone,
                corporatename: this.data.code,
                conpayaddress: this.data.addressStr,
                ifreceiver:this.data.s1=='true'? 0 : 1,// 1分销商 0经销商
                province: this.data.address.province_id,  //分销地区省id
                city: this.data.address.city_id,//分销地区市id
                area: this.data.address.district_id,//分销地区区id
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
          addressStr: e.detail.value
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

  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(app.data.hostAjax + '/api/user/v1/pcd', { prov: regionId }).then(function (res) {
      // that.data.address.province_id = 0
      // that.data.address.city_id = 0
      // that.data.address.district_id = 0
      console.log(that.data.addvalues)
      that.setData({
        addvalues: [],
        regionList: res.Data,
        // address: that.data.address
      })
    });
  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });
    this.getRegionList(0);
  },
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })
    if (this.data.regionType == 1) {//查询省
      //查询市
      this.getRegionList(0)
    }
  },
  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(app.data.hostAjax + '/api/user/v1/pcd', { prov: regionId }).then(function (res) {
      // that.data.address.province_id = 0
      // that.data.address.city_id = 0
      // that.data.address.district_id = 0
      console.log(that.data.addvalues)
      that.setData({
        addvalues: [],
        regionList: res.Data,
        // address: that.data.address
      })
    });
  },
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    //查询市
    util.request(app.data.hostAjax + '/api/user/v1/pcd', { prov: regionIndex }).then(function (res) {
      let arr = that.data.addvalues
      if (res.Data.length == 0) {
        that.data.address.full_region = event.target.dataset.name
        that.data.address.province_id = regionIndex
        that.data.address.city_id = 0
        that.data.address.district_id = 0
        that.setData({
          address: that.data.address,
          openSelectRegion: false
        })
        console.log(that.data.address.province_id + "--" + that.data.address.city_id + "--" + that.data.address.district_id)
        return
      }

      arr[0] = {
        id: regionIndex,
        name: event.target.dataset.name
      }
      //  arr.push(event.target.dataset.name)
      that.setData({
        addvalues: arr,
        regionList: res.Data,
        regionType: 2,
        // address: that.data.address
      })
      console.log(that.data.addvalues)
    });
  },
  selectRegion1(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    //查询xian
    util.request(app.data.hostAjax + '/api/user/v1/pcd', { prov: this.data.address.province_id, cit: regionIndex }).then(function (res) {

      // that.data.address.city_id = regionIndex
      // that.data.address.district_id = 0
      let arr = that.data.addvalues
      arr[1] = {
        id: regionIndex,
        name: event.target.dataset.name
      }
      that.setData({
        addvalues: arr,
        regionList: res.Data,
        regionType: 3,
      })
      console.log(that.data.addvalues)
    });
  },
  selectRegion2(event) {

    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    //设置地区
    let arr = that.data.addvalues
    arr[2] = {
      id: regionIndex,
      name: event.target.dataset.name
    }
    this.data.address.full_region = arr.map(item => item.name).join(',')
    that.data.address.province_id = arr[0].id
    that.data.address.city_id = arr[1].id
    that.data.address.district_id = arr[2].id
    that.setData({
      addvalues: arr,
      address: that.data.address,
    })
    this.cancelSelectRegion();
  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });
    console.log(this.data.address.province_id + "--" + this.data.address.city_id + "--" + this.data.address.district_id)
  }
})