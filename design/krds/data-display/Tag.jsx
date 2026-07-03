import React from "react";

export function Tag({ variant = "soft", size = "medium", onRemove, children, style, ...rest }) {
  const dims = { large: { h: 36, fs: 15, px: 12 }, medium: { h: 32, fs: 15, px: 10 }, small: { h: 24, fs: 13, px: 8 } }[size] || { h: 32, fs: 15, px: 10 };
  const look =
    variant === "outline"
      ? { background: "var(--color-surface-white)", border: "1px solid var(--color-border-gray)", color: "var(--color-text-basic)" }
      : { background: "var(--color-surface-gray-subtler)", border: "1px solid transparent", color: "var(--color-text-basic)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: dims.h,
        padding: `0 ${dims.px}px`,
        borderRadius: 4,
        fontFamily: "var(--krds-font-sans)",
        fontSize: dims.fs,
        fontWeight: 500,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
        ...look,
        ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="삭제"
          onClick={onRemove}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            marginRight: -2,
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "var(--color-icon-gray)",
            fontSize: dims.fs,
          }}
        >
          ✕
        </button>
      )}
    </span>
  );
}

export default Tag;
