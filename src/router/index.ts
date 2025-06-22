import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/Layout.vue"; // 引入Layout组件

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Layout, // 所有使用该布局的页面，都以Layout作为父组件
      children: [
        {
          path: "", // 默认子路由，当访问'/'时，会渲染HomeView
          name: "home",
          component: () => import("../views/HomeView.vue"),
        },
        // 在这里添加其他需要使用该布局的页面
        // {
        //   path: 'categories',
        //   name: 'categories',
        //   component: () => import('../views/CategoriesView.vue')
        // },
        // {
        //   path: 'tags',
        //   name: 'tags',
        //   component: () => import('../views/TagsView.vue')
        // }
      ],
    },
    // 在这里添加其他不需要使用该布局的页面，例如登录、注册页
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('../views/LoginView.vue')
    // }
  ],
});

export default router;
