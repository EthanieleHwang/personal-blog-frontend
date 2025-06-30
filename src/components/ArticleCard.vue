<template>
  <el-card shadow="hover" class="article-card">
    <div class="card-content">
      <div v-if="article.coverImageUrl" class="cover-image">
        <img :src="article.coverImageUrl" alt="cover" />
      </div>
      <div class="article-details">
        <h2 class="title">
          <router-link :to="`/articles/${article.id}`">{{
            article.title
          }}</router-link>
        </h2>
        <p class="summary">{{ article.summary }}</p>
        <div class="meta">
          <span class="author">
            <el-avatar
              size="small"
              :src="article.author?.avatarUrl || defaultAvatar"
            />
            {{ article.author?.nickname }}
          </span>
          <span class="time"
            >发布于 {{ formattedDate(article.createdAt) }}</span
          >
          <span v-if="article.category" class="category">
            <el-tag size="small">{{ article.category.name }}</el-tag>
          </span>
        </div>
        <div v-if="article.tags?.length" class="tags">
          <el-tag
            v-for="tag in article.tags"
            :key="tag.id"
            type="info"
            size="small"
            class="tag-item"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">

import type { PropType } from "vue";
import type { ArticleItemVO } from "../common/types"; // 确认路径正确

const props = defineProps({
  article: {
    type: Object as PropType<ArticleItemVO>,
    required: true,
  },
});

const defaultAvatar =
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";

const formattedDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>

<style scoped>
.article-card {
  margin-bottom: 20px;
}
.card-content {
  display: flex;
}
.cover-image {
  width: 200px;
  margin-right: 20px;
  flex-shrink: 0;
}
.cover-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
}
.article-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.title a {
  text-decoration: none;
  color: #303133;
  font-size: 22px;
  font-weight: 600;
}
.title a:hover {
  color: #409eff;
}
.summary {
  color: #606266;
  margin: 10px 0;
  flex-grow: 1;
  line-height: 1.6;
}
.meta {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 13px;
  flex-wrap: wrap;
  gap: 15px;
}
.meta > span {
  display: flex;
  align-items: center;
}
.author .el-avatar {
  margin-right: 5px;
}
.tags {
  margin-top: 10px;
}
.tag-item {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
