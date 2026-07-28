import { baseApi } from "./baseApi";
import type { User, UserRole, UserStatus } from "@/types/user.types";
import type { PaginatedResponse } from "@/types/api.types";
import type {
     ListQueryParams
} from "@/types/api.types";

import { buildListParams } from "@/lib/utils";

export const userApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getUsers: builder.query<PaginatedResponse<User>, ListQueryParams | void>({
               query: (params) => ({
                    url: "/users",
                    params: params ? buildListParams(params) : undefined,
               }),
               providesTags: (result) =>
                    result
                         ? [
                              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
                              { type: "User", id: "LIST" },
                         ]
                         : [{ type: "User", id: "LIST" }],
          }),
          getUserById: builder.query<User, string>({
               query: (id) => `/users/${id}`,
               providesTags: (result, error, id) => [{ type: "User", id }],
          }),
          createUser: builder.mutation<User, Partial<User> & { password: string }>({
               query: (data) => ({
                    url: "/users",
                    method: "POST",
                    body: data,
               }),
               invalidatesTags: [{ type: "User", id: "LIST" }],
          }),
          updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
               query: ({ id, data }) => ({
                    url: `/users/${id}`,
                    method: "PATCH",
                    body: data,
               }),
               invalidatesTags: (result, error, { id }) => [
                    { type: "User", id },
                    { type: "User", id: "LIST" },
               ],
          }),
          deleteUser: builder.mutation<{ message: string }, string>({
               query: (id) => ({
                    url: `/users/${id}`,
                    method: "DELETE",
               }),
               invalidatesTags: [{ type: "User", id: "LIST" }],
          }),
          updateProfile: builder.mutation<User, Partial<User>>({
               query: (data) => ({
                    url: "/users/profile/me",
                    method: "PATCH",
                    body: data,
               }),
               invalidatesTags: [{ type: "User", id: "LIST" }, "User"],
          }),
          updateProfileWithAvatar: builder.mutation<User, FormData>({
               query: (formData) => ({
                    url: "/users/profile/me",
                    method: "PATCH",
                    body: formData,
               }),
               invalidatesTags: [{ type: "User", id: "LIST" }, "User"],
          }),
          updateUserRole: builder.mutation<User, { id: string; role: UserRole }>({
               query: ({ id, role }) => ({
                    url: `/users/${id}/role`,
                    method: "PATCH",
                    params: { role },
               }),
               invalidatesTags: (result, error, { id }) => [
                    { type: "User", id },
                    { type: "User", id: "LIST" },
               ],
          }),
          updateUserStatus: builder.mutation<User, { id: string; status: UserStatus }>({
               query: ({ id, status }) => ({
                    url: `/users/${id}/status`,
                    method: "PATCH",
                    params: { status },
               }),
               invalidatesTags: (result, error, { id }) => [
                    { type: "User", id },
                    { type: "User", id: "LIST" },
               ],
          }),
     }),
});

export const {
     useGetUsersQuery,
     useGetUserByIdQuery,
     useCreateUserMutation,
     useUpdateUserMutation,
     useDeleteUserMutation,
     useUpdateProfileMutation,
     useUpdateProfileWithAvatarMutation,
     useUpdateUserRoleMutation,
     useUpdateUserStatusMutation,
} = userApi;
