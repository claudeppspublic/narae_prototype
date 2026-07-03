import * as React from "react";

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Visual variant of the chip. */
  variant?: "filled" | "outlined";
  /** Whether the chip is in a selected/active state. */
  selected?: boolean;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Size variant. */
  size?: "small" | "medium" | "large";
  /** Optional leading icon element. */
  icon?: React.ReactNode;
  /** Optional leading avatar element (takes precedence over icon). */
  avatar?: React.ReactNode;
  /** When provided, a delete icon is shown and this handler is called on click. */
  onDelete?: (event: React.MouseEvent<HTMLSpanElement>) => void;
  /** Click handler for the chip itself (toggle / filter action). */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
  /** Chip content. */
  children?: React.ReactNode;
}

declare function Chip(props: ChipProps): React.ReactElement;

export default Chip;
