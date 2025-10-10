import type { DSLData, TransformOptions } from "@repo/core/types";
import { generateStyles } from "./styleGenerator";

interface AssembleOptions {
  componentName: string;
  propsInterface: string;
  styleCode: string;
  componentBody: string;
  exportStyle: boolean;
  useCSS: boolean;
  outputFileName?: string | null;
}

/**
 * DSL 데이터로부터 React 컴포넌트 코드 생성
 */
export function generateComponent(
  dslData: DSLData,
  options: TransformOptions = {}
): string {
  const {
    useCSS = false,
    useTailwind = false,
    outputFileName = null,
  } = options;

  const componentName = capitalizeFirst(dslData.component);

  // TypeScript 인터페이스 생성
  const propsInterface = generatePropsInterface(dslData, componentName);

  // 스타일 코드 생성
  const styleCode = generateStyles(dslData, { useCSS, useTailwind });

  // 컴포넌트 본문 생성
  const componentBody = generateComponentBody(dslData, componentName, {
    useCSS,
    useTailwind,
  });

  // 전체 코드 조합
  return assembleComponent({
    componentName,
    propsInterface,
    styleCode,
    componentBody,
    exportStyle: true,
    useCSS,
    outputFileName,
  });
}

/**
 * Props 인터페이스 생성
 */
function generatePropsInterface(
  dslData: DSLData,
  componentName: string
): string {
  const lines: string[] = [];

  // Size 타입
  if (dslData.sizes) {
    const sizeOptions = Object.keys(dslData.sizes)
      .map((s) => `"${s}"`)
      .join(" | ");
    lines.push(`type ${componentName}Size = ${sizeOptions};`);
  }

  // Type/Variant 타입
  if (dslData.types) {
    const typeOptions = Object.keys(dslData.types)
      .map((t) => `"${t}"`)
      .join(" | ");
    lines.push(`type ${componentName}Variant = ${typeOptions};`);
  }

  // Props 인터페이스
  lines.push("");
  lines.push(`export interface ${componentName}Props`);
  lines.push(
    `  extends Omit<React.${getHTMLElementType(dslData.component)}, "className"> {`
  );
  lines.push("  className?: string;");

  if (dslData.sizes) {
    lines.push(`  size?: ${componentName}Size;`);
  }

  if (dslData.types) {
    lines.push(`  variant?: ${componentName}Variant;`);
  }

  // 아이콘 지원
  if (hasIconSupport(dslData)) {
    lines.push("  leftIcon?: React.ReactNode;");
    lines.push("  rightIcon?: React.ReactNode;");
  }

  lines.push("}");

  return lines.join("\n");
}

/**
 * 컴포넌트 본문 생성
 */
