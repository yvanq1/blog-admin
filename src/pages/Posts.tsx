import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import CreateEditPost from '../components/posts/CreateEditPost';
import { Article, CreateEditArticleData } from '../types/article';
import * as articleService from '../services/article';

const Posts: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticles({});
      setArticles(response.items);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('获取文章列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleUpdateArticle = async (data: FormData) => {
    if (!editingArticle) return;
    try {
      setLoading(true);
      await articleService.updateArticle(editingArticle._id, data);
      toast.success('更新文章成功');
      setIsModalOpen(false);
      fetchArticles();
    } catch (error) {
      console.error('Failed to update article:', error);
      toast.error('更新文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (data: FormData) => {
    try {
      setLoading(true);
      await articleService.createArticle(data);
      toast.success('创建文章成功');
      setIsModalOpen(false);
      fetchArticles();
    } catch (error) {
      console.error('Failed to create article:', error);
      toast.error('创建文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;
    try {
      await articleService.deleteArticle(id);
      toast.success('删除文章成功');
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error('删除文章失败');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">文章管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理所有的博客文章，包括创建、编辑和删除操作。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingArticle(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            新建文章
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      标题
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      分类
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      标签
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      状态
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      浏览量
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      创建时间
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {articles.map((article) => (
                    <tr key={article._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          {article.coverImage && (
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={article.coverImage} 
                                alt={article.title}
                                onError={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  img.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className={`${article.coverImage ? 'ml-4' : ''}`}>
                            <div className="font-medium text-gray-900">{article.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {article.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {article.tags.join(', ')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            article.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {article.isPublished ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {article.views}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={async () => {
                            try {
                              const updatedArticle = await articleService.getArticle(article._id);
                              setEditingArticle(updatedArticle);
                              setIsModalOpen(true);
                            } catch (error) {
                              console.error('Failed to fetch article:', error);
                              toast.error('获取文章详情失败');
                            }
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CreateEditPost
          article={editingArticle}
          onClose={() => {
            setIsModalOpen(false);
            setEditingArticle(null);
          }}
          onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle}
        />
      )}
    </div>
  );
};

export default Posts;
