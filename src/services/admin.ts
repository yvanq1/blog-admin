import axios from 'axios';

// 创建请求实例
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true
});

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminData {
  id: string;
  email: string;
  username: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    admin: AdminData;
  };
  message?: string;
}

// 管理员登录
export const adminLogin = async (data: AdminLoginData) => {
  const response = await api.post<LoginResponse>('/admin/login', data);
  return response.data;
};

// 管理员退出
export const adminLogout = async () => {
  const response = await api.post('/admin/logout');
  return response.data;
};

// 获取当前管理员信息
export const getCurrentAdmin = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};
