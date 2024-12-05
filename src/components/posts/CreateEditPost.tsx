import React, { useState, useEffect, useCallback, useRef } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { Article, CreateEditArticleData } from '../../types/article';
import * as articleService from '../../services/article';
import { request } from '../../utils/request';

interface Props {
  article?: Article | null;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface UploadData {
  url: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CreateEditPost: React.FC<Props> = ({ 
  article, 
  onClose, 
  onSubmit,
  isLoading = false 
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState(article?.category || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [isPublished, setIsPublished] = useState(article?.isPublished || false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(article?.coverImage || '');
  const [previewUrl, setPreviewUrl] = useState(article?.coverImage || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['comfyui', 'sd', 'mj', 'other'];

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setContent(article.content || '');
      setCategory(article.category || '');
      setTags(article.tags || []);
      setIsPublished(article.isPublished || false);
      setImageFile(null);  // 清除之前的文件
      setImageUrl(article.coverImage || '');
      setPreviewUrl(article.coverImage || '');
    }
    const loadMetadata = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          articleService.getCategories(),
          articleService.getTags()
        ]);
        // setCategories(categoriesResponse);
        // setAllTags(tagsResponse);
      } catch (error) {
        console.error('Failed to load metadata:', error);
        toast.error('加载分类和标签失败');
      }
    };

    loadMetadata();
  }, [article]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('图片大小不能超过5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    setImageFile(file);
    setImageUrl('');  // 清除原有的URL
    
    // 创建预览URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('图片大小不能超过5MB');
      return '';
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file); // 修改字段名为 'file'

      const response = await request.post<ApiResponse<UploadData>>('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data) {
        throw new Error('Upload failed');
      }

