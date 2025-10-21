/**
 * 플랫폼 독립적 스타일 속성 정의
 * HTML/CSS와 유사하지만 멀티 플랫폼을 위한 추상화
 */

// ============================================================================
// 기본 타입
// ============================================================================

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type AlignItems =
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "baseline";
export type AlignSelf =
  | "auto"
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "baseline";
export type BorderStyle = "solid" | "dashed" | "dotted" | "none";
export type FontWeight =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | "normal"
  | "bold";
export type TextAlign = "left" | "center" | "right" | "justify";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
export type Position = "relative" | "absolute" | "fixed" | "sticky";
export type Overflow = "visible" | "hidden" | "scroll" | "auto";
export type Cursor =
  | "pointer"
  | "default"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "text"
  | "move";

// ============================================================================
// 플랫폼 독립적 스타일
// ============================================================================

/**
 * 플랫폼 독립적 스타일 속성
 *
 * 모든 플랫폼에서 사용 가능한 공통 스타일 속성을 정의합니다.
 * 각 플랫폼 제너레이터가 이를 플랫폼별 스타일로 변환합니다.
 */
export interface PlatformStyle {
  // ============ Layout ============
  /** 높이 */
  height?: number;
  /** 너비 */
  width?: number;
  /** 최소 높이 */
  minHeight?: number;
  /** 최소 너비 */
  minWidth?: number;
  /** 최대 높이 */
  maxHeight?: number;
  /** 최대 너비 */
  maxWidth?: number;

  // ============ Spacing ============
  /** 패딩 (모든 방향) */
  padding?: number;
  /** 패딩 (상하) */
  paddingVertical?: number;
  /** 패딩 (좌우) */
  paddingHorizontal?: number;
  /** 패딩 상단 */
  paddingTop?: number;
  /** 패딩 우측 */
  paddingRight?: number;
  /** 패딩 하단 */
  paddingBottom?: number;
  /** 패딩 좌측 */
  paddingLeft?: number;

  /** 마진 (모든 방향) */
  margin?: number;
  /** 마진 (상하) */
  marginVertical?: number;
  /** 마진 (좌우) */
  marginHorizontal?: number;
  /** 마진 상단 */
  marginTop?: number;
  /** 마진 우측 */
  marginRight?: number;
  /** 마진 하단 */
  marginBottom?: number;
  /** 마진 좌측 */
  marginLeft?: number;

  /** 자식 요소 간 간격 */
  gap?: number;

  // ============ Colors ============
  /** 배경색 */
  backgroundColor?: string;
  /** 전경색 (텍스트, 아이콘 등) */
  color?: string;
  /** 테두리 색상 */
  borderColor?: string;
  /** 아웃라인 색상 */
  outlineColor?: string;

  // ============ Border ============
  /** 테두리 두께 */
  borderWidth?: number;
  /** 테두리 반경 (모든 모서리) */
  borderRadius?: number;
  /** 테두리 반경 (좌상단) */
  borderTopLeftRadius?: number;
  /** 테두리 반경 (우상단) */
  borderTopRightRadius?: number;
  /** 테두리 반경 (좌하단) */
  borderBottomLeftRadius?: number;
  /** 테두리 반경 (우하단) */
  borderBottomRightRadius?: number;
  /** 테두리 스타일 */
  borderStyle?: BorderStyle;

  // ============ Typography ============
  /** 폰트 크기 */
  fontSize?: number;
  /** 폰트 굵기 */
  fontWeight?: FontWeight;
  /** 폰트 패밀리 */
  fontFamily?: string;
  /** 줄 높이 */
  lineHeight?: number;
  /** 글자 간격 */
  letterSpacing?: number;
  /** 텍스트 정렬 */
  textAlign?: TextAlign;
  /** 텍스트 변형 */
  textTransform?: TextTransform;
  /** 텍스트 장식 */
  textDecoration?: "none" | "underline" | "line-through";

  // ============ Effects ============
  /** 투명도 (0-1) */
  opacity?: number;
  /** 고도/깊이 (플랫폼 독립적, shadow 대신 사용) */
  elevation?: number;
  /** 그림자 (직접 지정) */
  shadow?: string;
  /** 블러 */
  blur?: number;

  // ============ Transform ============
  /** 크기 변환 */
  scale?: number;
  /** X축 크기 변환 */
  scaleX?: number;
  /** Y축 크기 변환 */
  scaleY?: number;
  /** 회전 (도) */
  rotate?: number;
  /** X축 이동 */
  translateX?: number;
  /** Y축 이동 */
  translateY?: number;

  // ============ Flexbox ============
  /** Flex 방향 */
  flexDirection?: FlexDirection;
  /** 주축 정렬 */
  justifyContent?: JustifyContent;
  /** 교차축 정렬 */
  alignItems?: AlignItems;
  /** 자신 정렬 */
  alignSelf?: AlignSelf;
  /** Flex 비율 */
  flex?: number;
  /** Flex 줄바꿈 */
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";

  // ============ Position ============
  /** 위치 유형 */
  position?: Position;
  /** 상단 위치 */
  top?: number;
  /** 우측 위치 */
  right?: number;
  /** 하단 위치 */
  bottom?: number;
  /** 좌측 위치 */
  left?: number;
  /** Z 인덱스 */
  zIndex?: number;

  // ============ Overflow ============
  /** 오버플로우 처리 */
  overflow?: Overflow;
  overflowX?: Overflow;
  overflowY?: Overflow;

  // ============ Cursor (웹 전용) ============
  /** 커서 스타일 */
  cursor?: Cursor;

  // ============ Other ============
  /** 배경 이미지 */
  backgroundImage?: string;
  /** 아웃라인 두께 */
  outlineWidth?: number;
  /** 아웃라인 오프셋 */
  outlineOffset?: number;
  /** 아웃라인 스타일 */
  outlineStyle?: BorderStyle;
}

// ============================================================================
// 특화 스타일
// ============================================================================

/**
 * 아이콘 전용 스타일
 */
export interface IconStyle
  extends Pick<
    PlatformStyle,
    | "color"
    | "opacity"
    | "margin"
    | "marginTop"
    | "marginRight"
    | "marginBottom"
    | "marginLeft"
    | "marginVertical"
    | "marginHorizontal"
  > {
  /** 아이콘 크기 */
  size?: number;
}

/**
 * 텍스트 전용 스타일
 */
export interface TextStyle
  extends Pick<
    PlatformStyle,
    | "fontSize"
    | "fontWeight"
    | "fontFamily"
    | "lineHeight"
    | "letterSpacing"
    | "color"
    | "textAlign"
    | "textTransform"
    | "textDecoration"
    | "opacity"
  > {}

/**
 * 컨테이너/레이아웃 전용 스타일
 */
export type ContainerStyle = PlatformStyle;

// ============================================================================
// 헬퍼 타입
// ============================================================================

/**
 * 스타일과 상태를 포함하는 스타일 정의
 */
export interface StyleWithStates<TStyle = PlatformStyle> {
  /** 기본 스타일 */
  style: TStyle;
}

/**
 * 부분 스타일 (DeepPartial)
 */
export type PartialStyle<T> = {
  [P in keyof T]?: T[P] extends object ? PartialStyle<T[P]> : T[P];
};
