import * as React from "react";

export interface SplashScreenProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Whether the splash screen is visible. */
  open: boolean;
  /** Logo image or element displayed at the top. */
  logo?: React.ReactNode;
  /** Application or service name. */
  title?: string;
  /** Tagline or description shown below the title. */
  subtitle?: string;
  /** Show a circular spinner below the content. @default true */
  showSpinner?: boolean;
  /** Called when the splash screen finishes (after duration + fade-out). */
  onComplete?: () => void;
  /** Display duration in milliseconds before fade-out starts. @default 2000 */
  duration?: number;
  /** Additional CSS class names. */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
}

declare function SplashScreen(props: SplashScreenProps): React.ReactElement | null;

export default SplashScreen;
