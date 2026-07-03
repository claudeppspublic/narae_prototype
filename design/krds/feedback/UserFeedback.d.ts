import * as React from "react";

export interface UserFeedbackData {
  /** Star rating (1–5). */
  rating: number;
  /** Free-form comment text. */
  comment: string;
  /** Selected category (may be empty string if none chosen). */
  category: string;
}

export interface UserFeedbackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onSubmit"> {
  /** Controlled open state of the feedback panel. */
  open: boolean;
  /** Called when the panel's open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Called with the collected feedback data when the user submits. */
  onSubmit?: (data: UserFeedbackData) => void;
  /** Category choices shown as selectable chips. @default ["기능 개선", "오류 신고", "사용성", "기타"] */
  categories?: string[];
  /** Heading text for the feedback panel. @default "의견 보내기" */
  title?: string;
  /** Placeholder text for the comment textarea. @default "의견을 입력해 주세요" */
  placeholder?: string;
  /** Label for the submit button. @default "제출" */
  submitLabel?: string;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides applied to the feedback panel. */
  style?: React.CSSProperties;
}

declare function UserFeedback(props: UserFeedbackProps): React.ReactElement;

export default UserFeedback;
