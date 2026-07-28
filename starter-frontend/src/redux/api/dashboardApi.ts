import { baseApi } from "./baseApi";
import type {
     AdminOverview,
     UserStats,
} from "@/types";
import type { User } from "@/types/user.types";

export const dashboardApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getAdminOverview: builder.query<AdminOverview, void>({
               query: () => "/dashboard/admin/overview",
               providesTags: ["User"],
          }),
          getAdminUsers: builder.query<UserStats, void>({
               query: () => "/dashboard/admin/users",
               providesTags: ["User"],
          }),
          getRecentUsers: builder.query<User[], number | void>({
               query: (limit = 5) => ({
                    url: "/dashboard/admin/recent/users",
                    params: { limit },
               }),
               providesTags: ["User"],
          }),
     }),
});

export const {
     useGetAdminOverviewQuery,
     useGetAdminUsersQuery,
     useGetRecentUsersQuery,
} = dashboardApi;
