<template>
  <div class="home-view">
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
import { onMounted, reactive } from "vue";
import { useArticleStore } from "../stores/article"; // 确认路径正确
import ArticleCard from "../components/ArticleCard.vue"; // 确认路径正确

const articleStore = useArticleStore();

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});

const loadArticles = () => {
  articleStore.fetchArticles(queryParams);
};

const handlePageChange = (newPage: number) => {
  queryParams.pageNum = newPage;
  loadArticles();
  // (可选) 切换页面后滚动到顶部
  window.scrollTo(0, 0);
};

onMounted(() => {
  loadArticles();
});
</script>

<style scoped>
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