function generateComponentBody(
  dslData: DSLData,
  componentName: string,
  options: { useCSS?: boolean; useTailwind?: boolean }
): string {
  const { useCSS, useTailwind } = options;
  const htmlElement = getHTMLElementName(dslData.component);
  const hasIcons = hasIconSupport(dslData);

  const defaultSize = dslData.sizes
    ? Object.keys(dslData.sizes)[1] || Object.keys(dslData.sizes)[0]
    : null;
  const defaultVariant = dslData.types ? Object.keys(dslData.types)[0] : null;

  const lines: string[] = [];

  // 컴포넌트 선언
  lines.push(
    `export const ${componentName} = forwardRef<HTML${capitalizeFirst(htmlElement)}Element, ${componentName}Props>(`
  );
  lines.push("  (");
  lines.push("    {");
  lines.push("      children,");
  lines.push("      className,");

  if (defaultSize) {
    lines.push(`      size = "${defaultSize}",`);
  }
  if (defaultVariant) {
    lines.push(`      variant = "${defaultVariant}",`);
  }
  if (hasIcons) {
    lines.push("      leftIcon,");
    lines.push("      rightIcon,");
  }

  lines.push("      ...rest");
  lines.push("    },");
  lines.push("    ref");
  lines.push("  ) => {");

  // 스타일 계산 로직
  if (useTailwind) {
    lines.push("    const classes = cn(");
    lines.push("      getBaseStyles(),");
    if (defaultSize) lines.push("      getSizeStyles(size),");
    if (defaultVariant) lines.push("      getVariantStyles(variant),");
    lines.push("      className");
    lines.push("    );");
  } else if (useCSS) {
    lines.push("    const styleClasses = [");
    lines.push("      styles.base,");
    if (defaultSize) lines.push("      styles[`size-${size}`],");
    if (defaultVariant) lines.push("      styles[`variant-${variant}`],");
    lines.push("      className");
    lines.push('    ].filter(Boolean).join(" ");');
  } else {
    lines.push("    const inlineStyles = {");
    lines.push("      ...getBaseStyles(),");
    if (defaultSize) lines.push("      ...getSizeStyles(size),");
    if (defaultVariant) lines.push("      ...getVariantStyles(variant),");
    lines.push("    };");
  }

  // Accessibility 속성
  const a11y = dslData.accessibility || {};

  // JSX 반환
  lines.push("");
  lines.push("    return (");
  lines.push(`      <${htmlElement}`);
  lines.push("        ref={ref}");

  if (useTailwind || useCSS) {
    lines.push(`        className={${useCSS ? "styleClasses" : "classes"}}`);
  } else {
    lines.push("        style={inlineStyles}");
  }

  if (a11y.role) {
    lines.push(`        role="${a11y.role}"`);
  }
  if (typeof a11y.tabIndex === "number") {
    lines.push(`        tabIndex={${a11y.tabIndex}}`);
  }

  lines.push("        {...rest}");
  lines.push("      >");

  if (hasIcons) {
    lines.push(
      '        {leftIcon && <span className="icon-left">{leftIcon}</span>}'
    );
    lines.push("        {children}");
    lines.push(
      '        {rightIcon && <span className="icon-right">{rightIcon}</span>}'
    );
  } else {
    lines.push("        {children}");
  }

  lines.push(`      </${htmlElement}>`);
  lines.push("    );");
  lines.push("  }");
  lines.push(");");
  lines.push("");
  lines.push(`${componentName}.displayName = "${componentName}";`);

  return lines.join("\n");
}

/**
 * 전체 컴포넌트 코드 조합
 */
function assembleComponent(options: AssembleOptions): string {
  const {
    componentName,
    propsInterface,
    styleCode,
    componentBody,
    useCSS,
    outputFileName,
  } = options;

  const parts: string[] = [];

  // 헤더
  parts.push('"use client";\n');
  parts.push('import React, { forwardRef } from "react";');

  if (useCSS && outputFileName) {
    // 파일명에서 확장자 제거하고 .module.css 추가
    const cssFileName = outputFileName.replace(/\.tsx?$/, ".module.css");
    parts.push(`import styles from "./${cssFileName}";`);
  } else if (useCSS) {
    parts.push(
      `import styles from "./${componentName.toLowerCase()}.module.css";`
    );
  }

  parts.push("");

  // 타입 정의
  parts.push(propsInterface);
  parts.push("");

  // 스타일 함수들
  if (styleCode) {
    parts.push(styleCode);
    parts.push("");
  }

  // 컴포넌트
  parts.push(componentBody);

  return parts.join("\n");
}

/**
 * HTML 요소 타입 추론
 */
function getHTMLElementType(componentType: string): string {
  const map: Record<string, string> = {
    button: "ButtonHTMLAttributes<HTMLButtonElement>",
    input: "InputHTMLAttributes<HTMLInputElement>",
    link: "AnchorHTMLAttributes<HTMLAnchorElement>",
    card: "HTMLAttributes<HTMLDivElement>",
  };

  return map[componentType] || "HTMLAttributes<HTMLDivElement>";
}

/**
 * HTML 요소 이름 추론
 */
function getHTMLElementName(componentType: string): string {
  const map: Record<string, string> = {
    button: "button",
    input: "input",
    link: "a",
    card: "div",
  };

  return map[componentType] || "div";
}

/**
 * 아이콘 지원 여부 확인
 */
function hasIconSupport(dslData: DSLData): boolean {
  if (!dslData.sizes) return false;

  for (const sizeData of Object.values(dslData.sizes)) {
    if (sizeData.icon) return true;
  }

  return false;
}

/**
 * 첫 글자 대문자로 변환
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
