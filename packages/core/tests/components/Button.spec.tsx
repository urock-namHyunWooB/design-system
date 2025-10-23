import { test, expect } from "@playwright/experimental-ct-react";
import { Button } from "../../generated/react/Button";

/**
 * Button Component Tests
 *
 * 생성된 Button 컴포넌트의 렌더링, 스타일, 접근성을 테스트합니다.
 */

test.describe("Button Component", () => {
  test.describe("Basic Rendering", () => {
    test("should render with required props", async ({ mount }) => {
      const component = await mount(<Button label="Click me" />);
      await expect(component).toBeVisible();
      await expect(component).toContainText("Click me");
    });

    test("should render with leftIcon", async ({ mount }) => {
      const component = await mount(
        <Button
          label="Click me"
          leftIcon={<span data-testid="left-icon">←</span>}
        />
      );

      await expect(component).toBeVisible();
      const leftIcon = component.getByTestId("left-icon");
      await expect(leftIcon).toBeVisible();
      await expect(leftIcon).toContainText("←");
    });

    test("should render with rightIcon", async ({ mount }) => {
      const component = await mount(
        <Button
          label="Click me"
          rightIcon={<span data-testid="right-icon">→</span>}
        />
      );

      await expect(component).toBeVisible();
      const rightIcon = component.getByTestId("right-icon");
      await expect(rightIcon).toBeVisible();
      await expect(rightIcon).toContainText("→");
    });

    test("should render with both icons", async ({ mount }) => {
      const component = await mount(
        <Button
          label="Click me"
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
        />
      );

      await expect(component).toBeVisible();
      await expect(component.getByTestId("left-icon")).toBeVisible();
      await expect(component.getByTestId("right-icon")).toBeVisible();
    });
  });

  test.describe("Sizes", () => {
    const sizes = ["S", "M", "L"] as const;

    sizes.forEach((size) => {
      test(`should render size: ${size}`, async ({ mount }) => {
        const component = await mount(
          <Button label={`Size ${size}`} size={size} />
        );

        await expect(component).toBeVisible();
        await expect(component).toContainText(`Size ${size}`);

        // CSS 클래스 확인
        const className = await component.getAttribute("class");
        expect(className).toContain(`size-${size.toLowerCase()}`);
      });
    });

    test("should render without size (default)", async ({ mount }) => {
      const component = await mount(<Button label="Default size" />);
      await expect(component).toBeVisible();
    });
  });

  test.describe("Variants", () => {
    const variants = [
      "filled",
      "outlined-black",
      "outlined-blue",
      "outlined-red",
      "text-blue",
      "text-black",
      "filled-red",
    ] as const;

    variants.forEach((variant) => {
      test(`should render variant: ${variant}`, async ({ mount }) => {
        const component = await mount(
          <Button label={`Variant ${variant}`} variant={variant} />
        );

        await expect(component).toBeVisible();
        await expect(component).toContainText(`Variant ${variant}`);

        // CSS 클래스 확인
        const className = await component.getAttribute("class");
        expect(className).toContain(`variant-${variant.toLowerCase()}`);
      });
    });

    test("should render without variant (default)", async ({ mount }) => {
      const component = await mount(<Button label="Default variant" />);
      await expect(component).toBeVisible();
    });
  });

  test.describe("Combinations", () => {
    test("should render with size and variant", async ({ mount }) => {
      const component = await mount(
        <Button label="Large Filled Button" size="L" variant="filled" />
      );

      await expect(component).toBeVisible();
      const className = await component.getAttribute("class");
      expect(className).toContain("size-l");
      expect(className).toContain("variant-filled");
    });

    test("should render with all props", async ({ mount }) => {
      const component = await mount(
        <Button
          label="Complete Button"
          size="M"
          variant="outlined-blue"
          leftIcon={<span data-testid="left">←</span>}
          rightIcon={<span data-testid="right">→</span>}
        />
      );

      await expect(component).toBeVisible();
      await expect(component).toContainText("Complete Button");
      await expect(component.getByTestId("left")).toBeVisible();
      await expect(component.getByTestId("right")).toBeVisible();

      const className = await component.getAttribute("class");
      expect(className).toContain("size-m");
      expect(className).toContain("variant-outlined-blue");
    });
  });

  test.describe("Visual Regression", () => {
    test("should match screenshot for default button", async ({ mount }) => {
      const component = await mount(<Button label="Default Button" />);
      await expect(component).toHaveScreenshot("button-default.png");
    });

    test("should match screenshot for filled variant", async ({ mount }) => {
      const component = await mount(
        <Button label="Filled Button" variant="filled" size="M" />
      );
      await expect(component).toHaveScreenshot("button-filled-m.png");
    });

    test("should match screenshot for outlined-blue variant", async ({
      mount,
    }) => {
      const component = await mount(
        <Button label="Outlined Blue" variant="outlined-blue" size="M" />
      );
      await expect(component).toHaveScreenshot("button-outlined-blue-m.png");
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper structure", async ({ mount }) => {
      const component = await mount(<Button label="Accessible Button" />);
      await expect(component).toBeVisible();

      // 컨테이너가 div인지 확인
      const tagName = await component.evaluate((el) =>
        el.tagName.toLowerCase()
      );
      expect(tagName).toBe("div");
    });

    test("should contain text content", async ({ mount }) => {
      const component = await mount(<Button label="Test Content" />);
      const textContent = await component.textContent();
      expect(textContent).toContain("Test Content");
    });

    test("should render React nodes as label", async ({ mount }) => {
      const component = await mount(
        <Button
          label={
            <span data-testid="complex-label">
              <strong>Bold</strong> Text
            </span>
          }
        />
      );

      await expect(component.getByTestId("complex-label")).toBeVisible();
      await expect(component).toContainText("Bold Text");
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle empty string label", async ({ mount }) => {
      const component = await mount(<Button label="" />);
      await expect(component).toBeVisible();
    });

    test("should handle very long label", async ({ mount }) => {
      const longLabel =
        "This is a very long button label that might wrap or overflow";
      const component = await mount(<Button label={longLabel} />);
      await expect(component).toBeVisible();
      await expect(component).toContainText(longLabel);
    });

    test("should handle special characters in label", async ({ mount }) => {
      const specialLabel = "버튼 클릭! @#$% & 123";
      const component = await mount(<Button label={specialLabel} />);
      await expect(component).toBeVisible();
      await expect(component).toContainText(specialLabel);
    });
  });
});
