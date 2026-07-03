import React from "react";

/**
 * KRDS Breadcrumb — hierarchical trail. Pass `items` as [{label, href}].
 * The last item is rendered as the current page.
 */
export function Breadcrumb({ items = [], style, ...rest }) {
  return (
    <nav aria-label="breadcrumb" style={{ ...style }} {...rest}>
      <ol style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {i === 0 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--color-icon-gray)" }}><path d="M4 11l8-7 8 7M6 9.5V20h12V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {last ? (
                <span aria-current="page" style={{ font: "700 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>{it.label}</span>
              ) : (
                <a href={it.href || "#"} style={{ font: "400 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-subtle)", textDecoration: "none" }}>{it.label}</a>
              )}
              {!last && <span aria-hidden="true" style={{ color: "var(--color-icon-gray)", fontSize: 12 }}>\u203a</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
