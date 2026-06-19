import * as React from "react";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export type TooltipTrigger = "hover" | "focus" | "click";

export interface TooltipProps {
  /** Text or content to display in the tooltip. */
  content: React.ReactNode;
  /** Position of the tooltip relative to the trigger element. @default "top" */
  placement?: TooltipPlacement;
  /** How the tooltip is activated. @default "hover" */
  trigger?: TooltipTrigger;
  /** Delay in milliseconds before the tooltip appears. @default 200 */
  delay?: number;
  /** Maximum width of the tooltip in pixels. @default 240 */
  maxWidth?: number;
  /** The trigger element that the tooltip wraps. */
  children: React.ReactNode;
  /** Additional CSS class names applied to the tooltip. */
  className?: string;
  /** Inline style overrides applied to the tooltip. */
  style?: React.CSSProperties;
}

declare function Tooltip(props: TooltipProps): React.ReactElement;

export default Tooltip;
