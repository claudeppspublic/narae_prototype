import React from "react";

export function Disclosure({ summary, children, defaultOpen = false, style, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderRadius: 8, border: "1px solid var(--color-border-gray-light)", overflow: "hidden", ...style }} {...rest}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", border: "none", background: "var(--color-surface-gray-subtler)", cursor: "pointer", textAlign: "left", font: "700 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-bolder)" }}
      >
        {summary}
        <span aria-hidden="true" style={{ transition: "transform .2s ease", transform: open ? "rotate(180deg)" : "none", color: "var(--color-icon-gray)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>
      {open && <div style={{ padding: "14px 16px", font: "400 15px/1.6 var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>{children}</div>}
    </div>
  );
}

export default Disclosure;
