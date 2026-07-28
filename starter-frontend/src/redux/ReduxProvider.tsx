"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import { baseApi } from "@/redux/api/baseApi";

export function ReduxProvider({ 
     children, 
     preloadedUser 
}: { 
     children: React.ReactNode; 
     preloadedUser?: any;
}) {
     const storeRef = useRef<any>(null);

     if (!storeRef.current) {
          storeRef.current = configureStore({
               reducer: {
                    auth: authReducer,
                    [baseApi.reducerPath]: baseApi.reducer,
               },
               middleware: (getDefaultMiddleware) =>
                    getDefaultMiddleware().concat(baseApi.middleware),
               preloadedState: preloadedUser ? {
                    auth: {
                         user: preloadedUser,
                         isAuthenticated: true,
                         isLoading: false,
                         error: null,
                    }
               } : undefined
          });
     }

     return <Provider store={storeRef.current}>{children}</Provider>;
}
