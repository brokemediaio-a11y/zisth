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
  const [shareSuccess, setShareSuccess] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate('/blogs')
      return
    }

    const loadBlog = async () => {
      try {
        setIsLoading(true)
        const foundBlog = await getBlogById(id)
        if (!foundBlog || !foundBlog.published) {
          navigate('/blogs')
          return
        }
        setBlog(foundBlog)
      } catch (error: any) {
        console.error('Failed to load blog:', error)
        navigate('/blogs')
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [id, navigate])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleShare = async () => {
    const blogUrl = `${window.location.origin}/blogs/${id}`
    const shareData = {
      title: blog?.title || 'Blog Post',
      text: blog?.excerpt || '',
      url: blogUrl,
    }

    try {
      // Try Web Share API first (works on mobile and some desktop browsers)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(blogUrl)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      }
    } catch (error: any) {
      // If user cancels share, don't show error
      if (error.name !== 'AbortError') {
        // Fallback to copy to clipboard if share fails
        try {
          await navigator.clipboard.writeText(blogUrl)
          setShareSuccess(true)
          setTimeout(() => setShareSuccess(false), 2000)
        } catch (clipboardError) {
          console.error('Failed to copy link:', clipboardError)
        }
      }
    }
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
              <div className="blog-detail__meta-right">
                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-detail__tags">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="blog-detail__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  className="blog-detail__share-button"
                  onClick={handleShare}
                  aria-label="Share blog post"
                  title="Share this blog post"
                >
                  <svg
                    className="blog-detail__share-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                      fill="currentColor"
                    />
                  </svg>
                  {shareSuccess && (
                    <span className="blog-detail__share-success">Link copied!</span>
                  )}
                </button>
              </div>
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
