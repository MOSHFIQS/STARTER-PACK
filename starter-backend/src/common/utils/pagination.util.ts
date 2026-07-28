import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '../dto/pagination.dto';

/**
 * Build Prisma `where` clause for search across given fields.
 */
export function buildSearchClause(
     search: string | undefined,
     fields: string[],
): Prisma.Sql | undefined {
     if (!search || fields.length === 0) return undefined;
     // Returns undefined; actual OR clause built by buildWhere
     return undefined;
}

/**
 * Build an OR-based search filter for Prisma across multiple string fields.
 */
export function buildSearchFilter(
     search: string | undefined,
     fields: string[],
): Record<string, any> | undefined {
     if (!search || fields.length === 0) return undefined;
     return {
          OR: fields.map((field) => ({
               [field]: { contains: search, mode: 'insensitive' },
          })),
     };
}

/**
 * Build Prisma orderBy object from pagination params.
 */
export function buildOrderBy(
     sortBy: string | undefined,
     sortOrder: SortOrder | undefined,
): Record<string, 'asc' | 'desc'> {
     return {
          [sortBy || 'createdAt']: sortOrder || SortOrder.DESC,
     };
}

/**
 * Build Prisma pagination skip & take from pagination params.
 */
export function buildPagination(
     page: number | undefined,
     limit: number | undefined,
): { skip: number; take: number } {
     const p = Number(page) || 1;
     const l = Number(limit) || 10;
     return {
          skip: (p - 1) * l,
          take: l,
     };
}

/**
 * Merge multiple where-clause fragments into one Prisma where object.
 */
export function mergeWhere(
     ...clauses: Array<Record<string, any> | undefined>
): Record<string, any> {
     return clauses.reduce<Record<string, any>>((acc, clause) => {
          if (clause) {
               Object.assign(acc, clause);
          }
          return acc;
     }, {});
}

/**
 * Convenience: build full pagination args from a PaginationDto.
 */
export function buildPaginationArgs(dto: PaginationDto) {
     return {
          ...buildPagination(dto.page, dto.limit),
          orderBy: buildOrderBy(dto.sortBy, dto.sortOrder),
     };
}
