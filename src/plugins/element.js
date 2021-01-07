import Vue from 'vue'
// 按需导入 element-ui 中需要用到的组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 全局注册组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message 使用方式不一样，需要挂载
Vue.prototype.$message = Message
