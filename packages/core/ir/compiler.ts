/**
 * DSL to IR Compiler
 *
 * DSL 정의를 읽어서 플랫폼 독립적인 IR로 변환
 *
 * @module ir/compiler
 */

import type { BaseDSL } from "../types/base";
import type {
  ComponentIR,
  ComponentMetadata,
  TokenInfo,
  StructureDefinition,
  BaseStructure,
  IRPartDefinition,
  PartTreeNode,
  StructureVariants,
  LayeredStyles,
  SizeStyleLayer,
  VariantStyleLayer,
  InteractionStyleLayer,
  ResponsiveStyleLayer,
  StyleRules,
  AnimationDefinitions,
  ComponentPropsSchema,
  AttributeRules,
  ValidationRules,
  AccessibilityMetadata,
} from "./types";

// ============================================================================
// Compiler Options
// ============================================================================

export interface CompilerOptions {
  /** IR 버전 */
  version?: string;

  /** 토큰 해석 여부 */
  resolveTokens?: boolean;

  /** 토큰 소스 (디자인 토큰 파일 경로) */
  tokenSource?: string;

  /** 검증 활성화 */
  validate?: boolean;

  /** 최적화 활성화 */
  optimize?: boolean;
}

export interface CompilerContext {
  /** 원본 DSL */
  dsl: BaseDSL<any, any, any>;

  /** 컴파일러 옵션 */
  options: CompilerOptions;

  /** 에러 수집 */
  errors: CompilerError[];

  /** 경고 수집 */
  warnings: CompilerWarning[];
}

export interface CompilerError {
  type: "error";
  message: string;
  path?: string;
  line?: number;
}

export interface CompilerWarning {
  type: "warning";
  message: string;
  path?: string;
}

// ============================================================================
// Main Compiler
// ============================================================================

/**
 * DSL을 IR로 컴파일
 */
export function compile(
  dsl: BaseDSL<any, any, any>,
  options: CompilerOptions = {}
): ComponentIR {
  const ctx: CompilerContext = {
    dsl,
    options: {
      version: "1.0.0",
      resolveTokens: false,
      validate: true,
      optimize: false,
      ...options,
    },
    errors: [],
    warnings: [],
  };

  try {
    // Phase 1: Metadata 생성
    const metadata = compileMetadata(ctx);

    // Phase 2: Token 정보 수집
    const tokens = compileTokens(ctx);

    // Phase 3: Structure 변환
    const structure = compileStructure(ctx);

    // Phase 4: Styles 변환
    const styles = compileStyles(ctx);

    // Phase 5: Style Rules 생성
    const styleRules = compileStyleRules(ctx);

    // Phase 6: Animations 변환
    const animations = compileAnimations(ctx);

    // Phase 7: Props Schema 생성
    const propsSchema = compilePropsSchema(ctx);

    // Phase 8: Attributes 생성
    const attributes = compileAttributes(ctx);

    // Phase 9: Validation Rules 생성
    const validation = compileValidation(ctx);

    // Phase 10: Accessibility 변환
    const accessibility = compileAccessibility(ctx);

    const ir: ComponentIR = {
      metadata,
      tokens,
      structure,
      styles,
      styleRules,
      animations,
      propsSchema,
      attributes,
      validation,
      accessibility,
    };

    // 검증
    if (ctx.options.validate) {
      validateIR(ir, ctx);
    }

    // 에러가 있으면 throw
    if (ctx.errors.length > 0) {
      throw new CompilationError(ctx.errors, ctx.warnings);
    }

    return ir;
  } catch (error) {
    if (error instanceof CompilationError) {
      throw error;
    }
    throw new CompilationError(
      [
        {
          type: "error",
          message: error instanceof Error ? error.message : String(error),
        },
      ],
      ctx.warnings
    );
  }
}

// ============================================================================
// Phase Compilers
// ============================================================================

/**
 * Phase 1: Metadata 생성
 */
function compileMetadata(ctx: CompilerContext): ComponentMetadata {
  const { dsl } = ctx;

  // Sizes 추출
  const availableSizes = dsl.sizes ? Object.keys(dsl.sizes) : [];

  // Variants 추출
  const availableVariants = dsl.types ? Object.keys(dsl.types) : [];

  // States 추출
  const availableStates = dsl.interactions
    ? Object.keys(dsl.interactions)
    : ["default"];

  // 기본값 결정
  const defaultSize = availableSizes[0] || "M";
  const defaultVariant = availableVariants[0] || "default";

  return {
    component: dsl.component,
    version: ctx.options.version || "1.0.0",
    generatedAt: new Date().toISOString(),
    availableSizes,
    availableVariants,
    availableStates,
    defaults: {
      size: defaultSize,
      variant: defaultVariant,
    },
    complexity: "simple", // Phase 1은 simple만
  };
}

