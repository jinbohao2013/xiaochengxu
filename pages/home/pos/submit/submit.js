var app = getApp();
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:true,
    ifHide:3,
    isIphoneX: app.data.isIphoneX,
    statusBarHeight: app.data.statusBarHeight,
    orderLists: [1, 2, 3],
    proName:"",//订单名字
    showLoad: false,
    expresscompany: "",
    imgList: [],
    imgList_thumb:[],
    imgListStr:"",
    num:0,
    visible1: false,
    visible2: false,
    visible3: false,
    type1:-1,//方案的类型
    expressnumber: "",
    text1:"",//售后原因
    orderNum:"",
    text2: "",//意向建议方案
    type2: -1,//意向建议方案的type
    text3: "",//选择银行
    text4: "",//账户名
    text5:"",//意向优惠金额
    text6: "",//意向其他解决方案
    text7: "",//补印数量
    text5_num: "",//账户号
    textareaBValue:"",//问题描述
    texttel: "",//联系方式
    textqq: "",//联系QQ
    onece:false,
    processPictures:[],//工作人员处理图片数组
    options: null,
    manID: null,
    reMainID: null,
    sumPrice: null,
    permissions:null,
    launchTime: "",//预出货时间
    name: "",//送货员名称
  },
  onLoad: function (options) {
    this.setData({
      options: options
    })
    let _this = this;
    
  },
  onShow: function () {
    this._onLoad(this.data.options);
    if (wx.getStorageSync("attation")) {
      wx.showToast({
        title: '成功',
        icon: 'none',
        duration: 2000
      })
      wx.removeStorageSync('attation')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  _onLoad: function (options) {
    if (!wx.getStorageSync("token")) {
      wx.reLaunch({
        url: '../../../pages/index/index'
      })
    }
    let _this = this;
    console.log(options)
    if (JSON.stringify(options) == "{}" || !JSON.parse(options.data)){
      this.setData({
        ifHide: 1
      })
      return false;
    }
    if (JSON.parse(options.data).id=="漏单"){
      //此时用/api/OrderAfterSale/Detail/{id}这个接口
      wx.request({
        url: app.data.hostAjax + '/api/OrderAfterSale/Detail', // 查找订单的审核状态判断订单的
        data: {
          id: JSON.parse(options.data).idd
        },
        method: "get",
        header: {
          'content-type': 'application/json',
          'Authorization': "Bearer " + wx.getStorageSync("token")
        },
        success(res) {
          console.log(res.data);
          let arr1 = [], arr2 = [],arr3=[];

          if (res.data.result) {//正在审核中
            if (res.data.result.pictures) {
              for (let i = 0; i < res.data.result.pictures.length; i++) {
                arr1.push(app.data.imgHost + res.data.result.pictures[i])
                arr3.push(app.data.imgHost + res.data.result.pictures[i].split('.')[0] + "_thumb." + res.data.result.pictures[i].split('.')[1])
              }
            }
            if (res.data.result.processPictures) {
              for (let i = 0; i < res.data.result.processPictures.length; i++) {
                arr2.push(app.data.imgHost + res.data.result.processPictures[i].url)
              }
            }
            
            if (res.data.result.status == 2) {
              _this.setData({
                num: 2,
              })
            } else {
              _this.setData({
                num: 1,
              })
            }
            
            _this.setData({
              ifHide: 3,
              imgList_thumb: arr3,              
              imgList: arr1,
              ajaxNum1: res.data.result,
              processPictures: arr2
            })
          } else {
            _this.setData({
              ifHide: 1
            })
          }
        }
      })
      return false;
    }
    wx.request({
      url: app.data.hostAjax + '/api/OrderAfterSale/DetailBySn', // 查找订单的审核状态判断订单的
      data: {
        sn: JSON.parse(options.data).id 
      },
      method: "get",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        console.log(res.data);
        let arr1 = [], arr2 = [], arr3 = [];
        
        if (res.data.result) {//正在审核中
          if (res.data.result.pictures) {
            for (let i = 0; i < res.data.result.pictures.length; i++) {
              arr1.push(app.data.imgHost + res.data.result.pictures[i])
              arr3.push(app.data.imgHost + res.data.result.pictures[i].split('.')[0] + "_thumb." + res.data.result.pictures[i].split('.')[1])
            }
          }
          if (res.data.result.processPictures) {
            for (let i = 0; i < res.data.result.processPictures.length; i++) {
              arr2.push(app.data.imgHost + res.data.result.processPictures[i].url)
            }
          }
          
          if (res.data.result.status == 2) {
            _this.setData({
              num: 2,
            })
          } else if (res.data.result.status == 0) {
            _this.setData({
              num: 0,
            })
          } else if (res.data.result.status == 1) {
            _this.setData({
              num: 1,
            })
          } else {
            _this.setData({
              num: 0,
            })
          }
          _this.setData({
            reMainID: res.data.result.deliveryManId,
            ifHide: 3,
            imgList_thumb: arr3,     
            imgList: arr1,
            ajaxNum1:res.data.result,
            processPictures: arr2
          })
        } else {
          _this.setData({
            ifHide: 1
          })
        }
      }
    })
    this.setData({
      orderNum: JSON.parse(options.data).id 
    })
    //最后把订单号赋予senddata进行传递
    this.setData({
      sendDate: JSON.stringify({
        id: _this.data.orderNum
      })
    });
    this.getOrder();
  },
  orderNum(e) {
    this.data.ajaxData.productName = "";
    this.setData({
      orderNum: e.detail.value.trim(),
      proName: ""
    })
  },
  return: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  text4(e) {
    this.setData({
      text4: e.detail.value
    })
    this.data.ajaxData.bankCardName = e.detail.value;//账户名
  },
  text5(e) {
    this.setData({
      text5: e.detail.value
    })
    this.data.ajaxData.discountPrice = e.detail.value;//意向优惠金额
  },
  text5_num(e) {
    this.setData({
      text5_num: e.detail.value
    })
    this.data.ajaxData.bankCardNumber = e.detail.value;//银行卡号
  },
  text6(e) {
    this.setData({
      text6: e.detail.value
    })
    this.data.ajaxData.solutionDescription = e.detail.value;//解决方案描述
  },
  text7(e) {
    this.setData({
      text7: e.detail.value
    })
    this.data.ajaxData.reprintCount = e.detail.value;//补印数量
  },
  texttel(e) {
    this.setData({
      texttel: e.detail.value
    })
    this.data.ajaxData.telephone = e.detail.value;//联系电话 
  },
  textqq(e) {
    this.setData({
      textqq: e.detail.value
    })
    this.data.ajaxData.customerQQ = e.detail.value;//客户QQ 
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
    this.data.ajaxData.description = e.detail.value;
  },
  handleOpen1() {
    this.setData({
      visible1: true
    });
  },
  handleOpen2() {
    this.setData({
      visible2: true
    });
  },
  handleOpen3() {
    this.setData({
      visible3: true
    });
  },
  searchOrder:function(){//查询订单是否已经提价售后
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/OrderAfterSale/List',//根据订单号获取订单名称
      data: {
        "startTime": "",
        "endTime": "",
        "productNameOrSN": this.data.orderNum,
      },
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        if (res.data.result.items.length==1) {//表明订单存在
           wx.showModal({
             content: '订单已存在',
             confirmText: '去查看',
            success(res) {
              if (res.confirm) {
               _this._onLoad({
                 data:JSON.stringify({
                   id: _this.data.orderNum
                 })
               })

              }else{

              }
            }
          })
        }
      }
    })
  },
  getOrder:function(){
    if (this.data.orderNum==""){
      return false;
    }
    let _this=this;
    wx.request({
      url: app.data.hostAjax + '/api/OrderAfterSale/GetOrder',//根据订单号获取订单名称
      data: {
        sn: this.data.orderNum
      },
      method: "get",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        if (res.data.result) {
          _this.setData({
            proName: res.data.result.name,
            sumPrice: res.data.result.payment.sum / 100,
            launchTime: res.data.result.delivery.time
          });
          _this.data.ajaxData.productName = res.data.result.name;
          _this.data.ajaxData.sn = _this.data.orderNum;
          _this.data.ajaxData.category = res.data.result.category;
          _this.data.ajaxData.makeTime = res.data.result.makeTime;
          _this.data.ajaxData.orderAmount = res.data.result.payment.sum; 
        }else{
          _this.setData({
            // orderNum: "",
            proName: ""
          })
          _this.data.ajaxData.productName = "";
          _this.data.ajaxData.sn = "";
          _this.data.ajaxData.category = "";
          _this.data.ajaxData.orderAmount =0;
          _this.data.ajaxData.makeTime = "";
          if (res.data.error){
            wx.showToast({
              title: res.data.error.message,
              icon: 'none',
              duration: 3000
            })
          }else{
            wx.showToast({
              title: '该订单号在系统中不存在或者还没有审核',
              icon: 'none',
              duration: 3000
            })
          }
          
        }

      }
    })
  },
  handleClickItem1( detail ) {
    console.log(detail)
    const index = detail.detail.index + 1;
    this.setData({
      text1: this.data.actions1[detail.detail.index].name,
      type1: detail.detail.index,
      visible1: false,
      actions1: [
        { name: '下错单' },
        { name: '印刷问题' },
        { name: '裁切问题' },
        { name: '后工问题' },
        { name: '打包问题' },
        { name: '贴错标签' },
        { name: '运输问题' },
        { name: '误活' },
        { name: '原材料问题' }
      ]
    });
    
    if (parseInt(detail.detail.index) > 5) {
      this.data.ajaxData.reason = parseInt(detail.detail.index) - 1
    } else if (parseInt(detail.detail.index) == 5) {
      this.data.ajaxData.reason = 8
    }else{
      this.data.ajaxData.reason = parseInt(detail.detail.index);
    }
    if (parseInt(detail.detail.index)==8){
      this.data.ajaxData.reason = 9
    }
    // if (detail.detail.index==8){
    //   this.setData({
    //     orderNum:"漏单",
    //     proName: "漏单",
    //   })
    //   this.data.ajaxData.productName = "漏单";
    //   this.data.ajaxData.sn = "漏单";
    // }else{
    //   if(this.data.orderNum=="漏单"){
    //     this.setData({
    //       orderNum: "",
    //       proName: "",
    //     })
    //   }
    // }
    console.log(this.data.ajaxData.reason)
    let obj = this.data.actions1;
    obj[detail.detail.index].color ="#FFC450";
    this.setData({
      actions1:obj
    });
    // $Message({
    //   content: '点击了选项' + index
    // });
  },
  handleClickItem2(detail) {
    
    const index = detail.detail.index + 1;
    this.data.ajaxData.solution = detail.detail.index;
    this.setData({
      type2: detail.detail.index,//
      text2: this.data.actions2[detail.detail.index].name,
      visible2: false,
      actions2: [
        { name: '退款退货' },
        { name: '补印' },
        { name: '优惠货款' },
        { name: '其他' },
      ],
      text3:"",//初始化方案-选择银行
      text4: "",//初始化方案-账户名
      text5: "",//初始化方案-意向优惠金额
      text6: "",//初始化方案-意向的其他解决方案
      text7: "",//初始化方案-补印数量
      text5_num: "",//初始化方案-账户号
    });
    this.data.ajaxData.bank = 0;
    this.data.ajaxData.reprintCount = 0;
    this.data.ajaxData.solutionDescription = "";
    this.data.ajaxData.bankCardName = "";
    this.data.ajaxData.bankCardNumber = 0;
    this.data.ajaxData.discountPrice = 0;
    let obj = this.data.actions2;
    obj[detail.detail.index].color = "#FFC450";
    this.setData({
      actions2: obj,
      text3: "",//初始化方案-选择银行
      actions3: [
        { name: '工商银行' },
        { name: '农业银行' },
        { name: '建设银行' },
        { name: '中国银行' },
      ],
    });
    console.log(this.data.type2)
  },
  handleClickItem3(detail) {
    console.log(detail)
    const index = detail.detail.index + 1;
    this.data.ajaxData.bank = detail.detail.index;//银行卡类型0工商银行 1农业银行 2建设银行 3中国银行
    this.setData({
      text3: this.data.actions3[detail.detail.index].name,
      visible3: false,
      actions3: [
        { name: '工商银行' },
        { name: '农业银行' },
        { name: '建设银行' },
        { name: '中国银行' },
      ],
    });
    let obj = this.data.actions3;
    obj[detail.detail.index].color = "#FFC450";
    this.setData({
      actions3: obj
    });
  },
  handleCancel1() {
    this.setData({
      visible1: false,
      visible3: false,
      visible2: false
    });
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  submit: function () {
    
    if (this.data.onece){
      // wx.showToast({
      //   title: '您已经提交，请等待工作人员处理',
      //   icon: 'success',
      //   duration: 2000
      // })
      
      return false;
    }
    
    let _this = this;
    if (this.data.text1 == "") {
      wx.showToast({
        title: '请选择售后原因',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.orderNum == "") {
      wx.showToast({
        title: '请填写订单号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (_this.data.proName == "") {
      wx.showToast({
        title: '请填写准确的订单号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.textareaBValue == "") {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.text2 == "") {
      wx.showToast({
        title: '请选择建议方案',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if ((this.data.type2 == 2)&this.data.text5=="") {
      wx.showToast({
        title: '请填写意向优惠金额',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.text7.indexOf(".") >= 0) {
      wx.showToast({
        title: '补印数量必须为整数',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if ((this.data.type2 == 1) & this.data.text7 == "") {
      wx.showToast({
        title: '请填写补印数量',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (isNaN(this.data.text7)){
      wx.showToast({
        title: '补印数量必须为数字',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if ((this.data.type2 == 3) & this.data.text6 == "") {
      wx.showToast({
        title: '请填写其他意向的解决方案',
        icon: 'none',
        duration: 2000
      })
      return;
    }
   
    let imgStr="";
    for (var i = 0; i < this.data.imgList.length; i++){
      imgStr+=this.data.imgList[i].split("https://content.shengdaprint.com/")[1];
      if (i < this.data.imgList.length-1){
        imgStr +=","
      }
    }
    console.log(imgStr);
    this.data.ajaxData.picture = imgStr;
   
    this.setData({
      onece: true,
      isLoading: false
    })
    wx.request({
      url: app.data.hostAjax + '/api/OrderAfterSale/Create',//提价 提交售后
      data: this.data.ajaxData,
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        if (res.data.result.isSuccess) {
          //跳到售后详情页面
          wx.redirectTo({
            url: 'saleDetail/salDetail?data='+JSON.stringify({
              // idd: res.data.result.id,// 订单id
              id: _this.data.orderNum,//订单号有可能是漏单
            })
          })
        }else{
          _this.setData({
            onece: false,
            isLoading: true
          })
          wx.showToast({
            title: res.data.result.message,
            icon: 'none',
            duration: 3000
          })
        }
      }, fail:function(e){
        _this.setData({
          onece: false,
          isLoading: true
        })
        wx.showToast({
          title: e,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  setTimeOrder(){

    console.log(this.data.orderNum.length + "----" + /^[A-Z]{2,3}[0-9]{10,11}$/.test(this.data.orderNum))
    
    console.log((this.data.orderNum.length == 13 || this.data.orderNum.length == 12) && /^[A-Z]{2,3}[0-9]{10,11}$/.test(this.data.orderNum)) 
    let _this=this;
    _this.setData({
      // orderNum: "",
      proName: ""
    })
    _this.data.ajaxData.productName = "";
    if ((this.data.orderNum.length == 13 || this.data.orderNum.length == 12) && /^[A-Z]{2,3}[0-9]{10,11}$/.test(this.data.orderNum)) {//正则总共13位，前两位为大写的英文字母--判断订单号
    setTimeout(function(){
      _this.getOrder();
      _this.searchOrder();
    },1000)
    }
  },
  clearNum(){
    this.setData({
      orderNum: "",
      
    })
  },
  scaner(){//扫描
    let _this=this;
    wx.scanCode({
      success(res) {
        _this.setData({
          orderNum: res.result,
        });
        _this.setData({
          // orderNum: "",
          proName: ""
        })
        _this.data.ajaxData.productName = "";
        _this.getOrder();
      }
    })
  },
onHide:function(){
  // console.log("删除所有的图片")
  // for (var i = 0; i < this.data.imgList.length; i++){
  //   wx.request({
  //     url: 'https://www.shengdaprint.com/UploadImage/DeleteFile',//删除图片
  //     data: {
  //       "url": this.data.imgList[i].split("https://content.shengdaprint.com/")[1]
  //     },
  //     method: "post",
  //     header: {
  //       'content-type': 'application/json',
  //       'Authorization': "Bearer " + wx.getStorageSync("token")
  //     },
  //     success(res) {

  //     }
  //   })
  // }
},
  ChooseImage() {
    let _this=this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        if(res.tempFilePaths.length+this.data.imgList.length > 1){
          wx.showToast({
            title: '图片不能大于1张，清确定上传图片数量',
            icon: 'none',
            duration: 3000
          })
          return false;
        }
        for (var i = 0; i < tempFilePaths.length;i++){
          wx.uploadFile({
            url: 'https://www.shengdaprint.com/UploadImage/SaveFile', // 上传图篇
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              mark: 'aftersale',
              orderNum: _this.data.orderNum
            },
            success(res) {
              console.log(res)
              const data = res.data
              // do something
              let b = _this.data.imgList;
              let a = "https://content.shengdaprint.com/" +JSON.parse(res.data).Message
              b.push(a);
              _this.setData({
                imgList: b
              })
            }
          })
        }
        
        console.log(_this.data.imgList)
      }
    });
  },
  ViewImage(e) {//https://content.shengdaprint.com/
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    console.log(e)
    let _this=this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: 'https://www.shengdaprint.com/UploadImage/DeleteFile',//删除图片
            data: {
              "url": _this.data.imgList[e.currentTarget.dataset.index].split("https://content.shengdaprint.com/")[1]
            },
            method: "post",
            header: {
              'content-type': 'application/json',
              'Authorization': "Bearer " + wx.getStorageSync("token")
            },
            success(res) {
             
            }
          })
          _this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          _this.setData({
            imgList: _this.data.imgList
          })
        }
      }
    })
  },
  submit111: function (e) {//受理
    console.log(e.currentTarget.dataset.id)
    let _this = this;
    wx.request({
      url: app.data.hostAjax + '/api/OrderAfterSale/Process',
      data: {
        id: e.currentTarget.dataset.id,
        sn: e.currentTarget.dataset.ordernum,
        processOpinion: "",//处理意见
        deliverManName: "",//名称
      },
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        if (res.data.result.isSuccess) {
          _this.setData({
            onece: true
          })
          wx.showToast({
            title: "您已成功受理客户的售后申请，\r\n快去了解详情帮他处理吧！",
            icon: 'none',
            duration: 2000
          })
          _this.onShow();
          wx.request({
            url: app.data.hostAjax + '/api/OrderAfterSale/GetWaitProcessingCount',
            data: {

            },
            method: "get",
            header: {
              'content-type': 'application/json',
              'Authorization': "Bearer " + wx.getStorageSync("token")
            },
            success(res) {
              if (res.data.result != 0) {
                wx.setTabBarBadge({
                  index: 2,
                  text: String(res.data.result),
                })
              } else {
                wx.hideTabBarRedDot({ index: 2, })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.result.message,
            icon: 'none',
            duration: 5000
          })
        }
      }
    })
  },
  onchange(event) {

    let _this = this, add = "reduce";
    console.warn(`change: ${event.detail[0]}`);
    console.log(event.detail)
    // if (event.detail[0] == 0) {
    //   util.request(app.data.hostAjax + '/api/transaction/v1/updateshoppingcart', { userid: wx.getStorageSync("userIdBuyGood"), optiontype: "delete", id: event.currentTarget.dataset.id }).then(function (res) {

    //     _this.onShow();
    //   })
    // }else
    if (event.detail[1]) {
      add = "add"
    }
    util.request(app.data.hostAjax + '/api/transaction/v1/updateshoppingcart', { userid: wx.getStorageSync("userIdBuyGood"), optiontype: add, id: event.currentTarget.dataset.id }).then(function (res) {

      _this.onShow();
    })
  },
  onShareAppMessage: function (res) {
    // let _this = this;
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    // return {
    //   path: '/pages/index/index?stop=1'
    // }
  }
})