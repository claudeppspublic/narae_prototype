import React from "react";

const COLORS = {
  primary: { base: "--color-light-primary-50", soft: "--color-light-primary-5", line: "--color-light-primary-50", text: "--color-light-primary-60", on: "#fff" },
  secondary: { base: "--color-light-secondary-70", soft: "--color-light-secondary-5", line: "--color-light-secondary-70", text: "--color-light-secondary-80", on: "#fff" },
  tertiary: { base: "--color-light-gray-60", soft: "--color-light-gray-10", line: "--color-light-gray-60", text: "--color-light-gray-80", on: "#fff" },
  point: { base: "--color-light-point-50", soft: "--color-light-point-5", line: "--color-light-point-50", text: "--color-light-point-60", on: "#fff" },
  danger: { base: "--color-light-danger-50", soft: "--color-light-danger-5", line: "--color-light-danger-50", text: "--color-light-danger-60", on: "#fff" },
  warning: { base: "--color-light-warning-30", soft: "--color-light-warning-5", line: "--color-light-warning-50", text: "--color-light-warning-60", on: "--color-light-gray-90" },
  success: { base: "--color-light-success-50", soft: "--color-light-success-5", line: "--color-light-success-50", text: "--color-light-success-60", on: "#fff" },
  info: { base: "--color-light-information-50", soft: "--color-light-information-5", line: "--color-light-information-50", text: "--color-light-information-60", on: "#fff" },
};

export function Badge({ type = "solid", color = "primary", size = "medium", children, style, ...rest }) {
  const c = COLORS[color] || COLORS.primary;
  const v = (t) => (t && t.startsWith("--") ? `var(${t})` : t);
  const dims = size === "small" ? { h: 24, fs: 13 } : { h: 32, fs: 15 };
  let look;
  if (type === "soft") look = { background: v(c.soft), color: v(c.text), border: "1px solid transparent" };
  else if (type === "outline") look = { background: "var(--color-surface-white)", color: v(c.text), border: `1px solid ${v(c.line)}` };
  else look = { background: v(c.base), color: v(c.on), border: "1px solid transparent" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: dims.h,
        padding: "0 8px",
        borderRadius: 4,
        fontFamily: "var(--krds-font-sans)",
        fontSize: dims.fs,
        fontWeight: 700,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
        ...look,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Badge;
