import { baseApi } from "./baseApi";
import type { LoginResponse, RegisterResponse, User } from "@/types/user.types";

export const authApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          login: builder.mutation<LoginResponse, { email: string; password: string }>({
               query: (credentials) => ({
                    url: "/auth/login",
                    method: "POST",
                    body: credentials,
               }),
               invalidatesTags: ["User"],
          }),
          register: builder.mutation<
               RegisterResponse,
               {
                    email: string;
                    password: string;
                    firstName: string;
                    lastName: string;
                    phone?: string;
               }
          >({
               query: (data) => ({
                    url: "/auth/register",
                    method: "POST",
                    body: data,
               }),
          }),
          // NOTE: logout intentionally does NOT invalidate the "User" tag.
          // Invalidating it triggers a /auth/me refetch whose stale cached
          // result can restore the user client-side before the 401 settles.
          // useAuth.logout() calls api.util.resetApiState() after the backend
          // clears the token, so the next me fetch returns 401 (not stale user).
          logout: builder.mutation<{ message: string }, void>({
               query: () => ({
                    url: "/auth/logout",
                    method: "POST",
               }),
          }),
          me: builder.query<User, void>({
               query: () => "/auth/me",
               providesTags: ["User"],
          }),
          changePassword: builder.mutation<{ message: string }, { currentPassword: string; newPassword: string }>({
               query: (data) => ({
                    url: "/users/profile/change-password",
                    method: "PATCH",
                    body: data,
               }),
          }),
          forgotPassword: builder.mutation<{ message: string }, { email: string }>({
               query: (data) => ({
                    url: "/auth/forgot-password",
                    method: "POST",
                    body: data,
               }),
          }),
          resetPassword: builder.mutation<
               { message: string },
               { email: string; otp: string; newPassword: string }
          >({
               query: (data) => ({
                    url: "/auth/reset-password",
                    method: "POST",
                    body: data,
               }),
          }),
     }),
});

export const {
     useLoginMutation,
     useRegisterMutation,
     useLogoutMutation,
     useMeQuery,
     useLazyMeQuery,
     useChangePasswordMutation,
     useForgotPasswordMutation,
     useResetPasswordMutation,
} = authApi;
