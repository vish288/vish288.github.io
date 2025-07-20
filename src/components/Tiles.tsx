import { useEffect, useMemo } from 'react'
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { loadTiles } from '../store/tilesSlice'
import type { Tile } from '../types'

const TileCard = ({ tile }: { tile: Tile }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {tile.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={tile.imageUrl}
          alt={tile.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {tile.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {tile.description}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {tile.category} • {new Date(tile.date).toLocaleDateString()}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {tile.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

const Tiles = () => {
  const dispatch = useAppDispatch()
  const { items, searchTerm, sortBy, sortOrder, loading, error } = useAppSelector(
    (state) => state.tiles
  )

  useEffect(() => {
    dispatch(loadTiles())
  }, [dispatch])

  const filteredAndSortedTiles = useMemo(() => {
    let filtered = items

    // Apply search filter
    if (searchTerm) {
      filtered = items.filter(
        (tile) =>
          tile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tile.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title)
          break
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [items, searchTerm, sortBy, sortOrder])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  if (filteredAndSortedTiles.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {searchTerm ? 'No projects found matching your search.' : 'No projects available.'}
      </Alert>
    )
  }

  return (
    <Grid container spacing={3}>
      {filteredAndSortedTiles.map((tile) => (
        <Grid item xs={12} sm={6} md={4} key={tile.id}>
          <TileCard tile={tile} />
        </Grid>
      ))}
    </Grid>
  )
}

export default Tiles