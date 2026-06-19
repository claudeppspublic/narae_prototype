import React from "react";

/**
 * KRDS Button — primary action control.
 * Types: primary (filled), secondary (tinted + border), tertiary (outline), text (no chrome).
 * Sizes: xsmall(32) · small(40) · medium(48) · large(56) · xlarge(64).
 */
const SIZES = {
  xsmall: { h: 32, fs: 13, pad: 12, radius: 4, gap: 4, icon: 16 },
  small: { h: 40, fs: 15, pad: 12, radius: 6, gap: 4, icon: 16 },
  medium: { h: 48, fs: 17, pad: 16, radius: 6, gap: 4, icon: 20 },
  large: { h: 56, fs: 19, pad: 20, radius: 8, gap: 4, icon: 24 },
  xlarge: { h: 64, fs: 19, pad: 24, radius: 8, gap: 4, icon: 24 },
};

function typeStyle(type, disabled) {
  if (disabled) {
    return {
      background: type === "text" || type === "tertiary" ? "transparent" : "var(--color-button-disabled-fill)",
      color: "var(--color-text-disabled)",
      border: type === "tertiary" ? "1px solid var(--color-button-disabled-border)" : "1px solid transparent",
    };
  }
  switch (type) {
    case "secondary":
      return {
        background: "var(--color-button-secondary-fill)",
        color: "var(--color-text-primary)",
        border: "1px solid var(--color-button-secondary-border)",
        "--hov": "var(--color-button-secondary-fill-hover)",
        "--prs": "var(--color-button-secondary-fill-pressed)",
      };
    case "tertiary":
      return {
        background: "var(--color-button-tertiary-fill)",
        color: "var(--color-text-basic)",
        border: "1px solid var(--color-button-tertiary-border)",
        "--hov": "var(--color-button-tertiary-fill-hover)",
        "--prs": "var(--color-button-tertiary-fill-pressed)",
      };
    case "text":
      return {
        background: "transparent",
        color: "var(--color-text-basic)",
        border: "1px solid transparent",
        "--hov": "var(--color-button-text-fill-hover)",
        "--prs": "var(--color-button-text-fill-pressed)",
      };
    default: // primary
      return {
        background: "var(--color-button-primary-fill)",
        color: "var(--color-text-basic-inverse)",
        border: "1px solid transparent",
        "--hov": "var(--color-button-primary-fill-hover)",
        "--prs": "var(--color-button-primary-fill-pressed)",
      };
  }
}

export function Button({
  type = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.medium;
  const ts = typeStyle(type, disabled);
  return (
    <button
      type="button"
      disabled={disabled}
      data-krds-type={type}
      style={{
        display: fullWidth ? "flex" : "inline-flex",
        width: fullWidth ? "100%" : undefined,
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.h,
        minHeight: s.h,
        padding: `0 ${s.pad}px`,
        borderRadius: s.radius,
        fontFamily: "var(--krds-font-sans)",
        fontSize: s.fs,
        fontWeight: 700,
        lineHeight: 1.5,
        letterSpacing: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        transition: "background-color .12s ease, border-color .12s ease, color .12s ease",
        ...ts,
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled && ts["--hov"]) e.currentTarget.style.background = ts["--hov"]; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = ts.background; }}
      onMouseDown={(e) => { if (!disabled && ts["--prs"]) e.currentTarget.style.background = ts["--prs"]; }}
      onMouseUp={(e) => { if (!disabled && ts["--hov"]) e.currentTarget.style.background = ts["--hov"]; }}
      {...rest}
    >
      {leftIcon}
      {children != null && <span>{children}</span>}
      {rightIcon}
    </button>
  );
}

export default Button;
