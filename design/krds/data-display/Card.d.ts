import { HTMLAttributes, ReactNode, CSSProperties, MouseEvent } from "react";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardSize = "small" | "medium" | "large";

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Visual variant. @default "elevated" */
  variant?: CardVariant;
  /** Size preset — controls padding. @default "medium" */
  size?: CardSize;
  /** Whether the card is interactive/clickable. @default false */
  clickable?: boolean;
  /** Click handler. Providing this implies clickable. */
  onClick?: (event: MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
  /** Optional header content rendered above the body. */
  header?: ReactNode;
  /** Optional footer content rendered below the body. */
  footer?: ReactNode;
  /** Optional media area (image/video) rendered flush at the top of the card. */
  media?: ReactNode;
  /** Stretch to fill the parent container width. @default false */
  fullWidth?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: CSSProperties;
  /** Card body content. */
  children?: ReactNode;
}

declare function Card(props: CardProps): JSX.Element;
export default Card;
