import Vue from 'vue'
import Element, { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

// 每个组件都可以通过this访问
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox
