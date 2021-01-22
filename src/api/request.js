import axios from 'axios'
import { Message } from 'element-ui'


// 新建一个 axios 实例
const request = axios.create({
  // baseURL 将自动加在 url 前面
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})

// 添加请求拦截器
request.interceptors.request.use( config => {
  // 在发送请求前做些什么
  // 除登录接口外的所有接口，必须在请求头中使用 Authorization 字段提供 token 令牌
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, error => {
  // 对请求错误做些什么
  // console.log(error)
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use( response => {
  const { data: res } = response
  const status = res.meta.status
  // console.log('res', res)
  // 统一为失败响应作出错误消息提示
  if(status !== 200 && status !== 201) {
    return Message.error(res.meta.msg)
  }
  // return res.data
  return res
}, error => {
  return Promise.reject(error)
})

export default request