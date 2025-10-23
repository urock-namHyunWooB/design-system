import { test, expect } from "@playwright/experimental-ct-react";
import { Typography } from "../../generated/react/Typography";

/**
 * Typography Component Tests
 *
 * 생성된 Typography 컴포넌트의 렌더링, 스타일, 접근성을 테스트합니다.
 */

test.describe("Typography Component", () => {
  test.describe("Basic Rendering", () => {
    test("should render with required props", async ({ mount }) => {
      const component = await mount(<Typography text="Hello World" />);
      await expect(component).toBeVisible();
      await expect(component).toContainText("Hello World");
    });

    test("should render React nodes as text", async ({ mount }) => {
      const component = await mount(
        <Typography
          text={
            <span data-testid="complex-text">
              <strong>Bold</strong> and <em>italic</em>
            </span>
          }
        />
      );

      await expect(component).toBeVisible();
      const complexText = component.getByTestId("complex-text");
      await expect(complexText).toBeVisible();
      await expect(component).toContainText("Bold and italic");
    });
  });

  test.describe("Sizes", () => {
    const sizes = [
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
      "120",
    ] as const;

    sizes.forEach((size) => {
      test(`should render size: ${size}`, async ({ mount }) => {
        const component = await mount(
          <Typography text={`Size ${size}px`} size={size} />
        );

        await expect(component).toBeVisible();
        await expect(component).toContainText(`Size ${size}px`);

        // CSS 클래스 확인
        const className = await component.getAttribute("class");
        expect(className).toContain(`size-${size}`);
      });
    });

    test("should render without size (default)", async ({ mount }) => {
      const component = await mount(<Typography text="Default size" />);
      await expect(component).toBeVisible();
    });
  });

  test.describe("Variants", () => {
    const variants = ["bold", "semibold", "medium", "regular"] as const;

    variants.forEach((variant) => {
      test(`should render variant: ${variant}`, async ({ mount }) => {
        const component = await mount(
          <Typography text={`Variant ${variant}`} variant={variant} />
        );

        await expect(component).toBeVisible();
        await expect(component).toContainText(`Variant ${variant}`);

        // CSS 클래스 확인
        const className = await component.getAttribute("class");
        expect(className).toContain(`variant-${variant.toLowerCase()}`);
      });
    });

    test("should render without variant (default)", async ({ mount }) => {
      const component = await mount(<Typography text="Default variant" />);
      await expect(component).toBeVisible();
    });
  });

  test.describe("Combinations", () => {
    test("should render with size and variant", async ({ mount }) => {
      const component = await mount(
        <Typography text="Large Bold Text" size="48" variant="bold" />
      );

      await expect(component).toBeVisible();
      await expect(component).toContainText("Large Bold Text");

      const className = await component.getAttribute("class");
      expect(className).toContain("size-48");
      expect(className).toContain("variant-bold");
    });

    test("should render heading-like typography", async ({ mount }) => {
      const component = await mount(
        <Typography text="Heading" size="72" variant="bold" />
      );

      await expect(component).toBeVisible();
      const className = await component.getAttribute("class");
      expect(className).toContain("size-72");
      expect(className).toContain("variant-bold");
    });

    test("should render body-like typography", async ({ mount }) => {
      const component = await mount(
        <Typography text="Body text content" size="16" variant="regular" />
      );

      await expect(component).toBeVisible();
      const className = await component.getAttribute("class");
      expect(className).toContain("size-16");
      expect(className).toContain("variant-regular");
    });

    test("should render caption-like typography", async ({ mount }) => {
      const component = await mount(
        <Typography text="Caption text" size="12" variant="regular" />
      );

      await expect(component).toBeVisible();
      const className = await component.getAttribute("class");
      expect(className).toContain("size-12");
      expect(className).toContain("variant-regular");
    });
  });

  test.describe("Visual Regression", () => {
    test("should match screenshot for default typography", async ({
      mount,
    }) => {
      const component = await mount(<Typography text="Default Typography" />);
      await expect(component).toHaveScreenshot("typography-default.png");
    });

    test("should match screenshot for bold 48px", async ({ mount }) => {
      const component = await mount(
        <Typography text="Bold 48px" size="48" variant="bold" />
      );
      await expect(component).toHaveScreenshot("typography-bold-48.png");
    });

    test("should match screenshot for regular 16px", async ({ mount }) => {
      const component = await mount(
        <Typography text="Regular 16px" size="16" variant="regular" />
      );
      await expect(component).toHaveScreenshot("typography-regular-16.png");
    });

    test("should match screenshot for large display text", async ({
      mount,
    }) => {
      const component = await mount(
        <Typography text="Display" size="120" variant="bold" />
      );
      await expect(component).toHaveScreenshot("typography-display-120.png");
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper structure", async ({ mount }) => {
      const component = await mount(<Typography text="Accessible Text" />);
      await expect(component).toBeVisible();

      // 컨테이너가 div인지 확인
      const tagName = await component.evaluate((el) =>
        el.tagName.toLowerCase()
      );
      expect(tagName).toBe("div");
    });

    test("should contain text content", async ({ mount }) => {
      const component = await mount(<Typography text="Test Content" />);
      const textContent = await component.textContent();
      expect(textContent).toContain("Test Content");
    });

    test("should be readable with different sizes", async ({ mount }) => {
      const sizes = ["12", "16", "24", "48"] as const;

      for (const size of sizes) {
        const component = await mount(
          <Typography text={`Readable at ${size}px`} size={size} />
        );
        await expect(component).toBeVisible();
      }
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle empty string text", async ({ mount }) => {
      const component = await mount(<Typography text="" />);
      await expect(component).toBeVisible();
    });

    test("should handle very long text", async ({ mount }) => {
      const longText =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(10);
      const component = await mount(<Typography text={longText} />);
      await expect(component).toBeVisible();
      await expect(component).toContainText("Lorem ipsum");
    });

    test("should handle special characters", async ({ mount }) => {
      const specialText = "한글 텍스트 & Special @#$% Characters 123";
      const component = await mount(<Typography text={specialText} />);
      await expect(component).toBeVisible();
      await expect(component).toContainText(specialText);
    });

    test("should handle multiline text", async ({ mount }) => {
      const multilineText = "Line 1\nLine 2\nLine 3";
      const component = await mount(<Typography text={multilineText} />);
      await expect(component).toBeVisible();
      await expect(component).toContainText("Line 1");
    });

    test("should handle numbers", async ({ mount }) => {
      const component = await mount(<Typography text={12345} />);
      await expect(component).toBeVisible();
      await expect(component).toContainText("12345");
    });
  });

  test.describe("Typography Scale", () => {
    test("should render complete typography scale", async ({ mount, page }) => {
      const sizes = ["12", "16", "24", "32", "48", "72"] as const;

      // 여러 사이즈를 한 번에 렌더링
      await mount(
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {sizes.map((size) => (
            <Typography
              key={size}
              text={`Size ${size}px`}
              size={size}
              variant="regular"
            />
          ))}
        </div>
      );

      // 모든 텍스트가 보이는지 확인
      for (const size of sizes) {
        await expect(page.getByText(`Size ${size}px`)).toBeVisible();
      }
    });
  });

  test.describe("Weight Variants", () => {
    test("should render all weight variants", async ({ mount, page }) => {
      const variants = ["bold", "semibold", "medium", "regular"] as const;

      // 여러 variant를 한 번에 렌더링
      await mount(
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {variants.map((variant) => (
            <Typography
              key={variant}
              text={`Weight: ${variant}`}
              size="24"
              variant={variant}
            />
          ))}
        </div>
      );

      // 모든 텍스트가 보이는지 확인
      for (const variant of variants) {
        await expect(page.getByText(`Weight: ${variant}`)).toBeVisible();
      }
    });
  });
});
