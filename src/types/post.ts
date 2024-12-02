export interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  status: 'published' | 'draft';
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
}

export type CreateEditPostData = Omit<Post, 'id' | 'createdAt' | 'views' | 'likes' | 'comments'>;
