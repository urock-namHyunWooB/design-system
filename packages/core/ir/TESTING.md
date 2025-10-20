# IR 테스트 가이드

DSL → IR 컴파일러의 산출물을 테스트하는 방법

## 🎯 테스트 방법들

### 방법 1: npm 스크립트 (가장 쉬움) ⭐

```bash
# 빌드 + 테스트 한 번에
cd packages/core
pnpm build && pnpm test:ir

# 또는 테스트만 실행 (빌드가 이미 되어있다면)
pnpm test:ir
```

**또는 직접 실행:**

```bash
# 프로젝트 루트에서
node packages/core/tests/ir/button-ir.test.mjs
```

**결과:**

- ✅ 8개 검증 항목 자동 체크
- 📊 IR 상세 정보 출력
- 💾 `button.ir.json` 파일 생성
- 🎨 샘플 스타일 출력

---

### 방법 2: JSON 파일 직접 확인

```bash
# IR JSON 파일 열기
cat packages/core/button.ir.json

# 또는 예쁘게 보기
jq '.' packages/core/button.ir.json

# 특정 부분만 확인
jq '.metadata' packages/core/button.ir.json
jq '.styles.sizes.M' packages/core/button.ir.json
jq '.tokens.used' packages/core/button.ir.json
```

---

### 방법 3: Node.js REPL에서 인터랙티브 테스트

```bash
node
```

```javascript
// 컴파일러 import
const { compile } = require("./packages/core/dist/ir/compiler.js");
const { buttonDSL } = require("./packages/core/dist/DSL/button.dsl.js");

// 컴파일
const ir = compile(buttonDSL);

// 탐색
ir.metadata;
ir.styles.sizes.M;
ir.structure.base.parts;
ir.tokens.used;
```

---

### 방법 4: TypeScript에서 타입 체크와 함께 테스트

```typescript
// test-ir.ts
import { compile } from "@repo/core/ir";
import { buttonDSL } from "@repo/core";
import type { ComponentIR } from "@repo/core/ir";

const ir: ComponentIR = compile(buttonDSL);

// 타입 안전하게 접근
console.log(ir.metadata.component); // "button"
console.log(ir.styles.sizes.M.parts.container); // type-safe!
```

---

### 방법 5: Jest 테스트 작성

```typescript
// button-ir.test.ts
import { compile, isComponentIR } from "@repo/core/ir";
import { buttonDSL } from "@repo/core";

describe("Button IR Compiler", () => {
  let ir: ComponentIR;

  beforeAll(() => {
    ir = compile(buttonDSL);
  });

  test("should compile successfully", () => {
    expect(isComponentIR(ir)).toBe(true);
  });

  test("should have correct metadata", () => {
    expect(ir.metadata.component).toBe("button");
    expect(ir.metadata.availableSizes).toEqual(["S", "M", "L"]);
    expect(ir.metadata.availableVariants).toHaveLength(7);
  });

  test("should have 3 sizes", () => {
    expect(Object.keys(ir.styles.sizes)).toHaveLength(3);
    expect(ir.styles.sizes.M).toBeDefined();
  });

  test("should extract layout properties for size M", () => {
    const container = ir.styles.sizes.M.parts.container;
    expect(container.layout).toBeDefined();
    expect(container.layout?.height).toBe(40);
    expect(container.layout?.borderRadius).toBe(10);
  });

  test("should extract color properties for filled variant", () => {
    const container = ir.styles.variants.filled.parts.container;
    expect(container.colors).toBeDefined();
    expect(container.colors?.background).toBe("{Color/primary/01}");
  });

  test("should collect tokens", () => {
    expect(ir.tokens.used).toContain("{Color/primary/01}");
    expect(ir.tokens.used.length).toBeGreaterThan(0);
  });

  test("should generate props schema", () => {
    expect(ir.propsSchema.required).toContain("label");
    expect(ir.propsSchema.optional).toContain("size");
    expect(ir.propsSchema.optional).toContain("variant");
  });
});
```

---

## 🔍 검증 체크리스트

### ✅ 기본 검증

- [ ] IR이 유효한 ComponentIR 타입인가?
- [ ] metadata.component가 올바른가?
- [ ] availableSizes, availableVariants가 올바른가?
- [ ] structure.base.parts가 모두 정의되어 있는가?
- [ ] styles.sizes, styles.variants가 올바른가?

### ✅ 스타일 검증

- [ ] Size 레이어에 layout, spacing 속성이 올바르게 분류되었는가?
- [ ] Variant 레이어에 colors, effects 속성이 올바르게 분류되었는가?
- [ ] Interaction 레이어가 올바르게 변환되었는가?
- [ ] Responsive 레이어가 올바르게 변환되었는가?

### ✅ 토큰 검증

- [ ] 모든 토큰 참조가 수집되었는가?
- [ ] 중복 토큰이 없는가?
- [ ] 토큰 형식이 올바른가? (`{Category/subcategory/value}`)

### ✅ Props 스키마 검증

- [ ] 필수 slot이 required에 포함되었는가?
- [ ] size, variant prop이 생성되었는가?
- [ ] prop 타입이 올바르게 정의되었는가?

---

## 📊 IR 품질 메트릭

### 파일 크기

```bash
# Button IR 예상 크기
ls -lh packages/core/button.ir.json
# 약 14KB

# 압축 시
gzip -c packages/core/button.ir.json | wc -c
# 약 2-3KB
```

### 컴파일 시간

```javascript
const start = Date.now();
const ir = compile(buttonDSL);
console.log(`Compilation time: ${Date.now() - start}ms`);
// 예상: 1-5ms
```

### 토큰 사용량

```javascript
console.log(`Tokens used: ${ir.tokens.used.length}`);
// Button: 9개 토큰
```

---

## 🐛 문제 해결

### "Cannot find module" 에러

```bash
# 빌드가 되지 않았을 수 있음
cd packages/core
pnpm build
```

### "CompilationError" 발생

```javascript
try {
  const ir = compile(buttonDSL);
} catch (error) {
  if (error.errors) {
    console.log("Errors:", error.errors);
  }
  if (error.warnings) {
    console.log("Warnings:", error.warnings);
  }
}
```

### IR 타입 에러

```typescript
// isComponentIR로 타입 가드
if (isComponentIR(ir)) {
  // 이제 타입 안전함
  console.log(ir.metadata.component);
}
```

---

## 🎨 시각화 도구 (향후)

### JSON Viewer

```bash
# VS Code에서 열기
code packages/core/button.ir.json
```

### IR Diff Tool (계획)

```bash
# 두 IR 비교
npm run ir:diff button.ir.json button-v2.ir.json
```

### IR Visualizer (계획)

```bash
# IR을 다이어그램으로 시각화
npm run ir:visualize button.ir.json
```

---

## 📈 CI/CD 통합

### GitHub Actions

```yaml
name: Test IR Compilation

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

        - name: Test IR Compilation
          run: node packages/core/tests/ir/button-ir.test.mjs

      - name: Upload IR artifact
        uses: actions/upload-artifact@v3
        with:
          name: button-ir
          path: packages/core/button.ir.json
```

---

## 🔗 관련 문서

- [IR 타입 정의](./types.ts)
- [컴파일러 구현](./compiler.ts)
- [사용 가이드](./README.md)
