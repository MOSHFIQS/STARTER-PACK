import { baseApi } from "./baseApi";
import type { AuditLog } from "@/types";
import type { PaginatedResponse } from "@/types/api.types";
import type {
  ListQueryParams
} from "@/types/api.types";
import { buildListParams } from "@/lib/utils";

export const auditLogApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getAuditLogs: builder.query<PaginatedResponse<AuditLog>, ListQueryParams | void>({
               query: (params) => ({
                    url: "/audit-logs",
                    params: params ? buildListParams(params) : undefined,
               }),
               providesTags: (result) =>
                    result
                         ? [
                                ...result.data.map(({ id }) => ({ type: "AuditLog" as const, id })),
                                { type: "AuditLog", id: "LIST" },
                           ]
                         : [{ type: "AuditLog", id: "LIST" }],
          }),
          getAuditLogById: builder.query<AuditLog, string>({
               query: (id) => `/audit-logs/${id}`,
               providesTags: (result, error, id) => [{ type: "AuditLog", id }],
          }),
     }),
});

export const {
     useGetAuditLogsQuery,
     useGetAuditLogByIdQuery,
} = auditLogApi;
