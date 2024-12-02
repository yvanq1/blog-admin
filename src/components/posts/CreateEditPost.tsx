import React, { useState, useCallback, useEffect, useRef } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Article, CreateArticleData, UpdateArticleData } from '../../types/article';
import { generateUniqueImageName } from '../../utils/imageUtils';
import axios from 'axios';

interface CreateEditPostProps {
  article?: Article | null;
  onClose: () => void;
  onSubmit: (data: CreateArticleData | UpdateArticleData) => void;
}

const CreateEditPost: React.FC<CreateEditPostProps> = ({ article, onClose, onSubmit }) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState(article?.category || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [isPublished, setIsPublished] = useState(article?.isPublished || false);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState(article?.coverImage || '');
  const [previewUrl, setPreviewUrl] = useState<string>(article?.coverImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:8000/api/upload/image', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = `http://localhost:8000${response.data.data.url}`;
        const imageName = generateUniqueImageName();
        return `![${imageName}](${imageUrl})\n`;
      } else {
        throw new Error(response.data.message || '图片上传失败');
      }
    } catch (error) {
      console.error('Upload image error:', error);
      throw new Error('图片上传失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 处理网络图片本地化
  const handleNetworkImage = async (imageUrl: string): Promise<string> => {
    try {
      // 获取网络图片
      const response = await axios.get(imageUrl, {
        responseType: 'blob'
      });

      // 从URL中获取文件扩展名
      const extension = imageUrl.split('.').pop()?.split(/[#?]/)[0] || 'png';
      
      // 创建File对象
      const file = new File([response.data], `image.${extension}`, {
        type: `image/${extension}`
      });

      // 验证文件大小（5MB）
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('图片大小不能超过5MB');
      }

      // 上传到服务器
      return await handleImageUpload(file);
    } catch (error) {
      console.error('Network image processing error:', error);
      throw new Error('处理网络图片失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 处理粘贴事件
  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        // 处理直接粘贴的图片
        const file = item.getAsFile();
        if (file) {
          event.preventDefault();
          try {
            const markdownImage = await handleImageUpload(file);
            const textArea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
            if (textArea) {
              const { selectionStart, selectionEnd } = textArea;
              const newContent = content.slice(0, selectionStart) + markdownImage + content.slice(selectionEnd);
              setContent(newContent);
              toast.success('图片已上传并插入');
            }
          } catch (error) {
            toast.error(error instanceof Error ? error.message : '图片上传失败');
          }
        }
      } else if (item.type === 'text/plain') {
        // 处理粘贴的图片URL
        item.getAsString(async (text) => {
          const imageUrlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
          if (imageUrlRegex.test(text)) {
            event.preventDefault();
            try {
              const markdownImage = await handleNetworkImage(text);
              const textArea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
              if (textArea) {
                const { selectionStart, selectionEnd } = textArea;
                const newContent = content.slice(0, selectionStart) + markdownImage + content.slice(selectionEnd);
                setContent(newContent);
                toast.success('网络图片已保存到本地并插入');
              }
            } catch (error) {
              toast.error(error instanceof Error ? error.message : '处理网络图片失败');
            }
          }
        });
      }
    }
  };

  // 处理封面图上传
  const handleCoverImageUpload = async (file: File) => {
    try {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件');
        return;
      }

      // 验证文件大小（5MB）
      if (file.size > MAX_FILE_SIZE) {
        toast.error('图片大小不能超过5MB');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:8000/api/upload/image', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = `http://localhost:8000${response.data.data.url}`;
        setCoverImage(imageUrl);
        setPreviewUrl(imageUrl);
        toast.success('封面图上传成功');
      } else {
        throw new Error(response.data.message || '图片上传失败');
      }
    } catch (error) {
      console.error('Upload cover image error:', error);
      toast.error('封面图上传失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 处理封面图选择
  const handleCoverImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleCoverImageUpload(file);
    }
    // 清除文件选择，这样可以重复选择同一个文件
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = '';
    }
  };

  // 上传图片命令
  const uploadImageCommand = {
    name: 'upload-image',
    keyCommand: 'upload-image',
    buttonProps: { 'aria-label': 'Upload image' },
    icon: (
      <PhotoIcon className="h-4 w-4" />
    ),
    execute: (state: any, api: any) => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    },
  };

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过5MB');
      return;
    }

    try {
      const markdownImage = await handleImageUpload(file);
      const textArea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
      if (textArea) {
        const { selectionStart, selectionEnd } = textArea;
        const newContent = content.slice(0, selectionStart) + markdownImage + content.slice(selectionEnd);
        setContent(newContent);
        toast.success('图片已上传并插入');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '图片上传失败');
    } finally {
      // 清除文件选择，这样可以重复选择同一个文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 自定义命令列表
  const customCommands = [
    commands.group([], {
      name: 'custom',
      groupName: 'custom',
      buttonProps: { 'aria-label': 'Custom' }
    }),
    uploadImageCommand,
    commands.divider,
    commands.title,
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.divider,
    commands.link,
    commands.quote,
    commands.code,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
    commands.divider,
  ];

  const handleAddTag = useCallback(() => {
    if (tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('标题不能为空');
      return;
    }

    if (!content.trim()) {
      toast.error('内容不能为空');
      return;
    }

    if (!category.trim()) {
      toast.error('分类不能为空');
      return;
    }

    const articleData: CreateArticleData | UpdateArticleData = {
      title: title.trim(),
      content,
      category: category.trim(),
      tags,
      isPublished,
      coverImage
    };

    onSubmit(articleData);
  }, [title, content, category, tags, isPublished, coverImage, onSubmit]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {article ? '编辑文章' : '新建文章'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 隐藏的文件输入框 */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              标题
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="输入文章标题"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              分类
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="输入文章分类"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              封面图
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto h-32 w-auto object-cover"
                  />
                ) : (
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="cover-image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>上传图片</span>
                    <input
                      id="cover-image-upload"
                      type="file"
                      className="sr-only"
                      ref={coverImageInputRef}
                      onChange={handleCoverImageSelect}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1 text-gray-500">或拖拽图片到这里</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF 格式, 最大 5MB，推荐800×450 像素
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              内容
            </label>
            <div data-color-mode="light" className="dark:hidden">
              <MDEditor
                value={content}
                onChange={(value) => setContent(value || '')}
                commands={customCommands}
                height={400}
                preview="live"
                className="!border-gray-300"
                previewOptions={{
                  rehypePlugins: [],
                  remarkPlugins: []
                }}
                onPaste={handlePaste}
              />
            </div>
            <div data-color-mode="dark" className="hidden dark:block">
              <MDEditor
                value={content}
                onChange={(value) => setContent(value || '')}
                commands={customCommands}
                height={400}
                preview="live"
                className="!border-gray-600"
                previewOptions={{
                  rehypePlugins: [],
                  remarkPlugins: []
                }}
                onPaste={handlePaste}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              标签
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="输入标签后按回车添加"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                添加
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              立即发布
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              取消
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditPost;
