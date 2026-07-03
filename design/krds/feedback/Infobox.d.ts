import { HTMLAttributes, ReactNode } from "react";

export type InfoboxSeverity = "information" | "success" | "warning" | "danger";

export interface InfoboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Semantic severity level. @default "information" */
  severity?: InfoboxSeverity;
  /** Optional bold heading text. */
  title?: string;
  /** Custom icon element; auto-selected by severity if omitted. */
  icon?: ReactNode;
  /** Show a dismiss button. @default false */
  closable?: boolean;
  /** Called when the dismiss button is clicked. */
  onClose?: () => void;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
  /** Description / body content (longer explanations or instructions). */
  children?: ReactNode;
}

declare function Infobox(props: InfoboxProps): JSX.Element | null;
export default Infobox;
