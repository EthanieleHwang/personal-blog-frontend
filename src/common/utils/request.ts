import axios from "axios";
import { useAuthStore } from "../../stores/auth";
import { ElMessage } from "element-plus";
import type { ApiResponse } from "../types";

const service = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

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

service.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse<any>;

    if (res.code !== 200) {
      ElMessage.error(res.message || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res.data; // 这里返回的是 T
    }
  },
  (error) => {
    console.error("Request Error:", error);
    ElMessage.error(error.message || "网络错误，请稍后重试");
    return Promise.reject(error);
  }
);

// 导出包装函数，明确返回 Promise<T>
const requestWrapper = {
  get: <T = any>(url: string, config?: any) =>
    service.get<ApiResponse<T>>(url, config).then((res) => res.data),
  post: <T = any>(url: string, data?: any, config?: any) =>
    service.post<ApiResponse<T>>(url, data, config).then((res) => res.data),
  put: <T = any>(url: string, data?: any, config?: any) =>
    service.put<ApiResponse<T>>(url, data, config).then((res) => res.data),
  delete: <T = any>(url: string, config?: any) =>
    service.delete<ApiResponse<T>>(url, config).then((res) => res.data),
  // 可以根据需要添加其他方法
};

export default requestWrapper;