/**
 * Phase 2: Token 정보 수집
 */
function compileTokens(ctx: CompilerContext): TokenInfo {
  const { dsl } = ctx;
  const usedTokens = new Set<string>();

  // DSL을 순회하며 토큰 참조 찾기
  function findTokens(obj: any) {
    if (typeof obj === "string" && obj.startsWith("{") && obj.endsWith("}")) {
      usedTokens.add(obj);
    } else if (typeof obj === "object" && obj !== null) {
      for (const value of Object.values(obj)) {
        findTokens(value);
      }
    }
  }

  findTokens(dsl);

  return {
    used: Array.from(usedTokens).sort(),
    // TODO: 토큰 해석 로직 추가
    resolved: undefined,
    unresolved: Array.from(usedTokens).sort(),
  };
}

/**
 * Phase 3: Structure 변환
 */
function compileStructure(ctx: CompilerContext): StructureDefinition {
  const { dsl } = ctx;

  if (!dsl.structure) {
    ctx.errors.push({
      type: "error",
      message: "DSL must have 'structure' field",
    });
    throw new Error("DSL must have structure");
  }

  // Base structure 변환
  const base = compileBaseStructure(ctx);

  // Variants (현재는 빈 객체, 나중에 확장)
  const variants: StructureVariants = {
    visibility: {},
    modifications: [],
  };

  return {
    base,
    variants,
  };
}

/**
 * Base Structure 변환
 */
function compileBaseStructure(ctx: CompilerContext): BaseStructure {
  const { dsl } = ctx;
  const { structure } = dsl;

  if (!structure) {
    throw new Error("Structure is required");
  }

  // Parts 변환
  const parts: Record<string, IRPartDefinition> = {};
  for (const [partId, partDef] of Object.entries(structure.parts)) {
    parts[partId] = {
      type: partDef.type,
      slotType: partDef.slotType,
      required: partDef.required ?? false,
      description: partDef.description,
      exposedAsProp: partDef.type === "slot", // Slot은 prop으로 노출
      renderStrategy: "normal",
    };
  }

  // Hierarchy 변환
  const hierarchy = compileHierarchy(ctx, structure.hierarchy, parts);

  return {
    layout: structure.layout,
    parts,
    hierarchy,
  };
}

/**
 * Hierarchy 변환
 */
function compileHierarchy(
  ctx: CompilerContext,
  hierarchy: any,
  parts: Record<string, IRPartDefinition>
): { root: string; tree: PartTreeNode } {
  // Root 찾기
  let rootId: string | null = null;
  for (const [partId, def] of Object.entries(hierarchy)) {
    if ((def as any).parent === null) {
      rootId = partId;
      break;
    }
  }

  if (!rootId) {
    ctx.errors.push({
      type: "error",
      message: "No root part found in hierarchy",
    });
    throw new Error("No root part");
  }

  // Tree 구축
  function buildTree(partId: string): PartTreeNode {
    const def = hierarchy[partId];
    const children: PartTreeNode[] = [];

    if (def?.children) {
      for (const childId of def.children) {
        children.push(buildTree(childId));
      }
    }

    return {
      id: partId,
      children,
    };
  }

  return {
    root: rootId,
    tree: buildTree(rootId),
  };
}

/**
 * Phase 4: Styles 변환
 */
function compileStyles(ctx: CompilerContext): LayeredStyles {
  const { dsl } = ctx;

  // Sizes 레이어
  const sizes: Record<string, SizeStyleLayer> = {};
  if (dsl.sizes) {
    for (const [sizeKey, sizeSpec] of Object.entries(dsl.sizes)) {
      sizes[sizeKey] = compileSizeLayer(ctx, sizeSpec);
    }
  }

  // Variants 레이어
  const variants: Record<string, VariantStyleLayer> = {};
  if (dsl.types) {
    for (const [variantKey, variantSpec] of Object.entries(dsl.types)) {
      variants[variantKey] = compileVariantLayer(ctx, variantSpec);
    }
  }

  // Interactions 레이어
  const interactions: InteractionStyleLayer = {};
  if (dsl.interactions) {
    for (const [stateKey, stateSpec] of Object.entries(dsl.interactions)) {
      interactions[stateKey] = {
        parts: stateSpec as any, // TODO: 타입 변환
        animation: undefined, // TODO: motion 매핑
      };
    }
  }

  // Responsive 레이어
  const responsive: ResponsiveStyleLayer = {};
  if (dsl.responsive) {
    for (const [breakpoint, breakpointSpec] of Object.entries(dsl.responsive)) {
      responsive[breakpoint] = {
        sizes: breakpointSpec as any, // TODO: 타입 변환
      };
    }
  }

  return {
    sizes,
    variants,
    interactions,
    responsive,
  };
}

