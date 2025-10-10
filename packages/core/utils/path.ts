import fs from "fs";
import path from "path";

/**
 * Monorepo 루트 경로를 반환합니다.
 * 기준:
 * - pnpm-workspace.yaml 또는 turbo.json 파일이 있는 디렉토리를 루트로 간주합니다.
 * - 위 파일들을 찾지 못하면, process.cwd()를 반환합니다.
 */
export function getRepoRoot(startDir: string = process.cwd()): string {
  let current = path.resolve(startDir);

  // 안전장치: 루프가 루트까지 올라가면 종료
  while (true) {
    const pnpmWorkspace = path.join(current, "pnpm-workspace.yaml");
    const turboJson = path.join(current, "turbo.json");

    if (fs.existsSync(pnpmWorkspace) || fs.existsSync(turboJson)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      // 파일을 찾지 못한 경우, 시작 디렉토리 기준을 반환
      return startDir;
    }

    current = parent;
  }
}

/**
 * 주어진 경로에서 가장 가까운 package.json이 위치한 디렉토리를 반환합니다.
 * 찾지 못하면 startDir를 반환합니다.
 */
export function getPackageRoot(startDir: string = process.cwd()): string {
  let current = path.resolve(startDir);

  while (true) {
    const pkgJson = path.join(current, "package.json");
    if (fs.existsSync(pkgJson)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return startDir;
    }

    current = parent;
  }
}
