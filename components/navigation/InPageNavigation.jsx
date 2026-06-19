import React from "react";

export function InPageNavigation({ title = "\ubaa9\ucc28", items = [], style, ...rest }) {
  return (
    <nav aria-label={title} style={{ ...style }} {...rest}>
      {title && <p style={{ margin: "0 0 8px", font: "700 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>{title}</p>}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2, borderLeft: "2px solid var(--color-border-gray-light)" }}>
        {items.map((it, i) => (
          <li key={i}>
            <a href={it.href || "#"} style={{
              display: "block", padding: "6px 14px", marginLeft: -2, textDecoration: "none",
              borderLeft: it.active ? "2px solid var(--color-element-primary)" : "2px solid transparent",
              font: `${it.active ? 700 : 400} 15px/1.5 var(--krds-font-sans)`, color: it.active ? "var(--color-text-primary)" : "var(--color-text-subtle)" }}>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default InPageNavigation;
