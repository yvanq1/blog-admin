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
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    instance.get(url, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    instance.post(url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    instance.put(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    instance.delete(url, config),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    instance.patch(url, data, config),
};
