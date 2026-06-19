import { HTMLAttributes, ReactNode } from "react";

export type NumberBadgeColor = "primary" | "danger" | "success" | "warning";
export type NumberBadgeSize = "small" | "medium" | "large";

export interface NumberBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /** The number to display. */
  count?: number;
  /** Maximum count before showing "maxCount+". @default 99 */
  maxCount?: number;
  /** Badge colour. @default "danger" */
  color?: NumberBadgeColor;
  /** Size preset. @default "medium" */
  size?: NumberBadgeSize;
  /** Show badge when count is zero. @default false */
  showZero?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
  /** The element the badge is attached to. */
  children?: ReactNode;
}

declare function NumberBadge(props: NumberBadgeProps): JSX.Element | null;
export default NumberBadge;
