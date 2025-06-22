<template>
  <el-container class="main-layout">
    <el-header class="header">
      <HeaderComponent />
    </el-header>
    <el-main class="main-content">
      <!-- 子路由的出口 -->
      <router-view />
    </el-main>
    <el-footer class="footer">
      <FooterComponent />
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  padding: 0;
  border-bottom: 1px solid #e4e7ed;
}
.main-content {
  flex: 1; /* 让主内容区域占据剩余的所有空间 */
  padding: 20px;
  /* 为了让内容居中，可以设置最大宽度 */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.footer {
  padding: 0;
}
</style>
