import Vue from 'vue'
import VueRouter from 'vue-router'
import myLogin from '../components/myLogin.vue'
import MyHome from '../components/myHome.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/users.vue'
import Rights from '@/components/power/Right.vue'
import Roles from '@/components/power/Roles.vue'
import Cate from '@/components/goods/Cate.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history', // 去掉url中的#
  routes: [
    { path: '/', redirect: '/login' },
    {
      // 设置路由项：即/shbook 访问路径对应SBook组件即ShowBooks组件
      path: '/login',
      component: myLogin
    },
    {
      path: '/home',
      component: MyHome,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate }
      ]
    }
  ]
})

// 挂载路由导航守卫
// beforeEach接收一个回调函数
// to:将要访问的路劲 from:从哪个路径跳转而来 next:是一个函数，表示放行(有两种方式， next() 放行    next('/login)强制跳转)
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
