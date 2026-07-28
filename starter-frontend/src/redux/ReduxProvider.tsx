"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import { useGetSiteSettingsQuery } from "@/redux/api/siteSettingApi";

function DynamicSiteSettingsInjector() {
     const { data: settings } = useGetSiteSettingsQuery();

     useEffect(() => {
          if (settings?.primaryColor) {
               localStorage.setItem("starter-app-primary-color", settings.primaryColor);
               const root = document.documentElement;
               root.style.setProperty('--primary', settings.primaryColor);
               root.style.setProperty('--ring', settings.primaryColor);
               root.style.setProperty('--color-primary', settings.primaryColor);
               
               // Force browser repaint / style recalculation
               root.classList.add('theme-updating');
               void root.offsetHeight;
               root.classList.remove('theme-updating');
          }
     }, [settings]);

     return null;
}

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

      return (
           <Provider store={storeRef.current}>
                <DynamicSiteSettingsInjector />
                {children}
           </Provider>
      );
}
