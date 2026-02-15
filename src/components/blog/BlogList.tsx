import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedBlogs } from '../../lib/blogStorage'
import type { Blog } from '../../types/blog'
import TextType from '../ui/TextType'
import './BlogList.css'

const BLOGS_PER_PAGE = 4 // 1 featured + 3 grid cards

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

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

  // Calculate pagination
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE)
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE
  const endIndex = startIndex + BLOGS_PER_PAGE
  const currentBlogs = blogs.slice(startIndex, endIndex)
  const featuredBlog = currentBlogs[0]
  const gridBlogs = currentBlogs.slice(1)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
          <>
            {/* Featured Blog - Full Display */}
            {featuredBlog && (
              <article className="blog-featured">
                {featuredBlog.featuredImage && (
                  <div className="blog-featured__image-wrapper">
                    <img
                      src={featuredBlog.featuredImage}
                      alt={featuredBlog.title}
                      className="blog-featured__image"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="blog-featured__content">
                  <div className="blog-featured__meta">
                    <time className="blog-featured__date">{formatDate(featuredBlog.createdAt)}</time>
                    {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                      <div className="blog-featured__tags">
                        {featuredBlog.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="blog-featured__tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h2 className="blog-featured__title">
                    <Link to={`/blogs/${featuredBlog.id}`}>{featuredBlog.title}</Link>
                  </h2>
                  {featuredBlog.excerpt && (
                    <p className="blog-featured__excerpt">{featuredBlog.excerpt}</p>
                  )}
                  {featuredBlog.content && (
                    <p className="blog-featured__preview">
                      {featuredBlog.content.replace(/<[^>]*>/g, '').substring(0, 500)}
                      {featuredBlog.content.replace(/<[^>]*>/g, '').length > 500 ? '...' : ''}
                    </p>
                  )}
                  <Link to={`/blogs/${featuredBlog.id}`} className="blog-featured__link">
                    Read more
                  </Link>
                </div>
              </article>
            )}

            {/* Grid of 3 Blogs */}
            {gridBlogs.length > 0 && (
              <div className="blog-list__grid">
                {gridBlogs.map((blog) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="blog-list__pagination">
                <button
                  className="blog-list__pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  ← Previous
                </button>
                <div className="blog-list__pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`blog-list__pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Go to page ${page}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="blog-list__pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
