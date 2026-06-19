import React from "react";

export function TextList({ type = "bullet", items = [], style, ...rest }) {
  if (type === "ordered") {
    return (
      <ol style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8, font: "400 17px/1.6 var(--krds-font-sans)", color: "var(--color-text-basic)", ...style }} {...rest}>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ol>
    );
  }
  const marker = type === "dash" ? "–" : type === "check" ? "✓" : "•";
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8, ...style }} {...rest}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "flex", gap: 8, font: "400 17px/1.6 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>
          <span aria-hidden="true" style={{ flex: "none", color: type === "check" ? "var(--color-icon-primary)" : "var(--color-text-subtle)", fontWeight: type === "check" ? 700 : 400 }}>{marker}</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default TextList;
