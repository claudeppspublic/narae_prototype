import React from "react";

const SZ = {
  xsmall: { box: 32, radius: 4 },
  small: { box: 40, radius: 6 },
  medium: { box: 48, radius: 6 },
  large: { box: 56, radius: 8 },
};

export function IconButton({
  type = "tertiary",
  size = "medium",
  disabled = false,
  rounded = false,
  "aria-label": ariaLabel = "button",
  children,
  style,
  ...rest
}) {
  const s = SZ[size] || SZ.medium;
  const base =
    type === "primary"
      ? { background: "var(--color-button-primary-fill)", color: "var(--color-text-basic-inverse)", border: "1px solid transparent", hov: "var(--color-button-primary-fill-hover)" }
      : type === "secondary"
      ? { background: "var(--color-button-secondary-fill)", color: "var(--color-text-primary)", border: "1px solid var(--color-button-secondary-border)", hov: "var(--color-button-secondary-fill-hover)" }
      : type === "ghost"
      ? { background: "transparent", color: "var(--color-icon-gray)", border: "1px solid transparent", hov: "var(--color-button-tertiary-fill-hover)" }
      : { background: "var(--color-button-tertiary-fill)", color: "var(--color-icon-gray)", border: "1px solid var(--color-button-tertiary-border)", hov: "var(--color-button-tertiary-fill-hover)" };
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: s.box,
        height: s.box,
        borderRadius: rounded ? 999 : s.radius,
        background: disabled ? "var(--color-button-disabled-fill)" : base.background,
        color: disabled ? "var(--color-text-disabled)" : base.color,
        border: base.border,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color .12s ease",
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = base.hov; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = base.background; }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default IconButton;
