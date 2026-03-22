"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-gray-100 text-gray-700",
      success:
        "bg-green-100 text-green-700",
      warning:
        "bg-amber-100 text-amber-700",
      danger: "bg-red-100 text-red-700",
      info: "bg-[#0066FF]/10 text-[#0066FF]",
      purple:
        "bg-[#0066FF]/10 text-[#0066FF]",
    };

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors",
          variantStyles[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
