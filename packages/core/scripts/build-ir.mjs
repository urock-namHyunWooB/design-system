/**
 * DSL → IR 빌드 스크립트
 *
 * DSL 파일을 읽어서 IR JSON 파일을 생성합니다.
 *
 * 사용법:
 *   node packages/core/scripts/build-ir.mjs
 *   pnpm build:ir
 */

import { compile } from "../dist/ir/compiler.js";
import { buttonDSL } from "../dist/DSL/button.dsl.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔧 Building IR from DSL...\n");

try {
  const startTime = Date.now();

  // DSL → IR 컴파일
  const ir = compile(buttonDSL, {
    version: "1.0.0",
    resolveTokens: false, // 필요시 true
    validate: true,
    optimize: false,
  });

  const endTime = Date.now();

  // IR을 JSON으로 저장
  const outputPath = path.join(__dirname, "../button.ir.json");
  const jsonStr = JSON.stringify(ir, null, 2);
  fs.writeFileSync(outputPath, jsonStr, "utf-8");

  const fileSize = (jsonStr.length / 1024).toFixed(2);

  console.log("✅ IR build successful!");
  console.log(`   Compilation time: ${endTime - startTime}ms`);
  console.log(`   Output: packages/core/button.ir.json`);
  console.log(`   File size: ${fileSize} KB`);
  console.log("");
  console.log("📊 Summary:");
  console.log(`   Component: ${ir.metadata.component}`);
  console.log(`   Sizes: ${ir.metadata.availableSizes.length}`);
  console.log(`   Variants: ${ir.metadata.availableVariants.length}`);
  console.log(`   Tokens: ${ir.tokens.used.length}`);
  console.log("");

  process.exit(0);
} catch (error) {
  console.error("❌ IR build failed!");
  console.error(error);

  if (error.errors) {
    console.error("\nErrors:");
    error.errors.forEach((e) => {
      console.error(`  - ${e.message}`);
    });
  }

  if (error.warnings) {
    console.error("\nWarnings:");
    error.warnings.forEach((w) => {
      console.error(`  - ${w.message}`);
    });
  }

  process.exit(1);
}
