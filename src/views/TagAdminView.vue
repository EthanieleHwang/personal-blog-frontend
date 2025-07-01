<template>
  <div class="tag-admin-container">
    <h1>标签管理</h1>

    <!-- 新增按钮 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleOpenDialog(null)">新增标签</el-button>
    </div>

    <!-- 标签表格 -->
    <el-table :data="tags" v-loading="loading" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="名称" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleOpenDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import request from '../common/utils/request';
import type { TagInfoVO } from '../common/types';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';

const loading = ref(true);
const tags = ref<TagInfoVO[]>([]);
const dialogVisible = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);

const formRef = ref<FormInstance>();
const form = reactive({
  id: null as number | null,
  name: '',
});

const dialogTitle = computed(() => (isEditMode.value ? '编辑标签' : '新增标签'));

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
});

const fetchTags = async () => {
  loading.value = true;
  try {
    tags.value = await request.get<TagInfoVO[]>('/api/tags');
  } catch (error) {
    console.error('获取标签列表失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleOpenDialog = (tag: TagInfoVO | null) => {
  dialogVisible.value = true;
  if (tag) {
    isEditMode.value = true;
    Object.assign(form, tag);
  } else {
    isEditMode.value = false;
    Object.assign(form, { id: null, name: '' });
  }
  formRef.value?.clearValidate();
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true;
      try {
        if (isEditMode.value) {
          await request.put('/api/tags', form);
          ElMessage.success('更新成功');
        } else {
          await request.post('/api/tags', form);
          ElMessage.success('新增成功');
        }
        dialogVisible.value = false;
        await fetchTags();
      } catch (error) {
        // ...
      } finally {
        isSubmitting.value = false;
      }
    }
  });
};

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个标签吗？', '警告', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await request.delete(`/api/tags/${id}`);
    ElMessage.success('删除成功');
    await fetchTags();
  } catch (error) {
    if (error !== 'cancel') {
        // ...
    }
  }
};

onMounted(() => {
  fetchTags();
});
</script>

<style scoped>
.tag-admin-container {
  padding: 20px;
}
.toolbar {
  margin-bottom: 20px;
}
</style>