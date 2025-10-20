/**
 * Component Intermediate Representation (IR) Types
 *
 * 플랫폼 독립적인 컴포넌트 정의를 위한 타입 시스템
 * DSL → IR → Platform Code 파이프라인의 중간 표현
 *
 * @module ir/types
 */

// Import shared types from base (not re-exported to avoid conflicts)
import type {
  DeepPartial,
  AnimationType,
  AnimationCurve,
  AnimationConfig,
  LayoutDirection,
  PartType,
  PartDefinition,
  MinSize,
} from "../types/base";

// ============================================================================
// 1. Metadata
// ============================================================================

/** 컴포넌트 복잡도 레벨 */
export type ComponentComplexity = "simple" | "interactive" | "complex";

/** 컴포넌트 메타데이터 */
export interface ComponentMetadata {
  /** 컴포넌트 이름 (예: "button", "input") */
  component: string;

  /** IR 스키마 버전 (호환성 관리) */
  version: string;

  /** IR 생성 시각 (ISO 8601) */
  generatedAt: string;

  /** 사용 가능한 size 값들 */
  availableSizes: string[];

  /** 사용 가능한 variant 값들 */
  availableVariants: string[];

  /** 사용 가능한 상태 값들 */
  availableStates: string[];

  /** 기본값 */
  defaults: {
    size: string;
    variant: string;
  };

  /** 컴포넌트 복잡도 */
  complexity: ComponentComplexity;
}

// ============================================================================
// 2. Token Information
// ============================================================================

/** 디자인 토큰 정보 */
export interface TokenInfo {
  /** DSL에서 사용된 토큰 목록 (예: ["{Color/primary/01}"]) */
  used: string[];

  /** 토큰 → 값 매핑 (빌드 타임 해석 가능 시) */
  resolved?: Record<string, string | number>;

  /** 미해석 토큰 (런타임 테마 변경용) */
  unresolved?: string[];
}

// ============================================================================
// 3. Structure Definition
// ============================================================================

/** Slot 타입 */
export type SlotType = "icon" | "text" | "node" | "custom";

/** 렌더링 전략 */
export type RenderStrategy = "normal" | "portal" | "positioned";

/** Extended Part 정의 (IR 전용) */
export interface IRPartDefinition extends PartDefinition {
  /** Props로 노출되는지 여부 */
  exposedAsProp: boolean;

  /** 특수 렌더링 전략 */
  renderStrategy?: RenderStrategy;

  /** Portal 렌더링 타겟 (renderStrategy가 "portal"일 때) */
  portalTarget?: "body" | "root" | string;
}

/** 계층 구조 트리 노드 */
export interface PartTreeNode {
  id: string;
  children: PartTreeNode[];
}

/** 기본 구조 정의 */
export interface BaseStructure {
  /** 기본 레이아웃 방향 */
  layout: LayoutDirection;

  /** Parts 정의 */
  parts: Record<string, IRPartDefinition>;

  /** 계층 구조 */
  hierarchy: {
    root: string;
    tree: PartTreeNode;
  };
}

// ============================================================================
// Structure Variants (구조 변형)
// ============================================================================

/** 조건 정의 */
export type Condition =
  | { prop: string; value: any }
  | { size: string | string[] }
  | { variant: string | string[] }
  | { state: string | string[] }
  | { breakpoint: string | string[] }
  | { and: Condition[] }
  | { or: Condition[] }
  | { not: Condition };

/** Visibility 액션 */
export type VisibilityAction = "show" | "hide" | "remove";

/** Visibility 규칙 */
export interface VisibilityRule {
  /** 조건 */
  when: Condition;

  /** 액션 */
  action: VisibilityAction;

  /** 우선순위 (높을수록 우선) */
  priority?: number;
}

/** 구조 변경 타입 */
export type StructureModificationType =
  | "layout"
  | "reorder"
  | "replace"
  | "inject";

/** 구조 변경 규칙 */
export interface StructureModification {
  /** 조건 */
  when: Condition;

  /** 변경 타입 */
  type: StructureModificationType;

  /** 변경 내용 */
  changes: {
    /** 레이아웃 변경 */
    layout?: LayoutDirection;

    /** 순서 변경 */
    reorder?: {
      parent: string;
      newOrder: string[];
    };

    /** 부모 변경 */
    reparent?: {
      partId: string;
      newParent: string;
    };

    /** 새 Part 주입 */
    inject?: {
      partId: string;
      definition: IRPartDefinition;
      parent: string;
      position?: number;
    };
  };

  /** 우선순위 */
  priority?: number;
}

/** 구조 변형 규칙 */
export interface StructureVariants {
  /** Part 표시/숨김 규칙 */
  visibility: Record<string, VisibilityRule[]>;

  /** 구조 변경 규칙 */
  modifications: StructureModification[];
}

