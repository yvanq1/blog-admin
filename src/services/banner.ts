import { CarouselItem, CreateEditCarouselData } from '../types/carousel';
import { request } from '../utils/request';

const BANNER_API = '/api/banners';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function getBanners(): Promise<CarouselItem[]> {
  const response = await request.get<ApiResponse<CarouselItem[]>>(BANNER_API);
  return response.data;
}

export async function createBanner(data: FormData): Promise<CarouselItem> {
  const response = await request.post<ApiResponse<CarouselItem>>(BANNER_API, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function updateBanner(id: string, data: FormData): Promise<CarouselItem> {
  const response = await request.put<ApiResponse<CarouselItem>>(`${BANNER_API}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deleteBanner(id: string): Promise<void> {
  await request.delete<ApiResponse<void>>(`${BANNER_API}/${id}`);
}

export interface ReorderItem {
  id: string;
  order: number;
}

export async function reorderBanners(orders: ReorderItem[]): Promise<void> {
  await request.patch<ApiResponse<void>>(`${BANNER_API}/reorder`, { orders });
}
