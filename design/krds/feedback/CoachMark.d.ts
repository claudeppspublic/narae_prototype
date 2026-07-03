import { HTMLAttributes, ReactNode, RefObject, CSSProperties } from "react";

export type CoachMarkPlacement = "top" | "right" | "bottom" | "left";

export interface CoachMarkProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Whether the coach mark is visible. */
  open: boolean;
  /** Called when the coach mark should close. */
  onClose?: () => void;
  /** Ref to the element to spotlight/highlight. */
  target: RefObject<HTMLElement>;
  /** Heading text for the current step. */
  title?: string;
  /** Body text for the current step. */
  description?: string;
  /** Current step number (1-based). */
  step?: number;
  /** Total number of steps. */
  totalSteps?: number;
  /** Called when the "다음" (next) button is clicked. */
  onNext?: () => void;
  /** Called when the "이전" (previous) button is clicked. */
  onPrev?: () => void;
  /** Called when the "건너뛰기" (skip) button is clicked. */
  onSkip?: () => void;
  /** Popover placement relative to the target. @default "bottom" */
  placement?: CoachMarkPlacement;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: CSSProperties;
}

declare function CoachMark(props: CoachMarkProps): JSX.Element | null;
export default CoachMark;
