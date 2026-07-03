import { HTMLAttributes } from "react";

export type SpinnerSize = "small" | "medium" | "large";
export type SpinnerColor = "primary" | "secondary" | "inverse" | "inherit";

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Size preset. @default "medium" */
  size?: SpinnerSize;
  /** Spinner colour. @default "primary" */
  color?: SpinnerColor;
  /** Accessible label for screen readers. @default "로딩 중" */
  label?: string;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
}

declare function Spinner(props: SpinnerProps): JSX.Element;
export default Spinner;
