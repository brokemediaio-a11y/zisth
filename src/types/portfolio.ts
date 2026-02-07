export type PortfolioCategory = 'Hardware' | 'Software'

export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: PortfolioCategory
  featuredImage: string
  content?: string
  technologies?: string[]
  year?: string
}
