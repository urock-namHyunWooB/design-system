/**
 * DSL로부터 스타일 코드 생성
 */

import type { DSLData } from "@repo/core";

interface StyleOptions {
  useCSS?: boolean;
  useTailwind?: boolean;
}

/**
 * 스타일 함수 생성
 */
export function generateStyles(
  dslData: DSLData,
  options: StyleOptions = {}
): string {
  const { useCSS = false, useTailwind = false } = options;

  return generateTailwindClasses(dslData);
}

/**
 * Tailwind CSS 클래스 생성 함수
 */
function generateTailwindClasses(dslData: DSLData): string {
  const lines: string[] = [];

  lines.push("/**");
  lines.push(" * Tailwind CSS 클래스 유틸리티");
  lines.push(" */");
  lines.push(
    "function cn(...classes: Array<string | undefined | false>): string {"
  );
  lines.push('  return classes.filter(Boolean).join(" ");');
  lines.push("}");
  lines.push("");

  // Base styles
  lines.push("function getBaseStyles(): string {");
  lines.push(
    '  return "inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";'
  );
  lines.push("}");
  lines.push("");

  // Size styles
  if (dslData.sizes) {
    lines.push(`function getSizeStyles(size: string): string {`);
    lines.push("  switch (size) {");

    for (const [sizeName, sizeData] of Object.entries(dslData.sizes)) {
      const classes: string[] = [];

      if (sizeData.container?.height) {
        classes.push(`h-[${sizeData.container.height}px]`);
      }
      if (sizeData.container?.radius) {
        classes.push(`rounded-[${sizeData.container.radius}px]`);
      }
      if (sizeData.padding) {
        const { top, left } = sizeData.padding;
        classes.push(`py-[${top}px] px-[${left}px]`);
      }
      if (sizeData.label?.size) {
        classes.push(`text-[${sizeData.label.size}px]`);
      }
      if (sizeData.gap) {
        classes.push(`gap-[${sizeData.gap}px]`);
      }

      lines.push(`    case "${sizeName}":`);
      lines.push(`      return "${classes.join(" ")}";`);
    }

    lines.push("    default:");
    lines.push(`      return "";`);
    lines.push("  }");
    lines.push("}");
    lines.push("");
  }

  // Variant styles
  if (dslData.types) {
    lines.push(`function getVariantStyles(variant: string): string {`);
    lines.push("  switch (variant) {");

    for (const [variantName, variantData] of Object.entries(dslData.types)) {
      const classes: string[] = [];

      if (variantData.container?.bg) {
        classes.push(`bg-[${variantData.container.bg.color}]`);
      }
      if (
        variantData.container?.border &&
        variantData.container.border.width > 0
      ) {
        classes.push(`border-[${variantData.container.border.width}px]`);
        if (
          variantData.container.border.color &&
          variantData.container.border.color !== "transparent"
        ) {
          classes.push(`border-[${variantData.container.border.color}]`);
        }
      }
      if (variantData.label?.color) {
        classes.push(`text-[${variantData.label.color}]`);
      }

      lines.push(`    case "${variantName}":`);
      lines.push(`      return "${classes.join(" ")}";`);
    }

    lines.push("    default:");
    lines.push(`      return "";`);
    lines.push("  }");
    lines.push("}");
  }

  return lines.join("\n");
}
