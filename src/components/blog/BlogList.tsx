import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedBlogs } from '../../lib/blogStorage'
import type { Blog } from '../../types/blog'
import './BlogList.css'

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = () => {
      setIsLoading(true)
      const publishedBlogs = getPublishedBlogs()
      setBlogs(publishedBlogs)
      setIsLoading(false)
    }

    loadBlogs()
    // Refresh blogs every 2 seconds to catch new posts
    const interval = setInterval(loadBlogs, 2000)
    return () => clearInterval(interval)
  }, [])

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
      <div className="blog-list">
        <div className="blog-list__container">
          <div className="blog-list__loading">Loading blogs...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-list">
      <div className="blog-list__container">
        <header className="blog-list__header">
          <h1 className="blog-list__title">Blog</h1>
          <p className="blog-list__subtitle">
            Insights, research, and updates from our team
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="blog-list__empty">
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="blog-list__grid">
            {blogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                {blog.featuredImage && (
                  <div className="blog-card__image-wrapper">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="blog-card__image"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    <time className="blog-card__date">{formatDate(blog.createdAt)}</time>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="blog-card__tags">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="blog-card__tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h2 className="blog-card__title">
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </h2>
                  {blog.excerpt && (
                    <p className="blog-card__excerpt">{blog.excerpt}</p>
                  )}
                  <Link to={`/blogs/${blog.id}`} className="blog-card__link">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
