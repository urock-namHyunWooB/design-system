/**
 * DSL (Domain Specific Language) 타입 정의
 */

// 컨테이너 속성
export interface ContainerDefinition {
  height?: number;
  radius?: number;
  bg?: { color: string };
  border?: BorderDefinition;
  shadow?: string;
}

// 테두리 속성
export interface BorderDefinition {
  width: number;
  color?: string;
}

// 패딩 속성
export interface PaddingDefinition {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// 라벨 속성
export interface LabelDefinition {
  size?: number;
  color?: string;
}

// 아이콘 속성
export interface IconDefinition {
  size: number;
}

// 크기 정의
export interface SizeDefinition {
  container?: ContainerDefinition;
  padding?: PaddingDefinition;
  gap?: number;
  label?: LabelDefinition;
  icon?: IconDefinition;
}

// 타입/Variant 정의
export interface TypeDefinition {
  container?: ContainerDefinition;
  label?: LabelDefinition;
}

// Accessibility 속성
export interface AccessibilityDefinition {
  role?: string;
  tabIndex?: number;
  minSize?: {
    width: number;
    height: number;
  };
  keyboard?: Record<string, string>;
}

// 반응형 정의
export interface ResponsiveDefinition {
  mobile?: Record<string, SizeDefinition>;
  tablet?: Record<string, SizeDefinition>;
  desktop?: Record<string, SizeDefinition>;
}

// 메인 DSL 데이터 구조
export interface DSLData {
  version: string;
  component: string;
  sizes?: Record<string, SizeDefinition>;
  types?: Record<string, TypeDefinition>;
  accessibility?: AccessibilityDefinition;
  responsive?: ResponsiveDefinition;
}

// Design Token 데이터 구조
export interface TokenValue {
  $type?: string;
  $value: string | number;
  $description?: string;
}

export interface DesignTokenData {
  [key: string]: TokenValue | DesignTokenData;
}

// 변환 옵션
export interface TransformOptions {
  useCSS?: boolean;
  useTailwind?: boolean;
  outputFileName?: string;
}

// 변환 결과
export interface TransformResult {
  success: boolean;
  outputPath?: string;
  component?: string;
  error?: string;
  file?: string;
}
