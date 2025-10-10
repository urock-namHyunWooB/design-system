import fs from "fs";
import path from "path";
import type {
  DSLData,
  DesignTokenData,
  TransformOptions,
  TransformResult,
} from "@repo/core";
import { resolveTokens } from "../../core/token-resolver";
import { validateDSL } from "../../core/parser";
import { generateComponent } from "./componentGenerator";

/**
 * DSL 파일을 React 컴포넌트로 변환하는 메인 함수
 */
export async function transformDSLToReactComponent(
  dslPath: string,
  tokenPath: string,
  outputPath: string,
  options: TransformOptions = {}
): Promise<TransformResult> {
  try {
    // DSL 파일 읽기
    const dslContent = fs.readFileSync(dslPath, "utf-8");
    const dslData = JSON.parse(dslContent) as DSLData;

    // Design token 파일 읽기
    const tokenContent = fs.readFileSync(tokenPath, "utf-8");
    const tokenData = JSON.parse(tokenContent) as DesignTokenData;

    // DSL 데이터 검증
    validateDSL(dslData);

    // 토큰 참조를 실제 값으로 변환
    const resolvedDSL = resolveTokens(dslData, tokenData);

    // React 컴포넌트 코드 생성
    const outputFileName = path.basename(outputPath);
    const componentCode = generateComponent(resolvedDSL, {
      ...options,
      outputFileName,
    });

    // 출력 디렉토리가 없으면 생성
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 파일 저장
    fs.writeFileSync(outputPath, componentCode, "utf-8");

    console.log(`✓ React component generated successfully: ${outputPath}`);

    return {
      success: true,
      outputPath,
      component: dslData.component,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error transforming DSL to React component:", errorMessage);
    throw error;
  }
}

/**
 * 디렉토리의 모든 DSL 파일을 React 컴포넌트로 변환
 */
export async function transformAllDSLToReact(
  dslDir: string,
  tokenPath: string,
  outputDir: string,
  options: TransformOptions = {}
): Promise<TransformResult[]> {
  const files = fs.readdirSync(dslDir);
  const dslFiles = files.filter((file) => file.endsWith(".dsl.json"));

  const results: TransformResult[] = [];

  for (const file of dslFiles) {
    const dslPath = path.join(dslDir, file);
    const componentName = file.replace(".dsl.json", "");
    const outputPath = path.join(outputDir, `${componentName}.tsx`);

    try {
      const result = await transformDSLToReactComponent(
        dslPath,
        tokenPath,
        outputPath,
        options
      );
      results.push(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Failed to transform ${file}:`, errorMessage);
      results.push({
        success: false,
        file,
        error: errorMessage,
      });
    }
  }

  return results;
}
