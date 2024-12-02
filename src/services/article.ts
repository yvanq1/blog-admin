import axios from 'axios';
import type { Article, ArticleListResponse, CreateArticleData, UpdateArticleData, ApiResponse } from '../types/article';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // 允许跨域请求携带凭证
  headers: {
    'Content-Type': 'application/json'
  }
});

export const articleApi = {
  // 获取文章列表
  getArticles: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    keyword?: string;
  }) => {
    const response = await api.get<ApiResponse<ArticleListResponse>>('/articles', {
      params
    });
    return response.data;
  },

  // 获取单篇文章
  getArticle: async (id: string) => {
    const response = await api.get<ApiResponse<Article>>(`/articles/${id}`);
    return response.data;
  },

  // 创建文章
  createArticle: async (data: CreateArticleData) => {
    const response = await api.post<ApiResponse<Article>>('/articles', data);
    return response.data;
  },

  // 更新文章
  updateArticle: async (id: string, data: UpdateArticleData) => {
    const response = await api.put<ApiResponse<Article>>(`/articles/${id}`, data);
    return response.data;
  },

  // 删除文章
  deleteArticle: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/articles/${id}`);
    return response.data;
  },

  // 获取所有分类
  getCategories: async () => {
    const response = await api.get<ApiResponse<string[]>>(`/articles/categories`);
    return response.data;
  },

  // 获取所有标签
  getTags: async () => {
    const response = await api.get<ApiResponse<string[]>>(`/articles/tags`);
    return response.data;
  }
};
