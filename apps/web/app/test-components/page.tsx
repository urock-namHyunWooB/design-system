"use client";

import { Button } from "@repo/core/generated/react/Button";
import { Typography } from "@repo/core/generated/react/Typography";
import styles from "./test.module.css";

export default function TestComponentsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎨 Design System Components Test</h1>
        <p>자동 생성된 컴포넌트를 테스트합니다</p>
      </header>

      {/* Typography 테스트 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography Component</h2>

        <div className={styles.subsection}>
          <h3>Sizes (4 weights × 13 sizes)</h3>
          <div className={styles.grid}>
            {["bold", "semibold", "medium", "regular"].map((variant) => (
              <div key={variant} className={styles.column}>
                <h4>{variant}</h4>
                {[
                  "12",
                  "14",
                  "16",
                  "18",
                  "20",
                  "24",
                  "28",
                  "32",
                  "36",
                  "40",
                  "48",
                  "72",
                ].map((size) => (
                  <div key={`${variant}-${size}`} className={styles.item}>
                    <Typography
                      text={`Size ${size}`}
                      size={size as any}
                      variant={variant as any}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>Typography 사용 예시</h3>
          <div className={styles.examples}>
            <Typography text="Heading - 48/bold" size="48" variant="bold" />
            <Typography
              text="Subheading - 32/semibold"
              size="32"
              variant="semibold"
            />
            <Typography text="Body - 16/regular" size="16" variant="regular" />
            <Typography text="Caption - 12/medium" size="12" variant="medium" />
          </div>
        </div>
      </section>

      {/* Button 테스트 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Button Component</h2>

        <div className={styles.subsection}>
          <h3>Sizes (S, M, L)</h3>
          <div className={styles.buttonRow}>
            <Button label="Small Button" size="S" variant="filled" />
            <Button label="Medium Button" size="M" variant="filled" />
            <Button label="Large Button" size="L" variant="filled" />
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>Variants (7 types)</h3>
          <div className={styles.buttonColumn}>
            <div className={styles.buttonRow}>
              <Button label="Filled" size="M" variant="filled" />
              <Button label="Filled Red" size="M" variant="filled-red" />
            </div>
            <div className={styles.buttonRow}>
              <Button
                label="Outlined Black"
                size="M"
                variant="outlined-black"
              />
              <Button label="Outlined Blue" size="M" variant="outlined-blue" />
              <Button label="Outlined Red" size="M" variant="outlined-red" />
            </div>
            <div className={styles.buttonRow}>
              <Button label="Text Blue" size="M" variant="text-blue" />
              <Button label="Text Black" size="M" variant="text-black" />
            </div>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>With Icons (예시 - 실제 아이콘 연동 필요)</h3>
          <div className={styles.buttonRow}>
            <Button
              label="Download"
              leftIcon={<span>⬇️</span>}
              size="M"
              variant="filled"
            />
            <Button
              label="Next"
              rightIcon={<span>➡️</span>}
              size="M"
              variant="outlined-blue"
            />
            <Button
              label="Complete"
              leftIcon={<span>✅</span>}
              rightIcon={<span>🎉</span>}
              size="L"
              variant="filled"
            />
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>Size × Variant 조합 (일부)</h3>
          <div className={styles.buttonColumn}>
            {["S", "M", "L"].map((size) => (
              <div key={size} className={styles.buttonRow}>
                <Button
                  label={`${size} - filled`}
                  size={size as any}
                  variant="filled"
                />
                <Button
                  label={`${size} - outlined-blue`}
                  size={size as any}
                  variant="outlined-blue"
                />
                <Button
                  label={`${size} - text-blue`}
                  size={size as any}
                  variant="text-blue"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 통합 테스트 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Integration Example</h2>
        <div className={styles.card}>
          <Typography
            text="Welcome to our Design System"
            size="32"
            variant="bold"
          />
          <Typography
            text="자동 생성된 컴포넌트를 활용한 예시입니다."
            size="16"
            variant="regular"
          />
          <div className={styles.buttonRow} style={{ marginTop: "24px" }}>
            <Button label="Get Started" size="L" variant="filled" />
            <Button label="Learn More" size="L" variant="outlined-blue" />
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <Typography
          text="🎨 Generated by Design System Generator"
          size="14"
          variant="medium"
        />
        <Typography
          text="DSL → IR → React Components"
          size="12"
          variant="regular"
        />
      </footer>
    </div>
  );
}
