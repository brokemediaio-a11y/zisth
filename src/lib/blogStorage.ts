import type { Blog } from '../types/blog'

const STORAGE_KEY = 'zisth_blogs'

/**
 * Get all blogs from localStorage
 */
export function getAllBlogs(): Blog[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      console.log('No blogs found in localStorage')
      return []
    }
    const blogs = JSON.parse(stored)
    console.log('Loaded', blogs.length, 'blog(s) from localStorage')
    return blogs
  } catch (error) {
    console.error('Error loading blogs:', error)
    return []
  }
}

/**
 * Get published blogs only
 */
export function getPublishedBlogs(): Blog[] {
  return getAllBlogs()
    .filter(blog => blog.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * Get a single blog by ID
 */
export function getBlogById(id: string): Blog | null {
  const blogs = getAllBlogs()
  return blogs.find(blog => blog.id === id) || null
}

/**
 * Save a blog (create or update)
 */
export function saveBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Blog {
  const blogs = getAllBlogs()
  const now = new Date().toISOString()
  
  if (blog.id) {
    // Update existing blog
    const index = blogs.findIndex(b => b.id === blog.id)
    if (index !== -1) {
      blogs[index] = {
        ...blogs[index],
        ...blog,
        updatedAt: now,
      }
      try {
        const serialized = JSON.stringify(blogs)
        // Check size before saving (localStorage limit is typically 5-10MB)
        if (serialized.length > 4 * 1024 * 1024) { // 4MB warning threshold
          console.warn('Blog data is large (' + Math.round(serialized.length / 1024) + 'KB). Consider using smaller images.')
        }
        localStorage.setItem(STORAGE_KEY, serialized)
        console.log('Blog saved successfully:', blog.id)
      } catch (error: any) {
        console.error('Failed to save blog:', error)
        if (error.name === 'QuotaExceededError' || error.code === 22) {
          throw new Error('Storage quota exceeded. Please remove some blogs or use smaller images.')
        }
        throw new Error('Failed to save blog: ' + (error.message || 'Unknown error'))
      }
      return blogs[index]
    }
  }
  
  // Create new blog
  const newBlog: Blog = {
    id: blog.id || `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    ...blog,
  }
  
  blogs.push(newBlog)
  try {
    const serialized = JSON.stringify(blogs)
    // Check size before saving
    if (serialized.length > 4 * 1024 * 1024) { // 4MB warning threshold
      console.warn('Blog data is large (' + Math.round(serialized.length / 1024) + 'KB). Consider using smaller images.')
    }
    localStorage.setItem(STORAGE_KEY, serialized)
    console.log('Blog saved successfully:', newBlog.id)
  } catch (error: any) {
    console.error('Failed to save blog:', error)
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      throw new Error('Storage quota exceeded. Please remove some blogs or use smaller images.')
    }
    throw new Error('Failed to save blog: ' + (error.message || 'Unknown error'))
  }
  return newBlog
}

/**
 * Delete a blog
 */
export function deleteBlog(id: string): boolean {
  const blogs = getAllBlogs()
  const filtered = blogs.filter(blog => blog.id !== id)
  
  if (filtered.length === blogs.length) {
    return false // Blog not found
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    console.log('Blog deleted:', id)
    return true
  } catch (error: any) {
    console.error('Failed to delete blog:', error)
    throw new Error('Failed to delete blog: ' + (error.message || 'Unknown error'))
  }
}

/**
 * Generate excerpt from HTML content
 */
export function generateExcerpt(html: string, maxLength: number = 150): string {
  // Remove HTML tags and get plain text
  const text = html.replace(/<[^>]*>/g, '').trim()
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
