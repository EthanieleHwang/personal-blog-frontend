import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/Layout.vue";
import { useAuthStore } from "../stores/auth"; // 引入我们的auth store
import { ElMessage } from "element-plus"; // 引入Element Plus的消息提示

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "",
          name: "home",
          component: () => import("../views/HomeView.vue"),
        },
        // 假设我们未来会有一个需要登录才能访问的文章创建页
        {
          path: "create-article",
          name: "create-article",
          component: () => import("../views/ArticleEditorView.vue"), // 假设的组件
          meta: { requiresAuth: true }, // 【【【 使用元信息标记需要认证 】】】
        },
        // 假设我们未来会有一个用户个人中心页面
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/ProfileView.vue"), // 假设的组件
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
  ],
});

// --- ↓↓↓ 全局前置守卫逻辑 ↓↓↓ ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 检查目标路由是否需要认证
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // 1. 如果目标页面需要登录，但用户未登录
    ElMessage.warning("该页面需要登录后才能访问，请先登录！");
    // 2. 将用户重定向到登录页
    next({ name: "login" });
  } else if (
    (to.name === "login" || to.name === "register") &&
    authStore.isLoggedIn
  ) {
    // 3. 如果用户已登录，但试图访问登录或注册页
    // 4. 将用户重定向到首页
    next({ name: "home" });
  } else {
    // 5. 在其他所有情况下，直接放行
    next();
  }
});
// --- ↑↑↑ 守卫逻辑结束 ↑↑↑ ---

export default router;
