<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
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
    <el-sub-menu index="/profile">
      <template #title>我的</template>
      <el-menu-item index="/login">登录</el-menu-item>
      <el-menu-item index="/register">注册</el-menu-item>
      <el-menu-item index="/profile/settings">设置</el-menu-item>
      <el-menu-item index="/logout">退出登录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
console.log("isLoggedIn:", useAuthStore().isLoggedIn);
const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
