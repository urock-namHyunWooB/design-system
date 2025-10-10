/**
 * DSL 파서 및 검증 모듈
 * 플랫폼 독립적인 DSL 검증 로직
 */

import type { DSLData } from "../types/dsl.js";

/**
 * DSL 데이터 검증
 * @param dslData - DSL 데이터
 * @throws {Error} 검증 실패 시 에러 발생
 */
export function validateDSL(dslData: DSLData): boolean {
  if (!dslData.component) {
    throw new Error('DSL must have a "component" field');
  }

  if (!dslData.version) {
    throw new Error('DSL must have a "version" field');
  }

  if (!dslData.sizes && !dslData.types) {
    throw new Error('DSL must have at least "sizes" or "types" field');
  }

  // component 타입 검증
  const validComponents = ["button", "input", "card", "link", "modal"];
  if (!validComponents.includes(dslData.component)) {
    console.warn(
      `Warning: "${dslData.component}" is not a standard component type`
    );
  }

  return true;
}

/**
 * DSL 파일 파싱
 * @param dslContent - DSL JSON 문자열
 * @returns 파싱된 DSL 객체
 */
export function parseDSL(dslContent: string): DSLData {
  try {
    const dslData = JSON.parse(dslContent) as DSLData;
    validateDSL(dslData);
    return dslData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid DSL JSON: ${error.message}`);
    }
    throw error;
  }
}

/**
 * DSL 버전 확인
 * @param dslData - DSL 데이터
 * @returns DSL 버전
 */
export function getDSLVersion(dslData: DSLData): string {
  return dslData.version || "0.0.0";
}

/**
 * DSL 컴포넌트 타입 추출
 * @param dslData - DSL 데이터
 * @returns 컴포넌트 타입
 */
export function getComponentType(dslData: DSLData): string {
  return dslData.component;
}
