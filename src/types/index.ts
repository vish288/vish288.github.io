export interface Tile {
  id: string
  title: string
  description: string
  category: string
  date: string
  imageUrl?: string
  tags: string[]
  link?: string
}

export interface SearchSortProps {
  searchTerm: string
  sortBy: 'name' | 'date' | 'category'
  sortOrder: 'asc' | 'desc'
  onSearchChange: (term: string) => void
  onSortChange: (sortBy: 'name' | 'date' | 'category') => void
  onSortOrderChange: (order: 'asc' | 'desc') => void
}