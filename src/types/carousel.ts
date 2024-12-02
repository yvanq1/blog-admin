export interface CarouselItem {
  _id: string;  // 修改为MongoDB的_id
  title: string;
  imageUrl: string;
  link: string;
  order: number;
  active: boolean;
  createdAt: string;
}

export type CreateEditCarouselData = Omit<CarouselItem, '_id' | 'createdAt'>;
