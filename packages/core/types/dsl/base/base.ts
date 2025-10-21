/**
 * 공통 DSL 타입 정의
 * 모든 컴포넌트 DSL의 기반이 되는 타입들
 */

// ============================================================================
// 유틸리티 타입
// ============================================================================

/** Partial을 재귀적으로 적용 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// 컴포넌트 구조
// ============================================================================

/** 레이아웃 방향 */
export type LayoutDirection = "row" | "column" | "stack";

/** Part 타입 */
export type PartType =
  | "container"
  | "text"
  | "icon"
  | "image"
  | "slot"
  | "custom";

/** Part 정의 */
export interface PartDefinition {
  /** Part 타입 */
  type: PartType;

  /** Slot 전용 속성 */
  slotType?: "custom" | "text" | "icon" | "node";

  /** 필수 여부 */
  required?: boolean;

  /** 설명 */
  description?: string;
}

/** 계층 구조 정의 */
export interface HierarchyDefinition {
  /** 부모 Part ID (null이면 root) */
  parent?: string | null;

  /** 자식 Part IDs */
  children?: string[];

  /** 레이어 (z-index 순서 힌트) */
  layer?: number;

  /** Portal 렌더링 여부 (React Portal, Flutter Overlay 등) */
  portal?: boolean;
}

/** 컴포넌트 구조 정의 */
export interface ComponentStructure {
  /** 레이아웃 방향 */
  layout: LayoutDirection;

  /** Parts 정의 (Slot 포함) */
  parts: Record<string, PartDefinition>;

  /** 계층 구조 (선택) */
  hierarchy?: Record<string, HierarchyDefinition>;
}

// ============================================================================
// 검증 함수
// ============================================================================

/**
 * 계층 구조 일관성 검증
 */
export function validateHierarchy(
  parts: Record<string, PartDefinition>,
  hierarchy?: Record<string, HierarchyDefinition>
): void {
  if (!hierarchy) return;

  const errors: string[] = [];

  // 모든 part가 정의되어 있는지 확인
  Object.keys(hierarchy).forEach((partId) => {
    if (!parts[partId]) {
      errors.push(`Hierarchy contains undefined part: "${partId}"`);
    }
  });

  // parent-children 일관성 검증
  Object.keys(hierarchy).forEach((parentId) => {
    const def = hierarchy[parentId];
    def?.children?.forEach((childId) => {
      const child = hierarchy[childId];

      if (child?.parent !== undefined && child.parent !== parentId) {
        errors.push(
          `Inconsistency: "${childId}".parent="${child.parent}" but in "${parentId}".children`
        );
      }
    });
  });

  if (errors.length > 0) {
    throw new Error(`Hierarchy validation failed:\n${errors.join("\n")}`);
  }
}

// ============================================================================
// 인터랙션 상태
// ============================================================================

/** 인터랙션 상태 타입 */
export type InteractionState =
  | "default"
  | "hovered"
  | "pressed"
  | "focused"
  | "disabled"
  | "loading"
  | "error"
  | "success";

/** 상태별 스타일 */
export type InteractionStyles<TStyle = any> = Partial<
  Record<InteractionState, DeepPartial<TStyle>>
>;

// ============================================================================
// 모션/애니메이션
// ============================================================================

/** 애니메이션 타입 */
export type AnimationType = "spring" | "tween" | "ease" | "linear";

/** 애니메이션 곡선 */
export type AnimationCurve =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "anticipate"
  | "backIn"
  | "backOut";

/** 애니메이션 설정 */
export interface AnimationConfig {
  /** 애니메이션 타입 */
  type?: AnimationType;
  /** 지속 시간 (ms) */
  duration?: number;
  /** 애니메이션 곡선 */
  curve?: AnimationCurve;
  /** 지연 시간 (ms) */
  delay?: number;
  /** Spring 강성 */
  stiffness?: number;
  /** Spring 감쇠 */
  damping?: number;
  /** 반복 횟수 */
  repeat?: number;
  /** 반복 타입 */
  repeatType?: "loop" | "reverse" | "mirror";
}

/** 모션 설정 */
export interface MotionConfig {
  /** 기본 전환 */
  default?: AnimationConfig;
  /** 인터랙션별 애니메이션 */
  press?: AnimationConfig;
  hover?: AnimationConfig;
  focus?: AnimationConfig;
  /** 커스텀 애니메이션 */
  custom?: Record<string, AnimationConfig>;
}

// ============================================================================
// 반응형
// ============================================================================

/** 반응형 브레이크포인트 */
export type ResponsiveBreakpoint = "mobile" | "tablet" | "desktop";

/** 반응형 스펙 */
export interface ResponsiveSpec<TSizeSpec> {
  mobile?: Record<string, DeepPartial<TSizeSpec>>;
  tablet?: Record<string, DeepPartial<TSizeSpec>>;
  desktop?: Record<string, DeepPartial<TSizeSpec>>;
}

// ============================================================================
// 접근성
// ============================================================================

/** 최소 크기 */
export interface MinSize {
  width: number;
  height: number;
}

/** 접근성 스펙 */
export interface AccessibilitySpec {
  /** 역할 */
  role?: string;
  /** Tab 인덱스 */
  tabIndex?: number;
  /** 최소 터치 타겟 크기 */
  minSize?: MinSize;
  /** 키보드 단축키 */
  keyboard?: Record<string, string>;
  /** ARIA 라벨 */
  ariaLabel?: string;
  /** ARIA 설명 */
  ariaDescribedBy?: string;
  /** ARIA 상태 */
  ariaDisabled?: boolean;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
}

// ============================================================================
// 기본 DSL 구조
// ============================================================================

/**
 * 기본 컴포넌트 DSL 구조
 *
 * @template TComponentName - 컴포넌트 이름 ('button', 'input' 등)
 * @template TSizeSpec - Size 스펙 타입 (크기/레이아웃)
 * @template TTypeSpec - Type/Variant 스펙 타입 (색상/스타일)
 */
export interface BaseDSL<
  TComponentName extends string = string,
  TSizeSpec = any,
  TTypeSpec = any,
> {
  /** 컴포넌트 이름 */
  component: TComponentName;

  /** 컴포넌트 구조 (slots/parts 정의) */
  structure?: ComponentStructure;

  /** 크기별 레이아웃 스펙 */
  sizes?: Record<string, TSizeSpec>;

  /** 스타일별 비주얼 스펙 */
  types?: Record<string, TTypeSpec>;

  /** 인터랙션 상태별 스타일 */
  interactions?: InteractionStyles<TTypeSpec>;

  /** 모션/애니메이션 설정 */
  motion?: MotionConfig;

  /** 반응형 스펙 */
  responsive?: ResponsiveSpec<TSizeSpec>;

  /** 접근성 스펙 */
  accessibility?: AccessibilitySpec;
}

// ============================================================================
// 공통 타입
// ============================================================================

/** 컴포넌트 이름 타입 */
export type ComponentName =
  | "button"
  | "input"
  | "card"
  | "link"
  | "modal"
  | "select"
  | "checkbox"
  | "radio"
  | "switch"
  | "slider"
  | "badge"
  | "avatar"
  | "tooltip";

/** 공통 사이즈 타입 */
export type CommonSize = "XS" | "S" | "M" | "L" | "XL";

// ============================================================================
// 타입 가드
// ============================================================================

/**
 * 객체가 유효한 DSL인지 확인
 */
export function isValidDSL(dsl: any): dsl is BaseDSL {
  return dsl && typeof dsl === "object" && typeof dsl.component === "string";
}
