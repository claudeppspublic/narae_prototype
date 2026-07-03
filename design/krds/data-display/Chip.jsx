import React from "react";

export function Chip({ size = "medium", selected = false, disabled = false, leadingIcon, children, style, onClick, ...rest }) {
  const dims = { large: { h: 40, fs: 17, px: 16 }, medium: { h: 36, fs: 15, px: 14 }, small: { h: 32, fs: 15, px: 12 } }[size] || { h: 36, fs: 15, px: 14 };
  const look = disabled
    ? { background: "var(--color-surface-disabled)", border: "1px solid var(--color-border-disabled)", color: "var(--color-text-disabled)" }
    : selected
    ? { background: "var(--color-surface-primary-subtler)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }
    : { background: "var(--color-surface-white)", border: "1px solid var(--color-border-gray)", color: "var(--color-text-subtle)" };
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: dims.h,
        padding: `0 ${dims.px}px`,
        borderRadius: 999,
        fontFamily: "var(--krds-font-sans)",
        fontSize: dims.fs,
        fontWeight: selected ? 700 : 500,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color .12s ease, border-color .12s ease, color .12s ease",
        ...look,
        ...style,
      }}
      {...rest}
    >
      {leadingIcon}
      {children}
    </button>
  );
}

export default Chip;
