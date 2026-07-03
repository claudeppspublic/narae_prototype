import { HTMLAttributes } from "react";

export type ProgressBarSize = "small" | "medium" | "large";
export type ProgressBarColor = "primary" | "success" | "danger" | "warning";

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  /** Current progress value (0–100). @default 0 */
  value?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** Size preset controlling track height. @default "medium" */
  size?: ProgressBarSize;
  /** Semantic fill colour. @default "primary" */
  color?: ProgressBarColor;
  /** Whether to show a label above the bar. @default false */
  showLabel?: boolean;
  /** Custom label text (overrides the percentage display). */
  label?: string;
  /** Show an indeterminate animated bar instead of a fill. @default false */
  indeterminate?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
}

declare function ProgressBar(props: ProgressBarProps): JSX.Element;
export default ProgressBar;
