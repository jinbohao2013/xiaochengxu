const util = require('../../../utils/util.js');
var app = getApp();

import Toast from '../../../dist/toast/toast';
Page({
  data: {
    address: {
      id:0,
      province_id: 0,
      city_id: 0,
      district_id: 0,
      address: '',
      full_region: '',
      name: '',
      mobile: '',
      is_default: 0
    },
    addvalues:[],
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
  bindinputMobile(event) {
    let address = this.data.address;
    address.mobile = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    address.name = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddress (event){
    let address = this.data.address;
    address.address = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindIsDefault(){
    let address = this.data.address;
    address.is_default = !address.is_default;
    this.setData({
      address: address
    });
  },
  getAddressDetail() {
    let that = this;
    util.request(app.data.hostAjax +"/api/my/v1/selectreceivingaddress", { 
      user_id: wx.getStorageSync("userIdBuyGood"),
      id: this.data.addressId,
     }).then(function (res) {
       if (res.Data.list.length) {
       console.log(res)
       var data={
         id: res.Data.list[0].id,
         province_id: res.Data.list[0].provinceid,
         city_id: res.Data.list[0].cityid,
         district_id: res.Data.list[0].areaid,
         address: res.Data.list[0].address,
           full_region: res.Data.list[0].provincename + "," + res.Data.list[0].cityname + "," + res.Data.list[0].areaname,
           name: res.Data.list[0].NAME,
           mobile: res.Data.list[0].phone,
           is_default: res.Data.list[0].state!="2"?0:1
       }
       
      
        that.setData({
          address: data
        });
         console.log(that.data.address)
      }
    });
  },
  deleteAddress(event) {
    console.log(event.target)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.userbankid;
          util.request(app.data.hostAjax + '/api/my/v1/deletereceivingaddress', { user_id: wx.getStorageSync("userIdBuyGood"), userbankid: addressId }, 'get').then(function (res) {
            if (res.Success) {
              wx.navigateBack({
                delta: 1
              })
            }
          }).catch(e => {
            console.log(e)
          });

        }
      }
    })
    return false;

  },
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.id != 0;
    });

    that.setData({
      selectRegionDone: doneStatus
    })

  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });
    this.getRegionList(0);
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options.id)
    if (options.id!=0) {
      this.setData({
        addressId: options.id
      });
      this.getAddressDetail();
      wx.setNavigationBarTitle({
        title: '收货地址-修改'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '收货地址-新增'
      })
    }
  },
  onCancel(){
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
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex-1].id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })
    if (this.data.regionType==1){//查询省
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
      
    });
  },
  selectRegion1(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    //查询xian
    util.request(app.data.hostAjax + '/api/user/v1/pcd', { prov: this.data.address.province_id, cit: regionIndex}).then(function (res) {
      
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
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.province_id = selectRegionList[0].id;
    address.city_id = selectRegionList[1].id;
    address.district_id = selectRegionList[2].id;
    address.province_name = selectRegionList[0].name;
    address.city_name = selectRegionList[1].name;
    address.district_name = selectRegionList[2].name;
    address.full_region = selectRegionList.map(item => {
      return item.name;
    }).join('');

    this.setData({
      address: address,
      openSelectRegion: false
    });

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },
  
  cancelAddress(){
    wx.navigateBack({
      delta: 1
    })
  },
  saveAddress(){
    console.log(this.data.address)
    let address = this.data.address;

    if (address.name == '') {
      Toast('请输入姓名');

      return false;
    }

    if (address.mobile == '') {
      Toast('请输入手机号码');
      return false;
    }


    // if (address.district_id == 0) {
    //   Toast('请输入省市区');
    //   return false;
    // }

    if (address.address == '') {
      Toast('请输入详细地址');
      return false;
    }


    let _this = this, ajaxUrl = app.data.hostAjax + '/api/my/v1/addreceivingaddress', ajaxDate = {
      user_id: wx.getStorageSync("userIdBuyGood"),
      name: address.name,
      phone: address.mobile,
      postalcode: 212000,
      province: address.province_id,
      city: address.city_id,
      area: address.district_id,
      address: address.address,
      state: address.is_default ? "2" : "0"
    };
    if (this.data.addressId){
      ajaxUrl = app.data.hostAjax + '/api/my/v1/updatereceivingaddress';//修改
      ajaxDate = {
        receivingaddressid: this.data.addressId,
        user_id: wx.getStorageSync("userIdBuyGood"),
        name: address.name,
        phone: address.mobile,
        postalcode: 212000,
        province: address.province_id,
        city: address.city_id,
        area: address.district_id,
        address: address.address,
        state: address.is_default ? "2" : "0"
      }
    }
    wx.request({
      url: ajaxUrl, // 收货地址
      data: ajaxDate,
      method: "post",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res.data)
        console.log(res.data.Code==200)
        if (res.data.Code=="200") {
          wx.navigateBack({
            delta:1
          })
        } else {
          
        }
      }
    })
    // util.request(api.AddressSave, { 
    //   id: address.id,
      
    //   province_id: address.province_id,
    //   city_id: address.city_id,
    //   district_id: address.district_id,
    //   address: address.address,
    //   is_default: address.is_default,
    // }, 'POST').then(function (res) {
    //   if (res.errno === 0) {
    //     wx.navigateTo({
    //       url: '/pages/ucenter/address/address',
    //     })
    //   }
    // });

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