/** 전체 구조 정의 */
export interface StructureDefinition {
  base: BaseStructure;
  variants: StructureVariants;
}

// ============================================================================
// 4. Style Layers (Layered Style System)
// ============================================================================

/** 레이아웃 속성 */
export interface LayoutProperties {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  borderRadius?: number;
}

/** 간격 속성 */
export interface SpacingProperties {
  padding?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  margin?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  gap?: number;
}

/** 타이포그래피 속성 */
export interface TypographyProperties {
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "justify";
}

/** 색상 속성 */
export interface ColorProperties {
  background?: string;
  foreground?: string;
  border?: string;
}

/** 테두리 속성 */
export interface BorderProperties {
  width?: number;
  style?: "solid" | "dashed" | "dotted" | "none";
  color?: string;
}

/** 효과 속성 */
export interface EffectProperties {
  elevation?: number;
  opacity?: number;
  shadow?: string;
  blur?: number;
  scale?: number;
  rotate?: number;
  translateX?: number;
  translateY?: number;
}

/** Flexbox 속성 */
export interface FlexboxProperties {
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  alignSelf?:
    | "auto"
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "baseline";
  flex?: number;
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
}

/** 아웃라인 속성 */
export interface OutlineProperties {
  outlineWidth?: number;
  outlineColor?: string;
  outlineOffset?: number;
  outlineStyle?: "solid" | "dashed" | "dotted";
}

/** 기타 속성 */
export interface MiscProperties {
  cursor?:
    | "pointer"
    | "default"
    | "not-allowed"
    | "grab"
    | "grabbing"
    | "text"
    | "move";
  pointerEvents?: "auto" | "none";
  userSelect?: "auto" | "none" | "text" | "all";
}

/** 모든 스타일 속성 통합 */
export interface StyleProperties
  extends LayoutProperties,
    SpacingProperties,
    TypographyProperties,
    ColorProperties,
    BorderProperties,
    EffectProperties,
    FlexboxProperties,
    OutlineProperties,
    MiscProperties {}

/** Part별 스타일 (Size 레이어용) */
export interface PartSizeStyle {
  layout?: LayoutProperties;
  spacing?: SpacingProperties;
  typography?: TypographyProperties;
  flexbox?: FlexboxProperties;
}

/** Part별 스타일 (Variant 레이어용) */
export interface PartVariantStyle {
  colors?: ColorProperties;
  borders?: BorderProperties;
  effects?: EffectProperties;
  typography?: Pick<TypographyProperties, "fontWeight">;
}

/** Size 스타일 레이어 */
export interface SizeStyleLayer {
  parts: Record<string, PartSizeStyle>;
}

/** Variant 스타일 레이어 */
export interface VariantStyleLayer {
  parts: Record<string, PartVariantStyle>;
}

/** Interaction 스타일 레이어 */
export interface InteractionStyleLayer {
  [state: string]: {
    /** Part별 스타일 변경사항 (delta) */
    parts: Record<string, Partial<StyleProperties>>;

    /** 사용할 애니메이션 이름 */
    animation?: string;
  };
}

/** Responsive 스타일 레이어 */
export interface ResponsiveStyleLayer {
  [breakpoint: string]: {
    /** Size 오버라이드 */
    sizes?: Record<string, DeepPartial<SizeStyleLayer>>;

    /** Variant 오버라이드 */
    variants?: Record<string, DeepPartial<VariantStyleLayer>>;
  };
}

/** Layered Styles 전체 */
export interface LayeredStyles {
  sizes: Record<string, SizeStyleLayer>;
  variants: Record<string, VariantStyleLayer>;
  interactions: InteractionStyleLayer;
  responsive: ResponsiveStyleLayer;
}

// ============================================================================
// 5. Style Rules
// ============================================================================

/** 미정의 Part 동작 */
export type UndefinedPartBehavior = "hide" | "inherit" | "no-style";

/** 병합 타입 */
export type MergeType = "deep" | "shallow";

/** 병합 전략 */
export interface MergeStrategy {
  /** 우선순위 (숫자가 클수록 우선) */
  priority: {
    base: number;
    size: number;
    variant: number;
    responsive: number;
    interaction: number;
  };

  /** 병합 방식 */
  mergeType: MergeType;
}

/** 스타일 규칙 */
export interface StyleRules {
  /** 미정의 Part 동작 */
  undefinedPartBehavior: UndefinedPartBehavior;

  /** 병합 전략 */
  mergeStrategy: MergeStrategy;
}

// ============================================================================
// 6. Animations
// ============================================================================

/** 애니메이션 정의 맵 */
export type AnimationDefinitions = Record<string, AnimationConfig>;

// ============================================================================
// 7. Props Schema
// ============================================================================

