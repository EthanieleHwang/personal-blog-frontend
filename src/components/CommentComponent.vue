<template>
  <div class="comment-wrapper">
    <h3>评论区</h3>

    <!-- 发表评论表单 -->
    <div class="comment-form" v-if="authStore.isLoggedIn">
      <el-input
        v-model="newComment.content"
        :rows="3"
        type="textarea"
        placeholder="请发表你的看法..."
      />
      <div class="form-actions">
        <el-button type="primary" @click="submitComment" :loading="isSubmitting"
          >发表评论</el-button
        >
      </div>
    </div>
    <div v-else class="login-prompt">
      请<router-link to="/login">登录</router-link>后发表评论
    </div>

    <!-- 评论列表 -->
    <div v-loading="loading" class="comment-list">
      <el-empty
        v-if="comments.length === 0 && !loading"
        description="暂无评论，快来抢占沙发吧！"
      />
      <div
        v-else
        v-for="comment in comments"
        :key="comment.id"
        class="comment-item"
      >
        <el-avatar
          :src="comment.author?.avatarUrl || defaultAvatar"
          class="comment-avatar"
        />
        <div class="comment-body">
          <div class="comment-header">
            <span class="author-name">{{ comment.author?.nickname }}</span>
            <span class="publish-date">{{
              formattedDate(comment.createdAt)
            }}</span>
          </div>
          <div class="comment-content">
            <p>{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, reactive } from "vue";
import type { PropType } from "vue";
import request from "../common/utils/request";
import { useAuthStore } from "../stores/auth";
import { ElMessage } from "element-plus";

// --- Props & Store ---
const props = defineProps({
  articleId: {
    type: Number as PropType<number>,
    required: true,
  },
});

const authStore = useAuthStore();

// --- 响应式状态 ---
const loading = ref(true);
const isSubmitting = ref(false);
const comments = ref<any[]>([]); // 稍后可以定义更精确的CommentVO类型
const newComment = reactive({
  content: "",
});
const defaultAvatar =
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";

// --- 方法 ---
const fetchComments = async () => {
  if (!props.articleId) return;
  loading.value = true;
  try {
    // 调用我们之前在CommentController中定义的接口
    comments.value = await request.get<any[]>(
      `/api/comments/article/${props.articleId}`
    );
  } catch (error) {
    console.error("获取评论失败:", error);
  } finally {
    loading.value = false;
  }
};

const submitComment = async () => {
  if (!newComment.content.trim()) {
    ElMessage.warning("评论内容不能为空");
    return;
  }
  isSubmitting.value = true;
  try {
    const payload = {
      articleId: props.articleId,
      content: newComment.content,
    };
    await request.post("/api/comments", payload);
    ElMessage.success("评论发表成功");
    newComment.content = ""; // 清空输入框
    await fetchComments(); // 重新加载评论列表
  } catch (error: any) {
    // ElMessage.error(error.message || '发表失败');
  } finally {
    isSubmitting.value = false;
  }
};

const formattedDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString();
};

// --- 生命周期钩子 ---
onMounted(() => {
  fetchComments();
});
</script>

<style scoped>
.comment-wrapper {
  margin-top: 40px;
}
.comment-wrapper h3 {
  font-size: 20px;
  margin-bottom: 20px;
}
.comment-form {
  margin-bottom: 30px;
}
.form-actions {
  text-align: right;
  margin-top: 10px;
}
.login-prompt {
  text-align: center;
  color: #909399;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 30px;
}
.login-prompt a {
  color: #409eff;
  text-decoration: none;
}
.comment-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #f0f2f5;
}
.comment-item:last-child {
  border-bottom: none;
}
.comment-avatar {
  margin-right: 15px;
  flex-shrink: 0;
}
.comment-body {
  flex-grow: 1;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.author-name {
  font-weight: 600;
  color: #303133;
}
.publish-date {
  font-size: 12px;
  color: #909399;
}
.comment-content p {
  margin: 0;
  line-height: 1.7;
  color: #606266;
}
</style>
