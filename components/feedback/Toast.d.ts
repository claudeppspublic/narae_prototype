import * as React from "react";

export type ToastSeverity = "information" | "success" | "warning" | "danger";

export type ToastPosition =
  | "top"
  | "top-right"
  | "top-left"
  | "bottom"
  | "bottom-right"
  | "bottom-left";

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Whether the toast is visible. */
  open: boolean;
  /** Called when the toast should close (dismiss button, auto-dismiss, etc.). */
  onClose?: () => void;
  /** Content to display inside the toast. */
  message?: React.ReactNode;
  /** Semantic severity controlling accent colour and icon. @default "information" */
  severity?: ToastSeverity;
  /** Auto-dismiss delay in milliseconds. Set to 0 to disable auto-dismiss. @default 3000 */
  duration?: number;
  /** Screen position for the toast. @default "bottom" */
  position?: ToastPosition;
  /** Optional action element (e.g. an undo button). */
  action?: React.ReactNode;
  /** Whether to show the close (x) button. @default true */
  showCloseButton?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
}

declare function Toast(props: ToastProps): React.ReactElement | null;

export default Toast;
