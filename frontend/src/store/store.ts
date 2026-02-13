import { configureStore } from "@reduxjs/toolkit";
import { olympicsApi } from "./api/olympicsApi";

export const store = configureStore({
  reducer: {
    [olympicsApi.reducerPath]: olympicsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(olympicsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
