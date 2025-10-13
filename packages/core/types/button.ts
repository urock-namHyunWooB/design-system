/**
 * Button 컴포넌트 DSL 타입 정의
 *
 * Size: 크기/레이아웃 (height, padding, gap, fontSize 등)
 * Type: 색상/스타일 (backgroundColor, color, borderWidth 등)
 */

import {
  BaseDSL,
  ComponentStructure,
  InteractionStyles,
  MotionConfig,
  ResponsiveSpec,
  AccessibilitySpec,
} from "./base";
import type { PlatformStyle, IconStyle, TextStyle } from "./base";

// ============================================================================
// Button 전용 리터럴 타입
// ============================================================================

/** Button 사이즈 */
export type ButtonSize = "S" | "M" | "L";

/** Button Variant */
export type ButtonVariant =
  | "filled"
  | "outlined-black"
  | "outlined-blue"
  | "outlined-red"
  | "text-blue"
  | "text-black"
  | "filled-red";

// ============================================================================
// Button Size 스펙 (크기/레이아웃)
// ============================================================================

/**
 * Button Size 스펙
 * Parts별로 크기/레이아웃 스타일 정의
 */
export type ButtonSizeSpec = Record<
  string,
  {
    style: PlatformStyle | IconStyle | TextStyle;
  }
>;

// ============================================================================
// Button Type 스펙 (색상/스타일)
// ============================================================================

/**
 * Button Type/Variant 스펙
 * Parts별로 색상/비주얼 스타일 정의
 */
export type ButtonTypeSpec = Record<
  string,
  {
    style: PlatformStyle | IconStyle | TextStyle;
  }
>;

// ============================================================================
// 메인 Button DSL
// ============================================================================

/**
 * Button 컴포넌트 DSL
 *
 * - structure: 컴포넌트 구조 (parts 정의)
 * - sizes: 크기/레이아웃 정의
 * - types: 색상/스타일 정의
 * - interactions: 상태별 스타일 (hover, pressed 등)
 * - motion: 애니메이션 설정
 * - responsive: 반응형 스펙
 * - accessibility: 접근성 설정
 */
export interface ButtonDSL
  extends BaseDSL<"button", ButtonSizeSpec, ButtonTypeSpec> {
  component: "button";
  structure?: ComponentStructure;
  sizes: Record<ButtonSize, ButtonSizeSpec>;
  types: Record<ButtonVariant, ButtonTypeSpec>;
  interactions?: InteractionStyles<ButtonTypeSpec>;
  motion?: MotionConfig;
  responsive?: ResponsiveSpec<ButtonSizeSpec>;
  accessibility?: AccessibilitySpec;
}

// ============================================================================
// 타입 가드 & 유틸리티
// ============================================================================

/**
 * 타입 가드: DSL이 ButtonDSL인지 확인
 */
export function isButtonDSL(dsl: any): dsl is ButtonDSL {
  return dsl?.component === "button";
}

/**
 * Size가 유효한 ButtonSize인지 확인
 */
export function isButtonSize(size: string): size is ButtonSize {
  return ["S", "M", "L"].indexOf(size) !== -1;
}

/**
 * Variant가 유효한 ButtonVariant인지 확인
 */
export function isButtonVariant(variant: string): variant is ButtonVariant {
  return (
    [
      "filled",
      "outlined-black",
      "outlined-blue",
      "outlined-red",
      "text-blue",
      "text-black",
      "filled-red",
    ].indexOf(variant) !== -1
  );
}
