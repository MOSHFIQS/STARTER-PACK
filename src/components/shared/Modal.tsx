"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sizeClassName?: string; // custom width overrides (e.g., 'max-w-2xl')
}

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
  sizeClassName = "max-w-md",
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "bg-card text-card-foreground p-6 rounded-lg shadow-lg overflow-hidden border border-border sm:rounded-lg max-w-full w-full sm:w-auto animate-in fade-in zoom-in duration-200",
          sizeClassName
        )}
      >
        <DialogHeader className="space-y-1.5 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
