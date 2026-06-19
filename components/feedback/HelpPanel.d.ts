import { HTMLAttributes, ReactNode, CSSProperties } from "react";

export interface HelpPanelProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Whether the panel is visible. */
  open: boolean;
  /** Called when the panel should close. */
  onClose?: () => void;
  /** Header title. @default "도움말" */
  title?: string;
  /** Panel width in pixels. @default 360 */
  width?: number;
  /** Scrollable body content. */
  children?: ReactNode;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides for the panel. */
  style?: CSSProperties;
}

declare function HelpPanel(props: HelpPanelProps): JSX.Element | null;
export default HelpPanel;
