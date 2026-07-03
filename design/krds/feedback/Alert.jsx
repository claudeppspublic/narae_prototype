import React from "react";

const TYPES = {
  success: { fg: "--color-text-success", bd: "--color-border-success-light", bg: "--color-surface-success-subtler", icon: "var(--color-icon-success)", glyph: "M5 12l4.5 4.5L19 7" },
  info: { fg: "--color-text-information", bd: "--color-border-information-light", bg: "--color-surface-information-subtler", icon: "var(--color-icon-information)", glyph: "M12 11v5m0-8h.01" },
  warning: { fg: "--color-text-warning", bd: "--color-border-warning-light", bg: "--color-surface-warning-subtler", icon: "var(--color-icon-warning)", glyph: "M12 9v4m0 4h.01" },
  danger: { fg: "--color-text-danger", bd: "--color-border-danger-light", bg: "--color-surface-danger-subtler", icon: "var(--color-icon-danger)", glyph: "M12 8v5m0 3h.01" },
};

export function Alert({ type = "info", title, children, action, onClose, style, ...rest }) {
  const t = TYPES[type] || TYPES.info;
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: 16,
        borderRadius: 8,
        border: `1px solid var(${t.bd})`,
        background: `var(${t.bg})`,
        ...style,
      }}
      {...rest}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: t.icon, flex: "none", marginTop: 1 }} aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path d={t.glyph} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {title && <strong style={{ font: "700 17px/1.5 var(--krds-font-sans)", color: `var(${t.fg})` }}>{title}</strong>}
        {children && <div style={{ font: "400 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>{children}</div>}
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>
      {onClose && (
        <button type="button" aria-label="닫기" onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-icon-gray)", fontSize: 16, lineHeight: 1, padding: 2 }}>✕</button>
      )}
    </div>
  );
}

export default Alert;
