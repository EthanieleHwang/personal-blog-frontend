import axios, { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../stores/auth";
import { ElMessage } from "element-plus";
import type { ApiResponse } from "../types";

// 声明对 axios 模块的增强
declare module 'axios' {
  export interface AxiosInstance {
    // 这里的 T 是指业务数据类型，例如 { token: string }
    // R 是 Promise 解决后的类型，这里我们希望它就是 T
    // D 是请求体数据类型
    request<T = any, R = T, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
    get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    put<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  }
}

const service = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers!.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const res = response.data;
    if (res.code !== 200) {
      ElMessage.error(res.message || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res.data; // 返回核心数据部分
    }
  },
  (error: any) => {
    console.error("Request Error:", error);
    ElMessage.error(error.message || "网络错误，请稍后重试");
    return Promise.reject(error);
  }
);

export default service;
