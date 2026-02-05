import { useRef, useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveBlog, getBlogById, generateExcerpt } from '../../lib/blogStorage'
import { uploadImage } from '../../lib/storage'
import './BlogEditor.css'
import RichTextEditor from './RichTextEditor'

export default function BlogEditor() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditing = !!id && id !== 'new'
  const featuredUploadRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [featuredImage, setFeaturedImage] = useState('')
  const [tags, setTags] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const loadBlog = async () => {
      if (isEditing && id) {
        try {
          const blog = await getBlogById(id)
          if (blog) {
            setTitle(blog.title)
            setContent(blog.content)
            setPublished(blog.published)
            setFeaturedImage(blog.featuredImage || '')
            setTags(blog.tags?.join(', ') || '')
            setError('')
          } else {
            setError('Blog not found')
          }
        } catch (err: any) {
          setError(err?.message || 'Failed to load blog')
        }
        return
      }
      // Creating a new blog (or route changed away from an edit)
      setTitle('')
      setContent('')
      setPublished(false)
      setFeaturedImage('')
      setTags('')
      setError('')
    }

    loadBlog()
  }, [id, isEditing])

  const readImageAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })

  const isEmptyHtml = (html: string) => {
    const text = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return text.length === 0
  }

  const setFeaturedFromFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    try {
      // Upload to Firebase Storage instead of using base64
      const storageUrl = await uploadImage(file, 'blog-featured-images')
      setFeaturedImage(storageUrl)
    } catch (error: any) {
      console.error('Failed to upload featured image:', error)
      // Fallback to base64 if upload fails
      const src = await readImageAsDataUrl(file)
      setFeaturedImage(src)
    }
  }

  const onFeaturedUploadClick = () => {
    featuredUploadRef.current?.click()
  }

  const onFeaturedSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await setFeaturedFromFile(file)
    e.target.value = ''
  }

  const onFeaturedPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const file = e.clipboardData.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    e.preventDefault()
    await setFeaturedFromFile(file)
  }

  const onFeaturedDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    e.preventDefault()
    await setFeaturedFromFile(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (isEmptyHtml(content)) {
      setError('Content is required')
      return
    }

    setIsSaving(true)

    try {
      const blogData = {
        title: title.trim(),
        content,
        excerpt: generateExcerpt(content),
        author: 'Admin',
        published,
        featuredImage: featuredImage.trim() || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        ...(isEditing && id ? { id } : {}),
      }

      console.log('Saving blog:', { title: blogData.title, published: blogData.published, id: blogData.id })
      const savedBlog = await saveBlog(blogData)
      console.log('Blog saved successfully:', savedBlog.id)
      
      // Show success message
      setSuccessMessage(published ? 'Blog published successfully!' : 'Blog saved as draft!')
      
      // Redirect to admin list after 1.5 seconds
      setTimeout(() => {
        navigate('/admin/editor')
      }, 1500)
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to save blog. Please try again.'
      setError(errorMessage)
      console.error('Error saving blog:', err)
      setIsSaving(false)
    }
  }

  return (
    <div className="blog-editor">
      <div className="blog-editor__container">
        <div className="blog-editor__header">
          <h1 className="blog-editor__title">
            {isEditing ? 'Edit Blog' : 'Create New Blog'}
          </h1>
          <div className="blog-editor__header-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/editor')}
              className="blog-editor__back-button"
            >
              ← Back to List
            </button>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="blog-editor__back-button"
            >
              View Blogs
            </button>
          </div>
        </div>

        {error && (
          <div className="blog-editor__error">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="blog-editor__success">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="blog-editor__form">
          <div className="blog-editor__field">
            <label htmlFor="title" className="blog-editor__label">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="blog-editor__input"
              placeholder="Enter blog title"
              required
            />
          </div>

          <div className="blog-editor__field">
            <label htmlFor="featuredImage" className="blog-editor__label">
              Featured Image (URL or Upload/Paste)
            </label>
            <div
              className="blog-editor__featured-dropzone"
              onPaste={onFeaturedPaste}
              onDrop={onFeaturedDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={onFeaturedUploadClick}
              role="button"
              tabIndex={0}
              aria-label="Upload or paste featured image"
            >
              <input
                ref={featuredUploadRef}
                className="blog-editor__file-input"
                type="file"
                accept="image/*"
                onChange={onFeaturedSelected}
                aria-hidden
                tabIndex={-1}
              />
              {featuredImage ? (
                <div className="blog-editor__featured-preview">
                  <img className="blog-editor__featured-img" src={featuredImage} alt="Featured preview" />
                  <div className="blog-editor__featured-actions">
                    <button
                      type="button"
                      className="blog-editor__mini-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        onFeaturedUploadClick()
                      }}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      className="blog-editor__mini-btn blog-editor__mini-btn--danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFeaturedImage('')
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="blog-editor__featured-hint">
                  <div className="blog-editor__featured-title">Click to upload</div>
                  <div className="blog-editor__featured-subtitle">or paste / drag-drop an image here</div>
                </div>
              )}
            </div>

            <input
              id="featuredImage"
              type="url"
              value={featuredImage.startsWith('data:') ? '' : featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="blog-editor__input"
              placeholder="https://example.com/image.jpg (optional)"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="blog-editor__field">
            <label htmlFor="tags" className="blog-editor__label">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="blog-editor__input"
              placeholder="technology, AI, research"
            />
          </div>

          <div className="blog-editor__field">
            <label htmlFor="content" className="blog-editor__label">
              Content *
            </label>
            <div className="blog-editor__editor-wrapper">
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your blog content here..."
              />
            </div>
          </div>

          <div className="blog-editor__field">
            <label className="blog-editor__checkbox-label">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="blog-editor__checkbox"
              />
              <span>Publish immediately</span>
            </label>
          </div>

          <div className="blog-editor__actions">
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="blog-editor__button blog-editor__button--secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="blog-editor__button blog-editor__button--primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update Blog' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
