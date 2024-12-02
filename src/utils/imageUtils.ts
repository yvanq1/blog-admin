import axios from 'axios';
import { ClipboardEvent as ReactClipboardEvent } from 'react';

export const handlePastedImage = async (event: ReactClipboardEvent<HTMLDivElement>): Promise<string | null> => {
  const items = event.clipboardData?.items;
  
  if (!items) return null;

  // 查找剪贴板中的图片数据
  const imageItem = Array.from(items).find(
    item => item.type.indexOf('image') !== -1
  );

  if (!imageItem) return null;

  // 获取图片文件
  const file = imageItem.getAsFile();
  if (!file) return null;

  // 验证文件大小（限制为5MB）
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('图片大小不能超过5MB');
  }

  try {
    // 创建FormData对象
    const formData = new FormData();
    formData.append('image', file);

    // 上传图片到服务器
    const response = await axios.post('http://localhost:8000/api/upload/image', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      // 返回完整的图片URL
      return `http://localhost:8000${response.data.data.url}`;
    } else {
      throw new Error(response.data.message || '图片上传失败');
    }
  } catch (error) {
    console.error('Upload image error:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('请先登录管理员账号');
    }
    throw new Error('图片上传失败：' + (error instanceof Error ? error.message : '未知错误'));
  }
};

// 生成唯一的图片文件名
export const generateUniqueImageName = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `image-${timestamp}-${random}`;
};
