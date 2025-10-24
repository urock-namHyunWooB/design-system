import type { ButtonDSL } from "../types/dsl/button";
import type { ComponentSpec } from "../dsl/types";

/**
 * Button 컴포넌트 DSL 정의
 */
export const buttonDSL: ComponentSpec = {
  type: "button",

  structure: {
    tree: {
      id: "root",
      type: "container",
      children: [
        {
          id: "leftIconContainer",
          type: "container",
          children: [
            {
              id: "leftIcon",
              type: "slot",
            },
          ],
        },
        {
          id: "labelContainer",
          type: "container",
          children: [
            {
              id: "label",
              type: "slot",
            },
          ],
        },
        {
          id: "rightIconContainer",
          type: "container",
          children: [
            {
              id: "rightIcon",
              type: "slot",
            },
          ],
        },
      ],
    },
  },
  styles: {
    base: {
      root: {
        style: {
          display: "flex",
          flexDirection: "row",
          padding: 8,
          borderRadius: 8,
        },
      },
    },
    sizes: {},
    states: {},
    variants: {},
  },

  props: {
    label: {
      type: "string",
      required: true,
    },
    leftIcon: {
      type: "icon",
      required: false,
    },
    rightIcon: {
      type: "icon",
      required: false,
    },
    size: {
      type: "string",
      required: false,
      default: "M",
      options: ["S", "M", "L"],
    },
    variant: {
      type: "string",
      required: false,
      default: "filled",
      options: [
        "filled",
        "outlined-black",
        "outlined-blue",
        "outlined-red",
        "text-blue",
        "text-black",
        "filled-red",
      ],
    },
    onClick: {
      type: "function",
      required: false,
      default: () => {},
    },
    disabled: {
      type: "boolean",
      required: false,
      default: false,
    },
  },

  sizes: {
    S: {
      container: {
        style: {
          height: 28,
          borderRadius: 8,
          paddingVertical: 4,
          paddingHorizontal: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        },
      },
      leftIcon: {
        style: { size: 14 },
      },
      label: {
        style: { fontSize: 13, lineHeight: 20 },
      },
      rightIcon: {
        style: { size: 14 },
      },
    },
    M: {
      container: {
        style: {
          height: 40,
          borderRadius: 10,
          paddingVertical: 8,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        },
      },
      leftIcon: {
        style: { size: 16 },
      },
      label: {
        style: { fontSize: 14, lineHeight: 20 },
      },
      rightIcon: {
        style: { size: 16 },
      },
    },
    L: {
      container: {
        style: {
          height: 56,
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 28,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        },
      },
      leftIcon: {
        style: { size: 18 },
      },
      label: {
        style: { fontSize: 16, lineHeight: 24 },
      },
      rightIcon: {
        style: { size: 18 },
      },
    },
  },

  // ============================================================================
  // Types: 색상/스타일 정의 (Parts별)
  // ============================================================================
  types: {
    filled: {
      container: {
        style: {
          backgroundColor: "{Color/primary/01}",
          borderWidth: 0,
          borderColor: "transparent",
          elevation: 2,
        },
      },
      leftIcon: {
        style: { color: "{Color/text/00}" },
      },
      label: {
        style: {
          color: "{Color/text/00}",
          fontWeight: 600,
        },
      },
      rightIcon: {
        style: { color: "{Color/text/00}" },
      },
    },
    "outlined-black": {
      container: {
        style: {
          backgroundColor: "{Color/bg/00}",
          borderWidth: 2,
          borderColor: "{Color/line/01}",
          elevation: 1,
        },
      },
      leftIcon: {
        style: { color: "{Color/text/03-high}" },
      },
      label: {
        style: {
          color: "{Color/text/03-high}",
          fontWeight: 600,
        },
      },
      rightIcon: {
        style: { color: "{Color/text/03-high}" },
      },
    },
    "outlined-blue": {
      container: {
        style: {
          backgroundColor: "{Color/bg/00}",
          borderWidth: 2,
          borderColor: "{Color/primary/01}",
          elevation: 1,
        },
      },
      leftIcon: {
        style: { color: "{Color/primary/01}" },
      },
      label: {
        style: {
          color: "{Color/primary/01}",
          fontWeight: 600,
        },
      },
      rightIcon: {
        style: { color: "{Color/primary/01}" },
      },
    },
    "outlined-red": {
      container: {
        style: {
          backgroundColor: "{Color/bg/00}",
          borderWidth: 2,
          borderColor: "{Color/state/error}",
          elevation: 1,
        },
      },
      leftIcon: {
        style: { color: "{Color/text/error}" },
      },
      label: {
        style: {
          color: "{Color/text/error}",
          fontWeight: 600,
        },
      },
      rightIcon: {
        style: { color: "{Color/text/error}" },
      },
    },
    "text-blue": {
      container: {
        style: {
          backgroundColor: "{Color/bg/00}",
          borderWidth: 0,
          borderColor: "transparent",
        },
      },
      leftIcon: {
        style: { color: "{Color/primary/01}" },
      },
      label: {
        style: {
          color: "{Color/primary/01}",
          fontWeight: 600,
        },
      },
      rightIcon: {
        style: { color: "{Color/primary/01}" },
      },
    },
    "text-black": {
      container: {
        style: {
          backgroundColor: "transparent",
          borderWidth: 0,
          borderColor: "transparent",
        },
      },
      leftIcon: {
        style: { color: "{Color/text/03-high}" },
      },
      label: {
        style: {
          color: "{Color/text/03-high}",
          fontWeight: 600,
        },
      },
      rightIcon: {
        style: { color: "{Color/text/03-high}" },
      },
    },
    "filled-red": {
      container: {
        style: {
          backgroundColor: "{Color/state/error}",
          borderWidth: 0,
          borderColor: "transparent",
          elevation: 2,
        },
      },
      leftIcon: {
        style: { color: "{Color/text/00}" },
      },
      label: {
        style: {
          color: "{Color/text/00}",
          fontWeight: 600,
        },
      },
      rightIcon: {
        style: { color: "{Color/text/00}" },
      },
    },
  },

  // ============================================================================
  // Interactions: 상태별 스타일 (Parts별)
  // ============================================================================
  interactions: {
    hovered: {
      container: {
        style: {
          elevation: 4,
          scale: 1.02,
        },
      },
    },
    pressed: {
      container: {
        style: {
          elevation: 1,
          scale: 0.98,
        },
      },
    },
    focused: {
      container: {
        style: {
          outlineWidth: 2,
          outlineColor: "{Color/primary/01}",
          outlineOffset: 2,
        },
      },
    },
    disabled: {
      container: {
        style: {
          backgroundColor: "{Color/disabled}",
          opacity: 0.5,
          cursor: "not-allowed",
        },
      },
      label: {
        style: {
          color: "{Color/text/disabled}",
        },
      },
    },
  },

  // ============================================================================
  // Motion: 애니메이션 설정
  // ============================================================================
  motion: {
    default: {
      type: "spring",
      duration: 200,
      curve: "easeOut",
    },
    press: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 150,
    },
    hover: {
      type: "ease",
      duration: 200,
      curve: "easeOut",
    },
  },

  // ============================================================================
  // Responsive: 반응형 (Size 오버라이드, Parts별)
  // ============================================================================
  responsive: {
    mobile: {
      S: {
        container: {
          style: {
            height: 28,
            paddingVertical: 6,
            paddingHorizontal: 12,
            gap: 4,
          },
        },
        leftIcon: {
          style: { size: 14 },
        },
        label: {
          style: { fontSize: 12 },
        },
        rightIcon: {
          style: { size: 14 },
        },
      },
      M: {
        container: {
          style: {
            height: 36,
            paddingVertical: 10,
            paddingHorizontal: 20,
            gap: 6,
          },
        },
        leftIcon: {
          style: { size: 16 },
        },
        label: {
          style: { fontSize: 14 },
        },
        rightIcon: {
          style: { size: 16 },
        },
      },
      L: {
        container: {
          style: {
            height: 44,
            paddingVertical: 14,
            paddingHorizontal: 28,
            gap: 10,
          },
        },
        leftIcon: {
          style: { size: 18 },
        },
        label: {
          style: { fontSize: 16 },
        },
        rightIcon: {
          style: { size: 18 },
        },
      },
    },
  },

  // ============================================================================
  // Accessibility: 접근성
  // ============================================================================
  accessibility: {
    role: "button",
    tabIndex: 0,
    minSize: { width: 44, height: 44 },
    keyboard: { Enter: "activate", Space: "activate" },
  },
};

// Default export
export default buttonDSL;
