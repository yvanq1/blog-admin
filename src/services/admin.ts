import axios from 'axios';

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

export const adminLogin = async (data: AdminLoginData) => {
  const response = await api.post<{
    success: boolean;
    data: AdminData;
    message?: string;
  }>('/admin/login', data);
  return response.data;
};

export const adminLogout = async () => {
  const response = await api.post<{
    success: boolean;
    message: string;
  }>('/admin/logout');
  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await api.get<{
    success: boolean;
    data: AdminData;
    message?: string;
  }>('/admin/me');
  return response.data;
};
