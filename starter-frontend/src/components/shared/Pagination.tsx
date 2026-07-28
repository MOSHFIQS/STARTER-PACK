"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface PaginationProps {
     page: number
     totalPages: number
     totalItems?: number
     pageSize?: number
     pageSizeOptions?: number[]
     onPageChange: (page: number) => void
     onPageSizeChange?: (pageSize: number) => void
     className?: string
}

export function Pagination({
     page,
     totalPages,
     totalItems,
     pageSize,
     pageSizeOptions = [10, 20, 50],
     onPageChange,
     onPageSizeChange,
     className,
}: PaginationProps) {
     const safeTotalPages = Math.max(totalPages || 1, 1)
     const currentPage = Math.min(Math.max(page, 1), safeTotalPages)
     const start = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : undefined
     const end = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : undefined

     return (
          <div className={cn("flex flex-col gap-3 rounded-xl border bg-card p-3 text-sm text-muted-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between", className)}>
               <div className="font-medium">
                    {totalItems !== undefined && start !== undefined && end !== undefined
                         ? `Showing ${start}–${end} of ${totalItems}`
                         : `Page ${currentPage} of ${safeTotalPages}`}
               </div>
               <div className="flex flex-wrap items-center gap-2">
                    {pageSize && onPageSizeChange ? (
                         <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
                              <SelectTrigger className="w-28" aria-label="Rows per page">
                                   <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                   {pageSizeOptions.map((option) => (
                                        <SelectItem key={option} value={String(option)}>
                                             {option} / page
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    ) : null}
                    <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
                         <ChevronLeft className="size-4" />
                         Previous
                    </Button>
                    <span className="min-w-8 rounded-md bg-muted px-2.5 py-1 text-center font-semibold text-foreground tabular-nums">
                         {currentPage}
                    </span>
                    <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= safeTotalPages}>
                         Next
                         <ChevronRight className="size-4" />
                    </Button>
               </div>
          </div>
     )
}
