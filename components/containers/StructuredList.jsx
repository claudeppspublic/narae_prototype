import React from "react";

export function StructuredList({ items = [], layout = "row", labelWidth = 180, style, ...rest }) {
  return (
    <dl style={{ margin: 0, borderTop: "2px solid var(--color-light-gray-90)", ...style }} {...rest}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: layout === "stack" ? "column" : "row", alignItems: layout === "stack" ? "stretch" : "stretch", borderBottom: "1px solid var(--color-border-gray-light)" }}>
          <dt style={{ flex: layout === "stack" ? "none" : `0 0 ${labelWidth}px`, padding: "16px", background: "var(--color-surface-gray-subtler)", font: "700 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>
            {it.label}
          </dt>
          <dd style={{ flex: 1, margin: 0, padding: "16px", font: "400 15px/1.6 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default StructuredList;
