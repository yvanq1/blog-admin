export interface Article {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListResponse {
  total: number;
  page: number;
  limit: number;
  items: Article[];
}

export interface CreateArticleData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  isPublished?: boolean;
}

export type UpdateArticleData = Partial<CreateArticleData>;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
