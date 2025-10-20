/**
 * Host Config Interface
 *
 * React Native의 Host Config 패턴을 적용한 플랫폼 추상화 레이어
 * 각 플랫폼(React, React Native, Flutter 등)은 이 인터페이스를 구현
 */

import type { ComponentIR } from "../../ir/types";

// ============================================================================
// Node Types (플랫폼 독립적 노드)
// ============================================================================

export type NodeType =
  | "component"
  | "element"
  | "text"
  | "expression"
  | "conditional"
  | "loop";

export interface BaseNode {
  type: NodeType;
  id: string;
}

export interface ComponentNode extends BaseNode {
  type: "component";
  name: string;
  props: PropNode[];
  children: Node[];
  imports: ImportNode[];
  exports: ExportNode[];
}

export interface ElementNode extends BaseNode {
  type: "element";
  tagName: string;
  attributes: AttributeNode[];
  children: Node[];
}

export interface TextNode extends BaseNode {
  type: "text";
  content: string;
}

export interface ExpressionNode extends BaseNode {
  type: "expression";
  code: string;
}

export interface ConditionalNode extends BaseNode {
  type: "conditional";
  condition: string;
  trueBranch: Node[];
  falseBranch?: Node[];
}

export interface LoopNode extends BaseNode {
  type: "loop";
  item: string;
  collection: string;
  body: Node[];
}

export type Node =
  | ComponentNode
  | ElementNode
  | TextNode
  | ExpressionNode
  | ConditionalNode
  | LoopNode;

// ============================================================================
// Auxiliary Types
// ============================================================================

export interface ImportNode {
  items: string[];
  from: string;
  isType?: boolean;
  isDefault?: boolean;
}

export interface ExportNode {
  name: string;
  isDefault?: boolean;
  isType?: boolean;
}

export interface PropNode {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface AttributeNode {
  name: string;
  value: string | ExpressionNode;
}

export interface StyleNode {
  selector: string;
  properties: Record<string, string | number>;
  pseudo?: string; // :hover, :active, :focus
}

// ============================================================================
// Host Config Interface
// ============================================================================

/**
 * 플랫폼별로 구현해야 하는 Host Config
 * React Native의 ReactNativeHostConfig를 참고
 */
export interface HostConfig {
  // ========================================
  // Metadata
  // ========================================

  /** 플랫폼 이름 */
  readonly platformName: string;

  /** 지원하는 파일 확장자 */
  readonly fileExtensions: {
    component: string; // .tsx, .dart, .vue
    style: string; // .css, .dart (inline), .scss
    test: string; // .test.tsx, .test.dart
  };

  // ========================================
  // Component Creation
  // ========================================

  /**
   * 컴포넌트 노드 생성
   */
  createComponent(ir: ComponentIR): ComponentNode;

  /**
   * Props 노드 생성
   */
  createProps(ir: ComponentIR): PropNode[];

  /**
   * Import 문 생성
   */
  createImports(ir: ComponentIR): ImportNode[];

  /**
   * Export 문 생성
   */
  createExports(componentName: string): ExportNode[];

  // ========================================
  // Element Creation
  // ========================================

  /**
   * Element 노드 생성
   * 예: React의 <button>, Flutter의 TextButton, RN의 TouchableOpacity
   */
  createElement(elementType: string, ir: ComponentIR): ElementNode;

  /**
   * Text 노드 생성
   */
  createTextNode(content: string): TextNode;

  /**
   * Expression 노드 생성
   */
  createExpression(code: string): ExpressionNode;

  // ========================================
  // Attributes & Props
  // ========================================

  /**
   * Attribute 생성
   * 예: React의 className, Flutter의 decoration
   */
  createAttribute(name: string, value: string | ExpressionNode): AttributeNode;

  /**
   * Event handler attribute 생성
   * 예: onClick, onPress, onTap
   */
  createEventHandler(eventName: string, handler: string): AttributeNode;

  // ========================================
  // Style Generation
  // ========================================

  /**
   * 스타일 노드 생성
   */
  createStyleNode(selector: string, properties: Record<string, any>): StyleNode;

  /**
   * 스타일을 플랫폼별 형식으로 변환
   */
  transformStyles(ir: ComponentIR): StyleNode[];

  // ========================================
  // Control Flow
  // ========================================

  /**
   * 조건부 렌더링 노드 생성
   * 예: {condition && <Element />}
   */
  createConditional(
    condition: string,
    trueBranch: Node[],
    falseBranch?: Node[]
  ): ConditionalNode;

  /**
   * 반복 렌더링 노드 생성
   * 예: {items.map(item => <Element />)}
   */
  createLoop(item: string, collection: string, body: Node[]): LoopNode;

  // ========================================
  // Serialization
  // ========================================

  /**
   * Component 노드를 코드 문자열로 변환
   */
  serializeComponent(node: ComponentNode): string;

  /**
   * Style 노드를 코드 문자열로 변환
   */
  serializeStyles(nodes: StyleNode[]): string;

  /**
   * Import 문 직렬화
   */
  serializeImport(node: ImportNode): string;

  /**
   * Export 문 직렬화
   */
  serializeExport(node: ExportNode): string;

  /**
   * Element 직렬화
   */
  serializeElement(node: ElementNode, indent: number): string;

  /**
   * Props 인터페이스 직렬화
   */
  serializeProps(props: PropNode[], componentName: string): string;

  // ========================================
  // Utilities
  // ========================================

  /**
   * 컴포넌트 이름을 플랫폼 컨벤션에 맞게 변환
   * 예: button → Button (React), button_widget (Flutter)
   */
  formatComponentName(name: string): string;

  /**
   * 파일명 생성
   * 예: Button.tsx, button.dart, Button.vue
   */
  getFileName(
    componentName: string,
    fileType: "component" | "style" | "test"
  ): string;
}
