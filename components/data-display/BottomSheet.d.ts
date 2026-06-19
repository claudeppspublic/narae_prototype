import { HTMLAttributes, ReactNode, CSSProperties } from "react";

export type BottomSheetSize = "small" | "medium" | "large" | "full";

export interface BottomSheetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Whether the bottom sheet is visible. */
  open: boolean;
  /** Called when the user closes the sheet (backdrop click, Escape, or close button). */
  onClose?: (event?: React.SyntheticEvent) => void;
  /** Title text displayed in the header bar. */
  title?: string;
  /** Max-height preset. @default "medium" */
  size?: BottomSheetSize;
  /** Show the drag-handle bar at the top of the sheet. @default true */
  showHandle?: boolean;
  /** Show the close (X) button in the header. @default true */
  showCloseButton?: boolean;
  /** Additional CSS class names applied to the sheet panel. */
  className?: string;
  /** Inline style overrides applied to the sheet panel. */
  style?: CSSProperties;
  /** Sheet body content. */
  children?: ReactNode;
}

declare function BottomSheet(props: BottomSheetProps): JSX.Element | null;
export default BottomSheet;
