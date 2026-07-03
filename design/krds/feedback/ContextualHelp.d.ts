import { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";

export type ContextualHelpPlacement = "top" | "right" | "bottom" | "left";

export interface ContextualHelpProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** Popover heading text. */
  title?: string;
  /** Popover body content. */
  description?: ReactNode;
  /** Optional "learn more" link URL. */
  learnMoreUrl?: string;
  /** Text label for the learn-more link. @default "자세히 보기" */
  learnMoreLabel?: string;
  /** Popover placement relative to the trigger. @default "bottom" */
  placement?: ContextualHelpPlacement;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides for the trigger button. */
  style?: CSSProperties;
}

declare function ContextualHelp(props: ContextualHelpProps): JSX.Element;
export default ContextualHelp;
