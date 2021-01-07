import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

/** 
 * 控制页面访问权限：如果用户没有登录，但直接通过url访问特定页面，需要强制导航到登录页面
 * 方案：注册一个全局的路由导航守卫--全局前置守卫
 */
router.beforeEach((to, from, next) => {
  if(to.path === '/login' ) return next()
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
})

export default router
