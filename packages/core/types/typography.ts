/**
 * Typography 컴포넌트 DSL 타입 정의
 *
 * Size: 폰트 크기별 스타일 (12~120px)
 * Type: 폰트 weight (bold, semibold, medium, regular)
 * Family: 폰트 패밀리 (text: Pretendard, number: Spoqa Han Sans Neo)
 */

import {
  BaseDSL,
  ComponentStructure,
  InteractionStyles,
  MotionConfig,
  ResponsiveSpec,
  AccessibilitySpec,
} from "./base";
import type { PlatformStyle, TextStyle } from "./base";

// ============================================================================
// Typography 전용 리터럴 타입
// ============================================================================

/** Typography 사이즈 */
export type TypographySize =
  | "120" // number only
  | "72"
  | "48"
  | "40"
  | "36"
  | "32"
  | "28"
  | "24"
  | "20"
  | "18"
  | "16"
  | "14"
  | "12"; // text only

/** Typography Weight */
export type TypographyWeight = "bold" | "semibold" | "medium" | "regular";

/** Typography Font Family */
export type TypographyFamily = "text" | "number";

// ============================================================================
// Typography Size 스펙 (폰트 크기별 스타일)
// ============================================================================

/**
 * Typography Size 스펧
 * text 요소에 대한 폰트 크기별 스타일 정의
 */
export type TypographySizeSpec = Record<
  string,
  {
    style: TextStyle;
  }
>;

// ============================================================================
// Typography Type 스펙 (폰트 weight)
// ============================================================================

/**
 * Typography Type/Weight 스펙
 * text 요소에 대한 폰트 굵기별 스타일 정의
 */
export type TypographyTypeSpec = Record<
  string,
  {
    style: TextStyle;
  }
>;

// ============================================================================
// Typography Family 스펙 (폰트 패밀리)
// ============================================================================

/**
 * Typography Family 스펙
 * 폰트 패밀리별 설정
 */
export interface TypographyFamilySpec {
  fontFamily: string;
  availableSizes: TypographySize[];
  availableWeights: TypographyWeight[];
}

// ============================================================================
// 메인 Typography DSL
// ============================================================================

/**
 * Typography 컴포넌트 DSL
 *
 * - structure: 컴포넌트 구조 (단일 텍스트 요소)
 * - families: 폰트 패밀리별 설정 (text/number)
 * - sizes: 폰트 크기별 스타일
 * - types: 폰트 weight별 스타일
 * - interactions: 상태별 스타일 (선택적)
 * - motion: 애니메이션 설정 (선택적)
 * - responsive: 반응형 스펙 (선택적)
 * - accessibility: 접근성 설정
 */
export interface TypographyDSL
  extends BaseDSL<"typography", TypographySizeSpec, TypographyTypeSpec> {
  component: "typography";
  structure?: ComponentStructure;
  families: Record<TypographyFamily, TypographyFamilySpec>;
  sizes: Record<TypographySize, TypographySizeSpec>;
  types: Record<TypographyWeight, TypographyTypeSpec>;
  interactions?: InteractionStyles<TypographyTypeSpec>;
  motion?: MotionConfig;
  responsive?: ResponsiveSpec<TypographySizeSpec>;
  accessibility?: AccessibilitySpec;
}

// ============================================================================
// 타입 가드 & 유틸리티
// ============================================================================

/**
 * 타입 가드: DSL이 TypographyDSL인지 확인
 */
export function isTypographyDSL(dsl: any): dsl is TypographyDSL {
  return dsl?.component === "typography";
}

/**
 * Size가 유효한 TypographySize인지 확인
 */
export function isTypographySize(size: string): size is TypographySize {
  return [
    "120",
    "72",
    "48",
    "40",
    "36",
    "32",
    "28",
    "24",
    "20",
    "18",
    "16",
    "14",
    "12",
  ].includes(size);
}

/**
 * Weight가 유효한 TypographyWeight인지 확인
 */
export function isTypographyWeight(weight: string): weight is TypographyWeight {
  return ["bold", "semibold", "medium", "regular"].includes(weight);
}

/**
 * Family가 유효한 TypographyFamily인지 확인
 */
export function isTypographyFamily(family: string): family is TypographyFamily {
  return ["text", "number"].includes(family);
}
