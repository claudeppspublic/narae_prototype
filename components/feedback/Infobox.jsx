import React from "react";

export function Infobox({ type = "tip", title, children, style, ...rest }) {
  const accent = type === "point";
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 8,
        border: `1px solid ${accent ? "var(--color-border-primary-light)" : "var(--color-border-gray-light)"}`,
        background: accent ? "var(--color-surface-primary-subtler)" : "var(--color-surface-gray-subtler)",
        ...style,
      }}
      {...rest}
    >
      {title && (
        <strong style={{ display: "block", marginBottom: 8, font: "700 17px/1.5 var(--krds-font-sans)", color: accent ? "var(--color-text-primary)" : "var(--color-text-bolder)" }}>
          {title}
        </strong>
      )}
      <div style={{ font: "400 15px/1.6 var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>{children}</div>
    </div>
  );
}

export default Infobox;
