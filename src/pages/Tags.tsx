import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Tag {
  id: number;
  name: string;
  count: number;
}

const initialTags: Tag[] = [
  { id: 1, name: 'AI', count: 15 },
  { id: 2, name: '艺术', count: 12 },
  { id: 3, name: '教程', count: 8 },
  { id: 4, name: '未来', count: 6 },
  { id: 5, name: '创作', count: 9 },
  { id: 6, name: '传统', count: 4 },
];

function Tags() {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      const tag = {
        id: Math.max(...tags.map(t => t.id)) + 1,
        name: newTag.trim(),
        count: 0,
      };
      setTags([...tags, tag]);
      setNewTag('');
      toast.success('标签已添加');
    }
  };

  const handleDeleteTag = (id: number) => {
    if (window.confirm('确定要删除这个标签吗？')) {
      setTags(tags.filter(tag => tag.id !== id));
      toast.success('标签已删除');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">标签管理</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          管理所有的文章标签
        </p>
      </div>

      <form onSubmit={handleAddTag} className="flex gap-4">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="输入新标签名称"
          className="input-primary flex-1"
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          添加标签
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="relative group bg-white dark:bg-gray-800 p-4 shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {tag.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tag.count} 篇文章
                </p>
              </div>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tags;
