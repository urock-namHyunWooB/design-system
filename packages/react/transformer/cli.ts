#!/usr/bin/env node

import { transformDSLToReactComponent, transformAllDSLToReact } from "./index";
import type { TransformOptions } from "@repo/core";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CLI 도구 - DSL을 React 컴포넌트로 변환
 */

async function main() {
  const args = process.argv.slice(2);

  const command = args[0];

  // 옵션 파싱
  const tokenPathIndex = args.indexOf("--token");
  const styleIndex = args.indexOf("--style");

  const defaultTokenPath = path.join(
    process.cwd(),
    "../design-token/default-token.json"
  );

  const tokenPath =
    tokenPathIndex !== -1 ? args[tokenPathIndex + 1] : defaultTokenPath;

  const styleType = styleIndex !== -1 ? args[styleIndex + 1] : "tailwind";

  const options: TransformOptions = {
    useCSS: styleType === "css",
    useTailwind: styleType === "tailwind",
  };

  try {
    if (command === "all") {
      const dslDir = args[1];
      const outputDir = args[2];

      if (!dslDir || !outputDir) {
        console.error(
          'Error: dslDir and outputDir are required for "all" command'
        );
        process.exit(1);
      }

      console.log("🔄 Transforming all DSL files to React components...");
      console.log(`   DSL Directory: ${dslDir}`);
      console.log(`   Token: ${tokenPath}`);
      console.log(`   Output Directory: ${outputDir}`);
      console.log(`   Style: ${styleType}`);
      console.log("");

      const results = await transformAllDSLToReact(
        path.resolve(dslDir),
        path.resolve(tokenPath || ""),
        path.resolve(outputDir),
        options
      );

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      console.log("");
      console.log("📊 Transformation Summary:");
      console.log(`   ✅ Success: ${successCount}`);
      console.log(`   ❌ Failed: ${failCount}`);

      if (failCount > 0) {
        console.log("\nFailed transformations:");
        results
          .filter((r) => !r.success)
          .forEach((r) => {
            console.log(`   - ${r.file}: ${r.error}`);
          });
      }
    } else {
      console.error(`Error: Unknown command "${command}"`);
      printHelp();
      process.exit(1);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
