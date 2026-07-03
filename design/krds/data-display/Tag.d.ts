import * as React from "react";

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Semantic colour of the tag. */
  color?: "primary" | "secondary" | "danger" | "success" | "warning" | "information" | "gray";
  /** Size variant. */
  size?: "small" | "medium";
  /** Whether the tag shows a dismiss button. */
  removable?: boolean;
  /** Called when the remove button is clicked. */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Optional leading icon element. */
  icon?: React.ReactNode;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
  /** Tag content. */
  children?: React.ReactNode;
}

declare function Tag(props: TagProps): React.ReactElement;

export default Tag;
