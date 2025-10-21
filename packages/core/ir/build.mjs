/**
 * DSL → IR 빌드 스크립트
 *
 * DSL 폴더의 모든 파일을 읽어서 IR JSON 파일을 생성합니다.
 *
 * 사용법:
 *   node packages/core/ir/build.mjs
 *   pnpm build:ir
 */

import { compile } from "../dist/ir/compiler.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔧 Building IR from all DSL files...\n");

async function buildAll() {
  try {
    const startTime = Date.now();

    // 1. DSL 폴더에서 모든 .dsl.ts 파일 찾기
    const dslDir = path.join(__dirname, "../dist/DSL");
    const dslFiles = fs
      .readdirSync(dslDir)
      .filter((file) => file.endsWith(".dsl.js"));

    if (dslFiles.length === 0) {
      console.error("❌ No DSL files found in dist/DSL/");
      console.error("   Run 'pnpm build' first to compile TypeScript files.\n");
      process.exit(1);
    }

    console.log(`📂 Found ${dslFiles.length} DSL file(s):`);
    dslFiles.forEach((file) => console.log(`   - ${file}`));
    console.log("");

    const results = [];

    // 2. 각 DSL 파일 처리
    for (const file of dslFiles) {
      const dslPath = path.join(dslDir, file);
      const componentName = file.replace(".dsl.js", "");

      console.log(`📝 Processing: ${componentName}`);

      try {
        // 동적 import
        const dslModule = await import(dslPath);

        // DSL export 찾기 (componentNameDSL 형태)
        const dslExportName = `${componentName}DSL`;
        const dsl = dslModule[dslExportName];

        if (!dsl) {
          console.error(
            `   ❌ Error: No export named '${dslExportName}' found in ${file}`
          );
          continue;
        }

        // DSL → IR 컴파일
        const ir = compile(dsl, {
          version: "1.0.0",
          resolveTokens: false,
          validate: true,
          optimize: false,
        });

        // IR을 JSON으로 저장
        const outputPath = path.join(
          __dirname,
          "../generated/ir/",
          `${componentName}.ir.json`
        );

        // 폴더가 없으면 생성
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const jsonStr = JSON.stringify(ir, null, 2);
        fs.writeFileSync(outputPath, jsonStr, "utf-8");

        const fileSize = (jsonStr.length / 1024).toFixed(2);

        console.log(`   ✅ Success!`);
        console.log(`      Output: packages/core/${componentName}.ir.json`);
        console.log(`      Size: ${fileSize} KB`);
        console.log(
          `      Sizes: ${ir.metadata.availableSizes.length}, Variants: ${ir.metadata.availableVariants.length}`
        );
        console.log("");

        results.push({
          component: componentName,
          success: true,
          size: fileSize,
        });
      } catch (error) {
        console.error(`   ❌ Failed to compile ${componentName}`);
        console.error(`      ${error.message}`);
        console.error("");

        results.push({
          component: componentName,
          success: false,
          error: error.message,
        });
      }
    }

    const endTime = Date.now();

    // 3. 결과 요약
    console.log("=".repeat(60));
    console.log("📊 Build Summary");
    console.log("=".repeat(60));

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`Total: ${results.length} component(s)`);
    console.log(`✅ Success: ${successful.length}`);
    if (failed.length > 0) {
      console.log(`❌ Failed: ${failed.length}`);
    }
    console.log(`⏱️  Duration: ${endTime - startTime}ms`);
    console.log("");

    if (successful.length > 0) {
      console.log("Generated IR files:");
      successful.forEach((r) => {
        console.log(`  ✅ ${r.component}.ir.json (${r.size} KB)`);
      });
      console.log("");
    }

    if (failed.length > 0) {
      console.log("Failed components:");
      failed.forEach((r) => {
        console.log(`  ❌ ${r.component}: ${r.error}`);
      });
      console.log("");
      process.exit(1);
    }

    console.log("🎉 All IR files built successfully!");
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Build failed!");
    console.error("─".repeat(60));
    console.error(error);
    console.error("");
    process.exit(1);
  }
}

buildAll();
