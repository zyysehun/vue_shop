import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
// 把包挂载到vue的原型上，每个组件都可以通过this访问到$http，从而发起ajax请求
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
