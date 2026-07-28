import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "@/redux/slices/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const rawBaseQuery = fetchBaseQuery({
     baseUrl: API_BASE,
     credentials: "include",
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
     args,
     api,
     extraOptions
) => {
     let result = await rawBaseQuery(args, api, extraOptions);

     if (result.error && result.error.status === 401) {
          api.dispatch(clearAuth());
     }

     // If the API returned a wrapped response (e.g. { success: true, data: ... }),
     // let's unwrap it at the base query level if possible, OR let each endpoint unwrap it.
     // In apiServices/apiClient, we do: return (json as any)?.data as T;
     // Let's unwrap the success/data wrapper here so endpoints return the actual data entity directly!
     // Wait, if it's successful, result.data is { success: boolean, data: T, message?: string }.
     // We can return the unwrapped data, but we must make sure typescript type matches.
     // Let's do that! That's incredibly elegant and aligns with how the existing apiServices work.
     if (result.data && typeof result.data === "object" && "data" in result.data) {
          return { data: (result.data as any).data };
     }

     // Let's also extract friendly validation messages from errors.
     if (result.error) {
          const errorData = result.error.data as any;
          let errorMessage = errorData?.message || "An error occurred";
          if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
               const details = errorData.errors
                    .map((e: any) => e.message)
                    .filter(Boolean)
                    .join("; ");
               if (details) {
                    errorMessage = details;
               }
          }
          // Set a simplified error message field so components can easily grab it
          (result.error as any).message = errorMessage;
     }

     return result;
};

export const baseApi = createApi({
     reducerPath: "api",
     baseQuery,
     keepUnusedDataFor: 300, // Cache data for 5 minutes — serves repeated route visits from memory
     tagTypes: [
          "User",
          "Notification",
          "AuditLog",
          "SiteSetting",
     ],
     endpoints: () => ({}),
});
