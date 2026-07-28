"use client"

import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type SortDirection = "asc" | "desc"

export interface Column<T> {
     key: string
     label: string
     render?: (item: T) => React.ReactNode
     className?: string
     headerClassName?: string
     sortable?: boolean
}

interface DataTableProps<T> {
     columns: Column<T>[]
     data?: T[]
     keyExtractor: (item: T) => string | number | undefined
     emptyMessage?: string
     loading?: boolean
     error?: string | null
     skeletonRows?: number
     sortKey?: string
     sortDirection?: SortDirection
     onSortChange?: (key: string, direction: SortDirection) => void
}

export function DataTable<T>({
     columns,
     data,
     keyExtractor,
     emptyMessage = "No data found.",
     loading = false,
     error,
     skeletonRows = 6,
     sortKey,
     sortDirection = "asc",
     onSortChange,
}: DataTableProps<T>) {
     const rows = Array.isArray(data) ? data : []

     const handleSort = (column: Column<T>) => {
          if (!column.sortable || !onSortChange) return
          const nextDirection = sortKey === column.key && sortDirection === "asc" ? "desc" : "asc"
          onSortChange(column.key, nextDirection)
     }

     if (error) {
          return (
               <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                         <AlertCircle className="size-6" />
                    </div>
                    <div className="space-y-1">
                         <p className="font-semibold text-destructive">Unable to load records</p>
                         <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
               </div>
          )
     }

     return (
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
               <Table>
                    <TableHeader className="bg-muted/40">
                         <TableRow className="hover:bg-transparent">
                              {columns.map((column) => {
                                   const isSorted = sortKey === column.key
                                   const SortIcon = !isSorted ? ArrowUpDown : sortDirection === "asc" ? ArrowUp : ArrowDown

                                   return (
                                        <TableHead key={column.key} className={cn("whitespace-nowrap", column.headerClassName, column.className)}>
                                             {column.sortable ? (
                                                  <Button type="button" variant="ghost" size="sm" className="-ml-3 h-8 px-2 font-medium hover:bg-muted" onClick={() => handleSort(column)}>
                                                       {column.label}
                                                       <SortIcon className={cn("size-3.5 transition-transform", isSorted ? "text-primary" : "text-muted-foreground/60")} />
                                                  </Button>
                                             ) : (
                                                  column.label
                                             )}
                                        </TableHead>
                                   )
                              })}
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading
                              ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                                   <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                                        {columns.map((column) => (
                                             <TableCell key={column.key} className={column.className}>
                                                  <Skeleton className="h-5 w-full max-w-40" />
                                             </TableCell>
                                        ))}
                                   </TableRow>
                              ))
                              : rows.map((item, index) => {
                                   const key = keyExtractor(item) ?? index

                                   return (
                                        <TableRow key={key}>
                                             {columns.map((column) => (
                                                  <TableCell key={column.key} className={column.className}>
                                                       {column.render ? column.render(item) : (item as Record<string, React.ReactNode>)[column.key] ?? "-"}
                                                  </TableCell>
                                             ))}
                                        </TableRow>
                                   )
                              })}
                         {!loading && rows.length === 0 ? (
                              <TableRow className="hover:bg-transparent">
                                   <TableCell colSpan={columns.length} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                             <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                  <Inbox className="size-5" />
                                             </div>
                                             <p className="text-sm font-medium">{emptyMessage}</p>
                                        </div>
                                   </TableCell>
                              </TableRow>
                         ) : null}
                    </TableBody>
               </Table>
          </div>
     )
}
