import { HTMLAttributes } from "react";

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Currently selected date. */
  value?: Date | null;
  /** Called when a date is selected. */
  onChange?: (date: Date) => void;
  /** Earliest selectable date. */
  minDate?: Date;
  /** Latest selectable date. */
  maxDate?: Date;
  /** Specific dates to disable. */
  disabledDates?: Date[];
  /** Locale for month/year formatting. @default "ko-KR" */
  locale?: string;
  /** Show dates from adjacent months in empty cells. @default true */
  showAdjacentMonths?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
}

declare function Calendar(props: CalendarProps): JSX.Element;
export default Calendar;
