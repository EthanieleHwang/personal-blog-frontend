<template>
  <el-menu
    :default-active="route.path"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    router
  >
    <el-menu-item index="/">
      <img
        style="width: 40px; margin-right: 8px"
        src="/vite.svg"
        alt="Element logo"
      />
      My Personal Blog
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/categories">分类</el-menu-item>
    <el-menu-item index="/tags">标签</el-menu-item>
    <!-- 【【【 在这里添加一个按钮 】】】 -->
    <el-menu-item index="/create-article">
      <el-icon><EditPen /></el-icon>
      写文章
    </el-menu-item>
    <!-- 【【【 核心：根据登录状态动态显示菜单 】】】 -->
    <el-sub-menu v-if="authStore.isLoggedIn" index="/profile">
      <template #title>
        <el-avatar
          size="small"
          :src="defaultAvatar"
          style="margin-right: 8px"
        ></el-avatar>
        我的
      </template>
      <el-menu-item index="/profile/settings">个人设置</el-menu-item>
         <!-- 【【【 添加以下内容 】】】 -->
      <el-menu-item index="/admin/categories">分类管理</el-menu-item>
      <el-menu-item index="/admin/tags">标签管理</el-menu-item>
      <!-- 【【【 添加结束 】】】 -->
      <!-- 为“退出登录”绑定点击事件 -->
      <el-menu-item index="logout" @click="handleLogout">退出登录</el-menu-item>
    </el-sub-menu>

    <el-menu-item v-else index="/login"> 登录 / 注册 </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { ElMessage, ElMessageBox } from "element-plus";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const defaultAvatar =
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";

/**
 * 处理退出登录的函数
 */
const handleLogout = () => {
  // 1. 弹出确认框，防止用户误触
  ElMessageBox.confirm("您确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 2. 如果用户点击“确定”，执行登出逻辑
      authStore.logout(); // 调用store中的action，清理token

      // 3. 给出成功提示
      ElMessage({
        type: "success",
        message: "已成功退出登录",
      });

      // 4. 跳转到登录页
      router.push("/login");
    })
    .catch(() => {
      // 5. 如果用户点击“取消”，什么也不做，只在控制台给个提示
      console.log("Logout canceled by user.");
    });
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
