import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { CarouselItem, CreateEditCarouselData } from '../types/carousel';
import CreateEditCarousel from '../components/carousel/CreateEditCarousel';
import * as bannerService from '../services/banner';

function Carousel() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CarouselItem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const data = await bannerService.getBanners();
      setCarouselItems(data);
    } catch (error) {
      toast.error('获取Banner列表失败');
      console.error('Error fetching banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreateEdit = async (data: CreateEditCarouselData) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('link', data.link || '');
      formData.append('order', String(data.order));
      formData.append('active', String(data.active));

      // 如果imageUrl是Base64字符串，说明是新上传的图片
      if (data.imageUrl.startsWith('data:')) {
        const blob = await fetch(data.imageUrl).then(res => res.blob());
        formData.append('image', blob, 'image.jpg');
      }

      if (editingItem) {
        await bannerService.updateBanner(editingItem._id, formData);
        toast.success('更新Banner成功');
      } else {
        await bannerService.createBanner(formData);
        toast.success('创建Banner成功');
      }

      setIsModalOpen(false);
      setEditingItem(undefined);
      fetchBanners();
    } catch (error) {
      toast.error(editingItem ? '更新Banner失败' : '创建Banner失败');
      console.error('Error creating/updating banner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个Banner吗？')) {
      return;
    }

    try {
      setIsLoading(true);
      await bannerService.deleteBanner(id);
      toast.success('删除Banner成功');
      fetchBanners();
    } catch (error) {
      toast.error('删除Banner失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveItem = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = carouselItems.findIndex(item => item._id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === carouselItems.length - 1)
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const newItems = [...carouselItems];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const temp = newItems[targetIndex].order;
      newItems[targetIndex].order = newItems[currentIndex].order;
      newItems[currentIndex].order = temp;
      
      // Sort by order
      newItems.sort((a, b) => a.order - b.order);

      // Update orders
      await bannerService.reorderBanners(
        newItems.map((item, index) => ({
          id: item._id,
          order: index
        }))
      );

      toast.success('调整顺序成功');
      fetchBanners();
    } catch (error) {
      toast.error('调整顺序失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = (id: string) => {
    setCarouselItems(prevItems =>
      prevItems.map(item =>
        item._id === id ? { ...item, active: !item.active } : item
      )
    );
    toast.success('状态已更新');
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">轮播图管理</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            管理首页轮播图的显示内容、顺序和状态。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditingItem(undefined);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            新增轮播图
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                预览
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                标题
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                创建时间
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                排序
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {carouselItems.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-20 w-32">
                    <img
                      className="h-20 w-32 object-cover rounded"
                      src={item.imageUrl}
                      alt={item.title}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </div>
                  <div className="text-sm text-indigo-600 dark:text-indigo-400">
                    {item.link}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(item._id)}
                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                      item.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                    }`}
                  >
                    {item.active ? '已启用' : '已禁用'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMoveItem(item._id, 'up')}
                      disabled={carouselItems.indexOf(item) === 0}
                      className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
                    >
                      <ArrowUpIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleMoveItem(item._id, 'down')}
                      disabled={carouselItems.indexOf(item) === carouselItems.length - 1}
                      className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
                    >
                      <ArrowDownIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-3 justify-end">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CreateEditCarousel
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(undefined);
          }}
          onSubmit={handleCreateEdit}
          initialData={editingItem}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default Carousel;
