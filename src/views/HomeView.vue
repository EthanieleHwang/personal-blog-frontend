<template>
  <div class="home-view">
    <!-- (可选) 显示当前筛选条件的标题 -->
    <h2 v-if="pageTitle" class="page-title">{{ pageTitle }}</h2>

    <div v-loading="articleStore.loading" class="article-list">
      <div
        v-if="!articleStore.loading && articleStore.articles.length === 0"
        class="no-data"
      >
        <el-empty description="暂无文章" />
      </div>
      <ArticleCard
        v-for="article in articleStore.articles"
        :key="article.id"
        :article="article"
      />
    </div>

    <div
      v-if="!articleStore.loading && articleStore.total > queryParams.pageSize"
      class="pagination-container"
    >
      <el-pagination
        background
        layout="prev, pager, next"
        :total="articleStore.total"
        :page-size="queryParams.pageSize"
        :current-page="queryParams.pageNum"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useArticleStore } from "../stores/article";
import ArticleCard from "../components/ArticleCard.vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";

const articleStore = useArticleStore();
const route = useRoute();

// (可选) 用于显示 "分类：xxx下的文章"
const pageTitle = ref("");

// 将查询参数定义为响应式对象
const queryParams = reactive({
  pageNum: 1,
  pageSize: 5,
  categoryId: undefined as number | undefined,
  tagId: undefined as number | undefined,
  // keyword: undefined as string | undefined // 以后可以添加关键词
});

/**
 * 根据路由查询参数来更新queryParams
 * @param targetRoute 目标路由对象
 */
const updateQueryParamsFromRoute = (targetRoute: RouteLocationNormalized) => {
  queryParams.pageNum = Number(targetRoute.query.pageNum) || 1;
  queryParams.categoryId = targetRoute.query.categoryId
    ? Number(targetRoute.query.categoryId)
    : undefined;
  queryParams.tagId = targetRoute.query.tagId
    ? Number(targetRoute.query.tagId)
    : undefined;
  // 在这里可以设置页面标题 (可选)
  // pageTitle.value = ...
};

/**
 * 获取文章列表的核心方法
 */
const loadArticles = () => {
  articleStore.fetchArticles(queryParams);
};

/**
 * 处理页码变化
 * @param newPage 新的页码
 */
const handlePageChange = (newPage: number) => {
  queryParams.pageNum = newPage;
  loadArticles();
};

// --- 【【【 核心修改 】】】 ---

// 1. 使用 onBeforeRouteUpdate 守卫来监听路由变化
onBeforeRouteUpdate((to, _from) => {
  // 当从 /?categoryId=1 跳转到 /?categoryId=2 时
  // 或者从 / 跳转到 /?categoryId=1 时
  // 这个钩子会被触发
  updateQueryParamsFromRoute(to);
  loadArticles();
});

// 2. 在组件首次挂载时，也使用同样的方法来初始化
onMounted(() => {
  updateQueryParamsFromRoute(route); // 使用当前的路由信息初始化查询参数
  loadArticles();
});
</script>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
</style>
