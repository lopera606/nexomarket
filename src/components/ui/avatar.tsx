"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  image?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gradient";
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getGradientColor = (name: string): string => {
  const colors = [
    "from-[#0066FF] to-cyan-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-[#0066FF] to-blue-400",
    "from-pink-500 to-red-500",
    "from-yellow-500 to-orange-500",
    "from-teal-500 to-blue-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      name = "User",
      image,
      size = "md",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    };

    const initials = getInitials(name);
    const gradientColor = getGradientColor(name);

    if (image) {
      return (
        <img
          src={image}
          alt={name}
          className={cn(
            "rounded-full object-cover",
            sizeStyles[size],
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-full font-semibold",
          "text-white",
          variant === "gradient"
            ? `bg-gradient-to-br ${gradientColor}`
            : "bg-gray-300",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {initials}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
