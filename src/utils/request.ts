import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

// 创建axios实例
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  withCredentials: true, // 允许跨域请求携带cookie
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在这里可以添加token等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.data.success === false) {
      toast.error(response.data.message || '请求失败');
      return Promise.reject(new Error(response.data.message));
    }
    return response.data;
  },
  (error) => {
    // 统一处理错误
    const message = error.response?.data?.message || error.message || '请求失败';
    toast.error(message);
    return Promise.reject(error);
  }
);

// 封装请求方法
export const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T, T>(url, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.post<T, T>(url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.put<T, T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T, T>(url, config),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.patch<T, T>(url, data, config),
};
