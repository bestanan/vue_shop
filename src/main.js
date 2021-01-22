import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入阿里字体图标
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

// 全局引入公共组件
import Breadcrumb from './common/breadcrumb/Breadcrumb.vue'
// 全局注册公共组件
Vue.component('bread-crumb', Breadcrumb)

Vue.component('tree-table', TreeTable)

import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // 可以在发送请求前做些事情
  // 为请求头添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
