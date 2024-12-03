export interface CarouselItem {
  _id: string;  // 修改为MongoDB的_id
  title: string;
  imageUrl: string;
  link?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEditCarouselData {
  title: string;
  imageUrl: string | File;  // 可以是字符串URL或File对象
  link?: string;
  order: number;
  active: boolean;
}

export interface ReorderItem {
  id: string;
  order: number;
}
