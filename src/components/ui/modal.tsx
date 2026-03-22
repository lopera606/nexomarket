"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, className, overlayClassName }, ref) => {
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          "bg-black/30",
          "transition-opacity duration-200",
          overlayClassName
        )}
        onClick={onClose}
      >
        <div
          ref={ref}
          className={cn(
            "relative w-full max-w-md mx-4 p-6 rounded-2xl",
            "bg-white",
            "border border-gray-100",
            "shadow-[0_2px_60px_rgba(0,0,0,0.03)]",
            "animate-in fade-in zoom-in-95 duration-200",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = "Modal";

export { Modal };
