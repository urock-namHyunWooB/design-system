/**
 * @repo/core 메인 export
 * 플랫폼 독립적인 DSL 처리 기능 제공
 */

// Types
export * from "./types";

// DSL 데이터 export
export { buttonDSL } from "./DSL/button.dsl";

// Note: IR types는 명시적 import 필요
// import type { ComponentIR } from "@repo/core/ir";
