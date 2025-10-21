/**
 * Typography DSL
 *
 * Figma 디자인 시스템 기반의 Typography 컴포넌트 정의
 * - Text: Pretendard 폰트 (12~72px)
 * - Number: Spoqa Han Sans Neo 폰트 (14~120px)
 */

import type { TypographyDSL } from "../types/dsl/typography";

export const typographyDSL: TypographyDSL = {
  component: "typography",

  // ============================================================================
  // 구조 정의
  // ============================================================================
  structure: {
    layout: "row",
    parts: {
      text: {
        type: "slot",
        slotType: "text",
        required: true,
        description: "텍스트 콘텐츠",
      },
    },
  },

  // ============================================================================
  // 폰트 패밀리 정의
  // ============================================================================
  families: {
    text: {
      fontFamily: "Pretendard",
      availableSizes: [
        "72",
        "48",
        "40",
        "36",
        "32",
        "28",
        "24",
        "20",
        "18",
        "16",
        "14",
        "12",
      ],
      availableWeights: ["bold", "semibold", "medium", "regular"],
    },
    number: {
      fontFamily: "Spoqa Han Sans Neo",
      availableSizes: [
        "120",
        "72",
        "48",
        "40",
        "36",
        "32",
        "28",
        "24",
        "20",
        "18",
        "16",
        "14",
      ],
      availableWeights: ["bold", "medium"],
    },
  },

  // ============================================================================
  // 사이즈 정의 (Text - Pretendard)
  // ============================================================================
  sizes: {
    "72": {
      text: {
        style: {
          fontSize: 72,
          lineHeight: 86.4,
          letterSpacing: -4,
        },
      },
    },
    "48": {
      text: {
        style: {
          fontSize: 48,
          lineHeight: 57.6,
          letterSpacing: -3,
        },
      },
    },
    "40": {
      text: {
        style: {
          fontSize: 40,
          lineHeight: 48,
          letterSpacing: -3,
        },
      },
    },
    "36": {
      text: {
        style: {
          fontSize: 36,
          lineHeight: 46.08,
          letterSpacing: -3,
        },
      },
    },
    "32": {
      text: {
        style: {
          fontSize: 32,
          lineHeight: 38.4,
          letterSpacing: -3,
        },
      },
    },
    "28": {
      text: {
        style: {
          fontSize: 28,
          lineHeight: 38.08,
          letterSpacing: -1.3,
        },
      },
    },
    "24": {
      text: {
        style: {
          fontSize: 24,
          lineHeight: 33.6,
          letterSpacing: -1.3,
        },
      },
    },
    "20": {
      text: {
        style: {
          fontSize: 20,
          lineHeight: 24,
          letterSpacing: -1,
        },
      },
    },
    "18": {
      text: {
        style: {
          fontSize: 18,
          lineHeight: 24.48,
          letterSpacing: -0.5,
        },
      },
    },
    "16": {
      text: {
        style: {
          fontSize: 16,
          lineHeight: 23.68,
          letterSpacing: -0.5,
        },
      },
    },
    "14": {
      text: {
        style: {
          fontSize: 14,
          lineHeight: 19.6,
          letterSpacing: -0.5,
        },
      },
    },
    "12": {
      text: {
        style: {
          fontSize: 12,
          lineHeight: 16.32,
          letterSpacing: -0.5,
        },
      },
    },
    "120": {
      text: {
        style: {
          fontSize: 120,
          lineHeight: 132,
          letterSpacing: -2,
        },
      },
    },
  },

  // ============================================================================
  // 타입 정의 (Weight)
  // ============================================================================
  types: {
    bold: {
      text: {
        style: {
          fontWeight: 700,
        },
      },
    },
    semibold: {
      text: {
        style: {
          fontWeight: 600,
        },
      },
    },
    medium: {
      text: {
        style: {
          fontWeight: 500,
        },
      },
    },
    regular: {
      text: {
        style: {
          fontWeight: 400,
        },
      },
    },
  },

  // ============================================================================
  // 접근성
  // ============================================================================
  accessibility: {
    role: "text",
    ariaLabel: undefined,
    ariaDescribedBy: undefined,
  },
};
