import { HTMLAttributes, ReactNode } from "react";

export type AlertSeverity = "information" | "success" | "warning" | "danger";
export type AlertVariant = "standard" | "filled" | "outlined";

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Semantic severity level. @default "information" */
  severity?: AlertSeverity;
  /** Optional bold heading text. */
  title?: string;
  /** Show a dismiss button. @default false */
  closable?: boolean;
  /** Called when the dismiss button is clicked. */
  onClose?: () => void;
  /** Custom icon element; auto-selected by severity if omitted. */
  icon?: ReactNode;
  /** Action area (e.g. a button) rendered on the right side. */
  action?: ReactNode;
  /** Visual variant. @default "standard" */
  variant?: AlertVariant;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
  /** Description / body content. */
  children?: ReactNode;
}

declare function Alert(props: AlertProps): JSX.Element;
export default Alert;
