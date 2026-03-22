"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "purple" | "blue" | "green" | "amber" | "red";
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      icon,
      value,
      label,
      trend,
      color = "blue",
      ...props
    },
    ref
  ) => {
    const colorStyles = {
      purple: {
        bg: "bg-[#0066FF]/5",
        icon: "text-[#0066FF]",
        accent: "text-[#0066FF]",
      },
      blue: {
        bg: "bg-[#0066FF]/5",
        icon: "text-[#0066FF]",
        accent: "text-[#0066FF]",
      },
      green: {
        bg: "bg-green-50",
        icon: "text-green-600",
        accent: "text-green-700",
      },
      amber: {
        bg: "bg-amber-50",
        icon: "text-amber-600",
        accent: "text-amber-700",
      },
      red: {
        bg: "bg-red-50",
        icon: "text-red-600",
        accent: "text-red-700",
      },
    };

    const styles = colorStyles[color];

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border p-6",
          "bg-white",
          "border-gray-100",
          "shadow-[0_2px_60px_rgba(0,0,0,0.03)]",
          "transition-all hover:shadow-[0_4px_80px_rgba(0,0,0,0.05)] hover:scale-[1.02]",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div className={cn("p-2 rounded-lg", styles.bg, styles.icon)}>
              {icon}
            </div>
          )}
        </div>

        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">
            {label}
          </p>
          <div className="flex items-end gap-2">
            <h3 className={cn("text-3xl font-bold", styles.accent)}>
              {value}
            </h3>
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-semibold mb-1",
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard };
