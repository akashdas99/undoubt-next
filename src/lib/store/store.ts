import { configureStore } from '@reduxjs/toolkit'
import { questionApi } from './questions/questionApi'

export const makeStore = () => {
  return configureStore({
    reducer: {
        [questionApi.reducerPath]:questionApi.reducer
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(questionApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']