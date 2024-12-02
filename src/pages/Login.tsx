import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { adminLogin } from '../services/admin';
import { useAdmin } from '../contexts/AdminContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { setAdmin } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await adminLogin({ email, password });
      if (response.success) {
        setAdmin(response.data);
        toast.success('登录成功');
        navigate('/');
      } else {
        toast.error(response.message || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('登录失败，请重试');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 rounded-full p-2 bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 shadow-lg"
      >
        {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
      </button>
      <div className="max-w-md w-full">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Blog Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            后台管理系统
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 focus:z-10 sm:text-sm"
                placeholder="管理员邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 focus:z-10 sm:text-sm"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              登录
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          默认账号：admin@example.com<br />
          默认密码：admin123456
        </div>
      </div>
    </div>
  );
}

export default Login;
