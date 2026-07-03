import { HTMLAttributes, ReactNode } from "react";

export type ModalSize = "small" | "medium" | "large";

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called to request closing the modal. */
  onClose?: () => void;
  /** Header title text. */
  title?: string;
  /** Width preset. @default "medium" */
  size?: ModalSize;
  /** Show header close button. @default true */
  showCloseButton?: boolean;
  /** Close when clicking the backdrop. @default true */
  closeOnBackdrop?: boolean;
  /** Close on Escape key press. @default true */
  closeOnEscape?: boolean;
  /** Footer area for action buttons. */
  footer?: ReactNode;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
  /** Dialog body content. */
  children?: ReactNode;
}

declare function Modal(props: ModalProps): JSX.Element | null;
export default Modal;
