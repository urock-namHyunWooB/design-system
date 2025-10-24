/**
 * Component Specification v1.0.0
 *
 * 디자인 시스템 컴포넌트를 정의하기 위한 표준 Spec
 */

// ============================================================================
// Meta
// ============================================================================

export interface ComponentMeta {
  /** 컴포넌트 이름 */
  component: string;

  /** Spec 버전 (Semantic Versioning) */
  version: string;

  /** 컴포넌트 카테고리 */
  category?:
    | "input"
    | "display"
    | "feedback"
    | "layout"
    | "navigation"
    | "overlay";

  /** 컴포넌트 설명 */
  description?: string;
}

// ============================================================================
// Structure
// ============================================================================

export type Part = NativePart | SlotPart;

export interface NativePart {
  /** Part 종류 */
  kind: "native";

  /** HTML 태그 */
  tag:
    | "div"
    | "span"
    | "button"
    | "input"
    | "select"
    | "textarea"
    | "label"
    | "a";

  /** 루트 엘리먼트 여부 */
  isRoot?: boolean;

  /** 설명 */
  description?: string;
}

export interface SlotPart {
  /** Part 종류 */
  kind: "slot";

  /** 받을 수 있는 타입 */
  accepts: "text" | "icon" | "node" | "nodes";

  /** 필수 여부 */
  required?: boolean;

  /** 래퍼 태그 (slot을 감싸는 태그) */
  wrapper?: string;

  /** 설명 */
  description?: string;
}

export interface LayoutConfig {
  /** 레이아웃 방향 */
  direction: "horizontal" | "vertical";

  /** 정렬 */
  alignment?: "start" | "center" | "end" | "stretch";

  /** 분배 방식 */
  distribution?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";

  /** 간격 */
  gap?: number;

  /** 줄바꿈 여부 */
  wrap?: boolean;
}

export interface ComponentStructure {
  /** Part 정의 */
  parts: Record<string, Part>;

  /** 렌더링 순서 */
  order: string[];

  /** 레이아웃 설정 */
  layout?: LayoutConfig;
}

// ============================================================================
// Styles
// ============================================================================

export type StyleValue = number | string;

export type SpacingValue =
  | number
  | string
  | { vertical?: number; horizontal?: number }
  | { top?: number; right?: number; bottom?: number; left?: number };

export interface PartStyle {
  /** 레이아웃 */
  layout?: {
    width?: StyleValue;
    height?: StyleValue;
    minWidth?: StyleValue;
    minHeight?: StyleValue;
    maxWidth?: StyleValue;
    maxHeight?: StyleValue;
    aspectRatio?: number | string;
  };

  /** 간격 */
  spacing?: {
    padding?: SpacingValue;
    margin?: SpacingValue;
  };

  /** 색상 */
  colors?: {
    background?: string;
    foreground?: string;
    border?: string;
  };

  /** 테두리 */
  borders?: {
    width?: number | string;
    style?: "solid" | "dashed" | "dotted" | "none";
    radius?: number | string;
  };

  /** 타이포그래피 */
  typography?: {
    fontSize?: number;
    fontWeight?: number | string;
    lineHeight?: number | string;
    letterSpacing?: number | string;
    textAlign?: "left" | "center" | "right";
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  };

  /** 효과 */
  effects?: {
    opacity?: number;
    transform?: string;
    boxShadow?: string;
    filter?: string;
  };

  /** 인터랙션 */
  interaction?: {
    cursor?: "pointer" | "default" | "not-allowed" | "text" | "move" | "grab";
    pointerEvents?: "auto" | "none";
    userSelect?: "auto" | "none" | "text";
  };

  /** 포지셔닝 */
  positioning?: {
    position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
    top?: StyleValue;
    right?: StyleValue;
    bottom?: StyleValue;
    left?: StyleValue;
    zIndex?: number;
  };
}

export type StyleMap = Record<string, PartStyle>;

