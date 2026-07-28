"use client";

import {
     Calendar,
     CheckCircle2,
     ChevronLeft,
     ChevronRight,
     FileText,
     Image as ImageIcon,
     Info,
     Link2,
     MapPin,
     Tag,
     X,
} from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* DetailsDialog — scrollable, sectioned view-details modal            */
/* ------------------------------------------------------------------ */

interface DetailsDialogProps {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     title: string;
     description?: string;
     /** Optional badge shown next to the title (e.g. status). */
     titleBadge?: ReactNode;
     /** Optional hero node rendered above the scroll area (e.g. image gallery). */
     hero?: ReactNode;
     children: ReactNode;
     /** Footer content (e.g. created/updated timestamps). */
     footer?: ReactNode;
     maxWidthClassName?: string;
}

export function DetailsDialog({
     open,
     onOpenChange,
     title,
     description,
     titleBadge,
     hero,
     children,
     footer,
     maxWidthClassName = "sm:max-w-3xl",
}: DetailsDialogProps) {
     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent
                    className={cn(
                         maxWidthClassName,
                         "flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0",
                    )}
               >
                    <DialogHeader className="flex flex-row items-start justify-between gap-3 border-b px-4 py-3 sm:px-6 sm:py-4">
                         <div className="min-w-0 space-y-1">
                              <DialogTitle className="flex flex-wrap items-center gap-2 text-lg sm:text-xl">
                                   <span className="line-clamp-2 break-words">{title}</span>
                                   {titleBadge}
                              </DialogTitle>
                              {description ? (
                                   <DialogDescription className="line-clamp-2 break-words">
                                        {description}
                                   </DialogDescription>
                              ) : null}
                         </div>
                    </DialogHeader>

                    {hero ? <div className="border-b">{hero}</div> : null}

                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 scrollbar-thin">
                         <div className="space-y-6">{children}</div>
                    </div>

                    {footer ? (
                         <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 border-t bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground sm:px-6 sm:py-3">
                              {footer}
                         </div>
                    ) : null}
               </DialogContent>
          </Dialog>
     );
}

/* ------------------------------------------------------------------ */
/* DetailSection — titled group of fields                              */
/* ------------------------------------------------------------------ */

interface DetailSectionProps {
     title: string;
     icon?: ReactNode;
     /** Number of columns in the field grid. Defaults to 2. */
     columns?: 1 | 2 | 3 | 4;
     children: ReactNode;
     /** Optional extra content rendered full-width below the grid. */
     extra?: ReactNode;
     className?: string;
}

export function DetailSection({
     title,
     icon,
     columns = 2,
     children,
     extra,
     className,
}: DetailSectionProps) {
     const gridCols = {
          1: "grid grid-cols-1 gap-3",
          2: "grid grid-cols-1 gap-3 sm:grid-cols-2",
          3: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
          4: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
     }[columns];

     return (
          <section className={cn("rounded-lg border bg-card", className)}>
               <header className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
                    {icon ? <span className="text-primary">{icon}</span> : null}
                    <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
               </header>
               <div className="p-4">
                    <div className={gridCols}>{children}</div>
                    {extra ? <div className="mt-4 space-y-2">{extra}</div> : null}
               </div>
          </section>
     );
}

/* ------------------------------------------------------------------ */
/* DetailField — single label/value pair                               */
/* ------------------------------------------------------------------ */

interface DetailFieldProps {
     label: string;
     value?: ReactNode;
     /** Fallback when value is empty/null/undefined. */
     fallback?: string;
     /** Render value as a badge instead of text. */
     badge?: boolean;
     className?: string;
}

export function DetailField({ label, value, fallback = "—", badge, className }: DetailFieldProps) {
     const isEmpty =
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

     return (
          <div className={cn("min-w-0", className)}>
               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
               {badge && !isEmpty ? (
                    <div className="mt-1">{value}</div>
               ) : (
                    <p className="mt-0.5 break-words text-sm font-medium">
                         {isEmpty ? <span className="text-muted-foreground/60">{fallback}</span> : value}
                    </p>
               )}
          </div>
     );
}

/* ------------------------------------------------------------------ */
/* DetailBadgeList — list of badges (features / amenities)             */
/* ------------------------------------------------------------------ */

interface DetailBadgeListProps {
     items?: string[] | null;
     emptyText?: string;
     className?: string;
}

export function DetailBadgeList({ items, emptyText = "None specified", className }: DetailBadgeListProps) {
     if (!items || items.length === 0) {
          return <p className="text-sm text-muted-foreground/60">{emptyText}</p>;
     }
     return (
          <div className={cn("flex flex-wrap gap-1.5", className)}>
               {items.map((item, i) => (
                    <Badge key={`${item}-${i}`} variant="secondary" className="font-normal">
                         {item}
                    </Badge>
               ))}
          </div>
     );
}

/* ------------------------------------------------------------------ */
/* DetailImageGallery — thumbnail grid with lightbox                   */
/* ------------------------------------------------------------------ */

interface DetailImageGalleryProps {
     images?: string[] | null;
     emptyText?: string;
     className?: string;
}

