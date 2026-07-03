import React from "react";

export function Modal({ open = true, size = "medium", title, children, footer, onClose, closeOnOverlay = true, style, ...rest }) {
  if (!open) return null;
  const width = { small: 400, medium: 520, large: 720 }[size] || 520;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : undefined}
      onClick={closeOnOverlay ? (e) => { if (e.target === e.currentTarget) onClose && onClose(); } : undefined}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--color-background-dim)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: width,
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-surface-white)",
          borderRadius: 12,
          boxShadow: "var(--krds-shadow-3)",
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "24px 24px 0" }}>
          {title && <h2 style={{ margin: 0, flex: 1, font: "700 24px/1.4 var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>{title}</h2>}
          {onClose && (
            <button type="button" aria-label="닫기" onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-icon-gray)", fontSize: 22, lineHeight: 1, padding: 2, marginTop: -2 }}>✕</button>
          )}
        </div>
        <div style={{ padding: "16px 24px", overflowY: "auto", font: "400 17px/1.6 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>{children}</div>
        {footer && <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "8px 24px 24px" }}>{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
