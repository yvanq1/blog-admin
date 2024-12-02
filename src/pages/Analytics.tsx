import React from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: '本月访问量',
    value: '8,249',
    change: '+12.5%',
    changeType: 'increase',
    icon: ChartBarIcon,
  },
  {
    name: '新增用户',
    value: '45',
    change: '+5.2%',
    changeType: 'increase',
    icon: UsersIcon,
  },
  {
    name: '新增文章',
    value: '12',
    change: '-2.3%',
    changeType: 'decrease',
    icon: DocumentTextIcon,
  },
  {
    name: '新增评论',
    value: '86',
    change: '+8.1%',
    changeType: 'increase',
    icon: ChatBubbleLeftIcon,
  },
];

const topPosts = [
  { id: 1, title: 'AI艺术的未来展望', views: 1242, trend: 'up' },
  { id: 2, title: '如何利用AI创作艺术', views: 986, trend: 'up' },
  { id: 3, title: 'AI艺术与传统艺术的碰撞', views: 879, trend: 'down' },
  { id: 4, title: '探索AI艺术的无限可能', views: 654, trend: 'up' },
];

const activeUsers = [
  { id: 1, name: 'user1', visits: 45, lastVisit: '2小时前' },
  { id: 2, name: 'user2', visits: 38, lastVisit: '4小时前' },
  { id: 3, name: 'user3', visits: 32, lastVisit: '6小时前' },
  { id: 4, name: 'user4', visits: 28, lastVisit: '8小时前' },
];

function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">数据统计</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          查看网站的运营数据和趋势
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* 热门文章 */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              热门文章
            </h3>
            <div className="mt-6 flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {topPosts.map((post) => (
                  <li key={post.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {post.views} 次浏览
                        </p>
                      </div>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.trend === 'up'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {post.trend === 'up' ? '上升' : '下降'}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 活跃用户 */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              活跃用户
            </h3>
            <div className="mt-6 flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {activeUsers.map((user) => (
                  <li key={user.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {user.visits} 次访问 · {user.lastVisit}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
