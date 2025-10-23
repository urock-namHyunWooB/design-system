ㅌㅏ# DSL 한계점 및 확장 방안

## 현재 DSL 구조

```typescript
interface BaseDSL {
  structure: { layout, parts, hierarchy }  // ✅ 정적 구조
  sizes: { ... }                           // ✅ 크기별 스타일
  types: { ... }                           // ✅ variant별 스타일
  interactions: { ... }                    // ✅ 상태별 스타일 (hover, pressed)
  motion: { ... }                          // ✅ 애니메이션
  responsive: { ... }                      // ✅ 반응형
  accessibility: { ... }                   // ✅ 접근성
}
```

## 표현할 수 없는 것들

### 1. **이벤트 핸들러 & Callbacks**

❌ 현재: 없음

```typescript
// 필요한 것:
events?: {
  onClick?: EventHandler;
  onChange?: EventHandler;
  onSubmit?: EventHandler;
}
```

### 2. **Controlled Props (상태 관리)**

❌ 현재: 없음

```typescript
// Input 예시
props: {
  value: {
    type: "controlled",
    stateType: "string",
    changeHandler: "onChange"
  }
}
```

### 3. **동적 Children (리스트/반복)**

❌ 현재: 정적 슬롯만 가능

```typescript
// 필요한 것:
parts: {
  items: {
    type: "collection",
    itemType: "node",
    renderStrategy: "map"
  }
}
```

### 4. **조건부 렌더링 (복잡한 로직)**

❌ 현재: visibility rule만 IR에 있음 (DSL에는 없음)

```typescript
// 필요한 것:
conditionalRender?: {
  when: Condition;
  render: PartId[];
  else?: PartId[];
}
```

### 5. **중첩 컴포넌트 (Composition)**

❌ 현재: 단일 컴포넌트만

```typescript
// Select는 Dropdown + Input + List의 조합
composition?: {
  uses: ["Dropdown", "Input", "List"];
  mapping: { ... }
}
```

### 6. **데이터 바인딩 & Transformation**

❌ 현재: 없음

```typescript
// Table의 columns → cells 변환
dataBinding?: {
  source: "props.data";
  transform: "mapToRows";
  target: "parts.rows";
}
```

### 7. **Form Validation**

❌ 현재: 없음

```typescript
validation?: {
  rules: [
    { field: "email", type: "email" },
    { field: "password", type: "minLength", value: 8 }
  ]
}
```

### 8. **포커스 관리 & 키보드 네비게이션**

⚠️ 현재: 단순 keyboard shortcut만

```typescript
// 복잡한 포커스 트랩, 모달 포커스 관리 필요
focusManagement?: {
  trapFocus: boolean;
  initialFocus: PartId;
  returnFocus: boolean;
}
```

## 확장 전략

### 방안 1: **BaseDSL 확장 (모든 컴포넌트에 추가)**

```typescript
interface BaseDSL {
  // 기존...

  // ✨ 추가
  events?: EventDefinitions;
  state?: StateDefinitions;
  dataBinding?: DataBindingRules;
  validation?: ValidationRules;
}
```

**장점:** 일관성, 한 곳에서 관리
**단점:** 모든 컴포넌트가 무거워짐

### 방안 2: **컴포넌트별 확장 (Typography의 families처럼)**

```typescript
interface InputDSL extends BaseDSL {
  component: "input";

  // ✨ Input 전용
  controlledProps: {
    value: { type: "string"; handler: "onChange" };
  };
}

interface SelectDSL extends BaseDSL {
  component: "select";

  // ✨ Select 전용
  options: OptionDefinition[];
  dropdown: DropdownConfig;
}
```

**장점:** 컴포넌트별 최적화
**단점:** 공통 패턴 중복

### 방안 3: **Behavior 믹스인 (조합형)**

```typescript
interface InputDSL extends
  BaseDSL,
  WithControlledState,
  WithValidation,
  WithEvents {
  component: "input";
}

interface WithControlledState {
  controlledProps: { ... }
}

interface WithValidation {
  validation: { ... }
}
```

**장점:** 재사용성, 유연성
**단점:** 타입 복잡도

## 추천: **단계적 확장**

### Phase 1: Simple Components (완료)

- Button, Typography, Badge, Avatar
- 현재 DSL로 충분

### Phase 2: Interactive Components (필요)

- Input, Checkbox, Radio, Switch
- **필요:** `events`, `controlledProps`

### Phase 3: Composite Components (필요)

- Select, Dropdown, DatePicker
- **필요:** `composition`, `state`, `conditionalRender`

### Phase 4: Complex Components (필요)

- Modal, Dialog, Drawer
- **필요:** `focusManagement`, `portal`

### Phase 5: Data Components (필요)

- Table, List, Tree
- **필요:** `dataBinding`, `collection`, `virtualization`

## 다음 단계

1. **Behavior 타입 정의**
   - `WithEvents`, `WithState`, `WithValidation` 등

2. **BaseDSL 확장**
   - 옵셔널 필드로 추가

3. **Compiler 업데이트**
   - 새로운 필드 → IR 변환

4. **Input 컴포넌트 POC**
   - 확장된 DSL 테스트
