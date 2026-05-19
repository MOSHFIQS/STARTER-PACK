"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Search, Inbox } from "lucide-react";

export interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchKey?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  totalCount = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  searchKey,
  onSearchChange,
  searchPlaceholder = "Search records...",
}: DataTableProps<T>) {
  const [localSearch, setLocalSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalCount > pageSize && onPageChange;

  return (
    <div className="w-full space-y-4">
      {/* Search Header */}
      {onSearchChange && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={localSearch}
            onChange={handleSearch}
            className="pl-9 h-10 w-full"
          />
        </div>
      )}

      {/* Main Table Structure */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((col, idx) => (
                <TableHead key={idx} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: pageSize }).map((_, rIdx) => (
                <TableRow key={rIdx}>
                  {columns.map((_, cIdx) => (
                    <TableCell key={cIdx}>
                      <Skeleton className="h-5 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="rounded-full bg-muted p-4 text-muted-foreground">
                      <Inbox className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">No records found</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      There are no entries matches the current criteria or table is empty.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Render Loaded Data Rows
              data.map((row, rIdx) => (
                <TableRow key={rIdx} className="hover:bg-muted/20 transition-colors">
                  {columns.map((col, cIdx) => {
                    const cellValue =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode);
                    return (
                      <TableCell key={cIdx} className={col.className}>
                        {cellValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {showPagination && (
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-sm text-muted-foreground">
            Showing Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span> ({totalCount} total items)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
