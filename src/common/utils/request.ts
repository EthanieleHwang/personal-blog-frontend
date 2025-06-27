import axios from "axios";
import { useAuthStore } from "../../stores/auth";
import { ElMessage } from "element-plus";
import type { ApiResponse } from "../types";

const service = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

// 请求拦截器 (保持不变)
service.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 (保持不变)
service.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse<any>;
    if (res.code !== 200) {
      ElMessage.error(res.message || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      // 成功时，返回核心数据部分
      return res.data;
    }
  },
  (error) => {
    console.error("Request Error:", error);
    ElMessage.error(error.message || "网络错误，请稍后重试");
    return Promise.reject(error);
  }
);

export default service; // <-- 直接导出 service
