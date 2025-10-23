import { defineConfig, devices } from "@playwright/experimental-ct-react";
import path from "path";

/**
 * Playwright Component Testing Configuration
 *
 * 생성된 React 컴포넌트들을 테스트합니다.
 */
export default defineConfig({
  testDir: "./tests/components",

  /* 병렬 실행 설정 */
  fullyParallel: true,

  /* CI에서 재시도 */
  retries: process.env.CI ? 2 : 0,

  /* CI에서는 워커 제한 */
  workers: process.env.CI ? 1 : undefined,

  /* 리포터 설정 */
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],

  /* 컴포넌트 테스트 설정 */
  use: {
    /* 스크린샷을 위한 기본 URL */
    baseURL: "http://localhost:3100",

    /* 실패 시 스크린샷 */
    screenshot: "only-on-failure",

    /* 실패 시 trace */
    trace: "on-first-retry",

    /* 컴포넌트 테스트용 설정 */
    ctPort: 3100,
    ctViteConfig: {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./"),
        },
      },
    },
  },

  /* 다양한 브라우저에서 테스트 */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
