/**
 * @repo/core/ir - Intermediate Representation
 *
 * 플랫폼 독립적인 컴포넌트 IR 시스템
 * DSL → IR → Platform Code 변환 파이프라인의 핵심
 */

// Export Compiler
export { compile, CompilationError } from "./compiler";
export type {
  CompilerOptions,
  CompilerContext,
  CompilerError,
  CompilerWarning,
} from "./compiler";

// Export IR-specific types only (avoid conflicts with base types)
export type {
  // Main IR
  ComponentIR,

  // Metadata
  ComponentMetadata,
  ComponentComplexity,

  // Tokens
  TokenInfo,

  // Structure
  StructureDefinition,
  BaseStructure,
  StructureVariants,
  IRPartDefinition,
  PartTreeNode,
  SlotType,
  RenderStrategy,

  // Structure Variants
  Condition,
  VisibilityRule,
  VisibilityAction,
  StructureModification,
  StructureModificationType,

  // Styles
  LayeredStyles,
  SizeStyleLayer,
  VariantStyleLayer,
  InteractionStyleLayer,
  ResponsiveStyleLayer,
  StyleProperties,
  PartSizeStyle,
  PartVariantStyle,
  LayoutProperties,
  SpacingProperties,
  TypographyProperties,
  ColorProperties,
  BorderProperties,
  EffectProperties,
  FlexboxProperties,
  OutlineProperties,
  MiscProperties,

  // Style Rules
  StyleRules,
  UndefinedPartBehavior,
  MergeStrategy,
  MergeType,

  // Animations
  AnimationDefinitions,

  // Props
  ComponentPropsSchema,
  PropTypeDefinition,
  PropType,
  PropRole,

  // Attributes
  AttributeRules,
  AttributeRule,

  // Validation
  ValidationRules,
  IncompatibilityRule,
  RequirementRule,
  ConstraintRule,

  // Accessibility
  AccessibilityMetadata,
} from "./types";

// Export type guards
export { isComponentIR, isSimpleComponent } from "./types";
