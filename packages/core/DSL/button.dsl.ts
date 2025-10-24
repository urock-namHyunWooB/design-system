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
    variants: {
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
    states: {
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
  },

  props: {
    label: {
      type: "string",
      required: true,
    },
    leftIcon: {
      type: "node",
    },
    rightIcon: {
      type: "node",
    },
    size: {
      type: { kind: "union", values: ["S", "M", "L"] },
      default: "M",
    },
    variant: {
      type: {
        kind: "union",
        values: [
          "filled",
          "outlined-black",
          "outlined-blue",
          "outlined-red",
          "text-blue",
          "text-black",
          "filled-red",
        ],
      },
      default: "filled",
    },
    onClick: {
      type: "function",
    },
    disabled: {
      type: "boolean",
      default: false,
    },
  },

  events: {
    onClick: {
      handler: () => {},
      description: "Button click event",
    },
  },
};

// Default export
export default buttonDSL;
