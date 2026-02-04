import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminAuth from '../components/blog/AdminAuth'
import BlogEditor from '../components/blog/BlogEditor'
import { deleteBlog, getAllBlogs } from '../lib/blogStorage'
import type { Blog } from '../types/blog'
import '../components/blog/AdminBlogList.css'

export default function AdminEditorPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showList, setShowList] = useState(!id)
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadBlogs()
    }
  }, [])

  useEffect(() => {
    if (id) {
      setShowList(false)
    } else {
      setShowList(true)
      loadBlogs()
    }
  }, [id])

  const loadBlogs = () => {
    const allBlogs = getAllBlogs()
    setBlogs(allBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
    loadBlogs()
  }

  const handleDelete = (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(blogId)
      loadBlogs()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />
  }

  if (showList) {
    return (
      <div className="admin-blog-list">
        <div className="admin-blog-list__container">
          <div className="admin-blog-list__header">
            <h1 className="admin-blog-list__title">Blog Management</h1>
            <button
              onClick={() => navigate('/adminblogs/editor/new')}
              className="admin-blog-list__new-button"
            >
              + New Blog
            </button>
          </div>

          {blogs.length === 0 ? (
            <div className="admin-blog-list__empty">
              <p>No blogs yet. Create your first blog!</p>
              <button
                onClick={() => navigate('/adminblogs/editor/new')}
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
                      onClick={() => navigate(`/adminblogs/editor/${blog.id}`)}
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
