/**
 * Component Registry
 *
 * 플랫폼별 컴포넌트 매핑
 * 예: "button" → React: <button>, RN: <TouchableOpacity>, Flutter: TextButton
 */

export type PlatformType =
  | "react"
  | "react-native"
  | "flutter"
  | "angular"
  | "vue"
  | "svelte";

export type ElementType =
  | "container"
  | "button"
  | "text"
  | "icon"
  | "input"
  | "image";

// ============================================================================
// Component Mapping
// ============================================================================

/**
 * 플랫폼별 컴포넌트 매핑
 */
export const ComponentMap: Record<ElementType, Record<PlatformType, string>> = {
  container: {
    react: "div",
    "react-native": "View",
    flutter: "Container",
    angular: "div",
    vue: "div",
    svelte: "div",
  },

  button: {
    react: "button",
    "react-native": "TouchableOpacity",
    flutter: "TextButton",
    angular: "button",
    vue: "button",
    svelte: "button",
  },

  text: {
    react: "span",
    "react-native": "Text",
    flutter: "Text",
    angular: "span",
    vue: "span",
    svelte: "span",
  },

  icon: {
    react: "span",
    "react-native": "View",
    flutter: "Icon",
    angular: "span",
    vue: "span",
    svelte: "span",
  },

  input: {
    react: "input",
    "react-native": "TextInput",
    flutter: "TextField",
    angular: "input",
    vue: "input",
    svelte: "input",
  },

  image: {
    react: "img",
    "react-native": "Image",
    flutter: "Image",
    angular: "img",
    vue: "img",
    svelte: "img",
  },
};

// ============================================================================
// Prop/Attribute Mapping
// ============================================================================

/**
 * 플랫폼별 속성 매핑
 */
export const AttributeMap: Record<string, Record<PlatformType, string>> = {
  // Style
  className: {
    react: "className",
    "react-native": "style",
    flutter: "decoration",
    angular: "class",
    vue: "class",
    svelte: "class",
  },

  // Events
  onClick: {
    react: "onClick",
    "react-native": "onPress",
    flutter: "onPressed",
    angular: "(click)",
    vue: "@click",
    svelte: "on:click",
  },

  onFocus: {
    react: "onFocus",
    "react-native": "onFocus",
    flutter: "onFocusChange",
    angular: "(focus)",
    vue: "@focus",
    svelte: "on:focus",
  },

  // Accessibility
  ariaLabel: {
    react: "aria-label",
    "react-native": "accessibilityLabel",
    flutter: "semanticsLabel",
    angular: "aria-label",
    vue: "aria-label",
    svelte: "aria-label",
  },
};

// ============================================================================
// Import Mapping
// ============================================================================

/**
 * 플랫폼별 기본 import
 */
export const DefaultImports: Record<
  PlatformType,
  Array<{ from: string; items: string[]; isDefault?: boolean }>
> = {
  react: [{ from: "react", items: ["React"], isDefault: true }],

  "react-native": [
    { from: "react", items: ["React"], isDefault: true },
    {
      from: "react-native",
      items: ["View", "Text", "TouchableOpacity", "StyleSheet"],
    },
  ],

  flutter: [{ from: "package:flutter/material.dart", items: [] }],

  angular: [{ from: "@angular/core", items: ["Component"] }],

  vue: [],

  svelte: [],
};

// ============================================================================
// Registry Class
// ============================================================================

export class ComponentRegistry {
  constructor(private platform: PlatformType) {}

  /**
   * Element 타입을 플랫폼별 컴포넌트로 변환
   */
  getComponent(elementType: ElementType): string {
    return ComponentMap[elementType][this.platform];
  }

  /**
   * 속성명을 플랫폼별 속성으로 변환
   */
  getAttribute(attributeName: string): string {
    const mapping = AttributeMap[attributeName];
    if (!mapping) {
      return attributeName;
    }
    return mapping[this.platform] || attributeName;
  }

  /**
   * 플랫폼별 기본 import 가져오기
   */
  getDefaultImports() {
    return DefaultImports[this.platform];
  }

  /**
   * 여러 element 타입에 대한 import 계산
   */
  calculateImports(
    elementTypes: ElementType[]
  ): Array<{ from: string; items: string[] }> {
    const imports = new Map<string, Set<string>>();

    // 기본 imports 추가
    const defaultImports = this.getDefaultImports();
    defaultImports.forEach((imp) => {
      if (!imports.has(imp.from)) {
        imports.set(imp.from, new Set());
      }
      imp.items.forEach((item) => imports.get(imp.from)!.add(item));
    });

    // Element별 imports 추가 (React Native의 경우)
    if (this.platform === "react-native") {
      elementTypes.forEach((elementType) => {
        const component = this.getComponent(elementType);
        if (!imports.has("react-native")) {
          imports.set("react-native", new Set());
        }
        imports.get("react-native")!.add(component);
      });
    }

    // Map → Array 변환
    return Array.from(imports.entries()).map(([from, items]) => ({
      from,
      items: Array.from(items),
    }));
  }
}
