# Component Tests

Playwright Component Testing을 사용한 생성된 React 컴포넌트 테스트입니다.

## 개요

이 테스트는 DSL → IR → React 컴포넌트 생성 파이프라인의 결과물인 React 컴포넌트들이 올바르게 동작하는지 검증합니다.

## 테스트 구조

```
tests/components/
├── Button.spec.tsx       # Button 컴포넌트 테스트
├── Typography.spec.tsx   # Typography 컴포넌트 테스트
├── index.html           # Playwright CT 진입점
├── setup.ts             # 테스트 설정
└── README.md            # 이 문서
```

## 실행 방법

### 1. 모든 테스트 실행 (헤드리스 모드)

```bash
pnpm test:components
```

### 2. UI 모드로 실행 (개발 시 권장)

```bash
pnpm test:components:ui
```

UI 모드는 다음 기능을 제공합니다:

- 실시간 테스트 실행 및 결과 확인
- 각 단계별 스크린샷 확인
- 테스트 디버깅
- 재실행 및 필터링

### 3. 헤드풀 모드로 실행 (브라우저 보기)

```bash
pnpm test:components:headed
```

### 4. 디버그 모드로 실행

```bash
pnpm test:components:debug
```

### 5. 전체 테스트 실행 (IR + 컴포넌트)

```bash
pnpm test:all
```

## 테스트 범위

### Button 컴포넌트

- ✅ **기본 렌더링**: 필수 props, icon 슬롯
- ✅ **Sizes**: S, M, L
- ✅ **Variants**: filled, outlined-_, text-_
- ✅ **조합**: size + variant + icons
- ✅ **Visual Regression**: 스크린샷 비교
- ✅ **접근성**: 구조, 콘텐츠
- ✅ **Edge Cases**: 빈 문자열, 긴 텍스트, 특수 문자

### Typography 컴포넌트

- ✅ **기본 렌더링**: 텍스트 콘텐츠
- ✅ **Sizes**: 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 72, 120
- ✅ **Variants**: bold, semibold, medium, regular
- ✅ **조합**: size + variant
- ✅ **Visual Regression**: 스크린샷 비교
- ✅ **접근성**: 구조, 가독성
- ✅ **Edge Cases**: 빈 문자열, 긴 텍스트, 특수 문자, 다국어

## 파이프라인 통합

이 테스트는 다음 파이프라인의 최종 단계입니다:

```
DSL 작성
  ↓
DSL → IR 컴파일 (test:ir로 검증)
  ↓
IR → React 생성
  ↓
React 컴포넌트 테스트 (test:components로 검증) ← 여기
```

### 전체 파이프라인 테스트

```bash
# 1. IR 생성 및 검증
pnpm build:ir
pnpm test:ir

# 2. React 컴포넌트 생성
pnpm generate

# 3. 컴포넌트 테스트
pnpm test:components
```

또는 한 번에:

```bash
pnpm pipeline && pnpm test:all
```

## 브라우저 테스트

기본적으로 다음 브라우저에서 테스트합니다:

- Chromium
- Firefox
- WebKit (Safari)

특정 브라우저만 테스트하려면:

```bash
playwright test --project=chromium
playwright test --project=firefox
playwright test --project=webkit
```

## 스크린샷 업데이트

Visual regression 테스트의 기준 스크린샷을 업데이트하려면:

```bash
playwright test --update-snapshots
```

## CI/CD 통합

CI 환경에서는 다음과 같이 실행됩니다:

```bash
# CI 환경 감지 시 자동으로 적용됨
# - 최대 2회 재시도
# - 단일 워커 사용
# - HTML 리포트 생성
pnpm test:components
```

## 테스트 작성 가이드

새로운 컴포넌트 테스트를 추가할 때:

```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import { YourComponent } from '../../generated/react/YourComponent';

test.describe('YourComponent', () => {
  test('should render', async ({ mount }) => {
    const component = await mount(<YourComponent prop="value" />);
    await expect(component).toBeVisible();
  });
});
```

## 리포트

테스트 실행 후 HTML 리포트가 생성됩니다:

```bash
# 리포트 보기
npx playwright show-report playwright-report
```

## 문제 해결

### CSS가 로드되지 않는 경우

Playwright의 Vite 설정을 확인하세요 (`playwright.config.ts`의 `ctViteConfig`).

### 컴포넌트를 찾을 수 없는 경우

1. 컴포넌트가 생성되었는지 확인: `ls generated/react/`
2. 필요시 재생성: `pnpm generate`

### 테스트가 실패하는 경우

1. UI 모드로 실행하여 확인: `pnpm test:components:ui`
2. 디버그 모드로 실행: `pnpm test:components:debug`
3. 스크린샷 업데이트 필요 여부 확인: `playwright test --update-snapshots`

## 참고 자료

- [Playwright Component Testing](https://playwright.dev/docs/test-components)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [React Testing](https://playwright.dev/docs/test-components#react)
