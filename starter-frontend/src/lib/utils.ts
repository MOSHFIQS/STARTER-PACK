import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined, currency = "BDT"): string {
     if (amount === null || amount === undefined) return "—";
     const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
     });
     return formatter.format(amount);
}

export function formatNumber(value: number | null | undefined): string {
     if (value === null || value === undefined) return "—";
     return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(date: string | Date | null | undefined, includeTime = false): string {
     if (!date) return "—";
     const d = typeof date === "string" ? new Date(date) : date;
     if (isNaN(d.getTime())) return "—";
     const options: Intl.DateTimeFormatOptions = includeTime
          ? { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
          : { year: "numeric", month: "short", day: "numeric" };
     return d.toLocaleDateString("en-US", options);
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
     if (!date) return "—";
     const d = typeof date === "string" ? new Date(date) : date;
     if (isNaN(d.getTime())) return "—";
     const now = new Date();
     const diffMs = now.getTime() - d.getTime();
     const diffSec = Math.floor(diffMs / 1000);
     const diffMin = Math.floor(diffSec / 60);
     const diffHour = Math.floor(diffMin / 60);
     const diffDay = Math.floor(diffHour / 24);

     if (diffSec < 60) return "just now";
     if (diffMin < 60) return `${diffMin}m ago`;
     if (diffHour < 24) return `${diffHour}h ago`;
     if (diffDay < 7) return `${diffDay}d ago`;
     return formatDate(d);
}

export function truncate(text: string, length: number): string {
     if (text.length <= length) return text;
     return text.slice(0, length).trimEnd() + "…";
}

export function getInitials(name: string): string {
     if (!name) return "?";
     const parts = name.trim().split(/\s+/);
     if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
     return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function slugify(text: string): string {
     return text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
     let timeoutId: ReturnType<typeof setTimeout>;
     return (...args: Parameters<T>) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => fn(...args), delay);
     };
}

export function buildListParams(params?: {
     page?: number;
     limit?: number;
     search?: string;
     sortBy?: string;
     sortOrder?: "asc" | "desc";
     [key: string]: string | number | boolean | undefined;
}): Record<string, string | number | boolean | undefined> {
     if (!params) return {};
     const { page, limit, search, sortBy, sortOrder, ...rest } = params;
     return {
          page,
          limit,
          search,
          sortBy,
          sortOrder,
          ...rest,
     };
}

/**
 * Pull a single, human-readable message out of any thrown value.
 *
 * Handles (in priority order):
 *  - native `Error` instances
 *  - RTK Query / fetchBaseQuery error objects (`{ status, data, message }`)
 *    — `baseApi` already flattens backend validation details into `.message`
 *  - raw backend response bodies (`{ message, errors: [{ message }] }`)
 *  - plain strings
 *
 * This is necessary because RTK Query's `.unwrap()` rejects with a plain
 * object (NOT an `Error`), so `err instanceof Error` is `false` and the real
 * validation message would otherwise be lost behind a generic fallback.
 */
export function extractErrorMessage(err: unknown, fallback = "Something went wrong"): string {
     // Native Error
     if (err instanceof Error && err.message) {
          return err.message;
     }

     if (err && typeof err === "object") {
          const e = err as Record<string, any>;

          // RTK Query error: baseApi flattens validation details into `message`
          if (typeof e.message === "string" && e.message) {
               return e.message;
          }

          // Raw backend response body: { message, errors: [{ message }] }
          const data = e.data;
          if (data && typeof data === "object") {
               if (Array.isArray(data.errors) && data.errors.length > 0) {
                    const details = data.errors
                         .map((x: any) => (typeof x === "string" ? x : x?.message))
                         .filter(Boolean)
                         .join("; ");
                    if (details) return details;
               }
               if (typeof data.message === "string" && data.message) {
                    return data.message;
               }
          }

          // Errors array directly on the object
          if (Array.isArray(e.errors) && e.errors.length > 0) {
               const details = e.errors
                    .map((x: any) => (typeof x === "string" ? x : x?.message))
                    .filter(Boolean)
                    .join("; ");
               if (details) return details;
          }
     }

     if (typeof err === "string" && err) {
          return err;
     }

     return fallback;
}
