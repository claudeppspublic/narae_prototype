import { HTMLAttributes, ReactNode } from "react";

export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Array of slide content nodes. */
  slides?: ReactNode[];
  /** Auto-advance slides. @default false */
  autoPlay?: boolean;
  /** Auto-play interval in milliseconds. @default 5000 */
  autoPlayInterval?: number;
  /** Show prev/next arrow buttons. @default true */
  showArrows?: boolean;
  /** Show dot indicators. @default true */
  showDots?: boolean;
  /** Loop around at both ends. @default true */
  infinite?: boolean;
  /** Called when the active slide index changes. */
  onChange?: (index: number) => void;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
}

declare function Carousel(props: CarouselProps): JSX.Element | null;
export default Carousel;
