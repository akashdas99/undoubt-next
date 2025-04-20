import { configureStore } from "@reduxjs/toolkit";
import { questionApi } from "./questions/question";
import { userApi } from "./user/user";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [questionApi.reducerPath]: questionApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(questionApi.middleware, userApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
