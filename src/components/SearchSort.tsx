import { Box, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { SwapVert as SwapVertIcon } from '@mui/icons-material'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { setSearchTerm, setSortBy, setSortOrder } from '../store/tilesSlice'

const SearchSort = () => {
  const dispatch = useAppDispatch()
  const { searchTerm, sortBy, sortOrder } = useAppSelector((state) => state.tiles)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value))
  }

  const handleSortByChange = (event: SelectChangeEvent<'name' | 'date' | 'category'>) => {
    dispatch(setSortBy(event.target.value as 'name' | 'date' | 'category'))
  }

  const handleSortOrderToggle = () => {
    dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
      }}
    >
      <TextField
        label="Search projects..."
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ flexGrow: 1, minWidth: 200 }}
        size="medium"
      />

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortBy}
          label="Sort by"
          onChange={handleSortByChange}
          size="medium"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="category">Category</MenuItem>
        </Select>
      </FormControl>

      <IconButton
        onClick={handleSortOrderToggle}
        title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
        color="primary"
      >
        <SwapVertIcon
          sx={{
            transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease',
          }}
        />
      </IconButton>
    </Box>
  )
}

export default SearchSort