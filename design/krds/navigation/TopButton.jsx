import React from "react";

/**
 * KRDS TopButton — floating "scroll to top" button, fixed bottom-right.
 */
export function TopButton({ label = "위로", onClick, style, ...rest }) {
  const handle = onClick || (() => window.scrollTo({ top: 0, behavior: "smooth" }));
  return (
    <button type="button" aria-label={label} onClick={handle}
      style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, width: 56, height: 56, borderRadius: "50%", cursor: "pointer",
        border: "1px solid var(--color-border-gray-light)", background: "var(--color-surface-white)", boxShadow: "var(--krds-shadow-2)", color: "var(--color-text-subtle)", ...style }} {...rest}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 19V6m0 0l-6 6m6-6l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span style={{ font: "700 11px/1 var(--krds-font-sans)" }}>{label}</span>
    </button>
  );
}

export default TopButton;
