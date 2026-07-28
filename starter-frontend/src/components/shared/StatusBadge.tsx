import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusTone = "default" | "success" | "warning" | "danger" | "info" | "muted"

const toneClass: Record<StatusTone, string> = {
     default: "border-transparent bg-primary/10 text-primary",
     success: "border-transparent bg-success/10 text-success dark:bg-success/15",
     warning: "border-transparent bg-warning/15 text-warning-foreground dark:bg-warning/20",
     danger: "border-transparent bg-destructive/10 text-destructive",
     info: "border-transparent bg-info/10 text-info dark:bg-info/15",
     muted: "border-transparent bg-muted text-muted-foreground",
}

interface StatusBadgeProps {
     value?: string | boolean | null
     tone?: StatusTone
     className?: string
}

function inferTone(value?: string | boolean | null): StatusTone {
     if (typeof value === "boolean") return value ? "success" : "muted"
     const normalized = String(value ?? "").toLowerCase()
     if (["active", "approved", "published", "available", "verified", "confirmed", "success", "paid", "completed", "sold", "rented"].includes(normalized)) return "success"
     if (["pending", "draft", "review", "reserved", "contacted", "processing"].includes(normalized)) return "warning"
     if (["inactive", "rejected", "revoked", "cancelled", "closed", "deleted", "unavailable", "expired"].includes(normalized)) return "danger"
     if (["info", "new", "open"].includes(normalized)) return "info"
     return "default"
}

export function StatusBadge({ value, tone, className }: StatusBadgeProps) {
     const label = typeof value === "boolean" ? (value ? "Active" : "Inactive") : value || "Unknown"
     const selectedTone = tone ?? inferTone(value)

     return (
          <Badge
               variant="outline"
               className={cn("capitalize font-medium", toneClass[selectedTone], className)}
          >
               {String(label).replaceAll("_", " ").toLowerCase()}
          </Badge>
     )
}