      const imageUrl = response.data.url;
      toast.success('图片上传成功');
      return `![image](${imageUrl})\n`;
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error && error.message.includes('401')) {
        toast.error('请先登录管理员账号');
      } else {
        toast.error('图片上传失败');
      }
      return '';
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    const text = event.clipboardData?.getData('text/plain');
    const html = event.clipboardData?.getData('text/html');

    // 处理图片粘贴
    if (items) {
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            const markdownImage = await handleImageUpload(file);
            if (markdownImage) {
              const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
              if (textarea) {
                const { selectionStart, selectionEnd } = textarea;
                const newContent = content.slice(0, selectionStart) + markdownImage + content.slice(selectionEnd);
                setContent(newContent);
                return;
              }
            }
          }
        }
      }
    }

    // 处理HTML内容，优先从HTML中提取格式
    if (html) {
      event.preventDefault();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      let convertedText = '';
      const processNode = (node: Node) => {
        switch (node.nodeType) {
          case Node.ELEMENT_NODE:
            const element = node as Element;
            switch (element.tagName.toLowerCase()) {
              case 'h1':
                convertedText += '# ' + (element.textContent || '') + '\n\n';
                break;
              case 'h2':
                convertedText += '## ' + (element.textContent || '') + '\n\n';
                break;
              case 'h3':
                convertedText += '### ' + (element.textContent || '') + '\n\n';
                break;
              case 'p':
                convertedText += (element.textContent || '') + '\n\n';
                break;
              case 'strong':
              case 'b':
                convertedText += '**' + (element.textContent || '') + '**';
                break;
              case 'em':
              case 'i':
                convertedText += '*' + (element.textContent || '') + '*';
                break;
              case 'code':
                if (element.parentElement?.tagName.toLowerCase() === 'pre') {
                  convertedText += '```\n' + (element.textContent || '') + '\n```\n\n';
                } else {
                  convertedText += '`' + (element.textContent || '') + '`';
                }
                break;
              case 'pre':
                if (!element.querySelector('code')) {
                  convertedText += '```\n' + (element.textContent || '') + '\n```\n\n';
                }
                break;
              case 'a':
                const href = element.getAttribute('href') || '';
                convertedText += '[' + (element.textContent || '') + '](' + href + ')';
                break;
              case 'ul':
              case 'ol':
                element.childNodes.forEach((child, index) => {
                  if (child.nodeType === Node.ELEMENT_NODE && child.nodeName.toLowerCase() === 'li') {
                    const prefix = element.tagName.toLowerCase() === 'ul' ? '- ' : `${index + 1}. `;
                    convertedText += prefix + ((child as Element).textContent || '') + '\n';
                  }
                });
                convertedText += '\n';
                break;
              case 'blockquote':
                const text = element.textContent || '';
                convertedText += '> ' + text.split('\n').join('\n> ') + '\n\n';
                break;
              case 'img':
                const src = element.getAttribute('src') || '';
                const alt = element.getAttribute('alt') || '';
                convertedText += `![${alt}](${src})\n\n`;
                break;
              case 'table':
                const rows = element.querySelectorAll('tr');
                rows.forEach((row, rowIndex) => {
                  const cells = row.querySelectorAll('td, th');
                  convertedText += '|' + Array.from(cells).map(cell => cell.textContent?.trim() || '').join('|') + '|\n';
                  if (rowIndex === 0) {
                    convertedText += '|' + Array.from(cells).map(() => '---').join('|') + '|\n';
                  }
                });
                convertedText += '\n';
                break;
              default:
                element.childNodes.forEach(processNode);
            }
            break;
          case Node.TEXT_NODE:
            if (node.parentElement?.tagName.toLowerCase() === 'pre' ||
                node.parentElement?.tagName.toLowerCase() === 'code') {
              convertedText += node.textContent;
            } else {
              convertedText += node.textContent?.replace(/\n\s*/g, ' ');
            }
            break;
        }
      };

      doc.body.childNodes.forEach(processNode);
      
      // 插入转换后的内容
      const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
      if (textarea) {
        const { selectionStart, selectionEnd } = textarea;
        const newContent = content.slice(0, selectionStart) + convertedText.trim() + content.slice(selectionEnd);
        setContent(newContent);
      }
    } else if (text) {
      // 如果已经是Markdown格式，直接使用
      const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
      if (textarea) {
        const { selectionStart, selectionEnd } = textarea;
        const newContent = content.slice(0, selectionStart) + text + content.slice(selectionEnd);
        setContent(newContent);
      }
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const markdownImage = await handleImageUpload(file);
    if (markdownImage) {
      const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
      if (textarea) {
        const { selectionStart, selectionEnd } = textarea;
        const newContent = content.slice(0, selectionStart) + markdownImage + content.slice(selectionEnd);
        setContent(newContent);
      }
    }

    // 清除文件选择
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('请输入文章标题');
      return;
    }

    if (!content.trim()) {
      toast.error('请输入文章内容');
      return;
    }

    if (!category) {
      toast.error('请选择文章分类');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    // 将标签数组转换为字符串后添加到 FormData
    tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });
    formData.append('isPublished', String(isPublished));
    
    if (imageFile) {
      formData.append('coverImage', imageFile);
    } else if (imageUrl) {
      formData.append('coverImage', imageUrl);
    }

    onSubmit(formData);
  }, [title, content, category, tags, isPublished, imageFile, imageUrl, onSubmit]);

  const imageUploadCommand = {
    name: 'upload-image',
    keyCommand: 'upload-image',
    buttonProps: { 'aria-label': '上传图片' },
    icon: <PhotoIcon className="h-4 w-4" />,
    execute: () => {
      fileInputRef.current?.click();
    },
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <div className="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[90%] sm:p-6 sm:align-middle">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">关闭</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                标题
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="请输入文章标题"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                分类
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">请选择分类</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                标签
              </label>
              <div className="mt-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 inline-flex items-center p-0.5 text-blue-400 hover:text-blue-600"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="输入标签后按回车或逗号添加"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">封面图片</label>
              <div className="mt-1 flex items-center space-x-4">
                {previewUrl ? (
                  <div className="relative h-32 w-32">
                    <img src={previewUrl} alt="Preview" className="h-32 w-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImageUrl('');
                        setPreviewUrl('');
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-1 text-sm text-gray-500">点击上传</div>
                    </div>
                    <input
                      type="file"
                      className="absolute h-full w-full cursor-pointer opacity-0"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                内容
              </label>
              <div className="relative mt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <MDEditor
                  value={content}
                  onChange={value => setContent(value || '')}
                  height={800}
                  className={`${uploadingImage ? 'opacity-50 pointer-events-none' : ''} min-h-[800px] w-full`}
                  commands={[
                    commands.group([imageUploadCommand], {
                      name: 'upload',
                      groupName: 'upload',
                      buttonProps: { 'aria-label': '上传' }
                    }),
                    ...commands.getCommands()
                  ]}
                  onPaste={handlePaste}
                  preview="live"
                  previewOptions={{
                    transformImageUri: (uri: string) => {
                      // 如果是相对路径，转换为绝对路径
                      if (uri.startsWith('/')) {
                        return `${process.env.REACT_APP_API_URL}${uri}`;
                      }
                      return uri;
                    }
                  }}
                  extraCommands={[
                    commands.codeEdit,
                    commands.codeLive,
                    commands.codePreview
                  ]}
                />
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-gray-500">正在上传图片...</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                支持 Markdown 格式，可以通过粘贴或点击工具栏按钮上传图片
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="isPublished"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                立即发布
              </label>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-start-2 sm:text-sm"
              >
                {isLoading ? '保存中...' : '保存'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-start-1 sm:mt-0 sm:text-sm"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEditPost;
