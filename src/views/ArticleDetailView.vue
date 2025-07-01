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
      <div class="markdown-body" v-html="article?.contentHtml"></div>

      <!-- (可选) 文章标签 -->
      <div v-if="article.tags?.length" class="tags">
        <el-tag v-for="tag in article.tags" :key="tag.id" class="tag-item">{{
          tag.name
        }}</el-tag>
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
import { ref, onMounted } from "vue"; // 移除 computed
import { useRoute } from "vue-router";
import request from "../common/utils/request";
import type { ArticleDetailVO } from "../common/types/index";
import { parseMarkdown } from "../common/utils/markdown";
import CommentComponent from '../components/CommentComponent.vue'; // 导入评论组件

const route = useRoute();
const loading = ref(true);
const article = ref<ArticleDetailVO | null>(null);

// 从URL中获取文章ID
const articleId = Number(route.params.id);

// 获取文章详情数据
const fetchArticleDetail = async () => {
  if (!articleId) {
    console.warn("文章ID无效，无法获取文章详情。");
    loading.value = false;
    return;
  }
  loading.value = true;
  console.log(`正在获取文章详情，ID: ${articleId}`);
  try {
    // 我们的request拦截器会自动返回核心数据部分
    const response = await request.get<ArticleDetailVO>(
      `/api/articles/${articleId}`
    );
    console.log("获取文章详情成功，响应数据:", response);
    // 将Markdown内容转换为HTML并存储
    if (response && response.contentMd) {
      response.contentHtml = await parseMarkdown(response.contentMd);
      console.log("Markdown内容已转换为HTML。");
    } else {
      console.warn("文章内容（contentMd）为空或响应无效。");
    }
    article.value = response;
  } catch (error) {
    console.error("获取文章详情失败:", error);
    article.value = null;
  } finally {
    loading.value = false;
    console.log("文章详情加载完成，loading状态设置为false。");
  }
};

// 格式化日期
const formattedDate = (dateString: string) => {
  if (!dateString) return "";
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
