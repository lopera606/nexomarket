"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showShortcut?: boolean;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, showShortcut = true, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            ref={ref}
            type="text"
            className={cn(
              "w-full pl-10 pr-3 py-2 rounded-lg border",
              "bg-white",
              "border-gray-200",
              "text-gray-900",
              "placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]",
              "transition-colors",
              className
            )}
            {...props}
          />
          {showShortcut && (
            <span className="absolute right-3 px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded pointer-events-none">
              Ctrl K
            </span>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
