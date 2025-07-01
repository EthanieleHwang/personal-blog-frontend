<template>
  <div>
    <!-- 评论组件占位符 -->
    <h3>评论区</h3>
    <p>这里是评论组件的占位内容。</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  articleId: number;
}>();
</script>

<style scoped>
/* 评论组件的样式 */
div {
  border: 1px solid #eee;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
}
h3 {
  margin-top: 0;
  color: #333;
}
</style>
