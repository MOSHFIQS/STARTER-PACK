import { baseApi } from "./baseApi";
import type { AppNotification } from "@/types";
import type { PaginatedResponse } from "@/types/api.types";
import type {
  ListQueryParams
} from "@/types/api.types";
import { buildListParams } from "@/lib/utils";

export const notificationApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getNotifications: builder.query<PaginatedResponse<AppNotification>, ListQueryParams | void>({
               query: (params) => ({
                    url: "/notifications",
                    params: params ? buildListParams(params) : undefined,
               }),
               providesTags: (result) =>
                    result
                         ? [
                                ...result.data.map(({ id }) => ({ type: "Notification" as const, id })),
                                { type: "Notification", id: "LIST" },
                           ]
                         : [{ type: "Notification", id: "LIST" }],
          }),
          getUnreadCount: builder.query<{ count: number }, void>({
               query: () => "/notifications/unread/count",
               providesTags: ["Notification"],
          }),
          getNotificationById: builder.query<AppNotification, string>({
               query: (id) => `/notifications/${id}`,
               providesTags: (result, error, id) => [{ type: "Notification", id }],
          }),
          createNotification: builder.mutation<AppNotification, Partial<AppNotification>>({
               query: (data) => ({
                    url: "/notifications",
                    method: "POST",
                    body: data,
               }),
               invalidatesTags: ["Notification", { type: "Notification", id: "LIST" }],
          }),
          updateNotification: builder.mutation<AppNotification, { id: string; data: Partial<AppNotification> }>({
               query: ({ id, data }) => ({
                    url: `/notifications/${id}`,
                    method: "PATCH",
                    body: data,
               }),
               invalidatesTags: (result, error, { id }) => [
                    { type: "Notification", id },
                    { type: "Notification", id: "LIST" },
                    "Notification",
               ],
          }),
          markNotificationAsRead: builder.mutation<AppNotification, string>({
               query: (id) => ({
                    url: `/notifications/${id}/read`,
                    method: "PATCH",
               }),
               invalidatesTags: (result, error, id) => [
                    { type: "Notification", id },
                    { type: "Notification", id: "LIST" },
                    "Notification",
               ],
          }),
          markAllNotificationsAsRead: builder.mutation<{ message: string }, void>({
               query: () => ({
                    url: "/notifications/read/all",
                    method: "PATCH",
               }),
               invalidatesTags: ["Notification", { type: "Notification", id: "LIST" }],
          }),
          deleteNotification: builder.mutation<{ message: string }, string>({
               query: (id) => ({
                    url: `/notifications/${id}`,
                    method: "DELETE",
               }),
               invalidatesTags: ["Notification", { type: "Notification", id: "LIST" }],
          }),
     }),
});

export const {
     useGetNotificationsQuery,
     useGetUnreadCountQuery,
     useGetNotificationByIdQuery,
     useCreateNotificationMutation,
     useUpdateNotificationMutation,
     useMarkNotificationAsReadMutation,
     useMarkAllNotificationsAsReadMutation,
     useDeleteNotificationMutation,
} = notificationApi;
