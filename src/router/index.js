import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/rights/Rights.vue'
import Roles from '../components/rights/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import GoodsAdd from '../components/goods/GoodsAdd.vue'

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
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights',  component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: GoodsAdd },
    ]
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
