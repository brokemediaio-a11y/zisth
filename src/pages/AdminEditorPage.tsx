import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import BlogEditor from '../components/blog/BlogEditor'
import { deleteBlog, getAllBlogs } from '../lib/blogStorage'
import type { Blog } from '../types/blog'
import '../components/blog/AdminBlogList.css'

export default function AdminEditorPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { user, loading: authLoading, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }
  const [showList, setShowList] = useState(!id)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setShowList(false)
      setIsLoading(false)
    } else {
      setShowList(true)
      if (user) {
        loadBlogs()
      } else {
        setIsLoading(false)
      }
    }
  }, [id, user])

  const loadBlogs = async () => {
    try {
      setIsLoading(true)
      const allBlogs = await getAllBlogs()
      setBlogs(allBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error: any) {
      console.error('Failed to load blogs:', error)
      setBlogs([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(blogId)
        await loadBlogs()
      } catch (error: any) {
        alert('Failed to delete blog: ' + (error?.message || 'Unknown error'))
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (authLoading || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.125rem',
        color: '#718096'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    navigate('/admin/login')
    return null
  }

  if (showList) {
    return (
      <div className="admin-blog-list">
        <div className="admin-blog-list__container">
          <div className="admin-blog-list__header">
            <h1 className="admin-blog-list__title">Blog Management</h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={handleLogout}
                className="admin-blog-list__new-button"
                style={{ background: '#e53e3e' }}
              >
                Logout
              </button>
              <button
                onClick={() => navigate('/admin/editor/new')}
                className="admin-blog-list__new-button"
              >
                + New Blog
              </button>
            </div>
          </div>

          {blogs.length === 0 ? (
            <div className="admin-blog-list__empty">
              <p>No blogs yet. Create your first blog!</p>
              <button
                onClick={() => navigate('/admin/editor/new')}
                className="admin-blog-list__new-button"
              >
                Create Blog
              </button>
            </div>
          ) : (
            <div className="admin-blog-list__grid">
              {blogs.map((blog) => (
                <div key={blog.id} className="admin-blog-card">
                  <div className="admin-blog-card__header">
                    <h3 className="admin-blog-card__title">{blog.title}</h3>
                    <span className={`admin-blog-card__status ${blog.published ? 'published' : 'draft'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="admin-blog-card__date">{formatDate(blog.createdAt)}</p>
                  <div className="admin-blog-card__actions">
                    <button
                      onClick={() => navigate(`/admin/editor/${blog.id}`)}
                      className="admin-blog-card__button admin-blog-card__button--edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="admin-blog-card__button admin-blog-card__button--delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return <BlogEditor />
}
