<template>
  <div v-loading="loading" class="article-detail-container">
    <div v-if="article" class="article-content">
      <!-- 文章标题 -->
      <h1 class="title">{{ article.title }}</h1>

      <!-- 文章元信息 -->
      <div class="meta">
        <span>作者: {{ article.author?.nickname }}</span>
        <span>发布于: {{ formattedDate(article.createdAt) }}</span>
        <span>分类: {{ article.category?.name }}</span>
      </div>

      <!-- 文章正文 (渲染HTML) -->
      <div class="markdown-body" v-html="articleHtml"></div>

      <!-- (可选) 文章标签 -->
      <div v-if="article.tags?.length" class="tags">
        <el-tag v-for="tag in article.tags" :key="tag.id" class="tag-item">{{ tag.name }}</el-tag>
      </div>
    </div>

    <el-empty v-else-if="!loading" description="文章不存在或加载失败" />

    <!-- 评论区 (我们稍后会创建这个组件) -->
    <div class="comment-section">
      <CommentComponent :article-id="articleId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import request from '../common/utils/request';
import type { ArticleDetailVO } from '../common/types/index';
import { parseMarkdown } from '../common/utils/markdown';
import CommentComponent from '../components/CommentComponent.vue'; // 稍后创建

const route = useRoute();
const loading = ref(true);
const article = ref<ArticleDetailVO | null>(null);

// 从URL中获取文章ID
const articleId = Number(route.params.id);

// 将Markdown内容转换为HTML
const articleHtml = computed(() => {
  if (article.value && article.value.contentMd) {
    return parseMarkdown(article.value.contentMd);
  }
  return '';
});

// 获取文章详情数据
const fetchArticleDetail = async () => {
  if (!articleId) return;
  loading.value = true;
  try {
    // 我们的request拦截器会自动返回核心数据部分
    article.value = await request.get<ArticleDetailVO>(`/api/articles/${articleId}`);
  } catch (error) {
    console.error('获取文章详情失败:', error);
    article.value = null;
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formattedDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString();
};

// 组件挂载后执行数据获取
onMounted(() => {
  fetchArticleDetail();
});
</script>

<style scoped>
.article-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.title {
  font-size: 2.5em;
  margin-bottom: 20px;
  text-align: center;
}
.meta {
  text-align: center;
  color: #909399;
  margin-bottom: 40px;
}
.meta span {
  margin: 0 15px;
}
.markdown-body {
  line-height: 1.8;
  font-size: 16px;
}
/* 为Markdown渲染的HTML添加一些基本样式 */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  font-weight: 600;
}
.markdown-body :deep(p) {
  margin-bottom: 1em;
}
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
}
.markdown-body :deep(blockquote) {
  margin: 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}
.markdown-body :deep(pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  border-radius: 6px;
}
.tags {
  margin-top: 40px;
}
.tag-item {
  margin-right: 10px;
}
.comment-section {
  margin-top: 50px;
  border-top: 1px solid #eee;
  padding-top: 30px;
}
</style>