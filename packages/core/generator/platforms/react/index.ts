/**
 * React Platform Generator
 *
 * Host Config 패턴을 사용한 React 컴포넌트 생성기
 */

import { BaseRenderer } from "../../core/Renderer.js";
import { ReactHostConfig } from "./ReactHostConfig.js";
import type { ComponentIR } from "../../../ir/types.js";
import type { GeneratorResult, GeneratedFile } from "../../types.js";

/**
 * React 컴포넌트 생성
 */
export function generateReactComponent(
  ir: ComponentIR,
  options: {
    outputDir?: string;
    includeComments?: boolean;
    includeTimestamp?: boolean;
    usePlatformFolder?: boolean; // 플랫폼 폴더 사용 여부
  } = {}
): GeneratorResult {
  const startTime = Date.now();

  try {
    // Host Config 생성
    const hostConfig = new ReactHostConfig();

    // Renderer 생성
    const renderer = new BaseRenderer(hostConfig, {
      includeComments: options.includeComments,
      includeTimestamp: options.includeTimestamp,
    });

    // 렌더링
    const files = renderer.render(ir);

    // output dir 추가 (플랫폼 폴더 포함)
    const baseOutputDir = options.outputDir || "./generated";
    const usePlatformFolder = options.usePlatformFolder ?? true; // 기본값 true

    const filesWithPath = files.map((file) => {
      let fullPath: string;

      if (usePlatformFolder) {
        // ./generated/react/Button.tsx 형태
        fullPath = `${baseOutputDir}/${hostConfig.platformName}/${file.path}`;
      } else {
        // ./generated/Button.tsx 형태
        fullPath = `${baseOutputDir}/${file.path}`;
      }

      return {
        ...file,
        path: fullPath,
      };
    });

    const endTime = Date.now();

    // 통계 계산
    const stats = {
      totalFiles: filesWithPath.length,
      totalLines: filesWithPath.reduce(
        (sum, file) => sum + file.content.split("\n").length,
        0
      ),
      totalSize: filesWithPath.reduce(
        (sum, file) => sum + file.content.length,
        0
      ),
      duration: endTime - startTime,
    };

    return {
      success: true,
      files: filesWithPath,
      errors: [],
      warnings: [],
      stats,
    };
  } catch (error) {
    const endTime = Date.now();

    return {
      success: false,
      files: [],
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: [],
      stats: {
        totalFiles: 0,
        totalLines: 0,
        totalSize: 0,
        duration: endTime - startTime,
      },
    };
  }
}

export { ReactHostConfig } from "./ReactHostConfig.js";
