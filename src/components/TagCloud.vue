<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span>🏷️ 标签云</span>
      </div>
    </template>
    <div v-loading="loading" class="tag-cloud">
      <router-link
        v-for="tag in tags"
        :key="tag.id"
        :to="{ path: '/', query: { tagId: tag.id } }"
        class="tag-link"
      >
        <el-tag effect="plain" class="tag-item">
          {{ tag.name }}
        </el-tag>
      </router-link>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import request from "../common/utils/request";
import type { TagInfoVO } from "../common/types";

const loading = ref(true);
const tags = ref<TagInfoVO[]>([]);

// 获取标签列表
const fetchTags = async () => {
  loading.value = true;
  try {
    tags.value = await request.get<TagInfoVO[]>("/api/tags");
  } catch (error) {
    console.error("获取标签列表失败:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTags();
});
</script>

<style scoped>
.box-card {
  margin-top: 20px;
  border: none;
  background-color: #f8f9fa;
}
.card-header {
  font-weight: 600;
}
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 使用gap来创建间距 */
}
.tag-link {
  text-decoration: none;
}
.tag-item {
  cursor: pointer;
  transition: all 0.2s;
}
.tag-item:hover {
  transform: scale(1.1); /* 增加悬停效果 */
}
</style>