export interface ResponsiveStyles {
  mobile?: {
    base?: StyleMap;
    sizes?: Record<string, StyleMap>;
    variants?: Record<string, StyleMap>;
    states?: Record<string, StyleMap>;
  };
  tablet?: {
    base?: StyleMap;
    sizes?: Record<string, StyleMap>;
    variants?: Record<string, StyleMap>;
    states?: Record<string, StyleMap>;
  };
  desktop?: {
    base?: StyleMap;
    sizes?: Record<string, StyleMap>;
    variants?: Record<string, StyleMap>;
    states?: Record<string, StyleMap>;
  };
}

export interface ComponentStyles {
  /** 기본 스타일 */
  base?: StyleMap;

  /** 크기별 스타일 */
  sizes?: Record<string, StyleMap>;

  /** Variant별 스타일 */
  variants?: Record<string, StyleMap>;

  /** 상태별 스타일 */
  states?: Record<string, StyleMap>;

  /** 반응형 스타일 */
  responsive?: ResponsiveStyles;
}

// ============================================================================
// Motion
// ============================================================================

export interface TransitionConfig {
  /** 지속 시간 (ms) */
  duration: number;

  /** Easing 함수 */
  easing?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | string;

  /** 지연 시간 (ms) */
  delay?: number;
}

export interface AnimationConfig {
  /** Keyframes */
  keyframes: Array<Record<string, any>>;

  /** 지속 시간 (ms) */
  duration: number;

  /** Easing 함수 */
  easing?: string;

  /** 반복 횟수 */
  iterations?: number | "infinite";

  /** 방향 */
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
}

export interface MotionConfig {
  /** CSS Transition 설정 */
  transitions?: Record<string, TransitionConfig>;

  /** CSS Animation 설정 */
  animations?: Record<string, AnimationConfig>;
}

// ============================================================================
// Props
// ============================================================================

export type PropType =
  | { type: "string"; default?: string }
  | {
      type: "number";
      default?: number;
      min?: number;
      max?: number;
      step?: number;
    }
  | { type: "boolean"; default?: boolean }
  | { type: { kind: "union"; values: string[] }; default?: string }
  | { type: { kind: "array"; items?: string }; default?: any[] }
  | { type: { kind: "object"; shape?: string }; default?: object }
  | { type: "node" }
  | { type: "function"; signature?: string };

export interface PropDefinition {
  type:
    | "string"
    | "number"
    | "boolean"
    | "node"
    | "function"
    | "any"
    | "array"
    | "object";
  default?: string | number | boolean | any[] | object | Function;
  /** 필수 여부 */
  required?: boolean;

  /** Controlled prop (onChange event 이름) */
  controlled?: string;

  /** Deprecated 정보 */
  deprecated?: DeprecationInfo;
}

export interface DeprecationInfo {
  /** Deprecated된 버전 */
  since: string;

  /** 대체할 prop */
  replacement?: string;

  /** 사유 */
  reason?: string;
}

export type PropDefinitions = Record<string, PropDefinition>;

// ============================================================================
// Events
// ============================================================================

export interface EventDefinition {
  /** 함수 시그니처 */
  signature?: string;

  /** 설명 */
  description?: string;
}

export type EventDefinitions = Record<string, EventDefinition>;

// ============================================================================
// Accessibility
// ============================================================================

export interface AccessibilitySpec {
  /** ARIA role */
  role: string;

  /** 키보드 단축키 */
  keyboard?: Record<string, string>;

  /** 최소 터치 타겟 크기 */
  minTouchTarget?: {
    width: number;
    height: number;
  };

  /** ARIA label */
  ariaLabel?: string;
}

// ============================================================================
// Metadata
// ============================================================================

export interface ExampleSpec {
  /** 예제 제목 */
  title: string;

  /** 코드 */
  code: string;

  /** 설명 */
  description?: string;
}

export interface MetadataSpec {
  /** 사용 예제 */
  examples?: ExampleSpec[];

