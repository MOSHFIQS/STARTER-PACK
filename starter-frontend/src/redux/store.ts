import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import { cache } from "react";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

const createNewStore = () => configureStore({
     reducer: {
          auth: authReducer,
          [baseApi.reducerPath]: baseApi.reducer,
     },
     middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(baseApi.middleware),
});

// A temporary store instance used only for type inference
const tempStore = createNewStore();
export type RootState = ReturnType<typeof tempStore.getState>;
export type AppDispatch = typeof tempStore.dispatch;

// Browser/client-side singleton store
let clientStore: typeof tempStore | null = null;

// Server-side per-request store using React's cache() function
const getRequestStore = cache(() => {
     return createNewStore();
});

const getStore = (): typeof tempStore => {
     if (typeof window !== "undefined") {
          if (!clientStore) {
               clientStore = createNewStore();
          }
          return clientStore;
     }
     return getRequestStore();
};

// Exported proxy to dynamically route store calls to the appropriate instance.
// On the server, this resolves to a request-scoped store. On the client, a singleton.
export const store = new Proxy({} as typeof tempStore, {
     get(target, prop, receiver) {
          const activeStore = getStore();
          const value = Reflect.get(activeStore, prop, receiver);
          if (typeof value === "function") {
               return value.bind(activeStore);
          }
          return value;
     }
});

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
