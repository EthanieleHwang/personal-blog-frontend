import axios from "axios";
import { useAuthStore } from "../stores/auth";

// 创建Axios实例
const service = axios.create({
  // 我们的后端API基础路径
  baseURL: "http://localhost:8080", // 重要：确保这与你的后端端口一致
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么
    const authStore = useAuthStore();
    if (authStore.token) {
      // 让每个请求携带自定义token
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器 (可选，但推荐)
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    // 例如，如果后端统一了响应格式，可以在这里直接返回 data 部分
    const res = response.data;
    if (res.code !== 200) {
      // 处理业务错误，例如弹窗提示
      console.error("API Error:", res.message);
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    // 对响应错误做点什么
    console.log("err" + error); // for debug
    // 例如处理401, 403, 500等HTTP错误
    return Promise.reject(error);
  }
);

export default service;
