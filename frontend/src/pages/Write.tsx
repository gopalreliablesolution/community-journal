import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import CodeBlock from '@tiptap/extension-code-block';
import { useDropzone } from 'react-dropzone';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Save,
  Send,
  ChevronDown,
  ChevronUp,
  Settings,
  Eye,
  Upload,
  ArrowLeft,
} from 'lucide-react';
import api from '../services/apiClient';
import { useDebounce } from '../hooks/useDebounce';
import type { Category } from '../types';
import { toast } from 'sonner';

export default function Write() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxSize: 5242880,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        const { data } = await api.post('/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setCoverImage(data.data.path);
        setCoverImageId(data.data.id);
        toast.success('Cover image uploaded');
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('Image upload failed');
      } finally {
        setIsUploading(false);
      }
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
      Image,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      CodeBlock,
      Placeholder.configure({
        placeholder: 'Tell your story...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[420px] py-4',
      },
    },
  });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data));
  }, []);

  const autosave = useCallback(
    useDebounce(async (content: string) => {
      if (!id) return;

      setIsSaving(true);
      try {
        await api.patch(`/posts/${id}/autosave`, {
          title,
          contentHtml: content,
          excerpt,
          metaTitle,
          metaDescription,
          categoryIds: selectedCategories,
          tagNames: tags,
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error('Autosave failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 5000),
    [id, title, excerpt, metaTitle, metaDescription, selectedCategories, tags]
  );

  useEffect(() => {
    if (editor && id) {
      const loadPost = async () => {
        try {
          const { data } = await api.get(`/posts/${id}`);
          const post = data.data;
          setTitle(post.title);
          setExcerpt(post.excerpt || '');
          setMetaTitle(post.metaTitle || '');
          setMetaDescription(post.metaDescription || '');
          setSelectedCategories(post.categories?.map((c: any) => c.category.id) || []);
          setTags(post.tags?.map((t: any) => t.tag.name) || []);
          if (post.coverImage) {
            setCoverImage(post.coverImage.path);
            setCoverImageId(post.coverImage.id);
          }
          if (editor && post.contentHtml) {
            editor.commands.setContent(post.contentHtml);
          }
        } catch (error) {
          console.error('Failed to load post:', error);
        }
      };
      loadPost();
    }
  }, [editor, id]);

  useEffect(() => {
    if (editor) {
      const handleUpdate = () => {
        const content = editor.getHTML();
        autosave(content);
      };
      editor.on('update', handleUpdate);
      return () => {
        editor.off('update', handleUpdate);
      };
    }
  }, [editor, autosave]);

  const handleSaveDraft = async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      const content = editor.getHTML();
      const payload = {
        title,
        contentHtml: content,
        excerpt,
        metaTitle,
        metaDescription,
        categoryIds: selectedCategories,
        tagNames: tags,
        coverImageId: coverImageId || undefined,
        status: 'DRAFT' as const,
      };

      if (id) {
        await api.patch(`/posts/${id}`, payload);
      } else {
        const { data } = await api.post('/posts', payload);
        navigate(`/edit/${data.data.id}`, { replace: true });
      }
      setLastSaved(new Date());
      toast.success('Draft saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!editor || !id) return;

    setIsPublishing(true);
    try {
      const content = editor.getHTML();
      await api.patch(`/posts/${id}`, {
        title,
        contentHtml: content,
        excerpt,
        metaTitle,
        metaDescription,
        categoryIds: selectedCategories,
        tagNames: tags,
        coverImageId: coverImageId || undefined,
        status: 'PUBLISHED',
      });
      toast.success('Article published successfully!');
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Publish failed:', error);
      toast.error('Failed to publish article');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageInsert = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const { data } = await api.post('/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        editor.chain().focus().setImage({ src: data.data.path }).run();
        toast.success('Inline image inserted');
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('Failed to upload image');
      }
    };
    input.click();
  };

  const handleAddLink = () => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const ToolbarButton = ({
    onClick,
    active = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '6px 8px',
        borderRadius: '6px',
        border: 'none',
        background: active ? '#F7EAD2' : 'transparent',
        color: active ? '#A67C1F' : '#6B6B6B',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = '#FAF8F5';
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );

  if (!editor) return null;

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', color: '#1A1A1A' }}>
      
      {/* Sticky Header Bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#FFFFFF', borderBottom: '1px solid #EFEFEF' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#6B6B6B',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft style={{ width: '15px', height: '15px' }} />
              Back
            </button>

            {lastSaved && (
              <span style={{ fontSize: '12px', color: '#888888' }}>
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {isSaving && (
              <span style={{ fontSize: '12px', color: '#C89B3C', fontWeight: 600 }}>
                Saving draft...
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPreview(!isPreview)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #DADADA',
                background: '#FFFFFF',
                color: '#1A1A1A',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Eye style={{ width: '14px', height: '14px' }} />
              {isPreview ? 'Edit' : 'Preview'}
            </button>

            <button
              onClick={() => setShowSeoFields(!showSeoFields)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #DADADA',
                background: '#FFFFFF',
                color: '#1A1A1A',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Settings style={{ width: '14px', height: '14px' }} />
              SEO
              {showSeoFields ? <ChevronUp style={{ width: '14px', height: '14px' }} /> : <ChevronDown style={{ width: '14px', height: '14px' }} />}
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1px solid #DADADA',
                background: '#FAF8F5',
                color: '#1A1A1A',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Save style={{ width: '14px', height: '14px' }} />
              Save Draft
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing || !id}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: !id ? '#DADADA' : '#C89B3C',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: !id ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: !id ? 'none' : '0 4px 14px rgba(200,155,60,0.3)',
              }}
            >
              <Send style={{ width: '14px', height: '14px' }} />
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '36px 20px 80px' }}>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #EFEFEF',
            padding: '36px 40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
          }}
        >
          {/* Cover Image Upload Area */}
          <div style={{ marginBottom: '28px' }}>
            {coverImage ? (
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src={coverImage}
                  alt="Cover"
                  style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80'; }}
                />
                <button
                  onClick={() => {
                    setCoverImage(null);
                    setCoverImageId(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.65)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Remove Cover
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                style={{
                  width: '100%',
                  height: '140px',
                  border: isDragActive ? '2px dashed #C89B3C' : '2px dashed #DADADA',
                  background: isDragActive ? '#F7EAD2' : '#FAF8F5',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                }}
              >
                <input {...getInputProps()} />
                {isUploading ? (
                  <span style={{ fontSize: '13px', color: '#C89B3C', fontWeight: 600 }}>Uploading image...</span>
                ) : (
                  <>
                    <Upload style={{ width: '28px', height: '28px', color: '#C89B3C', marginBottom: '8px' }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#333333' }}>
                      {isDragActive ? 'Drop image here...' : 'Click or drag & drop cover image'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#888888', marginTop: '4px' }}>
                      JPEG, PNG, WebP (max 5MB)
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Title & Excerpt */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title..."
            style={{
              width: '100%',
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '36px',
              fontWeight: 600,
              color: '#1A1A1A',
              border: 'none',
              outline: 'none',
              marginBottom: '12px',
              background: 'transparent',
            }}
          />
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a brief compelling summary..."
            style={{
              width: '100%',
              fontSize: '16px',
              color: '#6B6B6B',
              border: 'none',
              outline: 'none',
              marginBottom: '24px',
              background: 'transparent',
            }}
          />

          {/* Rich Text Formatting Toolbar */}
          <div style={{ position: 'sticky', top: '60px', zIndex: 9, background: '#FFFFFF', borderTop: '1px solid #EFEFEF', borderBottom: '1px solid #EFEFEF', padding: '8px 0', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
              <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
              <Redo size={16} />
            </ToolbarButton>

            <div style={{ width: '1px', height: '20px', background: '#EFEFEF', margin: '0 4px' }} />

            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1">
              <Heading1 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
              <Heading2 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
              <Heading3 size={16} />
            </ToolbarButton>

            <div style={{ width: '1px', height: '20px', background: '#EFEFEF', margin: '0 4px' }} />

            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
              <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
              <UnderlineIcon size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strike">
              <Strikethrough size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code">
              <Code size={16} />
            </ToolbarButton>

            <div style={{ width: '1px', height: '20px', background: '#EFEFEF', margin: '0 4px' }} />

            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
              <Quote size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
              <List size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
              <ListOrdered size={16} />
            </ToolbarButton>

            <div style={{ width: '1px', height: '20px', background: '#EFEFEF', margin: '0 4px' }} />

            <ToolbarButton onClick={() => setShowLinkInput(!showLinkInput)} active={editor.isActive('link')} title="Add Link">
              <LinkIcon size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={handleImageInsert} title="Insert Image">
              <ImageIcon size={16} />
            </ToolbarButton>
          </div>

          {/* Link Popup */}
          {showLinkInput && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#FAF8F5', padding: '10px 14px', borderRadius: '10px' }}>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Paste URL..."
                style={{ flex: 1, padding: '6px 12px', border: '1px solid #DADADA', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
              />
              <button onClick={handleAddLink} style={{ padding: '6px 14px', background: '#C89B3C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Add
              </button>
            </div>
          )}

          {/* SEO Modal Panel */}
          {showSeoFields && (
            <div style={{ marginBottom: '24px', background: '#FAF8F5', padding: '20px', borderRadius: '12px', border: '1px solid #EFEFEF' }}>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1A1A1A', marginTop: 0, marginBottom: '14px' }}>
                SEO Metadata
              </h3>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={70}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DADADA', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={160}
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DADADA', borderRadius: '8px', fontSize: '13.5px', outline: 'none', resize: 'none' }}
                />
              </div>
            </div>
          )}

          {/* Categories & Tags Selector */}
          <div style={{ marginBottom: '28px', background: '#FAF8F5', padding: '20px', borderRadius: '12px', border: '1px solid #EFEFEF' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: selectedCategories.includes(cat.id) ? 'none' : '1px solid #DADADA',
                      background: selectedCategories.includes(cat.id) ? '#C89B3C' : '#FFFFFF',
                      color: selectedCategories.includes(cat.id) ? '#FFFFFF' : '#444444',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tags
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      background: '#F7EAD2',
                      color: '#A67C1F',
                      borderRadius: '9999px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                    }}
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      style={{ background: 'none', border: 'none', color: '#A67C1F', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and press Enter..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #DADADA', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Tiptap Article Editor */}
          {isPreview ? (
            <div style={{ minHeight: '400px', paddingTop: '10px' }}>
              {title && <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '36px', fontWeight: 600 }}>{title}</h1>}
              {excerpt && <p style={{ fontSize: '18px', color: '#6B6B6B' }}>{excerpt}</p>}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
              />
            </div>
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>
      </div>
    </div>
  );
}
