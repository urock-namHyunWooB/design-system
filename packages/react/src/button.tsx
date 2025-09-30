"use client";

import React, { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function getVariantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "secondary":
      return "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 active:bg-gray-100";
    case "ghost":
      return "bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200";
    case "destructive":
      return "bg-red-600 text-white hover:bg-red-700 active:bg-red-800";
    case "primary":
    default:
      return "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700";
  }
}

function getSizeClasses(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "h-8 px-3 text-sm";
    case "lg":
      return "h-12 px-6 text-base";
    case "md":
    default:
      return "h-10 px-4 text-sm";
  }
}

function mergeClassNames(
  ...classNames: Array<string | undefined | false>
): string {
  return classNames.filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      disabled,
      loading = false,
      leftIcon,
      rightIcon,
      ...rest
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-60 gap-2";

    const classes = mergeClassNames(
      baseStyles,
      getVariantClasses(variant),
      getSizeClasses(size),
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...rest}
      >
        {leftIcon ? (
          <span className="inline-flex items-center">{leftIcon}</span>
        ) : null}
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="size-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="sr-only">Loading</span>
          </span>
        ) : (
          children
        )}
        {rightIcon ? (
          <span className="inline-flex items-center">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";
