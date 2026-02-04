import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBlogById } from '../../lib/blogStorage'
import type { Blog } from '../../types/blog'
import './BlogDetail.css'

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      navigate('/blogs')
      return
    }

    const loadBlog = () => {
      setIsLoading(true)
      const foundBlog = getBlogById(id)
      if (!foundBlog || !foundBlog.published) {
        navigate('/blogs')
        return
      }
      setBlog(foundBlog)
      setIsLoading(false)
    }

    loadBlog()
    // Refresh blog every 2 seconds
    const interval = setInterval(loadBlog, 2000)
    return () => clearInterval(interval)
  }, [id, navigate])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="blog-detail">
        <div className="blog-detail__container">
          <div className="blog-detail__loading">Loading blog post...</div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return null
  }

  return (
    <div className="blog-detail">
      <div className="blog-detail__container">
        <Link to="/blogs" className="blog-detail__back">
          ← Back to Blogs
        </Link>

        <article className="blog-detail__article">
          <header className="blog-detail__header">
            <div className="blog-detail__meta">
              <time className="blog-detail__date">{formatDate(blog.createdAt)}</time>
              {blog.tags && blog.tags.length > 0 && (
                <div className="blog-detail__tags">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="blog-detail__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h1 className="blog-detail__title">{blog.title}</h1>
            {blog.excerpt && (
              <p className="blog-detail__excerpt">{blog.excerpt}</p>
            )}
          </header>

          {blog.featuredImage && (
            <div className="blog-detail__image-wrapper">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="blog-detail__image"
              />
            </div>
          )}

          <div
            className="blog-detail__content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    </div>
  )
}
