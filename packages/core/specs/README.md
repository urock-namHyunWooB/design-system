# Component Specifications

이 디렉토리는 디자인 시스템 컴포넌트의 Spec을 포함합니다.

## Spec Version

**Current Version: v1.0.0**

## 작성된 Spec

- ✅ `button.spec.json` - Button 컴포넌트

## Spec 검증

```bash
# 특정 spec 검증
npx tsx tools/validate-spec.ts specs/button.spec.json

# 모든 spec 검증 (TODO)
npm run validate:specs
```

## Spec 구조

```typescript
{
  meta: {
    component: string;     // 컴포넌트 이름
    version: string;       // Semantic version
    category?: string;     // 카테고리
    description?: string;  // 설명
  },

  structure: {
    parts: { ... },        // Part 정의
    order: [ ... ],        // 렌더링 순서
    layout?: { ... }       // 레이아웃 설정
  },

  styles: {
    base?: { ... },        // 기본 스타일
    sizes?: { ... },       // 크기별 스타일
    variants?: { ... },    // Variant별 스타일
    states?: { ... },      // 상태별 스타일
    responsive?: { ... }   // 반응형 스타일
  },

  motion?: { ... },        // 애니메이션
  props?: { ... },         // Props 정의
  events?: { ... },        // Events 정의
  config?: { ... },        // 설정
  accessibility: { ... },  // 접근성
  metadata?: { ... }       // 메타데이터
}
```

## 다음 작성할 Spec

- [ ] `input.spec.json` - Input 컴포넌트
- [ ] `select.spec.json` - Select 컴포넌트
- [ ] `switch.spec.json` - Switch 컴포넌트
- [ ] `checkbox.spec.json` - Checkbox 컴포넌트
- [ ] `badge.spec.json` - Badge 컴포넌트
- [ ] `card.spec.json` - Card 컴포넌트

## Spec 작성 가이드

### 1. 기본 구조 결정

- 어떤 part들이 필요한가?
- 렌더링 순서는?
- 레이아웃은?

### 2. 스타일 정의

- Base 스타일 (모든 경우에 적용)
- Size variants (S, M, L 등)
- Visual variants (filled, outlined 등)
- States (hover, active, disabled 등)

### 3. Props & Events

- 어떤 props가 필요한가?
- Controlled props는?
- 어떤 events가 필요한가?

### 4. 접근성

- ARIA role
- 키보드 단축키
- 최소 터치 타겟

### 5. 검증

```bash
npx tsx tools/validate-spec.ts specs/your-component.spec.json
```

## 스타일 병합 순서

```
base → size → variant → state
```

예: `<Button size="M" variant="filled">` (hover 상태)

```
base.container
  + sizes.M.container
  + variants.filled.container
  + states.hover.container  (현재 상태)
```

## 주의사항

### ✅ 권장

- 스타일은 토큰 사용 (`var(--color-primary)`)
- 명확한 part 이름
- 상세한 description
- 예제 코드 포함

### ❌ 피해야 할 것

- 하드코딩된 색상 값
- 모호한 part 이름
- 불필요하게 복잡한 구조
- 비즈니스 로직 포함

## 참고

- [Spec 타입 정의](../types/spec/index.ts)
- [Button 예제](./button.spec.json)
