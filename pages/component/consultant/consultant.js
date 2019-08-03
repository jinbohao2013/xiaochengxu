// pages/component/consultant/consultant.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  externalClasses: ['my-class'],
  /**
   * 组件的初始数据
   */
  data: {
    height: app.data.windowHeight,
    x: app.data.windowWidth-50,
    y: app.data.windowHeight*0.3
  },
  created:function(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
  }
})
