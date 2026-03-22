"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

    const variantStyles = {
      default:
        "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus-visible:ring-[#0066FF]/20",
      primary:
        "bg-[#0066FF] text-white hover:bg-[#0052CC] focus-visible:ring-[#0066FF]/30",
      outline:
        "border border-gray-200 text-gray-900 hover:bg-gray-50 focus-visible:ring-[#0066FF]/20",
      ghost:
        "text-gray-900 hover:bg-gray-50 focus-visible:ring-[#0066FF]/20",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
