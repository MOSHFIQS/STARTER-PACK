/**
 * Standard API Response Format
 * Every API returns this consistent structure.
 */

export interface PaginationMeta {
     page: number;
     limit: number;
     total: number;
     totalPages: number;
}

export interface ApiResponse<T = any> {
     success: boolean;
     message: string;
     data: T;
     meta?: PaginationMeta;
}

export interface ApiErrorResponse {
     success: false;
     message: string;
     errors: Array<Record<string, any>>;
}

export class ResponseBuilder {
     static success<T>(data: T, message = 'Operation successful'): ApiResponse<T> {
          return {
               success: true,
               message,
               data,
          };
     }

     static paginated<T>(
          data: T,
          meta: PaginationMeta,
          message = 'Operation successful',
     ): ApiResponse<T> {
          return {
               success: true,
               message,
               data,
               meta,
          };
     }

     static error(message: string, errors: Array<Record<string, any>> = []): ApiErrorResponse {
          return {
               success: false,
               message,
               errors,
          };
     }
}

export function buildPaginationMeta(
     total: number,
     page: number,
     limit: number,
): PaginationMeta {
     return {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 0,
     };
}
