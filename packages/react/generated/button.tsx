"use client";

import React, { forwardRef } from "react";

type ButtonSize = "S" | "M" | "L";
type ButtonVariant = "filled" | "outlined-black" | "outlined-blue" | "outlined-red" | "text-blue" | "text-black" | "filled-red";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Tailwind CSS 클래스 유틸리티
 */
function cn(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

function getBaseStyles(): string {
  return "inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
}

function getSizeStyles(size: string): string {
  switch (size) {
    case "S":
      return "h-[28px] rounded-[8px] py-[4px] px-[8px] text-[13px]";
    case "M":
      return "h-[40px] rounded-[10px] py-[8px] px-[12px] text-[14px] gap-[2px]";
    case "L":
      return "h-[56px] rounded-[12px] py-[16px] px-[28px] text-[16px] gap-[4px]";
    default:
      return "";
  }
}

function getVariantStyles(variant: string): string {
  switch (variant) {
    case "filled":
      return "bg-[#628cf5] text-[#ffffff]";
    case "outlined-black":
      return "bg-[#ffffff] border-[2px] border-[#ededed] text-[#1a1a1a]";
    case "outlined-blue":
      return "bg-[#ffffff] border-[2px] border-[#628cf5] text-[#628cf5]";
    case "outlined-red":
      return "bg-[#ffffff] border-[2px] border-[#ff8484] text-[#ee4c54]";
    case "text-blue":
      return "bg-[#ffffff] text-[#628cf5]";
    case "text-black":
      return "bg-[transparent] text-[#1a1a1a]";
    case "filled-red":
      return "bg-[#ff8484] text-[#ffffff]";
    default:
      return "";
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      size = "M",
      variant = "filled",
      leftIcon,
      rightIcon,
      ...rest
    },
    ref
  ) => {
    const classes = cn(
      getBaseStyles(),
      getSizeStyles(size),
      getVariantStyles(variant),
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        role="button"
        tabIndex={0}
        {...rest}
      >
        {leftIcon && <span className="icon-left">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="icon-right">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";