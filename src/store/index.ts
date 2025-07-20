import { configureStore } from '@reduxjs/toolkit'
import tilesSlice from './tilesSlice'

export const store = configureStore({
  reducer: {
    tiles: tilesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch