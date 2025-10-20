/**
 * Generator Public API
 */

// New Host Config based generators
export { generateReactComponent } from "./platforms/react";

// Legacy generators (deprecated)
// export { generateReactComponent as generateReactComponentLegacy } from "./react";

// Core
export { BaseRenderer } from "./core/Renderer";
export { ComponentRegistry } from "./core/ComponentRegistry";
export type { HostConfig } from "./core/HostConfig";

// Types
export type {
  GeneratorOptions,
  GeneratorResult,
  GeneratorContext,
  GeneratedFile,
  StyleStrategy,
  PropsDefinition,
  PropDefinition,
  ComponentDefinition,
  ImportStatement,
  StyleDefinition,
} from "./types";
