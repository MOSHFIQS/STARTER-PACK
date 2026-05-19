"use client";

import React, { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, containerClassName, className, id, type = "text", ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("space-y-2 w-full", containerClassName)}>
        <div className="flex items-center justify-between">
          <Label
            htmlFor={fieldId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
          </Label>
        </div>
        <Input
          id={fieldId}
          type={type}
          ref={ref}
          className={cn(
            "h-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-semibold text-destructive mt-1 animate-slide-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
export default FormField;
