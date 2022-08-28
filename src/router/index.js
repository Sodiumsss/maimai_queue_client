import { createRouter, createWebHashHistory  } from 'vue-router'
import index from "@/views";
import login from "@/components/login";
import home from "@/components/home";
import register from "@/components/register";


const routes = [
  {
    path: '',
    name: 'index',
    component: index,
    children:[
      {
      path:'/login',
      name:'login',
      component:login,
      },
      {
        path:'/home',
        name:'home',
        component:home,
      },
      {
        path:'/register',
        name:'register',
        component:register,
      }
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/404.vue')
  },
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
]

const router = createRouter({
  history: createWebHashHistory (process.env.BASE_URL),
  routes
})

export default router
