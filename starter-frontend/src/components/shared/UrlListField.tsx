"use client";

import { Link, Plus, X, Youtube } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UrlListFieldProps {
     /** Current list of video URLs (e.g. YouTube links). */
     value: string[];
     /** Called whenever the URL list changes. */
     onChange: (urls: string[]) => void;
     /** Human-readable label shown above the field. */
     label?: string;
     /** Hint text shown under the label. */
     hint?: string;
     /** Placeholder for each URL input. */
     placeholder?: string;
}

/**
 * A reusable field for managing a list of external video URLs (e.g. YouTube).
 * Users paste URLs they have already uploaded to YouTube/other platforms.
 */
export function UrlListField({
     value,
     onChange,
     label = "Video URLs",
     hint,
     placeholder = "https://www.youtube.com/watch?v=...",
}: UrlListFieldProps) {
     const [draft, setDraft] = useState("");

     const addUrl = useCallback(() => {
          const trimmed = draft.trim();
          if (!trimmed) return;
          onChange([...value, trimmed]);
          setDraft("");
     }, [draft, value, onChange]);

     const removeUrl = useCallback(
          (index: number) => {
               onChange(value.filter((_, i) => i !== index));
          },
          [value, onChange],
     );

     const updateUrl = useCallback(
          (index: number, newUrl: string) => {
               const next = [...value];
               next[index] = newUrl;
               onChange(next);
          },
          [value, onChange],
     );

     const handleKeyDown = useCallback(
          (e: React.KeyboardEvent<HTMLInputElement>) => {
               if (e.key === "Enter") {
                    e.preventDefault();
                    addUrl();
               }
          },
          [addUrl],
     );

     return (
          <div className="space-y-2">
               {label ? (
                    <Label className="flex items-center gap-2">
                         <Youtube className="h-4 w-4" />
                         {label}
                    </Label>
               ) : null}
               {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

               {/* Existing URLs */}
               {value.length > 0 ? (
                    <div className="space-y-2">
                         {value.map((url, index) => (
                              <div key={index} className="flex items-center gap-2">
                                   <Link className="h-4 w-4 shrink-0 text-muted-foreground" />
                                   <Input
                                        value={url}
                                        onChange={(e) => updateUrl(index, e.target.value)}
                                        placeholder={placeholder}
                                        className="flex-1"
                                   />
                                   <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeUrl(index)}
                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                   >
                                        <X className="h-4 w-4" />
                                   </Button>
                              </div>
                         ))}
                    </div>
               ) : null}

               {/* Add new URL */}
               <div className="flex items-center gap-2">
                    <Input
                         value={draft}
                         onChange={(e) => setDraft(e.target.value)}
                         onKeyDown={handleKeyDown}
                         placeholder={placeholder}
                         className="flex-1"
                    />
                    <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={addUrl}
                         disabled={!draft.trim()}
                         className="shrink-0"
                    >
                         <Plus className="h-4 w-4" />
                         Add
                    </Button>
               </div>
          </div>
     );
}
