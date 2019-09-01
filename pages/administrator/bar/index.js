import * as echarts from '../../../ec-canvas/echarts';
function initChart(canvas, width, height) {
const chart = echarts.init(canvas, null, {
  width: width,
  height: height
});
canvas.setChart(chart);

  var option = {
    color:"#3388FF",
    title: {
    },
    tooltip: {},
    legend: {
      data: ['销量']
    },
    xAxis: {
      name: ' 日期',
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      axisLabel: {
        interval: 0,//横轴信息全部显示  
      },
      nameGap:0
    },
    yAxis: {
      show:true
    },
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: { //数值样式
              color: 'black',
              fontSize: 16
            }
          }
        }
      },

    }]
  };
chart.setOption(option);
return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    }
  }
});