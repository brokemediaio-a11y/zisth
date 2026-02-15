import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPublishedBlogs } from '../../lib/blogStorage'
import type { Blog } from '../../types/blog'
import TextType from '../ui/TextType'
import './BlogList.css'

const BLOGS_PER_PAGE = 6 // Number of blogs to show in grid per page
const LATEST_BLOGS_COUNT = 4 // Number of latest blogs to show in carousel

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [shareSuccess, setShareSuccess] = useState<string | null>(null)

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

  // Get latest blogs for carousel (first LATEST_BLOGS_COUNT blogs)
  const latestBlogs = blogs.slice(0, LATEST_BLOGS_COUNT)

  const goToNextBlog = () => {
    setCarouselIndex((prev) => (prev + 1) % latestBlogs.length)
  }

  const goToPreviousBlog = () => {
    setCarouselIndex((prev) => (prev - 1 + latestBlogs.length) % latestBlogs.length)
  }

  const goToBlog = (index: number) => {
    setCarouselIndex(index)
  }

  // Calculate pagination for grid blogs (show all blogs including carousel ones)
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE)
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE
  const endIndex = startIndex + BLOGS_PER_PAGE
  const currentBlogs = blogs.slice(startIndex, endIndex)
  const gridBlogs = currentBlogs

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleShare = async (blogId: string, blogTitle: string, blogExcerpt?: string) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`
    const shareData = {
      title: blogTitle,
      text: blogExcerpt || '',
      url: blogUrl,
    }

    try {
      // Try Web Share API first (works on mobile and some desktop browsers)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        setShareSuccess(blogId)
        setTimeout(() => setShareSuccess(null), 2000)
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(blogUrl)
        setShareSuccess(blogId)
        setTimeout(() => setShareSuccess(null), 2000)
      }
    } catch (error: any) {
      // If user cancels share, don't show error
      if (error.name !== 'AbortError') {
        // Fallback to copy to clipboard if share fails
        try {
          await navigator.clipboard.writeText(blogUrl)
          setShareSuccess(blogId)
          setTimeout(() => setShareSuccess(null), 2000)
        } catch (clipboardError) {
          console.error('Failed to copy link:', clipboardError)
        }
      }
    }
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
            {/* Latest Blogs Carousel */}
            {latestBlogs.length > 0 && (
              <div className="blog-featured-carousel">
                <div className="blog-featured-carousel__wrapper">
                  <button
                    type="button"
                    className="blog-featured-carousel__nav-btn blog-featured-carousel__nav-btn--prev"
                    onClick={goToPreviousBlog}
                    aria-label="Previous blog"
                    disabled={latestBlogs.length <= 1}
                  >
                    <ChevronLeft />
                  </button>

                  <div className="blog-featured-carousel__container">
                    <AnimatePresence mode="wait">
                      {latestBlogs[carouselIndex] && (
                        <motion.article
                          key={latestBlogs[carouselIndex].id}
                          className="blog-featured"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {latestBlogs[carouselIndex].featuredImage && (
                  <div className="blog-featured__image-wrapper">
                    <img
                                src={latestBlogs[carouselIndex].featuredImage}
                                alt={latestBlogs[carouselIndex].title}
                      className="blog-featured__image"
                      loading="lazy"
                    />
                  </div>
                )}
                          <div className="blog-featured__content">
                            <h2 className="blog-featured-carousel__title">Latest blogs</h2>
                            <div className="blog-featured__meta">
                              <time className="blog-featured__date">
                                {formatDate(latestBlogs[carouselIndex].createdAt)}
                              </time>
                              {latestBlogs[carouselIndex].tags && latestBlogs[carouselIndex].tags.length > 0 && (
                                <div className="blog-featured__tags">
                                  {latestBlogs[carouselIndex].tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="blog-featured__tag">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <h2 className="blog-featured__title">
                              <Link to={`/blogs/${latestBlogs[carouselIndex].id}`}>
                                {latestBlogs[carouselIndex].title}
                              </Link>
                            </h2>
                            {latestBlogs[carouselIndex].excerpt && (
                              <p className="blog-featured__excerpt">
                                {latestBlogs[carouselIndex].excerpt}
                              </p>
                            )}
                            <div className="blog-featured__footer">
                              <Link
                                to={`/blogs/${latestBlogs[carouselIndex].id}`}
                                className="blog-featured__link"
                              >
                                Read more
                              </Link>
                              <button
                                className="blog-featured__share-button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleShare(
                                    latestBlogs[carouselIndex].id,
                                    latestBlogs[carouselIndex].title,
                                    latestBlogs[carouselIndex].excerpt
                                  )
                                }}
                                aria-label="Share blog post"
                                title="Share this blog post"
                              >
                                <svg
                                  className="blog-featured__share-icon"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                                    fill="currentColor"
                                  />
                                </svg>
                                {shareSuccess === latestBlogs[carouselIndex].id && (
                                  <span className="blog-featured__share-success">Link copied!</span>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    className="blog-featured-carousel__nav-btn blog-featured-carousel__nav-btn--next"
                    onClick={goToNextBlog}
                    aria-label="Next blog"
                    disabled={latestBlogs.length <= 1}
                  >
                    <ChevronRight />
                  </button>
                </div>

                {latestBlogs.length > 1 && (
                  <div className="blog-featured-carousel__indicators">
                    {latestBlogs.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`blog-featured-carousel__indicator ${
                          index === carouselIndex ? 'blog-featured-carousel__indicator--active' : ''
                        }`}
                        onClick={() => goToBlog(index)}
                        aria-label={`Go to blog ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
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
                      <div className="blog-card__footer">
                        <Link to={`/blogs/${blog.id}`} className="blog-card__link">
                          Read more →
                        </Link>
                        <button
                          className="blog-card__share-button"
                          onClick={(e) => {
                            e.preventDefault()
                            handleShare(blog.id, blog.title, blog.excerpt)
                          }}
                          aria-label="Share blog post"
                          title="Share this blog post"
                        >
                          <svg
                            className="blog-card__share-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                              fill="currentColor"
                            />
                          </svg>
                          {shareSuccess === blog.id && (
                            <span className="blog-card__share-success">Link copied!</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="blog-list__pagination">
                {currentPage > 1 && (
                  <button
                    className="blog-list__pagination-button blog-list__pagination-button--prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-label="Previous page"
                  >
                    ← Previous
                  </button>
                )}
                {currentPage < totalPages && (
                  <button
                    className="blog-list__pagination-button blog-list__pagination-button--next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
