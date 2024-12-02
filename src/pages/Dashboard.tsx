import React from 'react';
import {
  DocumentTextIcon,
  TagIcon,
  UserGroupIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { name: '文章总数', value: '42', icon: DocumentTextIcon },
  { name: '标签总数', value: '18', icon: TagIcon },
  { name: '用户总数', value: '128', icon: UserGroupIcon },
  { name: '总浏览量', value: '12.5k', icon: EyeIcon },
  { name: '总评论数', value: '356', icon: ChatBubbleLeftIcon },
  { name: '总点赞数', value: '2.1k', icon: HeartIcon },
];

const recentPosts = [
  { id: 1, title: 'AI艺术的未来展望', views: 342, likes: 89, comments: 12 },
  { id: 2, title: '如何利用AI创作艺术', views: 256, likes: 67, comments: 8 },
  { id: 3, title: 'AI艺术与传统艺术的碰撞', views: 198, likes: 45, comments: 6 },
  { id: 4, title: '探索AI艺术的无限可能', views: 167, likes: 34, comments: 4 },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">仪表盘</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          查看网站的整体运营情况
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* 最近文章 */}
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            最近文章
          </h3>
          <div className="mt-6 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                      >
                        标题
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        浏览
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        点赞
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        评论
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentPosts.map((post) => (
                      <tr key={post.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
                          {post.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {post.views}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {post.likes}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {post.comments}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
