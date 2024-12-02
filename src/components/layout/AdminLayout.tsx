import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  TagIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  SunIcon,
  MoonIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { useAdmin } from '../../contexts/AdminContext';
import { adminLogout } from '../../services/admin';
import toast from 'react-hot-toast';

const navigation = [
  { name: '仪表盘', href: '/', icon: HomeIcon },
  { name: '文章管理', href: '/posts', icon: DocumentTextIcon },
  { name: '轮播图管理', href: '/carousel', icon: PhotoIcon },
  { name: '标签管理', href: '/tags', icon: TagIcon },
  { name: '用户管理', href: '/users', icon: UserGroupIcon },
  { name: '数据统计', href: '/analytics', icon: ChartBarIcon },
  { name: '系统设置', href: '/settings', icon: Cog6ToothIcon },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { admin, setAdmin } = useAdmin();

  const handleLogout = async () => {
    try {
      const response = await adminLogout();
      if (response.success) {
        setAdmin(null);
        toast.success('已退出登录');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('退出登录失败，请重试');
    }
  };

  if (!admin) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 移动端侧边栏 */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Blog Admin
            </Link>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 px-2 py-4">
              <div className="flex items-center space-x-3 rounded-md px-2 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium">{admin.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{admin.email}</div>
                </div>
              </div>
            </div>
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400" />
              退出登录
            </button>
          </div>
        </div>
      </div>

      {/* 桌面端侧边栏 */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800">
          <div className="flex h-16 items-center justify-center px-4">
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Blog Admin
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 px-2 py-4">
              <div className="flex items-center space-x-3 rounded-md px-2 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium">{admin.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{admin.email}</div>
                </div>
              </div>
            </div>
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400" />
              退出登录
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow">
          <button
            type="button"
            className="px-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-end px-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
