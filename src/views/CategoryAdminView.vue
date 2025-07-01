    <template>
      <div class="category-admin-container">
        <h1>分类管理</h1>

        <!-- 新增按钮 -->
        <div class="toolbar">
          <el-button type="primary" @click="handleOpenDialog(null)">新增分类</el-button>
        </div>

        <!-- 分类表格 -->
        <el-table :data="categories" v-loading="loading" stripe border style="width: 100%">
          <el-table-column prop="id" label="ID" width="180" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="description" label="描述" />
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
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" type="textarea" />
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
    import type { CategoryInfoVO } from '../common/types';
    import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';

    // --- 响应式状态 ---
    const loading = ref(true);
    const categories = ref<CategoryInfoVO[]>([]);
    const dialogVisible = ref(false);
    const isEditMode = ref(false);
    const isSubmitting = ref(false);

    const formRef = ref<FormInstance>();
    const form = reactive({
      id: null as number | null,
      name: '',
      description: '',
    });

    // --- 计算属性 ---
    const dialogTitle = computed(() => (isEditMode.value ? '编辑分类' : '新增分类'));

    // --- 表单校验规则 ---
    const rules = reactive<FormRules>({
      name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    });

    // --- 方法 ---
    const fetchCategories = async () => {
      loading.value = true;
      try {
        categories.value = await request.get<CategoryInfoVO[]>('/api/categories');
      } catch (error) {
        console.error('获取分类列表失败:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleOpenDialog = (category: CategoryInfoVO | null) => {
      dialogVisible.value = true;
      if (category) {
        // 编辑模式
        isEditMode.value = true;
        // 使用 Object.assign 保证响应性
        Object.assign(form, category);
      } else {
        // 新增模式
        isEditMode.value = false;
        // 重置表单
        Object.assign(form, { id: null, name: '', description: '' });
      }
      // 清除之前的校验信息
      formRef.value?.clearValidate();
    };

    const handleSubmit = async () => {
      if (!formRef.value) return;
      await formRef.value.validate(async (valid) => {
        if (valid) {
          isSubmitting.value = true;
          try {
            if (isEditMode.value) {
              await request.put('/api/categories', form);
              ElMessage.success('更新成功');
            } else {
              await request.post('/api/categories', form);
              ElMessage.success('新增成功');
            }
            dialogVisible.value = false;
            await fetchCategories(); // 刷新列表
          } catch (error: any) {
            // ElMessage.error(error.message || '操作失败');
            // 全局异常处理器已经处理了错误提示，这里可以不重复提示
          } finally {
            isSubmitting.value = false;
          }
        }
      });
    };

    const handleDelete = async (id: number) => {
      try {
        await ElMessageBox.confirm('确定要删除这个分类吗？其下的文章将变为“未分类”。', '警告', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
        });
        
        await request.delete(`/api/categories/${id}`);
        ElMessage.success('删除成功');
        await fetchCategories(); // 刷新列表
      } catch (error: any) {
        if (error !== 'cancel') {
          // ElMessage.error(error.message || '删除失败');
        }
      }
    };

    onMounted(() => {
      fetchCategories();
    });
    </script>

    <style scoped>
    .category-admin-container {
      padding: 20px;
    }
    .toolbar {
      margin-bottom: 20px;
    }
    </style>