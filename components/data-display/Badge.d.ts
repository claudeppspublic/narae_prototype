import { HTMLAttributes, ReactNode } from "react";

export type BadgeType = "solid" | "soft" | "outline";
export type BadgeColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "information"
  | "point"
  | "gray";
export type BadgeSize = "small" | "medium" | "large";

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Visual variant. @default "solid" */
  type?: BadgeType;
  /** Semantic colour. @default "primary" */
  color?: BadgeColor;
  /** Size preset. @default "medium" */
  size?: BadgeSize;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
  /** Badge label content. */
  children?: ReactNode;
}

declare function Badge(props: BadgeProps): JSX.Element;
export default Badge;
