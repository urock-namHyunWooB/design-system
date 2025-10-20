/**
 * Generator Types
 *
 * IR → Platform Code 변환을 위한 타입 시스템
 */

import type { ComponentIR } from "../ir/types";

// ============================================================================
// Generator Options
// ============================================================================

/** 스타일 전략 */
export type StyleStrategy =
  | "css-modules" // CSS Modules
  | "styled-components" // styled-components
  | "emotion" // Emotion
  | "tailwind" // Tailwind CSS
  | "inline"; // Inline styles

/** Generator 옵션 */
export interface GeneratorOptions {
  /** 출력 디렉토리 */
  outputDir: string;

  /** 스타일 전략 */
  styleStrategy?: StyleStrategy;

  /** TypeScript 사용 여부 */
  typescript?: boolean;

  /** 파일명 컨벤션 */
  fileNaming?: "pascal" | "kebab" | "camel";

  /** Export 타입 */
  exportType?: "named" | "default" | "both";

  /** Prettier 포맷팅 */
  prettier?: boolean;
}

// ============================================================================
// Generator Context
// ============================================================================

/** Generator 컨텍스트 */
export interface GeneratorContext {
  /** IR */
  ir: ComponentIR;

  /** 옵션 */
  options: GeneratorOptions;

  /** 생성된 파일 목록 */
  generatedFiles: GeneratedFile[];

  /** 에러 */
  errors: string[];

  /** 경고 */
  warnings: string[];
}

/** 생성된 파일 */
export interface GeneratedFile {
  /** 파일 경로 */
  path: string;

  /** 파일 내용 */
  content: string;

  /** 파일 타입 */
  type: "component" | "style" | "type" | "index";
}

// ============================================================================
// Code Generation
// ============================================================================

/** Props 정의 */
export interface PropsDefinition {
  /** 인터페이스 이름 */
  name: string;

  /** Props 목록 */
  props: PropDefinition[];

  /** 확장할 타입 */
  extends?: string[];
}

/** Prop 정의 */
export interface PropDefinition {
  /** Prop 이름 */
  name: string;

  /** TypeScript 타입 */
  type: string;

  /** 필수 여부 */
  required: boolean;

  /** 기본값 */
  defaultValue?: string;

  /** 설명 */
  description?: string;
}

/** 컴포넌트 정의 */
export interface ComponentDefinition {
  /** 컴포넌트 이름 */
  name: string;

  /** Props 인터페이스 */
  propsInterface: string;

  /** 컴포넌트 본문 */
  body: string;

  /** Import 문 */
  imports: ImportStatement[];

  /** Export 문 */
  exports: string[];
}

/** Import 문 */
export interface ImportStatement {
  /** Import할 것들 */
  imports: string[];

  /** 패키지명 */
  from: string;

  /** 타입 import 여부 */
  isType?: boolean;
}

/** 스타일 정의 */
export interface StyleDefinition {
  /** 클래스명 또는 styled-component 이름 */
  name: string;

  /** 스타일 내용 */
  styles: Record<string, any>;

  /** Variant별 스타일 */
  variants?: Record<string, Record<string, any>>;
}

// ============================================================================
// Generator Result
// ============================================================================

/** Generator 결과 */
export interface GeneratorResult {
  /** 성공 여부 */
  success: boolean;

  /** 생성된 파일들 */
  files: GeneratedFile[];

  /** 에러 */
  errors: string[];

  /** 경고 */
  warnings: string[];

  /** 통계 */
  stats: {
    totalFiles: number;
    totalLines: number;
    totalSize: number; // bytes
    duration: number; // ms
  };
}
