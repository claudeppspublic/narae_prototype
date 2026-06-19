import React from "react";

export function Pagination({ page = 1, total = 1, siblings = 2, onChange, style, ...rest }) {
  const go = (p) => { if (p >= 1 && p <= total && p !== page) onChange && onChange(p); };
  const pages = [];
  const start = Math.max(1, page - siblings);
  const end = Math.min(total, page + siblings);
  for (let i = start; i <= end; i++) pages.push(i);
  const btn = (label, target, opts = {}) => (
    <button key={opts.key || label} type="button" aria-label={opts.ariaLabel} aria-current={opts.current ? "page" : undefined} disabled={opts.disabled} onClick={() => go(target)}
      style={{ minWidth: 40, height: 40, padding: "0 8px", borderRadius: 6, cursor: opts.disabled ? "not-allowed" : "pointer",
        border: opts.current ? "1px solid var(--color-border-primary)" : "1px solid transparent",
        background: opts.current ? "var(--color-surface-primary-subtler)" : "transparent",
        color: opts.disabled ? "var(--color-text-disabled)" : opts.current ? "var(--color-text-primary)" : "var(--color-text-subtle)",
        font: `${opts.current ? 700 : 500} 15px/1 var(--krds-font-sans)` }}>
      {label}
    </button>
  );
  return (
    <nav aria-label="pagination" style={{ display: "inline-flex", alignItems: "center", gap: 4, ...style }} {...rest}>
      {btn("\u2039", page - 1, { ariaLabel: "\uc774\uc804", disabled: page <= 1, key: "prev" })}
      {start > 1 && btn("1", 1, { key: "first" })}
      {start > 2 && <span style={{ padding: "0 4px", color: "var(--color-text-disabled)" }}>\u2026</span>}
      {pages.map((p) => btn(String(p), p, { current: p === page, key: p }))}
      {end < total - 1 && <span style={{ padding: "0 4px", color: "var(--color-text-disabled)" }}>\u2026</span>}
      {end < total && btn(String(total), total, { key: "last" })}
      {btn("\u203a", page + 1, { ariaLabel: "\ub2e4\uc74c", disabled: page >= total, key: "next" })}
    </nav>
  );
}

export default Pagination;
