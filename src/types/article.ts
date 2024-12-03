export interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListResponse {
  total: number;
  page: number;
  limit: number;
  items: Article[];
}

export interface CreateEditArticleData extends FormData {}

// 为了兼容性，保留旧的类型名称
export type CreateArticleData = CreateEditArticleData;
export type UpdateArticleData = Partial<CreateEditArticleData>;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;  // 改为必需字段
}

export interface ArticleQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  keyword?: string;
}
