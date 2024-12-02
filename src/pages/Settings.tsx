import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

interface SettingOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingOption[]>([
    {
      id: 'notifications',
      title: 'Email Notifications',
      description: 'Receive email notifications for new comments and user registrations',
      enabled: true,
    },
    {
      id: 'autoPublish',
      title: 'Auto Publish',
      description: 'Automatically publish scheduled posts',
      enabled: false,
    },
    {
      id: 'maintenance',
      title: 'Maintenance Mode',
      description: 'Put the site in maintenance mode',
      enabled: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your admin dashboard preferences and site settings
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {settings.map((setting) => (
            <div key={setting.id} className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    {setting.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {setting.description}
                  </p>
                </div>
                <Switch
                  checked={setting.enabled}
                  onChange={() => handleToggle(setting.id)}
                  className={`${
                    setting.enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      setting.enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
            Site Information
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                id="siteName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="AI Art Blog"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Site Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter site description..."
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-right sm:px-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
