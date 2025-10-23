#!/usr/bin/env tsx
/**
 * Spec Validator
 *
 * Usage:
 *   tsx tools/validate-spec.ts specs/button.spec.json
 */

import fs from "fs";
import path from "path";
import {
  ComponentSpec,
  validateSpec,
  isComponentSpec,
} from "../types/spec/index.js";

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: tsx tools/validate-spec.ts <spec-file>");
    process.exit(1);
  }

  const specPath = args[0];
  const absolutePath = path.resolve(process.cwd(), specPath);

  console.log(`🔍 Validating: ${specPath}\n`);

  // 파일 존재 확인
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    process.exit(1);
  }

  // JSON 파싱
  let spec: any;
  try {
    const content = fs.readFileSync(absolutePath, "utf-8");
    spec = JSON.parse(content);
  } catch (error) {
    console.error(`❌ Invalid JSON:`);
    console.error(error);
    process.exit(1);
  }

  // 타입 체크
  if (!isComponentSpec(spec)) {
    console.error(`❌ Invalid ComponentSpec structure`);
    console.error("   Required fields: meta, structure, styles, accessibility");
    process.exit(1);
  }

  // Spec 검증
  const result = validateSpec(spec as ComponentSpec);

  if (result.valid) {
    console.log("✅ Spec is valid!");
    console.log("");
    console.log("📋 Summary:");
    console.log(`   Component: ${spec.meta.component}`);
    console.log(`   Version: ${spec.meta.version}`);
    console.log(`   Parts: ${Object.keys(spec.structure.parts).length}`);
    console.log(
      `   Sizes: ${spec.styles.sizes ? Object.keys(spec.styles.sizes).length : 0}`
    );
    console.log(
      `   Variants: ${spec.styles.variants ? Object.keys(spec.styles.variants).length : 0}`
    );
    console.log(`   Props: ${spec.props ? Object.keys(spec.props).length : 0}`);
    console.log(
      `   Events: ${spec.events ? Object.keys(spec.events).length : 0}`
    );
    process.exit(0);
  } else {
    console.error("❌ Spec validation failed:\n");
    result.errors.forEach((error) => {
      console.error(`   ${error.path}: ${error.message}`);
    });
    process.exit(1);
  }
}

main();
