import { HTMLAttributes, ReactNode } from "react";

export type DotBadgeColor =
  | "primary"
  | "danger"
  | "success"
  | "warning"
  | "information"
  | "point";
export type DotBadgeSize = "small" | "medium" | "large";

export interface DotBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Dot colour. @default "danger" */
  color?: DotBadgeColor;
  /** Size preset. @default "medium" */
  size?: DotBadgeSize;
  /** Whether the dot is visible. @default true */
  visible?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
  /** The element the dot is positioned relative to. */
  children?: ReactNode;
}

declare function DotBadge(props: DotBadgeProps): JSX.Element | null;
export default DotBadge;
