"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useId } from "react";

/* ===========================================================================
 *  Shared helpers
 * ======================================================================== */

const CHART_PALETTE = [
     "hsl(221 83% 53%)", // blue
     "hsl(142 71% 45%)", // green
     "hsl(38 92% 50%)", // amber
     "hsl(0 84% 60%)", // red
     "hsl(280 65% 60%)", // purple
     "hsl(199 89% 48%)", // cyan
     "hsl(330 81% 60%)", // pink
];

interface Slice {
     label: string;
     value: number;
     color?: string;
}

function formatNumber(value: number): string {
     return value.toLocaleString();
}

/* ===========================================================================
 *  AreaChart — smooth area chart for time-series (e.g. monthly inquiries)
 * ======================================================================== */

interface AreaChartPoint {
     label: string;
     value: number;
}

interface AreaChartProps {
     data: AreaChartPoint[];
     height?: number;
     className?: string;
     color?: string;
     emptyMessage?: string;
}

export function AreaChart({
     data,
     height = 220,
     className,
     color = "hsl(221 83% 53%)",
     emptyMessage = "No data yet",
}: AreaChartProps) {
     const gradientId = useId();
     const width = 640;
     const padX = 16;
     const padY = 24;

     const values = data.map((d) => d.value);
     const max = Math.max(1, ...values);
     const min = 0;

     const innerW = width - padX * 2;
     const innerH = height - padY * 2;

     const points = data.map((d, i) => {
          const x = padX + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
          const y = padY + innerH - ((d.value - min) / (max - min)) * innerH;
          return { x, y, ...d };
     });

     const linePath = points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
          .join(" ");

     const areaPath =
          points.length > 0
               ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${padY + innerH} L ${points[0].x.toFixed(2)} ${padY + innerH} Z`
               : "";

     const gridLines = 4;

     if (data.length === 0 || values.every((v) => v === 0)) {
          return (
               <div
                    className={cn("flex items-center justify-center text-sm text-muted-foreground", className)}
                    style={{ height }}
               >
                    {emptyMessage}
               </div>
          );
     }

     return (
          <div className={cn("w-full", className)}>
               <svg
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                    className="h-auto w-full"
                    role="img"
                    aria-label="Area chart"
               >
                    <defs>
                         <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                         </linearGradient>
                    </defs>

                    {/* horizontal grid lines */}
                    {Array.from({ length: gridLines + 1 }).map((_, i) => {
                         const y = padY + (i / gridLines) * innerH;
                         return (
                              <line
                                   key={i}
                                   x1={padX}
                                   y1={y}
                                   x2={width - padX}
                                   y2={y}
                                   className="stroke-muted/40"
                                   strokeWidth={1}
                              />
                         );
                    })}

                    <path d={areaPath} fill={`url(#${gradientId})`} />
                    <path
                         d={linePath}
                         fill="none"
                         stroke={color}
                         strokeWidth={2.5}
                         strokeLinejoin="round"
                         strokeLinecap="round"
                         vectorEffect="non-scaling-stroke"
                    />

                    {points.map((p, i) => (
                         <g key={i}>
                              <circle cx={p.x} cy={p.y} r={3.5} fill={color} />
                              <title>{`${p.label}: ${formatNumber(p.value)}`}</title>
                         </g>
                    ))}
               </svg>

               <div className="mt-2 flex justify-between px-1 text-[10px] text-muted-foreground">
                    {data.map((d, i) => (
                         <span key={i} className="truncate">
                              {d.label}
                         </span>
                    ))}
               </div>
          </div>
     );
}

/* ===========================================================================
 *  DonutChart — donut/pie chart for distributions (e.g. property status)
 * ======================================================================== */

interface DonutChartProps {
     data: Slice[];
     size?: number;
     thickness?: number;
     centerLabel?: string;
     centerValue?: string | number;
     className?: string;
}

