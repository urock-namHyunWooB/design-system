/**
 * Button IR 검증 테스트
 *
 * 생성된 IR이 올바른지 검증합니다.
 * IR 생성은 scripts/build-ir.mjs를 사용하세요.
 *
 * 실행: pnpm test:ir
 */

import { compile } from "../../dist/ir/compiler.js";
import { buttonDSL } from "../../dist/DSL/button.dsl.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=" + "=".repeat(60));
console.log("🧪 Button IR Validation Test");
console.log("=" + "=".repeat(60));
console.log("");

try {
  // 1. DSL 컴파일 (메모리에서만)
  console.log("📝 Compiling DSL to IR...\n");
  const startTime = Date.now();

  const ir = compile(buttonDSL, {
    version: "1.0.0",
    validate: true,
  });

  const endTime = Date.now();
  console.log(`✅ Compilation successful! (${endTime - startTime}ms)\n`);

  // 2. 기본 검증
  console.log("🔍 IR Validation:");
  console.log("─".repeat(60));

  const checks = [
    {
      name: "Component name",
      value: ir.metadata.component === "button",
      expected: "button",
      actual: ir.metadata.component,
    },
    {
      name: "Has metadata",
      value: !!ir.metadata,
      expected: "truthy",
      actual: !!ir.metadata,
    },
    {
      name: "Has structure",
      value: !!ir.structure,
      expected: "truthy",
      actual: !!ir.structure,
    },
    {
      name: "Has styles",
      value: !!ir.styles,
      expected: "truthy",
      actual: !!ir.styles,
    },
    {
      name: "Has 3 sizes",
      value: Object.keys(ir.styles.sizes).length === 3,
      expected: 3,
      actual: Object.keys(ir.styles.sizes).length,
    },
    {
      name: "Has 7 variants",
      value: Object.keys(ir.styles.variants).length === 7,
      expected: 7,
      actual: Object.keys(ir.styles.variants).length,
    },
    {
      name: "Has 4 parts",
      value: Object.keys(ir.structure.base.parts).length === 4,
      expected: 4,
      actual: Object.keys(ir.structure.base.parts).length,
    },
    {
      name: "Has animations",
      value: Object.keys(ir.animations).length > 0,
      expected: "> 0",
      actual: Object.keys(ir.animations).length,
    },
    {
      name: "Has props schema",
      value: !!ir.propsSchema,
      expected: "truthy",
      actual: !!ir.propsSchema,
    },
    {
      name: "Label is required",
      value: ir.propsSchema.required.includes("label"),
      expected: "label in required",
      actual: ir.propsSchema.required.join(", "),
    },
    {
      name: "Size prop exists",
      value: ir.propsSchema.optional.includes("size"),
      expected: "size in optional",
      actual: ir.propsSchema.optional.join(", "),
    },
    {
      name: "Tokens collected",
      value: ir.tokens.used.length > 0,
      expected: "> 0",
      actual: ir.tokens.used.length,
    },
  ];

  let passed = 0;
  let failed = 0;

  checks.forEach((check) => {
    if (check.value) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(
        `❌ ${check.name}: expected ${check.expected}, got ${check.actual}`
      );
      failed++;
    }
  });

  console.log("\n" + "─".repeat(60));
  console.log(`Results: ${passed}/${checks.length} passed`);

  if (failed > 0) {
    throw new Error(`${failed} test(s) failed`);
  }

  // 3. 상세 검증
  console.log("\n📊 IR Details:");
  console.log("─".repeat(60));
  console.log(`Component: ${ir.metadata.component}`);
  console.log(`Complexity: ${ir.metadata.complexity}`);
  console.log(`Sizes: ${ir.metadata.availableSizes.join(", ")}`);
  console.log(`Variants: ${ir.metadata.availableVariants.join(", ")}`);
  console.log(`States: ${ir.metadata.availableStates.join(", ")}`);
  console.log(`Parts: ${Object.keys(ir.structure.base.parts).join(", ")}`);
  console.log(`Tokens: ${ir.tokens.used.length} used`);
  console.log(
    `Props: ${ir.propsSchema.required.length} required, ${ir.propsSchema.optional.length} optional`
  );

  // 4. 구조 검증
  console.log("\n🏗️  Structure Validation:");
  console.log("─".repeat(60));
  const parts = ir.structure.base.parts;
  Object.entries(parts).forEach(([id, part]) => {
    const icon = part.type === "slot" ? "📦" : "🔹";
    const req = part.required ? "required" : "optional";
    console.log(`${icon} ${id}: ${part.type} (${req})`);
  });

  // 5. 스타일 레이어 검증
  console.log("\n🎨 Style Layers:");
  console.log("─".repeat(60));
  console.log(`✅ Sizes: ${Object.keys(ir.styles.sizes).join(", ")}`);
  console.log(`✅ Variants: ${Object.keys(ir.styles.variants).join(", ")}`);
  console.log(
    `✅ Interactions: ${Object.keys(ir.styles.interactions).join(", ")}`
  );
  console.log(
    `✅ Responsive: ${Object.keys(ir.styles.responsive).length} breakpoint(s)`
  );

  // 6. Token 검증
  console.log("\n🎨 Token Validation:");
  console.log("─".repeat(60));
  console.log(`Total: ${ir.tokens.used.length} tokens`);
  console.log(`Resolved: ${ir.tokens.resolved ? "Yes" : "No"}`);
  console.log(`Unresolved: ${ir.tokens.unresolved?.length || 0} tokens`);

  // 7. 생성된 IR 파일 확인 (선택적)
  const irFilePath = path.join(__dirname, "../../button.ir.json");
  if (fs.existsSync(irFilePath)) {
    const savedIR = JSON.parse(fs.readFileSync(irFilePath, "utf-8"));
    console.log("\n📄 Saved IR File:");
    console.log("─".repeat(60));
    console.log(`✅ File exists: packages/core/button.ir.json`);
    console.log(`   Component: ${savedIR.metadata.component}`);
    console.log(`   Generated: ${savedIR.metadata.generatedAt}`);
  } else {
    console.log("\n📄 Saved IR File:");
    console.log("─".repeat(60));
    console.log("⚠️  No IR file found. Run 'pnpm build:ir' to generate.");
  }

  // 성공
  console.log("\n" + "=".repeat(60));
  console.log("🎉 All validations passed!");
  console.log("=" + "=".repeat(60));
  console.log("");

  process.exit(0);
} catch (error) {
  console.error("\n❌ Validation failed!");
  console.error("─".repeat(60));
  console.error(error);

  if (error.errors) {
    console.error("\nCompilation Errors:");
    error.errors.forEach((e) => {
      console.error(`  - ${e.message}`);
    });
  }

  if (error.warnings && error.warnings.length > 0) {
    console.error("\nWarnings:");
    error.warnings.forEach((w) => {
      console.error(`  - ${w.message}`);
    });
  }

  console.error("");
  process.exit(1);
}