/**
 * Size 레이어 컴파일
 */
function compileSizeLayer(ctx: CompilerContext, sizeSpec: any): SizeStyleLayer {
  const parts: Record<string, any> = {};

  for (const [partId, partStyle] of Object.entries(sizeSpec)) {
    if (
      typeof partStyle === "object" &&
      partStyle !== null &&
      "style" in partStyle
    ) {
      const style = (partStyle as any).style;

      // 스타일을 카테고리별로 분류
      parts[partId] = {
        layout: extractLayoutProperties(style),
        spacing: extractSpacingProperties(style),
        typography: extractTypographyProperties(style),
        flexbox: extractFlexboxProperties(style),
      };
    }
  }

  return { parts };
}

/**
 * Variant 레이어 컴파일
 */
function compileVariantLayer(
  ctx: CompilerContext,
  variantSpec: any
): VariantStyleLayer {
  const parts: Record<string, any> = {};

  for (const [partId, partStyle] of Object.entries(variantSpec)) {
    if (
      typeof partStyle === "object" &&
      partStyle !== null &&
      "style" in partStyle
    ) {
      const style = (partStyle as any).style;

      parts[partId] = {
        colors: extractColorProperties(style),
        borders: extractBorderProperties(style),
        effects: extractEffectProperties(style),
        typography: extractTypographyProperties(style, ["fontWeight"]),
      };
    }
  }

  return { parts };
}

// ============================================================================
// Style Property Extractors
// ============================================================================

function extractLayoutProperties(style: any) {
  const props: any = {};
  const layoutKeys = [
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "borderRadius",
  ];
  for (const key of layoutKeys) {
    if (key in style) props[key] = style[key];
  }
  return Object.keys(props).length > 0 ? props : undefined;
}

function extractSpacingProperties(style: any) {
  const props: any = {};
  const spacingKeys = [
    "padding",
    "paddingVertical",
    "paddingHorizontal",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "margin",
    "marginVertical",
    "marginHorizontal",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
    "gap",
  ];
  for (const key of spacingKeys) {
    if (key in style) props[key] = style[key];
  }
  return Object.keys(props).length > 0 ? props : undefined;
}

function extractTypographyProperties(style: any, filter?: string[]) {
  const props: any = {};
  const typoKeys = [
    "fontSize",
    "lineHeight",
    "letterSpacing",
    "fontWeight",
    "fontFamily",
    "textAlign",
  ];
  const keysToUse = filter || typoKeys;
  for (const key of keysToUse) {
    if (key in style) props[key] = style[key];
  }
  return Object.keys(props).length > 0 ? props : undefined;
}

function extractColorProperties(style: any) {
  const props: any = {};
  if ("backgroundColor" in style) props.background = style.backgroundColor;
  if ("color" in style) props.foreground = style.color;
  if ("borderColor" in style) props.border = style.borderColor;
  return Object.keys(props).length > 0 ? props : undefined;
}

function extractBorderProperties(style: any) {
  const props: any = {};
  if ("borderWidth" in style) props.width = style.borderWidth;
  if ("borderStyle" in style) props.style = style.borderStyle;
  if ("borderColor" in style) props.color = style.borderColor;
  return Object.keys(props).length > 0 ? props : undefined;
}

function extractEffectProperties(style: any) {
  const props: any = {};
  const effectKeys = [
    "elevation",
    "opacity",
    "shadow",
    "blur",
    "scale",
    "rotate",
    "translateX",
    "translateY",
  ];
  for (const key of effectKeys) {
    if (key in style) props[key] = style[key];
  }
  return Object.keys(props).length > 0 ? props : undefined;
}

