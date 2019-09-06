import * as echarts from '../../../ec-canvas/echarts';
var util = require('../../../utils/util.js');
var app=getApp();
var dataListX = [], dataListY = [];
var Chart = null, chartName="";
Page({
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    main1Date2: '',
    ajaxMain1:null,
    chartNameTypeControl:"",//控制四种图表的展示
  },
  onLoadTow(){
    if (this.data.options){
      this.onLoad(this.data.options)
    }
  },
  onLoad: function (options) {
    this.setData({ options: options, main1Date2: options.main1Date2})
    var url = "/api/admin/v1/getadminordernums";//支付笔数
    if (options.type=="1"){ wx.setNavigationBarTitle({ title: '支付笔数' })
      this.setData({ chartNameTypeControl: "支付笔数" }); chartName = "订单数（笔）";
    } else if (options.type == "2") {
      wx.setNavigationBarTitle({ title: '支付人数' }); url = "/api/admin/v1/getadminpaynumber"; this.setData({ chartNameTypeControl: "支付人数" }); chartName = "支付人数（人）";
    } else if (options.type == "3") {
      wx.setNavigationBarTitle({ title: '支付金额' }); url = "/api/admin/v1/getadminpayprice"; this.setData({ chartNameTypeControl: "支付金额", typeSize:8}); chartName = "付款金额（元）";
    } else if (options.type == "4") { wx.setNavigationBarTitle({ title: '提现金额' }); url = "/api/admin/v1/getadminapplicationcash"; this.setData({ chartNameTypeControl: "提现金额", typeSize: 8 }); chartName = "提现金额（元）"; }
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getData(url); //获取数据
  }, getData: function (url) {
    dataListX = [], dataListY = [];
    let _this = this;
    util.request(app.data.hostAjax + url, {//支付笔数--支付人数--支付金额--提现金额
      userid: wx.getStorageSync("userid"),
      endtime: this.data.main1Date2,
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          ajaxMain1: res.Data
        });
        var type="";
        if (_this.data.chartNameTypeControl == "支付笔数") {
          type = "ordernums";
        } else if (_this.data.chartNameTypeControl == "支付人数") {
          type = "ordernums";
        } else if (_this.data.chartNameTypeControl == "支付金额") {
          type = "sumprice";
        } else if (_this.data.chartNameTypeControl == "提现金额") {
          type = "sumprice";
        }
        for(var i=0;i<res.Data.list.length;i++){
          dataListX.push(res.Data.list[i]["days"].substr(5));
          dataListY.push(res.Data.list[i][type]);//Value 数据 数组
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
      color: "#3388FF",
      title: {
      },
      tooltip: {},
      legend: {
        data: [{name:chartName}],
        left: 10,
        top: 20,
      },
      xAxis: {
        name: ' 日期',
        data: dataListX,
        axisLabel: {
          interval: 0,//横轴信息全部显示  
        },
        nameGap: 0
      },
      yAxis: {
        show: true
      },
      series: [{
        name: chartName,
        type: 'bar',
        data: dataListY,
        itemStyle: {
          normal: {
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
              textStyle: { //数值样式
                color: 'black',
                fontSize: this.data.typeSize||16
              }
            }
          }
        },

      }]
    }
    return option;
  },
  DateChange2(e) {
    this.setData({
      main1Date2: e.detail.value
    })
  },
});