export function DonutChart({
     data,
     size = 200,
     thickness = 26,
     centerLabel,
     centerValue,
     className,
}: DonutChartProps) {
     const total = data.reduce((sum, s) => sum + s.value, 0);
     const radius = (size - thickness) / 2;
     const circumference = 2 * Math.PI * radius;
     const center = size / 2;

     let offset = 0;
     const segments = data.map((slice, i) => {
          const fraction = total > 0 ? slice.value / total : 0;
          const dash = fraction * circumference;
          const seg = {
               ...slice,
               color: slice.color ?? CHART_PALETTE[i % CHART_PALETTE.length],
               dash,
               gap: circumference - dash,
               offset: -offset,
          };
          offset += dash;
          return seg;
     });

     return (
          <div className={cn("flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6", className)}>
               <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
                    <g transform={`rotate(-90 ${center} ${center})`}>
                         <circle
                              cx={center}
                              cy={center}
                              r={radius}
                              fill="none"
                              strokeWidth={thickness}
                              className="stroke-muted/30"
                         />
                         {total > 0
                              ? segments.map((s, i) => (
                                   <circle
                                        key={i}
                                        cx={center}
                                        cy={center}
                                        r={radius}
                                        fill="none"
                                        stroke={s.color}
                                        strokeWidth={thickness}
                                        strokeDasharray={`${s.dash} ${s.gap}`}
                                        strokeDashoffset={s.offset}
                                        strokeLinecap="butt"
                                   >
                                        <title>{`${s.label}: ${formatNumber(s.value)}`}</title>
                                   </circle>
                              ))
                              : null}
                    </g>
                    {(centerValue !== undefined || centerLabel) && (
                         <text
                              x={center}
                              y={center}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-foreground"
                         >
                              {centerValue !== undefined && (
                                   <tspan x={center} dy="-0.2em" className="text-2xl font-bold">
                                        {typeof centerValue === "number" ? formatNumber(centerValue) : centerValue}
                                   </tspan>
                              )}
                              {centerLabel && (
                                   <tspan x={center} dy="1.4em" className="text-[10px] fill-muted-foreground">
                                        {centerLabel}
                                   </tspan>
                              )}
                         </text>
                    )}
               </svg>

               <ul className="flex w-full flex-col gap-2 text-sm">
                    {data.map((slice, i) => (
                         <li key={i} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-2">
                                   <span
                                        className="size-2.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: slice.color ?? CHART_PALETTE[i % CHART_PALETTE.length] }}
                                   />
                                   <span className="text-muted-foreground">{slice.label}</span>
                              </span>
                              <span className="font-medium tabular-nums">
                                   {formatNumber(slice.value)}
                                   {total > 0 && (
                                        <span className="ml-1 text-xs text-muted-foreground">
                                             ({Math.round((slice.value / total) * 100)}%)
                                        </span>
                                   )}
                              </span>
                         </li>
                    ))}
               </ul>
          </div>
     );
}

/* ===========================================================================
 *  RadialChart — radial/gauge chart for a single percentage metric
 * ======================================================================== */

interface RadialChartProps {
     value: number;
     max?: number;
     size?: number;
     thickness?: number;
     label?: string;
     color?: string;
     className?: string;
}

export function RadialChart({
     value,
     max = 100,
     size = 160,
     thickness = 16,
     label,
     color = "hsl(142 71% 45%)",
     className,
}: RadialChartProps) {
     const radius = (size - thickness) / 2;
     const circumference = 2 * Math.PI * radius;
     const center = size / 2;
     const fraction = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
     const dash = fraction * circumference;

     return (
          <div className={cn("flex flex-col items-center gap-2", className)}>
               <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <g transform={`rotate(-90 ${center} ${center})`}>
                         <circle
                              cx={center}
                              cy={center}
                              r={radius}
                              fill="none"
                              strokeWidth={thickness}
                              className="stroke-muted/30"
                         />
                         <circle
                              cx={center}
                              cy={center}
                              r={radius}
                              fill="none"
                              stroke={color}
                              strokeWidth={thickness}
                              strokeDasharray={`${dash} ${circumference - dash}`}
                              strokeLinecap="round"
                         />
                    </g>
                    <text
                         x={center}
                         y={center}
                         textAnchor="middle"
                         dominantBaseline="middle"
                         className="fill-foreground text-2xl font-bold"
                    >
                         {Math.round(fraction * 100)}%
                    </text>
               </svg>
               {label && <span className="text-xs text-muted-foreground">{label}</span>}
          </div>
     );
}

/* ===========================================================================
 *  ChartCard — wrapper card with title/description for a chart
 * ======================================================================== */

interface ChartCardProps {
     title: string;
     description?: string;
     action?: React.ReactNode;
     children: React.ReactNode;
     className?: string;
}

export function ChartCard({ title, description, action, children, className }: ChartCardProps) {
     return (
          <Card className={className}>
               <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                         <CardTitle className="text-base tracking-tight">{title}</CardTitle>
                         {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    {action}
               </CardHeader>
               <CardContent>{children}</CardContent>
          </Card>
     );
}
