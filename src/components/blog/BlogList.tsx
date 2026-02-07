import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedBlogs } from '../../lib/blogStorage'
import type { Blog } from '../../types/blog'
import TextType from '../ui/TextType'
import './BlogList.css'

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true)
        const publishedBlogs = await getPublishedBlogs()
        setBlogs(publishedBlogs)
      } catch (error: any) {
        console.error('Failed to load blogs:', error)
        setBlogs([])
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogs()
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
          <h1 className="blog-list__title">
            <TextType
              text={["Blogs"]}
              typingSpeed={110}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </h1>
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
