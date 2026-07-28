"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
	/** Current rating value (0-5). */
	value: number;
	/** Maximum number of stars. @default 5 */
	max?: number;
	/** Star size in pixels. @default 20 */
	size?: number;
	/** When true, renders an interactive, hoverable star input. */
	interactive?: boolean;
	/** Called when a star is clicked (interactive mode). */
	onValueChange?: (value: number) => void;
	/** Show the numeric rating next to the stars. */
	showValue?: boolean;
	/** Optional className for the container. */
	className?: string;
	/** Disable interaction (interactive mode). */
	disabled?: boolean;
}

/**
 * StarRating — displays a row of stars.
 *
 * In read-only mode it renders a fractional star rating (e.g. 4.3/5).
 * In interactive mode it acts as a rating input with hover preview.
 */
export function StarRating({
	value,
	max = 5,
	size = 20,
	interactive = false,
	onValueChange,
	showValue = false,
	className,
	disabled = false,
}: StarRatingProps) {
	const [hoverValue, setHoverValue] = useState<number | null>(null);

	const displayValue = hoverValue ?? value;

	return (
		<div className={cn("inline-flex items-center gap-1", className)}>
			<div
				className="inline-flex items-center"
				role={interactive ? "radiogroup" : undefined}
				aria-label={interactive ? "Rating" : `Rated ${value} out of ${max}`}
			>
				{Array.from({ length: max }, (_, i) => {
					const starValue = i + 1;
					const fillRatio = Math.min(Math.max(displayValue - i, 0), 1);

					return (
						<button
							key={i}
							type="button"
							disabled={!interactive || disabled}
							onClick={() => interactive && onValueChange?.(starValue)}
							onMouseEnter={() => interactive && !disabled && setHoverValue(starValue)}
							onMouseLeave={() => interactive && setHoverValue(null)}
							className={cn(
								"relative inline-flex items-center justify-center p-0.5",
								interactive && !disabled && "cursor-pointer transition-transform hover:scale-110",
								(!interactive || disabled) && "cursor-default",
							)}
							aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
							aria-pressed={interactive && value === starValue}
						>
							{/* Base (empty) star */}
							<Star
								className="text-muted-foreground/30"
								style={{ width: size, height: size }}
								strokeWidth={1.5}
							/>
							{/* Filled overlay (clipped to fill ratio) */}
							{fillRatio > 0 && (
								<span
									className="absolute inset-0.5 overflow-hidden"
									style={{ width: `calc(${fillRatio * 100}% - 0.25rem)` }}
								>
									<Star
										className="fill-amber-400 text-amber-400"
										style={{ width: size, height: size }}
										strokeWidth={1.5}
									/>
								</span>
							)}
						</button>
					);
				})}
			</div>
			{showValue && (
				<span className="text-sm font-medium tabular-nums text-muted-foreground">
					{value > 0 ? value.toFixed(1) : "—"}
					<span className="text-muted-foreground/60"> / {max}</span>
				</span>
			)}
		</div>
	);
}
