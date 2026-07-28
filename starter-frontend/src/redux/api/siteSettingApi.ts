import { baseApi } from "./baseApi";
import type { SiteSetting, SiteSettingInput } from "@/types";

export const siteSettingApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getSiteSettings: builder.query<SiteSetting, void>({
               query: () => "/settings/site",
               providesTags: ["SiteSetting"],
          }),
          updateSiteSettings: builder.mutation<SiteSetting, SiteSettingInput>({
               query: (data) => ({
                    url: "/settings/site",
                    method: "PATCH",
                    body: data,
               }),
               invalidatesTags: ["SiteSetting"],
          }),
     }),
});

export const {
     useGetSiteSettingsQuery,
     useUpdateSiteSettingsMutation,
} = siteSettingApi;
