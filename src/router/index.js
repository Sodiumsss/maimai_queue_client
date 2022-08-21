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
    ]
  },
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
]

const router = createRouter({
  history: createWebHashHistory (process.env.BASE_URL),
  routes
})

export default router
