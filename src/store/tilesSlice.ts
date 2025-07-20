import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Tile } from '../types'

interface TilesState {
  items: Tile[]
  searchTerm: string
  sortBy: 'name' | 'date' | 'category'
  sortOrder: 'asc' | 'desc'
  loading: boolean
  error: string | null
}

const initialState: TilesState = {
  items: [],
  searchTerm: '',
  sortBy: 'name',
  sortOrder: 'asc',
  loading: false,
  error: null,
}

// Mock data for now - in a real app this would come from an API
const mockTiles: Tile[] = [
  {
    id: '1',
    title: 'React Portfolio',
    description: 'A modern React portfolio website with TypeScript and Material-UI',
    category: 'Web Development',
    date: '2025-01-20',
    imageUrl: '/vis-creates.png',
    tags: ['React', 'TypeScript', 'MUI'],
  },
  {
    id: '2',
    title: 'Move PropTypes Tool',
    description: 'CLI tool for migrating React PropTypes to standalone prop-types package',
    category: 'Tools',
    date: '2025-01-15',
    tags: ['Node.js', 'CLI', 'React'],
  },
  {
    id: '3',
    title: 'Full Stack Projects',
    description: 'Collection of full-stack applications and experiments',
    category: 'Web Development',
    date: '2024-12-01',
    tags: ['JavaScript', 'Node.js', 'Database'],
  },
]

export const loadTiles = createAsyncThunk('tiles/loadTiles', async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockTiles
})

const tilesSlice = createSlice({
  name: 'tiles',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setSortBy: (state, action: PayloadAction<'name' | 'date' | 'category'>) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadTiles.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(loadTiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load tiles'
      })
  },
})

export const { setSearchTerm, setSortBy, setSortOrder, clearError } = tilesSlice.actions
export default tilesSlice.reducer