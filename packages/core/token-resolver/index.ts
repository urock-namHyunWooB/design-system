/**
 * Design token 참조를 실제 값으로 해석
 */

import type { DSLData, DesignTokenData } from "../types/dsl.js";

/**
 * DSL의 토큰 참조를 실제 값으로 변환
 * @param dslData - DSL 데이터
 * @param tokenData - Design token 데이터
 * @returns 해석된 DSL 데이터
 */
export function resolveTokens(
  dslData: DSLData,
  tokenData: DesignTokenData
): DSLData {
  return JSON.parse(JSON.stringify(dslData), (key, value) => {
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      return resolveTokenReference(value, tokenData);
    }
    return value;
  });
}

/**
 * 단일 토큰 참조를 해석
 * @param reference - 토큰 참조 (예: "{Color/primary/01}")
 * @param tokenData - Design token 데이터
 * @returns 해석된 값
 */
export function resolveTokenReference(
  reference: string,
  tokenData: DesignTokenData
): string | number {
  // 중괄호 제거
  const path = reference.slice(1, -1);

  // 경로 분리 (예: "Color/primary/01" -> ["Color", "primary", "01"])
  const parts = path.split("/");

  // 토큰 데이터에서 값 찾기
  let value: any = tokenData;
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = value[part];
    } else {
      console.warn(`Token reference not found: ${reference}`);
      return reference; // 찾지 못하면 원래 참조 반환
    }
  }

  // $value 속성이 있으면 해당 값 반환
  if (value && typeof value === "object" && "$value" in value) {
    return value.$value;
  }

  // $value가 없으면 전체 객체 반환
  return value;
}

/**
 * CSS 변수명으로 변환
 * @param reference - 토큰 참조
 * @returns CSS 변수명
 */
export function toCSSVariable(reference: string): string {
  if (!reference.startsWith("{") || !reference.endsWith("}")) {
    return reference;
  }

  // "{Color/primary/01}" -> "--color-primary-01"
  const path = reference.slice(1, -1);
  return `var(--${path.toLowerCase().replace(/\//g, "-")})`;
}

/**
 * 토큰 맵 생성 (CSS 변수 사용 시)
 * @param dslData - DSL 데이터
 * @returns 토큰 참조 -> CSS 변수 맵
 */
export function buildTokenMap(dslData: DSLData): Map<string, string> {
  const tokenMap = new Map<string, string>();

  const collectTokens = (obj: any): void => {
    if (typeof obj === "string" && obj.startsWith("{") && obj.endsWith("}")) {
      tokenMap.set(obj, toCSSVariable(obj));
    } else if (typeof obj === "object" && obj !== null) {
      for (const value of Object.values(obj)) {
        collectTokens(value);
      }
    }
  };

  collectTokens(dslData);
  return tokenMap;
}
