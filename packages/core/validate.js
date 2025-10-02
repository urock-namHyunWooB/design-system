import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import Ajv from "ajv/dist/2020.js"; // ✅ 핵심: 2020용 클래스

// const root = new URL("..", import.meta.url).pathname;
const root = new URL("./", import.meta.url).pathname;
const schemaPath = path.join(root, "DSL", "button.schema.json");
const dslPath = path.join(root, "DSL", "button.dsl.json");

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const data = JSON.parse(fs.readFileSync(dslPath, "utf-8"));

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const valid = validate(data);

if (valid) {
  console.log("✅ Button DSL is valid.");
  process.exit(0);
} else {
  console.error("❌ Button DSL validation failed.\n");
  for (const err of validate.errors ?? []) {
    console.error(`- ${err.instancePath || "(root)"} ${err.message}`);
    if (err.params) console.error(`  params: ${JSON.stringify(err.params)}`);
  }
  process.exit(1);
}
