"use client";
import { uploadApi } from "@/redux/api/uploadApi";
import { store } from "@/redux/store";

import { FileText, Image as ImageIcon, Loader2, Upload, Video, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export type MediaKind = "image" | "video" | "document";

interface MediaUploaderProps {
     /** Current list of uploaded media URLs (Cloudinary URLs). */
     value: string[];
     /** Called whenever the URL list changes (after uploads / removals). */
     onChange: (urls: string[]) => void;
     /** What kind of media this uploader handles. */
     kind: MediaKind;
     /** Cloudinary folder name (e.g. "properties", "projects"). */
     folder: string;
     /** Human-readable label shown above the uploader. */
     label?: string;
     /** Whether multiple files are allowed. Defaults to true. */
     multiple?: boolean;
     /** Hint text shown under the label. */
     hint?: string;
}

interface PendingItem {
     /** Local object URL for preview while uploading. */
     previewUrl: string;
     /** Original file name. */
     name: string;
}

export function MediaUploader({
     value,
     onChange,
     kind,
     folder,
     label,
     multiple = true,
     hint,
}: MediaUploaderProps) {
     const inputRef = useRef<HTMLInputElement>(null);
     const [uploading, setUploading] = useState(false);
     const [pending, setPending] = useState<PendingItem[]>([]);

     const accept = kind === "image" ? "image/*" : kind === "video" ? "video/*" : ".pdf,.doc,.docx,.txt";

     const uploadOne = useCallback(
          async (file: File): Promise<string> => {
               if (kind === "image") {
                    const result = await store.dispatch(uploadApi.endpoints.uploadImage.initiate({ file: file, folder: folder })).unwrap();
                    return result.url;
               }
               if (kind === "video") {
                    const result = await store.dispatch(uploadApi.endpoints.uploadVideo.initiate({ file: file, folder: folder })).unwrap();
                    return result.url;
               }
               const result = await store.dispatch(uploadApi.endpoints.uploadDocument.initiate({ file: file, folder: folder })).unwrap();
               return result.url;
          },
          [kind, folder],
     );

     const handleFiles = useCallback(
          async (fileList: FileList | null) => {
               if (!fileList || fileList.length === 0) return;
               const files = Array.from(fileList);

               // When single mode, replace existing value
               if (!multiple) {
                    const file = files[0];
                    const previewUrl = URL.createObjectURL(file);
                    setPending([{ previewUrl, name: file.name }]);
                    setUploading(true);
                    try {
                         const url = await uploadOne(file);
                         onChange([url]);
                         toast.success(`${kind === "image" ? "Image" : kind === "video" ? "Video" : "Document"} uploaded successfully`);
                    } catch (err) {
                         toast.error(err instanceof Error ? err.message : `Failed to upload ${kind}`);
                         onChange([]);
                    } finally {
                         setPending([]);
                         setUploading(false);
                         if (inputRef.current) inputRef.current.value = "";
                    }
                    return;
               }

               // Multiple mode: append
               const newPending = files.map((file) => ({
                    previewUrl: URL.createObjectURL(file),
                    name: file.name,
               }));
               setPending((prev) => [...prev, ...newPending]);
               setUploading(true);

               const uploadedUrls: string[] = [];
               const errors: string[] = [];
               for (const file of files) {
                    try {
                         const url = await uploadOne(file);
                         uploadedUrls.push(url);
                    } catch (err) {
                         errors.push(file.name);
                    }
               }

               if (uploadedUrls.length > 0) {
                    onChange([...value, ...uploadedUrls]);
                    toast.success(`${uploadedUrls.length} ${kind}${uploadedUrls.length > 1 ? "s" : ""} uploaded successfully`);
               }
               if (errors.length > 0) {
                    toast.error(`Failed to upload: ${errors.join(", ")}`);
               }

               // Revoke object URLs
               newPending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
               setPending([]);
               setUploading(false);
               if (inputRef.current) inputRef.current.value = "";
          },
          [kind, folder, multiple, onChange, value, uploadOne],
     );

     const handleRemove = useCallback(
          (index: number) => {
               const next = value.filter((_, i) => i !== index);
               onChange(next);
          },
          [value, onChange],
     );

     const handleRemovePending = useCallback((index: number) => {
          setPending((prev) => {
               const item = prev[index];
               if (item) URL.revokeObjectURL(item.previewUrl);
               return prev.filter((_, i) => i !== index);
          });
     }, []);

     const kindLabel = kind === "image" ? "Images" : kind === "video" ? "Videos" : "Documents";
     const KindIcon = kind === "image" ? ImageIcon : kind === "video" ? Video : FileText;

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
                    {/* Existing uploaded media */}
                    {value.map((url, index) => (
                         <MediaPreview
                              key={`uploaded-${index}`}
                              url={url}
                              kind={kind}
                              onRemove={() => handleRemove(index)}
                         />
                    ))}

                    {/* Pending uploads (uploading state) */}
                    {pending.map((item, index) => (
                         <div
                              key={`pending-${index}`}
                              className="relative h-24 w-24 overflow-hidden rounded-md border border-dashed bg-muted/50 flex flex-col items-center justify-center gap-1"
                         >
                              {kind === "image" ? (
                                   <Image
                                        src={item.previewUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover opacity-50"
                                        unoptimized
                                   />
                              ) : (
                                   <KindIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                              )}
                              <Loader2 className="h-4 w-4 animate-spin text-primary z-10" />
                              {kind !== "image" ? (
                                   <span className="text-[10px] text-muted-foreground px-1 truncate max-w-full z-10">
                                        {item.name}
                                   </span>
                              ) : null}
                              <button
                                   type="button"
                                   onClick={() => handleRemovePending(index)}
                                   className="absolute top-1 right-1 z-20 rounded-full bg-background/80 p-0.5 hover:bg-background"
                              >
                                   <X className="h-3 w-3" />
                              </button>
                         </div>
                    ))}

                    {/* Upload trigger */}
                    <button
                         type="button"
                         onClick={() => inputRef.current?.click()}
                         disabled={uploading || (!multiple && value.length > 0)}
                         className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-muted-foreground/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                         {uploading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                         ) : (
                              <Upload className="h-5 w-5" />
                         )}
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
