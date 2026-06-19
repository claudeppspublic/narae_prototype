import { HTMLAttributes, ReactNode } from "react";

export type CriticalAlertSeverity = "danger" | "warning";

export interface CriticalAlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called when the dialog should be dismissed (backdrop click, Escape key). */
  onClose?: () => void;
  /** Heading text. @default "주의" */
  title?: string;
  /** Explanatory message body. */
  message?: string | ReactNode;
  /** Confirm button label. @default "확인" */
  confirmLabel?: string;
  /** Cancel button label. @default "취소" */
  cancelLabel?: string;
  /** Called when the confirm button is clicked. */
  onConfirm?: () => void;
  /** Called when the cancel button is clicked (falls back to onClose). */
  onCancel?: () => void;
  /** Severity determines icon and button colour. @default "danger" */
  severity?: CriticalAlertSeverity;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides applied to the dialog panel. */
  style?: React.CSSProperties;
}

declare function CriticalAlert(props: CriticalAlertProps): React.ReactPortal | null;
export default CriticalAlert;
