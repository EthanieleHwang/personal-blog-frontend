<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <template #header>
        <div class="card-header">
          <span>用户登录</span>
        </div>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="auto"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="extra-links">
        <router-link to="/register">还没有账户？立即注册</router-link>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import request from "../common/utils/request"; // 引入我们封装的axios实例
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const loginFormRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
});

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
console.log(loading.value);
console.log(loading);
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const response = await request.post("/api/auth/login", loginForm);
        // 我们的响应拦截器已经处理了业务code，这里可以直接用data
        authStore.setToken(response.data.token);
        ElMessage.success("登录成功！");
        // 跳转到首页
        await router.push("/");
      } catch (error: any) {
        // 错误信息已在响应拦截器中打印，这里可以给用户一个通用提示
        ElMessage.error(error.message || "登录失败，请检查用户名和密码");
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}
.auth-card {
  width: 400px;
}
.card-header {
  text-align: center;
  font-size: 20px;
}
.extra-links {
  text-align: right;
  margin-top: 10px;
}
</style>
