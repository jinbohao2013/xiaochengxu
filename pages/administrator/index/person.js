import * as echarts from '../../../ec-canvas/echarts';
var util = require('../../../utils/util.js');
var app = getApp();
var dataListX = [], dataListY = [];
var Chart = null;
Page({
  gohuiyuan(){
    wx.redirectTo({
      url: '/pages/administrator/index/person1',
    })
  },
  data: {
    userInfo:null,
    main1Date1: '',
    main1Date2: '',
    main1Date2GO:"",
    picker: ['支付笔数', '支付人数', '支付金额'],
    index:0,
    ajaxMain1: null,////数据概览
    ajaxMain2: null,////详细概览
    ec: {
      lazyLoad: true // 延迟加载
    },
  },
  onLoadTow() {
    let _this = this;
    util.request(app.data.hostAjax + '/api/admin/v1/getadminpayinfo', {//数据概览
      userid: wx.getStorageSync("userid"),
      starttime: this.data.main1Date1,
      endtime: this.data.main1Date2,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxMain1: res.Data,
          main1Date2GO: _this.data.main1Date2
        });
      }
    })
  },
  onLoad: function (options) {
    let _this=this;
    util.request(app.data.hostAjax + '/api/admin/v1/getadminpayinfo', {//数据概览
      userid: wx.getStorageSync("userid"),
      starttime: this.data.main1Date1,
      endtime: this.data.main1Date2,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxMain1: res.Data
        });
      }
    })
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getData("/api/admin/v1/getadminordernumsimg","0"); //获取数据
  },
  getData: function (url,type) {
    dataListX = [], dataListY = [];
    let _this = this;
    util.request(app.data.hostAjax + url, {//支付笔数--支付人数--支付金额--提现金额
      userid: wx.getStorageSync("userid"),
      // endtime: this.data.main1Date2,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxMain2: res.Data
        });
        var typeStr = "";
        if (type == "0") {
          typeStr = "ordernums";
        } else if (type == "1") {
          typeStr = "ordernums";
        } else if (type == "2") {
          typeStr = "sumprice";
        } else {
          typeStr = "sumprice";
        }
        for (var i = 0; i < res.Data.list.length; i++) {
          
          dataListX.push(res.Data.list[i]["days"].substr(5));
          dataListY.push(res.Data.list[i][typeStr]);//Value 数据 数组
        }
        _this.init_echarts();
      }
    })

    //如果是第一次绘制
    // if (!Chart) {
    //   this.init_echarts(); //初始化图表
    // } else {
    //   this.setOption(Chart); //更新数据
    // }
  },
  //初始化图表
  init_echarts: function () {
    
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(Chart);
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption: function () {
    // 指定图表的配置项和数据
    var option = {
      color: "#7587DB",
      grid:{
        top:40,
        bottom:20
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [{ name: "当日", icon: 'circle' }],
        left: 10,
        top: 5,
      },
      xAxis: {
        type: 'category',
        data: dataListX,
        nameGap: 0,
        axisLabel: {
          interval: 0
        },
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: "当日",
        areaStyle: { color: "#E3E6F7" },
        data: dataListY,
        // data:[1,2,3,4,5,6,7],
        type: 'line'
      }]
    }
    return option;
  },
  DateChange1(e) {
    this.setData({
      main1Date1: e.detail.value
    })
    
  },
  DateChange2(e) {
    this.setData({
      main1Date2: e.detail.value
    })
  },
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value == "0") {
      this.getData("/api/admin/v1/getadminordernumsimg", e.detail.value); //支付笔数
    } else if (e.detail.value == "1") {
      this.getData("/api/admin/v1/getadminpaynumberimg", e.detail.value); //支付人数
    } else if (e.detail.value == "2") {
      this.getData("/api/admin/v1/getadminpaypriceimg", e.detail.value); //支付金额
    }
  },
})