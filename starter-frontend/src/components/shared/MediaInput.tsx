"use client";

import { FileText, Image as ImageIcon, Upload, Video, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type MediaKind = "image" | "video" | "document";

interface MediaInputProps {
     /** Existing media URLs kept from the server (editable — user can remove). */
     existingUrls: string[];
     /** New File objects selected by the user (not yet uploaded). */
     files: File[];
     /** Called whenever the kept URLs or new files change. */
     onChange: (existingUrls: string[], files: File[]) => void;
     /** What kind of media this input handles. */
     kind: MediaKind;
     /** Human-readable label shown above the input. */
     label?: string;
     /** Whether multiple files are allowed. Defaults to true. */
     multiple?: boolean;
     /** Hint text shown under the label. */
     hint?: string;
}

/**
 * MediaInput — a no-upload file input.
 *
 * Unlike MediaUploader, this component does NOT upload files to Cloudinary
 * on selection. Instead it collects File objects in local state (with
 * object-URL previews) and reports them to the parent via `onChange`.
 * The parent is responsible for appending the files to a FormData payload
 * on form submit, so files are only uploaded when the form is actually
 * submitted (no orphaned Cloudinary files on cancel).
 *
 * It also displays existing URLs (kept from the server) which the user can
 * remove. The kept URL list is reported back to the parent so it can be
 * included in the JSON `data` field as the "keep" list.
 */
export function MediaInput({
     existingUrls,
     files,
     onChange,
     kind,
     label,
     multiple = true,
     hint,
}: MediaInputProps) {
     const inputRef = useRef<HTMLInputElement>(null);
     // Local preview URLs for the currently-selected File objects.
     const [previews, setPreviews] = useState<string[]>([]);

     const accept =
          kind === "image"
               ? "image/*"
               : kind === "video"
                    ? "video/*"
                    : ".pdf,.doc,.docx,.txt";

     // Generate / revoke object URLs for previews whenever the files change.
     useEffect(() => {
          const urls = files.map((file) => URL.createObjectURL(file));
          setPreviews(urls);
          return () => {
               urls.forEach((url) => URL.revokeObjectURL(url));
          };
     }, [files]);

     const handleFiles = useCallback(
          (fileList: FileList | null) => {
               if (!fileList || fileList.length === 0) return;
               const selected = Array.from(fileList);

               if (!multiple) {
                    // Single mode: replace existing files
                    onChange(existingUrls, [selected[0]]);
               } else {
                    // Multiple mode: append
                    onChange(existingUrls, [...files, ...selected]);
               }

               if (inputRef.current) inputRef.current.value = "";
          },
          [existingUrls, files, multiple, onChange],
     );

     const handleRemoveUrl = useCallback(
          (index: number) => {
               const next = existingUrls.filter((_, i) => i !== index);
               onChange(next, files);
          },
          [existingUrls, files, onChange],
     );

     const handleRemoveFile = useCallback(
          (index: number) => {
               const next = files.filter((_, i) => i !== index);
               onChange(existingUrls, next);
          },
          [existingUrls, files, onChange],
     );

     const kindLabel = kind === "image" ? "Images" : kind === "video" ? "Videos" : "Documents";
     const KindIcon = kind === "image" ? ImageIcon : kind === "video" ? Video : FileText;

     const canAdd = multiple || (existingUrls.length === 0 && files.length === 0);

     return (
          <div className="space-y-2">
               {label ? (
                    <Label className="flex items-center gap-2">
                         <KindIcon className="h-4 w-4" />
                         {label}
                    </Label>
               ) : null}
               {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

               <div className="flex flex-wrap gap-3">
                    {/* Existing kept URLs (from the server) */}
                    {existingUrls.map((url, index) => (
                         <MediaPreview
                              key={`url-${index}`}
                              url={url}
                              kind={kind}
                              onRemove={() => handleRemoveUrl(index)}
                         />
                    ))}

                    {/* Newly selected files (local previews, not yet uploaded) */}
                    {files.map((file, index) => (
                         <FilePreview
                              key={`file-${index}`}
                              file={file}
                              previewUrl={previews[index]}
                              kind={kind}
                              onRemove={() => handleRemoveFile(index)}
                         />
                    ))}

                    {/* Add trigger */}
                    <button
                         type="button"
                         onClick={() => inputRef.current?.click()}
                         disabled={!canAdd}
                         className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-muted-foreground/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                         <Upload className="h-5 w-5" />
                         <span className="text-[10px] font-medium">Add {kindLabel}</span>
                    </button>
               </div>

               <Input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
               />
          </div>
     );
}

interface MediaPreviewProps {
     url: string;
     kind: MediaKind;
     onRemove: () => void;
}

function MediaPreview({ url, kind, onRemove }: MediaPreviewProps) {
     const fileName = decodeURIComponent(url.split("/").pop() || url);

     if (kind === "image") {
          return (
               <div className="group relative h-24 w-24 overflow-hidden rounded-md border">
                    <Image
                         src={url}
                         alt={fileName}
                         fill
                         className="object-cover"
                         unoptimized
                    />
                    <button
                         type="button"
                         onClick={onRemove}
                         className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                    >
                         <X className="h-3 w-3" />
                    </button>
               </div>
          );
     }

     if (kind === "video") {
          return (
               <div className="group relative h-24 w-24 overflow-hidden rounded-md border bg-muted">
                    <video
                         src={url}
                         className="h-full w-full object-cover"
                         muted
                         preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                         <Video className="h-6 w-6 text-white/80" />
                    </div>
                    <button
                         type="button"
                         onClick={onRemove}
                         className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                    >
                         <X className="h-3 w-3" />
                    </button>
               </div>
          );
     }

     // Document
     return (
          <div className="group relative flex h-24 w-40 items-center gap-2 overflow-hidden rounded-md border bg-muted/30 p-2">
               <FileText className="h-8 w-8 shrink-0 text-muted-foreground" />
               <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate"
               >
                    {fileName}
               </a>
               <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
               >
                    <X className="h-3 w-3" />
               </button>
          </div>
     );
}

interface FilePreviewProps {
     file: File;
     previewUrl: string | undefined;
     kind: MediaKind;
     onRemove: () => void;
}

function FilePreview({ file, previewUrl, kind, onRemove }: FilePreviewProps) {
     const KindIcon = kind === "image" ? ImageIcon : kind === "video" ? Video : FileText;

     if (kind === "image" && previewUrl) {
          return (
               <div className="group relative h-24 w-24 overflow-hidden rounded-md border border-primary/40">
                    <Image
                         src={previewUrl}
                         alt={file.name}
                         fill
                         className="object-cover"
                         unoptimized
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 px-1 py-0.5 text-[9px] font-medium text-primary-foreground">
                         New
                    </span>
                    <button
                         type="button"
                         onClick={onRemove}
                         className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                    >
                         <X className="h-3 w-3" />
                    </button>
               </div>
          );
     }

     if (kind === "video" && previewUrl) {
          return (
               <div className="group relative h-24 w-24 overflow-hidden rounded-md border border-primary/40 bg-muted">
                    <video
                         src={previewUrl}
                         className="h-full w-full object-cover"
                         muted
                         preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                         <Video className="h-6 w-6 text-white/80" />
                    </div>
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 px-1 py-0.5 text-[9px] font-medium text-primary-foreground">
                         New
                    </span>
                    <button
                         type="button"
                         onClick={onRemove}
                         className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                    >
                         <X className="h-3 w-3" />
                    </button>
               </div>
          );
     }

     // Document (or fallback)
     return (
          <div className="group relative flex h-24 w-40 items-center gap-2 overflow-hidden rounded-md border border-primary/40 bg-primary/5 p-2">
               <FileText className="h-8 w-8 shrink-0 text-muted-foreground" />
               <span className="text-xs text-foreground truncate">{file.name}</span>
               <span className="absolute bottom-0 left-0 right-0 bg-primary/80 px-1 py-0.5 text-[9px] font-medium text-primary-foreground">
                    New
               </span>
               <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
               >
                    <X className="h-3 w-3" />
               </button>
          </div>
     );
}
