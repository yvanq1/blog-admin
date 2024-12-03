import { Article, CreateEditArticleData, ArticleQuery } from '../types/article';
import { request } from '../utils/request';

const ARTICLE_API = '/api/articles';
const UPLOAD_API = '/api/upload';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ArticleListResponse {
  total: number;
  page: number;
  limit: number;
  items: Article[];
}

export async function getArticles(params: ArticleQuery): Promise<ArticleListResponse> {
  const response = await request.get<ApiResponse<ArticleListResponse>>(ARTICLE_API, { params });
  return response.data;
}

export async function getArticle(id: string): Promise<Article> {
  const response = await request.get<ApiResponse<Article>>(`${ARTICLE_API}/${id}`);
  return response.data;
}

export async function createArticle(data: FormData): Promise<Article> {
  const response = await request.post<ApiResponse<Article>>(ARTICLE_API, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function updateArticle(id: string, data: FormData): Promise<Article> {
  const response = await request.put<ApiResponse<Article>>(`${ARTICLE_API}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deleteArticle(id: string): Promise<void> {
  await request.delete<ApiResponse<void>>(`${ARTICLE_API}/${id}`);
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await request.post<ApiResponse<{ url: string }>>(`${UPLOAD_API}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.url;
}

export async function getCategories(): Promise<string[]> {
  const response = await request.get<ApiResponse<string[]>>(`${ARTICLE_API}/categories`);
  return response.data;
}

export async function getTags(): Promise<string[]> {
  const response = await request.get<ApiResponse<string[]>>(`${ARTICLE_API}/tags`);
  return response.data;
}
