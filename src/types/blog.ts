export interface Blog {
  id: string
  title: string
  content: string // HTML content from editor
  excerpt?: string
  author: string
  createdAt: string
  updatedAt: string
  published: boolean
  featuredImage?: string
  tags?: string[]
}
