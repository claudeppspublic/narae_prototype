import React from "react";

export function Link({
  href = "#",
  variant = "default",
  size = "medium",
  icon,
  children,
  style,
  ...rest
}) {
  const fs = { large: 19, medium: 17, small: 15, xsmall: 13 }[size] || 17;
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        color: "var(--color-link-default)",
        fontFamily: "var(--krds-font-sans)",
        fontSize: fs,
        fontWeight: 400,
        lineHeight: 1.5,
        textDecoration: variant === "subtle" ? "none" : "underline",
        textUnderlineOffset: "0.2em",
        cursor: "pointer",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-link-hover)";
        e.currentTarget.style.textDecoration = "underline";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-link-default)";
        e.currentTarget.style.textDecoration = variant === "subtle" ? "none" : "underline";
      }}
      {...rest}
    >
      {children}
      {icon}
    </a>
  );
}

export default Link;