export function DetailImageGallery({ images, emptyText = "No images uploaded", className }: DetailImageGalleryProps) {
     const [active, setActive] = useState<number | null>(null);

     if (!images || images.length === 0) {
          return (
               <div className={cn("flex items-center gap-2 rounded-md border border-dashed bg-muted/30 px-3 py-4 text-sm text-muted-foreground", className)}>
                    <ImageIcon className="h-4 w-4" />
                    {emptyText}
               </div>
          );
     }

     return (
          <div className={className}>
               <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {images.map((src, i) => (
                         <button
                              key={`${src}-${i}`}
                              type="button"
                              onClick={() => setActive(i)}
                              className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
                         >
                              <Image
                                   src={src}
                                   alt={`Image ${i + 1}`}
                                   fill
                                   sizes="(max-width: 640px) 50vw, 20vw"
                                   className="object-cover transition-transform duration-200 group-hover:scale-105"
                                   unoptimized
                              />
                         </button>
                    ))}
               </div>

               <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
                    <DialogContent className="max-w-4xl border-0 bg-black/90 p-2 sm:p-4" showCloseButton={false}>
                         {active !== null ? (
                              <div className="relative h-[60vh] w-full sm:h-[75vh]">
                                   <Image
                                        src={images[active]}
                                        alt={`Image ${active + 1}`}
                                        fill
                                        sizes="100vw"
                                        className="object-contain"
                                        unoptimized
                                   />

                                   {images.length > 1 ? (
                                        <>
                                             <Button
                                                  type="button"
                                                  variant="secondary"
                                                  size="icon"
                                                  onClick={() => setActive((p) => (p === null ? 0 : (p - 1 + images.length) % images.length))}
                                                  className="absolute left-2 top-1/2 size-9 -translate-y-1/2 rounded-full sm:size-10"
                                                  aria-label="Previous image"
                                             >
                                                  <ChevronLeft className="h-5 w-5" />
                                             </Button>
                                             <Button
                                                  type="button"
                                                  variant="secondary"
                                                  size="icon"
                                                  onClick={() => setActive((p) => (p === null ? 0 : (p + 1) % images.length))}
                                                  className="absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-full sm:size-10"
                                                  aria-label="Next image"
                                             >
                                                  <ChevronRight className="h-5 w-5" />
                                             </Button>
                                        </>
                                   ) : null}

                                   <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => setActive(null)}
                                        className="absolute right-2 top-2 size-9 rounded-full sm:size-10"
                                        aria-label="Close"
                                   >
                                        <X className="h-5 w-5" />
                                   </Button>

                                   <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                                        {active + 1} / {images.length}
                                   </span>
                              </div>
                         ) : null}
                    </DialogContent>
               </Dialog>
          </div>
     );
}

/* ------------------------------------------------------------------ */
/* DetailLinkList — list of clickable links (videos / documents)       */
/* ------------------------------------------------------------------ */

interface DetailLinkListProps {
     links?: string[] | null;
     icon?: ReactNode;
     emptyText?: string;
     className?: string;
}

export function DetailLinkList({ links, icon, emptyText = "None", className }: DetailLinkListProps) {
     if (!links || links.length === 0) {
          return <p className="text-sm text-muted-foreground/60">{emptyText}</p>;
     }
     return (
          <ul className={cn("space-y-1.5", className)}>
               {links.map((link, i) => (
                    <li key={`${link}-${i}`} className="min-w-0">
                         <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-start gap-1.5 text-sm text-primary hover:underline"
                         >
                              <span className="mt-0.5 shrink-0">{icon ?? <Link2 className="h-3.5 w-3.5" />}</span>
                              <span className="min-w-0 break-all">{link}</span>
                         </a>
                    </li>
               ))}
          </ul>
     );
}

/* ------------------------------------------------------------------ */
/* DetailTimestamps — footer with created/updated dates                 */
/* ------------------------------------------------------------------ */

interface DetailTimestampsProps {
     createdAt?: string;
     updatedAt?: string;
}

export function DetailTimestamps({ createdAt, updatedAt }: DetailTimestampsProps) {
     return (
          <>
               {createdAt ? (
                    <span className="inline-flex items-center gap-1">
                         <Calendar className="h-3 w-3" />
                         Created: {new Date(createdAt).toLocaleString()}
                    </span>
               ) : null}
               {updatedAt ? (
                    <span className="inline-flex items-center gap-1">
                         <Calendar className="h-3 w-3" />
                         Updated: {new Date(updatedAt).toLocaleString()}
                    </span>
               ) : null}
          </>
     );
}

/* ------------------------------------------------------------------ */
/* FormSection — titled group for create/edit forms                     */
/* ------------------------------------------------------------------ */

interface FormSectionProps {
     title: string;
     icon?: ReactNode;
     description?: string;
     /** Number of columns for the field grid. Defaults to 2. */
     columns?: 1 | 2 | 3 | 4;
     children: ReactNode;
     /** Full-width content rendered below the grid (e.g. media uploader). */
     extra?: ReactNode;
     className?: string;
}

export function FormSection({
     title,
     icon,
     description,
     columns = 2,
     children,
     extra,
     className,
}: FormSectionProps) {
     const gridCols = {
          1: "grid grid-cols-1 gap-4",
          2: "grid grid-cols-1 gap-4 sm:grid-cols-2",
          3: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          4: "grid grid-cols-2 gap-4 sm:grid-cols-4",
     }[columns];

     return (
          <fieldset className={cn("rounded-lg border bg-card/50 p-4", className)}>
               <legend className="mb-1 flex items-center gap-2 px-1 text-sm font-semibold">
                    {icon ? <span className="text-primary">{icon}</span> : null}
                    {title}
               </legend>
               {description ? <p className="mb-3 px-1 text-xs text-muted-foreground">{description}</p> : null}
               <div className={gridCols}>{children}</div>
               {extra ? <div className="mt-4 space-y-3">{extra}</div> : null}
          </fieldset>
     );
}

/* ------------------------------------------------------------------ */
/* Convenience icon exports for sections                               */
/* ------------------------------------------------------------------ */

export const SectionIcons = {
     Info,
     Tag,
     MapPin,
     Calendar,
     FileText,
     CheckCircle2,
     Image: ImageIcon,
};
