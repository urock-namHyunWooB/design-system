/**
 * Component Generator Script
 *
 * 모든 IR 파일을 읽어서 React 컴포넌트를 생성합니다.
 *
 * 사용법:
 *   node packages/core/generator/generate.mjs
 *   pnpm generate
 */

import { generateReactComponent } from "../dist/generator/platforms/react/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🎨 Generating React Components from all IR files...\n");

async function generateAll() {
  try {
    const startTime = Date.now();

    // 1. IR 파일 찾기
    const coreDir = path.join(__dirname, "../generated/ir/");
    const irFiles = fs
      .readdirSync(coreDir)
      .filter((file) => file.endsWith(".ir.json"));

    if (irFiles.length === 0) {
      console.error("❌ No IR files found!");
      console.error("   Run 'pnpm build:ir' first to generate IR files.\n");
      process.exit(1);
    }

    console.log(`📂 Found ${irFiles.length} IR file(s):`);
    irFiles.forEach((file) => console.log(`   - ${file}`));
    console.log("");

    const results = [];

    // 2. 각 IR 파일 처리
    for (const file of irFiles) {
      const irPath = path.join(coreDir, file);
      const componentName = file.replace(".ir.json", "");

      console.log(`📝 Generating: ${componentName}`);

      try {
        // IR 읽기
        const irContent = fs.readFileSync(irPath, "utf-8");
        const ir = JSON.parse(irContent);

        console.log(
          `   Component: ${ir.metadata.component}, Sizes: ${ir.metadata.availableSizes.join(", ")}`
        );

        // React 컴포넌트 생성
        const result = generateReactComponent(ir, {
          outputDir: "./generated",
          includeComments: true,
          includeTimestamp: true,
          usePlatformFolder: true,
        });

        if (!result.success) {
          console.error(`   ❌ Failed to generate ${componentName}`);
          result.errors.forEach((err) => {
            console.error(`      ${err}`);
          });
          console.error("");

          results.push({
            component: componentName,
            success: false,
            errors: result.errors,
          });
          continue;
        }

        // 파일 저장
        for (const file of result.files) {
          const fullPath = path.join(coreDir, file.path);

          // 디렉토리가 없으면 생성
          const dir = path.dirname(fullPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          fs.writeFileSync(fullPath, file.content, "utf-8");
        }

        console.log(`   ✅ Success!`);
        console.log(
          `      Files: ${result.files.length}, Lines: ${result.stats.totalLines}, Size: ${(result.stats.totalSize / 1024).toFixed(2)} KB`
        );
        console.log("");

        results.push({
          component: componentName,
          success: true,
          files: result.files.length,
          lines: result.stats.totalLines,
          size: (result.stats.totalSize / 1024).toFixed(2),
        });
      } catch (error) {
        console.error(`   ❌ Failed to generate ${componentName}`);
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
    console.log("📊 Generation Summary");
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
      console.log("Generated components:");
      successful.forEach((r) => {
        console.log(
          `  ✅ ${r.component} (${r.files} files, ${r.lines} lines, ${r.size} KB)`
        );
      });
      console.log("");
    }

    if (failed.length > 0) {
      console.log("Failed components:");
      failed.forEach((r) => {
        console.log(`  ❌ ${r.component}: ${r.error || r.errors?.join(", ")}`);
      });
      console.log("");
      process.exit(1);
    }

    console.log("🎉 All components generated successfully!");
    console.log("");
    console.log("📄 Output directory: packages/core/generated/react/");
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Generation failed!");
    console.error("─".repeat(60));
    console.error(error);
    console.error("");
    process.exit(1);
  }
}

generateAll();
