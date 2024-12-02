import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import CreateEditPost from '../components/posts/CreateEditPost';
import { Article, CreateArticleData, UpdateArticleData } from '../types/article';
import { articleApi } from '../services/article';

const Posts: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  // 加载文章列表
  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await articleApi.getArticles({
        page: currentPage,
        limit: pageSize
      });
      if (response.success && response.data) {
        setArticles(response.data.items);
        setTotal(response.data.total);
      } else {
        toast.error('加载文章列表失败');
      }
    } catch (error) {
      toast.error('加载文章列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [currentPage, pageSize]);

  // 创建文章
  const handleCreate = async (data: CreateArticleData) => {
    try {
      const response = await articleApi.createArticle(data);
      if (response.success) {
        toast.success('创建文章成功');
        setIsModalOpen(false);
        loadArticles();
      } else {
        toast.error(response.message || '创建文章失败');
      }
    } catch (error) {
      toast.error('创建文章失败');
    }
  };

  // 更新文章
  const handleUpdate = async (data: UpdateArticleData) => {
    if (!editingArticle) return;
    try {
      const response = await articleApi.updateArticle(editingArticle._id, data);
      if (response.success) {
        toast.success('更新文章成功');
        setIsModalOpen(false);
        setEditingArticle(null);
        loadArticles();
      } else {
        toast.error(response.message || '更新文章失败');
      }
    } catch (error) {
      toast.error('更新文章失败');
    }
  };

  // 删除文章
  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;
    try {
      const response = await articleApi.deleteArticle(id);
      if (response.success) {
        toast.success('删除文章成功');
        loadArticles();
      } else {
        toast.error(response.message || '删除文章失败');
      }
    } catch (error) {
      toast.error('删除文章失败');
    }
  };

  // 编辑文章
  const handleEdit = async (article: Article) => {
    try {
      // 获取完整的文章内容
      const response = await articleApi.getArticle(article._id);
      if (response.success && response.data) {
        setEditingArticle(response.data);
        setIsModalOpen(true);
      } else {
        toast.error('获取文章内容失败');
      }
    } catch (error) {
      toast.error('获取文章内容失败');
    }
  };

  // 处理表单提交
  const handleSubmit = (data: CreateArticleData | UpdateArticleData) => {
    if (editingArticle) {
      handleUpdate({
        ...data,
        content: data.content || editingArticle.content // 如果没有新内容，保留原内容
      } as UpdateArticleData);
    } else {
      handleCreate(data as CreateArticleData);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">文章管理</h1>
        <button
          onClick={() => {
            setEditingArticle(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          新建文章
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">加载中...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">浏览/点赞</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          article.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {article.isPublished ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.views} / {article.likes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              共 <span className="font-medium">{total}</span> 篇文章
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                上一页
              </button>
              <span className="px-3 py-1 text-sm">
                第 {currentPage} 页 / 共 {Math.ceil(total / pageSize)} 页
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(total / pageSize), prev + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        </>
      )}

      {/* 创建/编辑文章弹窗 */}
      {isModalOpen && (
        <CreateEditPost
          article={editingArticle}
          onClose={() => {
            setIsModalOpen(false);
            setEditingArticle(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Posts;
