export interface ApiResponse<T> {
     success: boolean;
     data: T;
     timestamp: string;
}

export interface PaginatedResponse<T> {
     data: T[];
     meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
     };
}

export interface ApiError {
     success: boolean;
     message: string;
     statusCode: number;
     timestamp: string;
     path?: string;
     error?: string;
}

export interface ListQueryParams {
     page?: number;
     limit?: number;
     search?: string;
     sortBy?: string;
     sortOrder?: "asc" | "desc";
     [key: string]: any;
}

export function normalizePaginatedResponse(res: any): PaginatedResponse<any> {
     if (res && Array.isArray(res.data)) {
          return res;
     }
     return {
          data: res || [],
          meta: {
               total: (res && res.length) || 0,
               page: 1,
               limit: (res && res.length) || 10,
               totalPages: 1,
               hasNextPage: false,
               hasPrevPage: false,
          },
     };
}