  /** 태그 */
  tags?: string[];

  /** Deprecated 정보 */
  deprecated?: DeprecationInfo;
}

// ============================================================================
// Main Component Spec
// ============================================================================

/**
 * Component Specification v1.0.0
 *
 * 모든 디자인 시스템 컴포넌트의 표준 정의 형식
 */
export interface ComponentSpec {
  /** 메타 정보 */
  meta: ComponentMeta;

  /** 구조 정의 */
  structure: ComponentStructure;

  /** 스타일 정의 */
  styles: ComponentStyles;

  /** 모션 정의 */
  motion?: MotionConfig;

  /** Props 정의 */
  props?: PropDefinitions;

  /** Events 정의 */
  events?: EventDefinitions;

  /** 컴포넌트별 설정 */
  config?: Record<string, any>;

  /** 접근성 정의 */
  accessibility: AccessibilitySpec;

  /** 메타데이터 */
  metadata?: MetadataSpec;
}

// ============================================================================
// Validation
// ============================================================================

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Spec 검증
 */
export function validateSpec(spec: ComponentSpec): ValidationResult {
  const errors: ValidationError[] = [];

  // 1. order의 모든 part가 parts에 존재하는지
  spec.structure.order.forEach((partId) => {
    if (!spec.structure.parts[partId]) {
      errors.push({
        path: `structure.order`,
        message: `Part "${partId}" not found in structure.parts`,
      });
    }
  });

  // 2. 루트 엘리먼트가 정확히 하나인지
  const rootParts = Object.entries(spec.structure.parts).filter(
    ([_, part]) => part.kind === "native" && part.isRoot
  );

  if (rootParts.length === 0) {
    errors.push({
      path: "structure.parts",
      message: "No root element found. One part must have isRoot: true",
    });
  } else if (rootParts.length > 1) {
    errors.push({
      path: "structure.parts",
      message: `Multiple root elements found: ${rootParts.map(([id]) => id).join(", ")}`,
    });
  }

  // 3. required slot이 order에 포함되는지
  Object.entries(spec.structure.parts).forEach(([partId, part]) => {
    if (
      part.kind === "slot" &&
      part.required &&
      !spec.structure.order.includes(partId)
    ) {
      errors.push({
        path: `structure.parts.${partId}`,
        message: `Required slot "${partId}" not found in structure.order`,
      });
    }
  });

  // 4. styles의 partId가 모두 parts에 존재하는지
  const validateStyleMap = (styleMap: StyleMap | undefined, path: string) => {
    if (!styleMap) return;

    Object.keys(styleMap).forEach((partId) => {
      if (!spec.structure.parts[partId]) {
        errors.push({
          path,
          message: `Style defined for unknown part "${partId}"`,
        });
      }
    });
  };

  validateStyleMap(spec.styles.base, "styles.base");

  if (spec.styles.sizes) {
    Object.entries(spec.styles.sizes).forEach(([sizeName, styleMap]) => {
      validateStyleMap(styleMap, `styles.sizes.${sizeName}`);
    });
  }

  if (spec.styles.variants) {
    Object.entries(spec.styles.variants).forEach(([variantName, styleMap]) => {
      validateStyleMap(styleMap, `styles.variants.${variantName}`);
    });
  }

  if (spec.styles.states) {
    Object.entries(spec.styles.states).forEach(([stateName, styleMap]) => {
      validateStyleMap(styleMap, `styles.states.${stateName}`);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Type Guards
// ============================================================================

export function isComponentSpec(obj: any): obj is ComponentSpec {
  return (
    obj &&
    typeof obj === "object" &&
    obj.meta &&
    typeof obj.meta.component === "string" &&
    typeof obj.meta.version === "string" &&
    obj.structure &&
    obj.structure.parts &&
    Array.isArray(obj.structure.order) &&
    obj.styles &&
    obj.accessibility
  );
}
