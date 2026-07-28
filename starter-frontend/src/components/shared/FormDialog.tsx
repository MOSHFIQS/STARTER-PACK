"use client"

import { Loader2 } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog"

interface FormDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     title: string
     description?: string
     children: React.ReactNode
     onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>
     submitLabel?: string
     cancelLabel?: string
     isSubmitting?: boolean
     maxWidthClassName?: string
}

export function FormDialog({
     open,
     onOpenChange,
     title,
     description,
     children,
     onSubmit,
     submitLabel = "Save",
     cancelLabel = "Cancel",
     isSubmitting = false,
     maxWidthClassName = "sm:max-w-2xl",
}: FormDialogProps) {
     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent
                    className={`${maxWidthClassName} flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0`}
               >
                    <DialogHeader className="border-b px-4 py-3 sm:px-6 sm:py-4">
                         <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
                         {description ? <DialogDescription>{description}</DialogDescription> : null}
                    </DialogHeader>
                    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
                         <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 scrollbar-thin">
                              <div className="space-y-5">{children}</div>
                         </div>
                         <DialogFooter className="border-t px-4 py-3 sm:px-6">
                              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                   {cancelLabel}
                              </Button>
                              <Button type="submit" disabled={isSubmitting}>
                                   {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                                   {submitLabel}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
