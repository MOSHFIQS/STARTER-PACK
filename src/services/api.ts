import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { mockDb } from "@/utils/mockDb";
import { BRAND_CONFIG } from "@/config/brand";

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Create custom axios instance
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000, // 8 seconds timeout
});

// Request Interceptor: Inject token automatically and intercept for offline mock
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      try {
        const persistedAuth = localStorage.getItem("persist:auth");
        if (persistedAuth) {
          const authData = JSON.parse(persistedAuth);
          const token = JSON.parse(authData.token);
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (err) {
        console.error("Error reading token in Axios interceptor:", err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: standard errors & dynamic offline mock fallbacks
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config;
    
    // Check if network error (offline or server unavailable)
    const isNetworkError = !error.response || error.code === "ERR_NETWORK" || error.response.status === 404 || error.response.status >= 500;
    
    if (isNetworkError && originalRequest && typeof window !== "undefined") {
      console.warn("⚠️ Remote API unavailable. Falling back to local mock database...");
      
      const { url, method, data, params } = originalRequest;
      
      try {
        // Intercept Auth Login Route
        if (url?.endsWith("/admin/login") && method === "post") {
          const payload = typeof data === "string" ? JSON.parse(data) : data;
          const mockRes = mockDb.mockLogin(payload.email || BRAND_CONFIG.adminDefaultEmail);
          return { data: mockRes, status: 200, statusText: "OK", headers: {}, config: originalRequest };
        }
      } catch (mockErr: unknown) {
        const message = mockErr instanceof Error ? mockErr.message : "Mock Database Error";
        return Promise.reject({
          message,
          statusCode: 400
        });
      }
    }

    // Default error mapping
    const errorResponse: ApiErrorResponse = {
      message: "An unexpected error occurred. Please try again.",
    };

    if (error.response) {
      errorResponse.statusCode = error.response.status;
      errorResponse.message = error.response.data?.message || error.message;
      errorResponse.errors = error.response.data?.errors;

      if (error.response.status === 401) {
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/signin")) {
          console.warn("Unauthorized! Clearing session...");
          localStorage.removeItem("persist:auth");
          window.location.href = "/signin";
        }
      }
    } else {
      errorResponse.message = error.message || "Network Timeout. Please check server state.";
    }

    return Promise.reject(errorResponse);
  }
);

export default api;