/** Prop 타입 */
export type PropType =
  | "string"
  | "number"
  | "boolean"
  | "function"
  | "array"
  | "object"
  | "node"
  | "union";

/** Prop의 역할 */
export type PropRole =
  | "controlled-value"
  | "visibility-control"
  | "style-modifier"
  | "event-handler"
  | "content";

/** Prop 타입 정의 */
export interface PropTypeDefinition {
  /** 타입 */
  type: PropType;

  /** Union 타입의 가능한 값들 */
  unionValues?: string[];

  /** Array 타입의 아이템 타입 */
  arrayItemType?: string;

  /** 기본값 */
  default?: any;

  /** Prop의 역할 */
  role?: PropRole;

  /** 설명 */
  description?: string;
}

/** Props 스키마 */
export interface ComponentPropsSchema {
  /** 필수 prop 이름들 */
  required: string[];

  /** 선택적 prop 이름들 */
  optional: string[];

  /** Prop 타입 정의 */
  types: Record<string, PropTypeDefinition>;

  /** 확장할 타입들 (예: HTMLButtonAttributes) */
  extends?: string[];
}

// ============================================================================
// 8. Conditional Attributes
// ============================================================================

/** Attribute 규칙 */
export interface AttributeRule {
  /** 속성 이름 (예: "disabled", "aria-label") */
  name: string;

  /** 조건 */
  when: Condition;

  /** 속성 값 */
  value: string | number | boolean | null;

  /** 우선순위 */
  priority?: number;
}

/** Part별 Attribute 규칙 */
export type AttributeRules = Record<string, AttributeRule[]>;

// ============================================================================
// 9. Validation Rules
// ============================================================================

/** 비호환성 규칙 */
export interface IncompatibilityRule {
  /** 조건 */
  when: Condition;

  /** 충돌하는 prop 이름들 */
  conflicts: string[];

  /** 에러 메시지 */
  message: string;
}

/** 요구사항 규칙 */
export interface RequirementRule {
  /** 조건 */
  when: Condition;

  /** 필요한 prop 이름들 */
  requires: string[];

  /** 에러 메시지 */
  message: string;
}

/** 제약 규칙 */
export interface ConstraintRule {
  /** Prop 이름 */
  prop: string;

  /** 제약 타입 */
  constraint:
    | { type: "min"; value: number }
    | { type: "max"; value: number }
    | { type: "range"; min: number; max: number }
    | { type: "pattern"; pattern: string }
    | { type: "enum"; values: any[] };

  /** 에러 메시지 */
  message: string;
}

/** Validation 규칙 */
export interface ValidationRules {
  /** 비호환성 규칙 */
  incompatible: IncompatibilityRule[];

  /** 요구사항 규칙 */
  requirements: RequirementRule[];

  /** 제약 규칙 */
  constraints: ConstraintRule[];
}

// ============================================================================
// 10. Accessibility
// ============================================================================

/** 접근성 메타데이터 */
export interface AccessibilityMetadata {
  /** ARIA role */
  role: string;

  /** Tab 인덱스 */
  tabIndex?: number;

  /** 최소 터치 타겟 크기 */
  minSize?: MinSize;

  /** ARIA 속성들 */
  ariaAttributes?: Record<string, string | boolean>;

  /** 키보드 단축키 (key → action) */
  keyboardShortcuts?: Record<string, string>;
}

// ============================================================================
// Main Component IR (Phase 1 - Simple Components)
// ============================================================================

/**
 * Component Intermediate Representation (IR)
 *
 * Phase 1: Simple Components (Button, Card, Badge 등)
 * 정적 스타일과 기본 인터랙션만 포함
 */
export interface ComponentIR {
  /** 메타데이터 */
  metadata: ComponentMetadata;

  /** 토큰 정보 */
  tokens: TokenInfo;

  /** 구조 정의 */
  structure: StructureDefinition;

  /** 스타일 레이어 */
  styles: LayeredStyles;

  /** 스타일 규칙 */
  styleRules: StyleRules;

  /** 애니메이션 */
  animations: AnimationDefinitions;

  /** Props 스키마 */
  propsSchema: ComponentPropsSchema;

  /** 조건부 Attributes */
  attributes: AttributeRules;

  /** Validation 규칙 */
  validation: ValidationRules;

  /** 접근성 */
  accessibility: AccessibilityMetadata;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * 객체가 유효한 ComponentIR인지 확인
 */
export function isComponentIR(obj: any): obj is ComponentIR {
  return (
    obj &&
    typeof obj === "object" &&
    obj.metadata &&
    typeof obj.metadata.component === "string" &&
    obj.structure &&
    obj.styles &&
    obj.propsSchema
  );
}

/**
 * 복잡도가 simple인지 확인
 */
export function isSimpleComponent(ir: ComponentIR): boolean {
  return ir.metadata.complexity === "simple";
}
