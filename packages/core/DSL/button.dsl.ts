import type { ButtonDSL } from "../types/button";

/**
 * Button 컴포넌트 DSL 정의
 *
 * Structure: 컴포넌트 구조 (parts)
 * Size: 크기/레이아웃 (height, padding, fontSize 등)
 * Type: 색상/스타일 (backgroundColor, borderWidth 등)
 * Interactions: 상태별 스타일 (hover, pressed 등)
 * Motion: 애니메이션 설정
 */
export const buttonDSL: ButtonDSL = {
  component: "button",

  // ============================================================================
  // Structure: 컴포넌트 구조
  // ============================================================================
  structure: {
    layout: "row",

    // Parts 정의 (Slot 포함)
    parts: {
      container: {
        type: "container",
        description: "버튼 컨테이너",
      },
      leftIcon: {
        type: "slot",
        slotType: "icon",
        required: false,
        description: "좌측 아이콘 슬롯",
      },
      label: {
        type: "slot",
        slotType: "text",
        required: true,
        description: "버튼 라벨 슬롯",
      },
      rightIcon: {
        type: "slot",
        slotType: "icon",
        required: false,
        description: "우측 아이콘 슬롯",
      },
    },

    // 계층 구조
    hierarchy: {
      container: {
        parent: null,
        children: ["leftIcon", "label", "rightIcon"],
      },
      leftIcon: {
        parent: "container",
      },
      label: {
        parent: "container",
      },
      rightIcon: {
        parent: "container",
      },
    },
  },

  // ============================================================================
  // Sizes: 크기/레이아웃 정의 (Parts별)
  // ============================================================================
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
        },
      },
      leftIcon: {
        style: { size: 14, marginRight: 4 },
      },
      label: {
        style: { fontSize: 13, lineHeight: 20 },
      },
      rightIcon: {
        style: { size: 14, marginLeft: 4 },
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
          gap: 2,
        },
      },
      leftIcon: {
        style: { size: 16, marginRight: 8 },
      },
      label: {
        style: { fontSize: 14, lineHeight: 20 },
      },
      rightIcon: {
        style: { size: 16, marginLeft: 8 },
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
          gap: 4,
        },
      },
      leftIcon: {
        style: { size: 18, marginRight: 12 },
      },
      label: {
        style: { fontSize: 16, lineHeight: 24 },
      },
      rightIcon: {
        style: { size: 18, marginLeft: 12 },
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
      label: {
        style: {
          color: "{Color/text/03-high}",
          fontWeight: 600,
        },
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
      label: {
        style: {
          color: "{Color/text/03-high}",
          fontWeight: 600,
        },
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
          },
        },
        label: {
          style: { fontSize: 12 },
        },
      },
      M: {
        container: {
          style: {
            height: 36,
            paddingVertical: 10,
            paddingHorizontal: 20,
          },
        },
        label: {
          style: { fontSize: 14 },
        },
      },
      L: {
        container: {
          style: {
            height: 44,
            paddingVertical: 14,
            paddingHorizontal: 28,
          },
        },
        label: {
          style: { fontSize: 16 },
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
