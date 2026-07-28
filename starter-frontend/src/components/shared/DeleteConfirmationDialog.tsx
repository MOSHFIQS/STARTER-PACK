"use client"

import { Loader2, Trash2 } from "lucide-react"

import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     title?: string
     description?: string
     itemName?: string
     isDeleting?: boolean
     onConfirm: () => void | Promise<void>
}

export function DeleteConfirmationDialog({
     open,
     onOpenChange,
     title = "Delete record",
     description,
     itemName,
     isDeleting = false,
     onConfirm,
}: DeleteConfirmationDialogProps) {
     const message = description ?? `This action cannot be undone${itemName ? ` for ${itemName}` : ""}.`

     return (
          <AlertDialog open={open} onOpenChange={onOpenChange}>
               <AlertDialogContent>
                    <AlertDialogHeader>
                         <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-4 ring-destructive/5 sm:mx-0">
                              <Trash2 className="size-5" />
                         </div>
                         <AlertDialogTitle className="text-center sm:text-left">{title}</AlertDialogTitle>
                         <AlertDialogDescription className="text-center sm:text-left">{message}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                         <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                         <AlertDialogAction asChild>
                              <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                                   {isDeleting ? <Loader2 className="animate-spin" /> : null}
                                   Delete
                              </Button>
                         </AlertDialogAction>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     )
}
