/**
 * Base Renderer
 *
 * React Native의 Reconciler와 유사한 역할
 * Host Config를 사용하여 플랫폼 독립적인 렌더링 로직 처리
 */

import type { ComponentIR } from "../../ir/types";
import type { HostConfig, ComponentNode, StyleNode, Node } from "./HostConfig";
import type { GeneratedFile } from "../types";

// ============================================================================
// Renderer Options
// ============================================================================

export interface RendererOptions {
  /** 들여쓰기 문자 (default: 2 spaces) */
  indent?: string;

  /** 줄바꿈 문자 (default: \n) */
  lineBreak?: string;

  /** 주석 추가 여부 */
  includeComments?: boolean;

  /** 생성 타임스탬프 추가 */
  includeTimestamp?: boolean;
}

// ============================================================================
// Base Renderer
// ============================================================================

/**
 * 플랫폼 독립적인 렌더러
 * Host Config를 통해 플랫폼별 구현 호출
 */
export class BaseRenderer {
  protected options: Required<RendererOptions>;

  constructor(
    protected hostConfig: HostConfig,
    options: RendererOptions = {}
  ) {
    this.options = {
      indent: options.indent || "  ",
      lineBreak: options.lineBreak || "\n",
      includeComments: options.includeComments ?? true,
      includeTimestamp: options.includeTimestamp ?? true,
    };
  }

  // ========================================
  // Public API
  // ========================================

  /**
   * IR을 코드 파일로 렌더링
   */
  render(ir: ComponentIR): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // 1. Component 파일 생성
    const componentFile = this.renderComponent(ir);
    files.push(componentFile);

    // 2. Style 파일 생성 (필요한 경우)
    const styleFile = this.renderStyles(ir);
    if (styleFile) {
      files.push(styleFile);
    }

    return files;
  }

  // ========================================
  // Component Rendering
  // ========================================

  /**
   * 컴포넌트 파일 렌더링
   */
  protected renderComponent(ir: ComponentIR): GeneratedFile {
    // 1. Component 노드 생성 (Host Config 호출)
    const componentNode = this.hostConfig.createComponent(ir);

    // 2. 컴포넌트 트리 구축
    this.buildComponentTree(componentNode, ir);

    // 3. 직렬화 (Host Config 호출)
    const content = this.serializeComponentFile(componentNode, ir);

    // 4. 파일 정보 생성
    const fileName = this.hostConfig.getFileName(
      this.hostConfig.formatComponentName(ir.metadata.component),
      "component"
    );

    return {
      path: fileName,
      content,
      type: "component",
    };
  }

  /**
   * 컴포넌트 트리 구축
   */
  protected buildComponentTree(
    componentNode: ComponentNode,
    ir: ComponentIR
  ): void {
    // 1. Root element 생성
    const rootElement = this.hostConfig.createElement("container", ir);

    // 2. Attributes 추가
    this.addAttributes(rootElement, ir);

    // 3. Children 추가
    this.addChildren(rootElement, ir);

    // 4. Component에 추가
    componentNode.children.push(rootElement);
  }

  /**
   * Attributes 추가
   */
  protected addAttributes(element: any, ir: ComponentIR): void {
    // className/style 등의 속성 추가
    const classNameAttr = this.hostConfig.createAttribute(
      "className",
      this.hostConfig.createExpression("classNames")
    );
    element.attributes.push(classNameAttr);

    // Event handlers
    if (ir.propsSchema.optional.includes("onClick")) {
      const clickHandler = this.hostConfig.createEventHandler(
        "click",
        "onClick"
      );
      element.attributes.push(clickHandler);
    }
  }

  /**
   * Children 추가
   */
  protected addChildren(element: any, ir: ComponentIR): void {
    const parts = ir.structure.base.parts;

    // leftIcon (조건부)
    if (parts.leftIcon) {
      const iconConditional = this.hostConfig.createConditional("leftIcon", [
        this.hostConfig.createElement("icon", ir),
      ]);
      element.children.push(iconConditional);
    }

    // label (필수)
    if (parts.label) {
      const labelElement = this.hostConfig.createElement("text", ir);
      labelElement.children.push(this.hostConfig.createExpression("label"));
      element.children.push(labelElement);
    }

    // rightIcon (조건부)
    if (parts.rightIcon) {
      const iconConditional = this.hostConfig.createConditional("rightIcon", [
        this.hostConfig.createElement("icon", ir),
      ]);
      element.children.push(iconConditional);
    }
  }

  /**
   * 컴포넌트 파일 직렬화
   */
  protected serializeComponentFile(
    componentNode: ComponentNode,
    ir: ComponentIR
  ): string {
    const lines: string[] = [];

    // Header comment
    if (this.options.includeComments) {
      lines.push(this.generateHeader(ir));
      lines.push("");
    }

    // Imports
    componentNode.imports.forEach((imp) => {
      lines.push(this.hostConfig.serializeImport(imp));
    });
    lines.push("");

    // Props interface
    const propsInterface = this.hostConfig.serializeProps(
      componentNode.props,
      componentNode.name
    );
    lines.push(propsInterface);
    lines.push("");

    // Component
    const componentCode = this.hostConfig.serializeComponent(componentNode);
    lines.push(componentCode);

    return lines.join(this.options.lineBreak);
  }

  // ========================================
  // Style Rendering
  // ========================================

  /**
   * 스타일 파일 렌더링
   */
  protected renderStyles(ir: ComponentIR): GeneratedFile | null {
    // 스타일 노드 생성 (Host Config 호출)
    const styleNodes = this.hostConfig.transformStyles(ir);

    if (styleNodes.length === 0) {
      return null;
    }

    // 직렬화
    const content = this.serializeStyleFile(styleNodes, ir);

    // 파일 정보 생성
    const fileName = this.hostConfig.getFileName(
      this.hostConfig.formatComponentName(ir.metadata.component),
      "style"
    );

    return {
      path: fileName,
      content,
      type: "style",
    };
  }

  /**
   * 스타일 파일 직렬화
   */
  protected serializeStyleFile(
    styleNodes: StyleNode[],
    ir: ComponentIR
  ): string {
    const lines: string[] = [];

    // Header comment
    if (this.options.includeComments) {
      lines.push(`/* ${ir.metadata.component} Component Styles */`);
      lines.push("");
    }

    // Styles
    const stylesCode = this.hostConfig.serializeStyles(styleNodes);
    lines.push(stylesCode);

    return lines.join(this.options.lineBreak);
  }

  // ========================================
  // Utilities
  // ========================================

  /**
   * 헤더 주석 생성
   */
  protected generateHeader(ir: ComponentIR): string {
    const lines = [
      "/**",
      ` * ${this.hostConfig.formatComponentName(ir.metadata.component)} Component`,
      ` * `,
      ` * Generated by Design System Generator`,
    ];

    if (this.options.includeTimestamp) {
      lines.push(` * Generated at: ${new Date().toISOString()}`);
    }

    lines.push(" * ");
    lines.push(" * Do not edit this file directly.");
    lines.push(" */");

    return lines.join(this.options.lineBreak);
  }
}
