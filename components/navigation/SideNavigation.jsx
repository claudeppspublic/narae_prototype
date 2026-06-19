import React from "react";

export function SideNavigation({ title, items = [], style, ...rest }) {
  return (
    <nav style={{ width: "100%", ...style }} {...rest}>
      {title && <h2 style={{ margin: "0 0 12px", font: "700 24px/1.4 var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>{title}</h2>}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "2px solid var(--color-light-gray-90)" }}>
        {items.map((it, i) => (
          <li key={i} style={{ borderBottom: "1px solid var(--color-border-gray-light)" }}>
            <a href={it.href || "#"} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 12px", textDecoration: "none",
              font: `${it.active ? 700 : 500} 17px/1.5 var(--krds-font-sans)`, color: it.active ? "var(--color-text-primary)" : "var(--color-text-basic)" }}>
              {it.label}
              {it.children && <span aria-hidden="true" style={{ color: "var(--color-icon-gray)" }}>\u203a</span>}
            </a>
            {it.children && it.active && (
              <ul style={{ listStyle: "none", margin: 0, padding: "0 0 8px", background: "var(--color-surface-gray-subtler)" }}>
                {it.children.map((c, j) => (
                  <li key={j}>
                    <a href={c.href || "#"} style={{ display: "block", padding: "10px 24px", textDecoration: "none",
                      font: `${c.active ? 700 : 400} 15px/1.5 var(--krds-font-sans)`, color: c.active ? "var(--color-text-primary)" : "var(--color-text-subtle)" }}>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SideNavigation;
