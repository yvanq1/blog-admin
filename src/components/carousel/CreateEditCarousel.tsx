import React, { useState, useCallback, useRef, useEffect } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { CarouselItem, CreateEditCarouselData } from '../../types/carousel';

interface CreateEditCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEditCarouselData) => void;
  initialData?: CarouselItem;
  isLoading?: boolean;
}

const RECOMMENDED_WIDTH = 1920;
const RECOMMENDED_HEIGHT = 800;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CreateEditCarousel: React.FC<CreateEditCarouselProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || '');
  const [link, setLink] = useState(initialData?.link || '');
  const [order, setOrder] = useState(initialData?.order || 0);
  const [active, setActive] = useState(initialData?.active ?? true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('图片大小不能超过5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('请上传图片文件');
        return;
      }

      // 检查图片尺寸
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        if (img.width < RECOMMENDED_WIDTH || img.height < RECOMMENDED_HEIGHT) {
          toast.error(`建议上传尺寸不小于 ${RECOMMENDED_WIDTH}x${RECOMMENDED_HEIGHT} 的图片`);
        }

        // 保存文件对象
        setImageFile(file);
        setImageUrl('');  // 清除原有的URL
        
        // 创建预览URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      };

      img.src = objectUrl;
    }
  };

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      toast.error('请输入标题');
      return;
    }

    if (!imageFile && !imageUrl) {
      toast.error('请上传图片');
      return;
    }

    onSubmit({
      title: title.trim(),
      imageUrl: imageFile || imageUrl,  // 如果有新文件就用文件，否则用原URL
      link: link.trim(),
      order,
      active
    });
  }, [title, imageFile, imageUrl, link, order, active, onSubmit]);

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setImageFile(null);  // 清除之前的文件
      setImageUrl(initialData.imageUrl);
      setPreviewUrl(initialData.imageUrl);
      setLink(initialData.link || '');
      setOrder(initialData.order);
      setActive(initialData.active);
    } else if (!isOpen) {
      setTitle('');
      setImageFile(null);
      setImageUrl('');
      setPreviewUrl('');
      setLink('');
      setOrder(0);
      setActive(true);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? '编辑Banner' : '创建Banner'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                标题 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                图片上传 *
              </label>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                推荐尺寸: {RECOMMENDED_WIDTH}x{RECOMMENDED_HEIGHT} 像素 (宽屏比例)
              </div>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-auto object-cover"
                    />
                  ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>上传图片</span>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <span className="text-gray-500">  支持 PNG, JPG, GIF 等格式</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                链接
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                排序
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                启用
              </label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                disabled={isLoading}
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEditCarousel;