function extractFlexboxProperties(style: any) {
  const props: any = {};
  const flexKeys = [
    "flexDirection",
    "justifyContent",
    "alignItems",
    "alignSelf",
    "flex",
    "flexWrap",
  ];
  for (const key of flexKeys) {
    if (key in style) props[key] = style[key];
  }
  return Object.keys(props).length > 0 ? props : undefined;
}

/**
 * Phase 5: Style Rules 생성
 */
function compileStyleRules(ctx: CompilerContext): StyleRules {
  return {
    undefinedPartBehavior: "no-style",
    mergeStrategy: {
      priority: {
        base: 0,
        size: 10,
        variant: 20,
        responsive: 30,
        interaction: 40,
      },
      mergeType: "deep",
    },
  };
}

/**
 * Phase 6: Animations 변환
 */
function compileAnimations(ctx: CompilerContext): AnimationDefinitions {
  const { dsl } = ctx;

  if (!dsl.motion) {
    return {};
  }

  return dsl.motion as AnimationDefinitions;
}

/**
 * Phase 7: Props Schema 생성
 */
function compilePropsSchema(ctx: CompilerContext): ComponentPropsSchema {
  const { dsl } = ctx;
  const required: string[] = [];
  const optional: string[] = [];
  const types: Record<string, any> = {};

  // Structure에서 slot 추출
  if (dsl.structure) {
    for (const [partId, partDef] of Object.entries(dsl.structure.parts)) {
      if (partDef.type === "slot") {
        if (partDef.required) {
          required.push(partId);
        } else {
          optional.push(partId);
        }

        // Slot 타입 정의
        types[partId] = {
          type: "node",
          role: "content",
          description: partDef.description,
        };
      }
    }
  }

  // Size prop
  const availableSizes = dsl.sizes ? Object.keys(dsl.sizes) : [];
  if (availableSizes.length > 0) {
    optional.push("size");
    types.size = {
      type: "union",
      unionValues: availableSizes,
      role: "style-modifier",
    };
  }

  // Variant prop
  const availableVariants = dsl.types ? Object.keys(dsl.types) : [];
  if (availableVariants.length > 0) {
    optional.push("variant");
    types.variant = {
      type: "union",
      unionValues: availableVariants,
      role: "style-modifier",
    };
  }

  return {
    required,
    optional,
    types,
    extends: ["HTMLButtonAttributes"], // TODO: 컴포넌트 타입별로 결정
  };
}

/**
 * Phase 8: Attributes 생성
 */
function compileAttributes(ctx: CompilerContext): AttributeRules {
  // Phase 1에서는 기본 attributes만
  return {};
}

/**
 * Phase 9: Validation Rules 생성
 */
function compileValidation(ctx: CompilerContext): ValidationRules {
  // Phase 1에서는 기본 validation만
  return {
    incompatible: [],
    requirements: [],
    constraints: [],
  };
}

/**
 * Phase 10: Accessibility 변환
 */
function compileAccessibility(ctx: CompilerContext): AccessibilityMetadata {
  const { dsl } = ctx;

  if (!dsl.accessibility) {
    return {
      role: "button", // 기본값
    };
  }

  return {
    role: dsl.accessibility.role || "button",
    tabIndex: dsl.accessibility.tabIndex,
    minSize: dsl.accessibility.minSize,
    ariaAttributes: {
      ...(dsl.accessibility.ariaLabel && {
        "aria-label": dsl.accessibility.ariaLabel,
      }),
      ...(dsl.accessibility.ariaDisabled !== undefined && {
        "aria-disabled": dsl.accessibility.ariaDisabled,
      }),
    },
    keyboardShortcuts: dsl.accessibility.keyboard,
  };
}

// ============================================================================
// Validation
// ============================================================================

function validateIR(ir: ComponentIR, ctx: CompilerContext): void {
  // 기본 필드 검증
  if (!ir.metadata.component) {
    ctx.errors.push({
      type: "error",
      message: "Component name is required",
    });
  }

  if (!ir.structure.base.parts) {
    ctx.errors.push({
      type: "error",
      message: "Parts definition is required",
    });
  }

  // TODO: 더 많은 검증 추가
}

// ============================================================================
// Error Handling
// ============================================================================

export class CompilationError extends Error {
  constructor(
    public errors: CompilerError[],
    public warnings: CompilerWarning[]
  ) {
    const errorMessages = errors.map((e) => e.message).join("\n");
    super(`Compilation failed:\n${errorMessages}`);
    this.name = "CompilationError";
  }
}
