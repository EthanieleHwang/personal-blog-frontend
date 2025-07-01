<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span>🗂️ 分类</span>
      </div>
    </template>
    <div v-loading="loading" class="category-list">
      <router-link
        to="/"
        class="category-item"
        :class="{ 'is-active': !activeCategoryId }"
      >
        全部文章
      </router-link>
      <router-link
        v-for="category in categories"
        :key="category.id"
        :to="{ path: '/', query: { categoryId: category.id } }"
        class="category-item"
        :class="{ 'is-active': category.id == activeCategoryId }"
      >
        {{ category.name }}
      </router-link>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import request from "../common/utils/request";
import type { CategoryInfoVO } from "../common/types";

const route = useRoute();
const loading = ref(true);
const categories = ref<CategoryInfoVO[]>([]);

// 计算当前激活的分类ID，用于高亮显示
const activeCategoryId = computed(() => {
  // route.query.categoryId 会是一个字符串，需要转换
  return route.query.categoryId ? Number(route.query.categoryId) : null;
});

// 获取分类列表
const fetchCategories = async () => {
  loading.value = true;
  try {
    categories.value = await request.get<CategoryInfoVO[]>("/api/categories");
  } catch (error) {
    console.error("获取分类列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 组件挂载后执行数据获取
onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.box-card {
  border: none;
  background-color: #f8f9fa;
}
.card-header {
  font-weight: 600;
}
.category-list {
  display: flex;
  flex-direction: column;
}
.category-item {
  padding: 10px 0;
  text-decoration: none;
  color: #606266;
  border-bottom: 1px solid #f0f2f5;
  transition: all 0.2s;
}
.category-item:last-child {
  border-bottom: none;
}
.category-item:hover {
  color: #409eff;
  background-color: #ecf5ff;
  padding-left: 10px; /* 增加悬停效果 */
}
.category-item.is-active {
  color: #409eff;
  font-weight: bold;
  border-right: 3px solid #409eff;
}
</style>
