import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { processImagesInContent } from './storage'
import type { Blog } from '../types/blog'

const BLOGS_COLLECTION = 'blogs'

/**
 * Convert Firestore document to Blog type
 */
function docToBlog(docId: string, data: any): Blog {
  return {
    id: docId,
    title: data.title || '',
    content: data.content || '',
    excerpt: data.excerpt || '',
    author: data.author || 'Admin',
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
    published: data.published || false,
    featuredImage: data.featuredImage || undefined,
    tags: data.tags || [],
  }
}

/**
 * Get all blogs from Firestore (admin only)
 */
export async function getAllBlogs(): Promise<Blog[]> {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION)
    const q = query(blogsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const blogs: Blog[] = []
    querySnapshot.forEach((doc) => {
      blogs.push(docToBlog(doc.id, doc.data()))
    })
    
    console.log('Loaded', blogs.length, 'blog(s) from Firestore')
    return blogs
  } catch (error) {
    console.error('Error loading blogs:', error)
    throw new Error('Failed to load blogs: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

/**
 * Get published blogs only (public)
 */
export async function getPublishedBlogs(): Promise<Blog[]> {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION)
    // Fetch all blogs and filter/sort in memory to avoid index requirement
    // This works fine for small to medium numbers of blogs
    const q = query(blogsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const blogs: Blog[] = []
    querySnapshot.forEach((doc) => {
      const blog = docToBlog(doc.id, doc.data())
      // Filter for published blogs only
      if (blog.published) {
        blogs.push(blog)
      }
    })
    
    return blogs
  } catch (error) {
    console.error('Error loading published blogs:', error)
    throw new Error('Failed to load published blogs: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

/**
 * Get a single blog by ID
 */
export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, id)
    const blogSnap = await getDoc(blogRef)
    
    if (!blogSnap.exists()) {
      return null
    }
    
    return docToBlog(blogSnap.id, blogSnap.data())
  } catch (error) {
    console.error('Error loading blog:', error)
    throw new Error('Failed to load blog: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

/**
 * Save a blog (create or update)
 */
export async function saveBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Blog> {
  try {
    const now = Timestamp.now()
    
    // Process images in content: compress large base64 images to fit Firestore limits
    let processedContent = blog.content
    try {
      processedContent = await processImagesInContent(blog.content)
      
      // Check total content size
      const contentSizeKB = new Blob([processedContent]).size / 1024
      if (contentSizeKB > 900) {
        console.warn(`Blog content is large (${Math.round(contentSizeKB)}KB). Consider reducing images or text.`)
      }
    } catch (error) {
      console.warn('Failed to process images in content:', error)
      // Continue with original content if image processing fails
    }
    
    const blogData = {
      title: blog.title,
      content: processedContent,
      excerpt: blog.excerpt || generateExcerpt(processedContent),
      author: blog.author || 'Admin',
      published: blog.published || false,
      featuredImage: blog.featuredImage || null,
      tags: blog.tags || [],
      updatedAt: now,
    }

    if (blog.id) {
      // Update existing blog
      const blogRef = doc(db, BLOGS_COLLECTION, blog.id)
      const existingDoc = await getDoc(blogRef)
      
      if (!existingDoc.exists()) {
        throw new Error('Blog not found')
      }

      // Preserve createdAt
      const existingData = existingDoc.data()
      await updateDoc(blogRef, {
        ...blogData,
        createdAt: existingData.createdAt || now,
      })

      const updatedDoc = await getDoc(blogRef)
      const updatedBlog = docToBlog(updatedDoc.id, updatedDoc.data())
      console.log('Blog updated successfully:', blog.id)
      return updatedBlog
    } else {
      // Create new blog
      const blogsRef = collection(db, BLOGS_COLLECTION)
      const docRef = await addDoc(blogsRef, {
        ...blogData,
        createdAt: now,
      })

      const newDoc = await getDoc(docRef)
      const newBlog = docToBlog(newDoc.id, newDoc.data())
      console.log('Blog created successfully:', newBlog.id)
      return newBlog
    }
  } catch (error) {
    console.error('Failed to save blog:', error)
    throw new Error('Failed to save blog: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

/**
 * Delete a blog
 */
export async function deleteBlog(id: string): Promise<boolean> {
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, id)
    const blogSnap = await getDoc(blogRef)
    
    if (!blogSnap.exists()) {
      return false // Blog not found
    }

    await deleteDoc(blogRef)
    console.log('Blog deleted:', id)
    return true
  } catch (error) {
    console.error('Failed to delete blog:', error)
    throw new Error('Failed to delete blog: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
