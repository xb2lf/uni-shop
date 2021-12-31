
// #ifndef VUE3
import Vue from 'vue'
import { $http } from '@escook/request-miniprogram'
import App from './App'

uni.$http = $http

//请求根路径
$http.baseUrl = 'https://www.uinav.com';
// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title:'数据加载中...'
  })
}
//响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}
//封装弹框的方法
uni.$showMsg = function(title="数据请求失败！",duration=1500,icon="none") {
  uni.showToast({
    title,
    duration,
    icon,
  })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif