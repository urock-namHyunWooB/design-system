/**
 * React Host Config
 *
 * React 플랫폼을 위한 Host Config 구현
 */

import type {
  HostConfig,
  ComponentNode,
  PropNode,
  ImportNode,
  ExportNode,
  ElementNode,
  TextNode,
  ExpressionNode,
  AttributeNode,
  StyleNode,
  ConditionalNode,
  LoopNode,
} from "../../core/HostConfig.js";
import type { ComponentIR } from "../../../ir/types.js";
import { ComponentRegistry } from "../../core/ComponentRegistry.js";

export class ReactHostConfig implements HostConfig {
  readonly platformName = "react";
  readonly fileExtensions = {
    component: ".tsx",
    style: ".module.css",
    test: ".test.tsx",
  };

  private registry: ComponentRegistry;
  private nodeIdCounter = 0;

  constructor() {
    this.registry = new ComponentRegistry("react");
  }

  // ========================================
  // Component Creation
  // ========================================

  createComponent(ir: ComponentIR): ComponentNode {
    const componentName = this.formatComponentName(ir.metadata.component);

    return {
      type: "component",
      id: this.generateId(),
      name: componentName,
      props: this.createProps(ir),
      children: [],
      imports: this.createImports(ir),
      exports: this.createExports(componentName),
    };
  }

  createProps(ir: ComponentIR): PropNode[] {
    const props: PropNode[] = [];
    const { propsSchema } = ir;

    // Required props
    for (const propName of propsSchema.required) {
      const propType = propsSchema.types[propName];
      if (propType) {
        props.push({
          name: propName,
          type: this.convertIRTypeToTS(propType),
          required: true,
          description: propType.description,
        });
      }
    }

    // Optional props
    for (const propName of propsSchema.optional) {
      const propType = propsSchema.types[propName];
      if (propType) {
        props.push({
          name: propName,
          type: this.convertIRTypeToTS(propType),
          required: false,
          defaultValue:
            propType.default !== undefined
              ? JSON.stringify(propType.default)
              : undefined,
          description: propType.description,
        });
      }
    }

    return props;
  }

  createImports(ir: ComponentIR): ImportNode[] {
    const imports: ImportNode[] = [];

    // React import
    imports.push({
      items: ["React"],
      from: "react",
      isDefault: true,
    });

    // Style import (CSS Modules)
    const componentName = this.formatComponentName(ir.metadata.component);
    imports.push({
      items: ["styles"],
      from: `./${componentName}.module.css`,
      isDefault: true,
    });

    return imports;
  }

  createExports(componentName: string): ExportNode[] {
    return [
      { name: `${componentName}Props`, isType: true },
      { name: componentName },
    ];
  }

  // ========================================
  // Element Creation
  // ========================================

  createElement(elementType: string, ir: ComponentIR): ElementNode {
    const tagName =
      this.registry.getComponent(elementType as any) || elementType;

    return {
      type: "element",
      id: this.generateId(),
      tagName,
      attributes: [],
      children: [],
    };
  }

  createTextNode(content: string): TextNode {
    return {
      type: "text",
      id: this.generateId(),
      content,
    };
  }

  createExpression(code: string): ExpressionNode {
    return {
      type: "expression",
      id: this.generateId(),
      code,
    };
  }

  // ========================================
  // Attributes
  // ========================================

  createAttribute(name: string, value: string | ExpressionNode): AttributeNode {
    const mappedName = this.registry.getAttribute(name);
    return {
      name: mappedName,
      value,
    };
  }

  createEventHandler(eventName: string, handler: string): AttributeNode {
    const eventAttrName = `on${this.capitalize(eventName)}`;
    return {
      name: eventAttrName,
      value: this.createExpression(handler),
    };
  }

  // ========================================
  // Style Generation
  // ========================================

  createStyleNode(
    selector: string,
    properties: Record<string, any>
  ): StyleNode {
    return {
      selector,
      properties,
    };
  }

  transformStyles(ir: ComponentIR): StyleNode[] {
    const styles: StyleNode[] = [];
    const { styles: layeredStyles } = ir;

    // Base styles
    styles.push(
      this.createStyleNode(".container", {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
      })
    );

    // Size styles
    for (const [sizeName, sizeLayer] of Object.entries(layeredStyles.sizes)) {
      const containerStyle = sizeLayer.parts.container;
      if (containerStyle) {
        const properties: Record<string, any> = {};

        if (containerStyle.layout?.height) {
          properties.height = `${containerStyle.layout.height}px`;
        }
        if (containerStyle.layout?.borderRadius) {
          properties.borderRadius = `${containerStyle.layout.borderRadius}px`;
        }
        if (containerStyle.spacing?.paddingHorizontal !== undefined) {
          properties.paddingLeft = `${containerStyle.spacing.paddingHorizontal}px`;
          properties.paddingRight = `${containerStyle.spacing.paddingHorizontal}px`;
        }
        if (containerStyle.spacing?.paddingVertical !== undefined) {
          properties.paddingTop = `${containerStyle.spacing.paddingVertical}px`;
          properties.paddingBottom = `${containerStyle.spacing.paddingVertical}px`;
        }
        if (containerStyle.spacing?.gap) {
          properties.gap = `${containerStyle.spacing.gap}px`;
        }

        // Typography from label
        const labelStyle = sizeLayer.parts.label;
        if (labelStyle?.typography) {
          if (labelStyle.typography.fontSize) {
            properties.fontSize = `${labelStyle.typography.fontSize}px`;
          }
          if (labelStyle.typography.lineHeight) {
            properties.lineHeight = `${labelStyle.typography.lineHeight}px`;
          }
        }

        styles.push(
          this.createStyleNode(`.size-${sizeName.toLowerCase()}`, properties)
        );
      }
    }

    // Variant styles
    for (const [variantName, variantLayer] of Object.entries(
      layeredStyles.variants
    )) {
      const containerStyle = variantLayer.parts.container;
      if (containerStyle) {
        const properties: Record<string, any> = {};

        if (containerStyle.colors?.background) {
          properties.backgroundColor = this.resolveToken(
            containerStyle.colors.background
          );
        }
        if (containerStyle.colors?.border) {
          properties.borderColor = this.resolveToken(
            containerStyle.colors.border
          );
        }
        if (containerStyle.borders?.width !== undefined) {
          properties.borderWidth = `${containerStyle.borders.width}px`;
        }

        // Label color
        const labelStyle = variantLayer.parts.label;
        if (labelStyle?.colors?.foreground) {
          properties.color = this.resolveToken(labelStyle.colors.foreground);
        }
        if (labelStyle?.typography?.fontWeight) {
          properties.fontWeight = labelStyle.typography.fontWeight;
        }

        styles.push(
          this.createStyleNode(
            `.variant-${variantName.toLowerCase()}`,
            properties
          )
        );
      }
    }

    // Interaction states
    for (const [stateName, stateLayer] of Object.entries(
      layeredStyles.interactions
    )) {
      const pseudo = this.getPseudoClass(stateName);
      const containerStyle = stateLayer.parts.container;
      if (containerStyle) {
        const properties: Record<string, any> = {};

        if (containerStyle.scale) {
          properties.transform = `scale(${containerStyle.scale})`;
        }
        if (containerStyle.opacity !== undefined) {
          properties.opacity = containerStyle.opacity;
        }

        const styleNode = this.createStyleNode(
          `.container${pseudo}`,
          properties
        );
        styleNode.pseudo = pseudo;
        styles.push(styleNode);
      }
    }

    return styles;
  }

  // ========================================
  // Control Flow
  // ========================================

  createConditional(
    condition: string,
    trueBranch: any[],
    falseBranch?: any[]
  ): ConditionalNode {
    return {
      type: "conditional",
      id: this.generateId(),
      condition,
      trueBranch,
      falseBranch,
    };
  }

  createLoop(item: string, collection: string, body: any[]): LoopNode {
    return {
      type: "loop",
      id: this.generateId(),
      item,
      collection,
      body,
    };
  }

  // ========================================
  // Serialization
  // ========================================

  serializeComponent(node: ComponentNode): string {
    const lines: string[] = [];

    // Component JSDoc
    lines.push(`/**`);
    lines.push(` * ${node.name} 컴포넌트`);
    lines.push(` */`);

    // Function declaration
    lines.push(`export function ${node.name}({`);

    // Props destructuring
    const propNames = node.props.map((p) =>
      p.required
        ? `  ${p.name}`
        : `  ${p.name}${p.defaultValue ? ` = ${p.defaultValue}` : ""}`
    );
    lines.push(propNames.join(",\n"));
    lines.push(`}: ${node.name}Props) {`);

    // Class names
    lines.push(`  const classNames = [`);
    lines.push(`    styles.container,`);
    lines.push(`    styles[\`size-\${size?.toLowerCase()}\`],`);
    lines.push(`    styles[\`variant-\${variant?.toLowerCase()}\`],`);
    lines.push(`  ].filter(Boolean).join(" ");`);
    lines.push(``);

    // Return JSX
    lines.push(`  return (`);
    node.children.forEach((child) => {
      lines.push(this.serializeNode(child, 2));
    });
    lines.push(`  );`);

    lines.push(`}`);

    return lines.join("\n");
  }

  serializeStyles(nodes: StyleNode[]): string {
    const lines: string[] = [];

    nodes.forEach((node) => {
      lines.push(`${node.selector} {`);
      Object.entries(node.properties).forEach(([key, value]) => {
        const cssKey = this.camelToKebab(key);
        lines.push(`  ${cssKey}: ${value};`);
      });
      lines.push(`}`);
      lines.push(``);
    });

    return lines.join("\n");
  }

  serializeImport(node: ImportNode): string {
    if (node.isDefault) {
      return `import ${node.items[0]} from "${node.from}";`;
    }
    if (node.isType) {
      return `import type { ${node.items.join(", ")} } from "${node.from}";`;
    }
    return `import { ${node.items.join(", ")} } from "${node.from}";`;
  }

  serializeExport(node: ExportNode): string {
    if (node.isType) {
      return `export type { ${node.name} };`;
    }
    if (node.isDefault) {
      return `export default ${node.name};`;
    }
    return `export { ${node.name} };`;
  }

  serializeElement(node: ElementNode, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const lines: string[] = [];

    // Opening tag
    lines.push(`${indentStr}<${node.tagName}`);

    // Attributes
    node.attributes.forEach((attr) => {
      const value =
        typeof attr.value === "string"
          ? `"${attr.value}"`
          : `{${attr.value.code}}`;
      lines.push(`${indentStr}  ${attr.name}=${value}`);
    });

    if (node.children.length === 0) {
      lines.push(`${indentStr}/>`);
    } else {
      lines.push(`${indentStr}>`);

      // Children
      node.children.forEach((child) => {
        lines.push(this.serializeNode(child, indent + 1));
      });

      // Closing tag
      lines.push(`${indentStr}</${node.tagName}>`);
    }

    return lines.join("\n");
  }

  serializeProps(props: PropNode[], componentName: string): string {
    const lines: string[] = [];

    lines.push(`export interface ${componentName}Props {`);

    props.forEach((prop) => {
      if (prop.description) {
        lines.push(`  /** ${prop.description} */`);
      }
      const optional = prop.required ? "" : "?";
      const defaultComment = prop.defaultValue
        ? ` // default: ${prop.defaultValue}`
        : "";
      lines.push(`  ${prop.name}${optional}: ${prop.type};${defaultComment}`);
    });

    lines.push(`}`);

    return lines.join("\n");
  }

  // ========================================
  // Utilities
  // ========================================

  formatComponentName(name: string): string {
    return this.capitalize(name);
  }

  getFileName(
    componentName: string,
    fileType: "component" | "style" | "test"
  ): string {
    return `${componentName}${this.fileExtensions[fileType]}`;
  }

  private serializeNode(node: any, indent: number): string {
    switch (node.type) {
      case "element":
        return this.serializeElement(node, indent);
      case "expression":
        return `${"  ".repeat(indent)}{${node.code}}`;
      case "conditional":
        return `${"  ".repeat(indent)}{${node.condition} && (${node.trueBranch.map((n: any) => this.serializeNode(n, 0)).join("")})}`;
      default:
        return "";
    }
  }

  private convertIRTypeToTS(irType: any): string {
    switch (irType.type) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "node":
        return "React.ReactNode";
      case "union":
        return (
          irType.unionValues?.map((v: string) => `"${v}"`).join(" | ") ||
          "string"
        );
      default:
        return "any";
    }
  }

  private resolveToken(token: string): string {
    if (token.startsWith("{") && token.endsWith("}")) {
      const varName = token.slice(1, -1).replace(/\//g, "-").toLowerCase();
      return `var(--${varName})`;
    }
    return token;
  }

  private getPseudoClass(stateName: string): string {
    const mapping: Record<string, string> = {
      hovered: ":hover",
      pressed: ":active",
      focused: ":focus",
      disabled: ":disabled",
    };
    return mapping[stateName] || "";
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  private generateId(): string {
    return `node_${this.nodeIdCounter++}`;
  }
}
