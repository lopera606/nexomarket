"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
  showPercentage?: boolean;
  color?: "blue" | "green" | "red" | "amber" | "purple";
  size?: "sm" | "md" | "lg";
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      label,
      showPercentage = true,
      color = "blue",
      size = "md",
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(value, 0), 100);

    const colorStyles = {
      blue: "bg-[#0066FF]",
      green: "bg-green-600",
      red: "bg-red-600",
      amber: "bg-amber-600",
      purple: "bg-[#0066FF]",
    };

    const sizeStyles = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {(label || showPercentage) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <span className="text-sm font-medium text-gray-700">
                {label}
              </span>
            )}
            {showPercentage && (
              <span className="text-sm font-semibold text-gray-600">
                {clampedValue}%
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            "w-full rounded-full overflow-hidden",
            "bg-gray-200",
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              colorStyles[color]
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
