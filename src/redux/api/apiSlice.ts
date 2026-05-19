import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig } from "axios";
import api, { ApiErrorResponse } from "@/services/api";

// Custom Axios-based Base Query for RTK Query
const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    ApiErrorResponse
  > =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await api({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      // Map custom interceptor error formats
      const err = axiosError as ApiErrorResponse;
      return {
        error: err,
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User", "Products"],
  endpoints: () => ({}),
});
