"use client"

import { Search, X } from "lucide-react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface FilterOption {
     key: string
     label: string
     value: string
     options: { label: string; value: string }[]
     placeholder?: string
}

interface SearchFilterBarProps {
     search?: string
     onSearchChange?: (value: string) => void
     searchPlaceholder?: string
     filters?: FilterOption[]
     onFilterChange?: (key: string, value: string) => void
     onReset?: () => void
     actions?: React.ReactNode
}

export function SearchFilterBar({
     search = "",
     onSearchChange,
     searchPlaceholder = "Search records...",
     filters = [],
     onFilterChange,
     onReset,
     actions,
}: SearchFilterBarProps) {
     const hasActiveFilters = Boolean(search) || filters.some((filter) => filter.value && filter.value !== "all")

     return (
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
               <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
                    {onSearchChange ? (
                         <div className="relative min-w-0 flex-1 sm:max-w-xs">
                              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                              <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} className="pl-9" />
                         </div>
                    ) : null}
                    {filters.map((filter) => {
                         const hasEmptyOption = filter.options.some((opt) => opt.value === "");
                         const hasAllOption = filter.options.some((opt) => opt.value === "all");
                         const hasAnyAllOption = hasEmptyOption || hasAllOption;

                         const selectOptions = hasAnyAllOption
                              ? filter.options
                              : [
                                     {
                                          label: filter.placeholder ?? `All ${filter.label}`,
                                          value: "all",
                                     },
                                     ...filter.options,
                                ];

                         let selectValue = filter.value;
                         if (!selectValue) {
                              if (hasEmptyOption) {
                                   selectValue = "";
                              } else {
                                   selectValue = "all";
                              }
                         }

                         return (
                              <div key={filter.key} className="min-w-40">
                                   <Select
                                        value={selectValue}
                                        onValueChange={(value) => {
                                             let valueToReport = value;
                                             if (!hasAnyAllOption && value === "all") {
                                                  valueToReport = "";
                                             }
                                             onFilterChange?.(filter.key, valueToReport);
                                        }}
                                   >
                                        <SelectTrigger aria-label={filter.label} className="w-full">
                                             <SelectValue placeholder={filter.placeholder ?? filter.label} />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {selectOptions.map((option) => (
                                                  <SelectItem key={option.value} value={option.value}>
                                                       {option.label}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>
                         );
                    })}
                    {onReset && hasActiveFilters ? (
                         <Button type="button" variant="ghost" size="sm" onClick={onReset} className="justify-start text-muted-foreground hover:text-foreground">
                              <X className="size-4" />
                              Reset
                         </Button>
                    ) : null}
               </div>
               {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
          </div>
     )
}
