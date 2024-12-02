import React, { useState } from 'react';
import { UserPlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 10:30',
  },
  {
    id: 2,
    username: 'editor',
    email: 'editor@example.com',
    role: 'editor',
    status: 'active',
    lastLogin: '2024-01-14 15:45',
  },
  {
    id: 3,
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-01-10 09:20',
  },
];

function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleDeleteUser = (id: number) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      setUsers(users.filter(user => user.id !== id));
      toast.success('用户已删除');
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">用户管理</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            管理系统用户和权限
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" />
            添加用户
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        用户名
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        邮箱
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        角色
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        状态
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        最后登录
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {user.status === 'active' ? '活跃' : '未活跃'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <TrashIcon className="h-5 w-5" />
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
      </div>
    </div>
  );
}

export default Users;
