import React from "react";

/**
 * KRDS Header — government site header: utility row + brand/logo + main nav (GNB).
 * `menus` as [{label, href}]; `utility` as [{label, href}]; `logo` is a node.
 */
export function Header({ logo, siteName = "정부기관", menus = [], utility = [], onSearch, style, ...rest }) {
  const [open, setOpen] = React.useState(null);
  return (
    <header style={{ borderBottom: "1px solid var(--color-border-gray-light)", background: "var(--color-surface-white)", ...style }} {...rest}>
      {/* Utility row */}
      <div style={{ borderBottom: "1px solid var(--color-border-gray-light)" }}>
        <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "0 24px", height: 40, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16 }}>
          {utility.map((u, i) => (
            <a key={i} href={u.href || "#"} style={{ font: "400 13px/1.5 var(--krds-font-sans)", color: "var(--color-text-subtle)", textDecoration: "none" }}>{u.label}</a>
          ))}
        </div>
      </div>
      {/* Main row */}
      <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--color-text-bolder)" }}>
          {logo || (
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, background: "var(--color-element-primary)", color: "#fff", fontWeight: 800 }}>정</span>
          )}
          <span style={{ font: "800 22px/1.2 var(--krds-font-sans)" }}>{siteName}</span>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {menus.map((m, i) => (
            <a key={i} href={m.href || "#"}
              onMouseEnter={() => setOpen(i)} onMouseLeave={() => setOpen(null)}
              style={{ padding: "0 18px", height: 72, display: "inline-flex", alignItems: "center", textDecoration: "none",
                font: "700 19px/1.5 var(--krds-font-sans)", color: open === i ? "var(--color-text-primary)" : "var(--color-text-basic)",
                boxShadow: open === i ? "inset 0 -3px 0 var(--color-element-primary)" : "none" }}>
              {m.label}
            </a>
          ))}
          {onSearch && (
            <button type="button" aria-label="검색" onClick={onSearch} style={{ marginLeft: 8, width: 44, height: 44, borderRadius: 999, border: "none", background: "var(--color-surface-gray-subtle)", cursor: "pointer", color: "var(--color-icon-gray)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "middle" }}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
