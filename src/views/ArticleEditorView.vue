<template>
  <div class="editor-container">
    <el-form :model="form" label-width="80px" class="editor-form">
      <el-form-item label="文章标题">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="文章分类">
        <el-select v-model="form.categoryId" placeholder="请选择分类">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="文章标签">
        <el-select v-model="form.tagIds" multiple placeholder="请选择标签">
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="文章摘要">
        <el-input
          type="textarea"
          v-model="form.summary"
          placeholder="请输入摘要"
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- Vditor 编辑器容器 -->
    <div id="vditor" class="vditor-container" />

    <div class="button-container">
      <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
        {{ isEditMode ? "更新文章" : "发布文章" }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import Vditor from "vditor";
import "vditor/dist/index.css";
import request from "../common/utils/request";
import { ElMessage } from "element-plus";
import type { CategoryInfoVO, TagInfoVO } from "../common/types";

const route = useRoute();
const router = useRouter();

// --- 状态定义 ---
const editorInstance = ref<Vditor | null>(null);
const isEditMode = ref(false);
const articleId = ref<number | null>(null);
const isSubmitting = ref(false);

const form = reactive({
  title: "",
  summary: "",
  categoryId: null as number | null,
  tagIds: [] as number[],
});

const categories = ref<CategoryInfoVO[]>([]);
const tags = ref<TagInfoVO[]>([]);

// --- API 调用 ---
const fetchCategoriesAndTags = async () => {
  try {
    // 并行获取分类和标签
    const [catRes, tagRes] = await Promise.all([
      request.get<CategoryInfoVO[]>("/api/categories"),
      request.get<TagInfoVO[]>("/api/tags"),
    ]);
    categories.value = catRes;
    tags.value = tagRes;
  } catch (error) {
    ElMessage.error("获取分类或标签失败");
  }
};

const fetchArticleData = async (id: number) => {
  try {
    const data = await request.get<any>(`/api/articles/${id}`);
    form.title = data.title;
    form.summary = data.summary;
    form.categoryId = data.categoryId;
    form.tagIds = data.tags.map((tag: any) => tag.id);
    // 等待DOM更新后再设置编辑器内容
    nextTick(() => {
      editorInstance.value?.setValue(data.contentMd);
    });
  } catch (error) {
    ElMessage.error("获取文章数据失败");
  }
};

// --- 事件处理 ---
const handleSubmit = async () => {
  isSubmitting.value = true;
  const contentMd = editorInstance.value?.getValue();

  if (!form.title || !contentMd || !form.categoryId) {
    ElMessage.warning("标题、内容和分类不能为空！");
    isSubmitting.value = false;
    return;
  }

  const payload = {
    ...form,
    contentMd,
  };

  try {
    if (isEditMode.value) {
      // 更新模式
      await request.put("/api/articles", { id: articleId.value, ...payload });
      ElMessage.success("文章更新成功！");
      // 跳转到更新后的文章详情页
      router.push(`/articles/${articleId.value}`);
    } else {
      // 创建模式
      const newId = await request.post<number>("/api/articles", payload);
      ElMessage.success("文章发布成功！");
      // 跳转到新文章的详情页
      router.push(`/articles/${newId}`);
    }
  } catch (error: any) {
    ElMessage.error(error.message || "操作失败");
  } finally {
    isSubmitting.value = false;
  }
};

// --- 生命周期钩子 ---
onMounted(() => {
  // 初始化Vditor编辑器
  editorInstance.value = new Vditor("vditor", {
    height: 500,
    placeholder: "请在这里开始你的创作...",
    after: () => {
      // 检查是否为编辑模式
      if (route.params.id) {
        isEditMode.value = true;
        articleId.value = Number(route.params.id);
        // 如果是编辑模式，获取文章原始数据
        fetchArticleData(articleId.value);
      }
    },
  });

  // 获取分类和标签列表用于下拉选择
  fetchCategoriesAndTags();
});
</script>

<style scoped>
.editor-container {
  padding: 20px;
}
.editor-form {
  margin-bottom: 20px;
}
.vditor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.button-container {
  margin-top: 20px;
  text-align: right;
}
</style>
