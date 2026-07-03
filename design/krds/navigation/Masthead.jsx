import React from "react";

/**
 * KRDS Masthead — the mandatory "official government site" banner at the very top.
 * Korean public sites must display this identity strip.
 */
export function Masthead({ text = "이 누리집은 대한민국 공식 전자정부 누리집입니다.", style, ...rest }) {
  return (
    <div
      style={{
        width: "100%",
        background: "var(--color-light-secondary-5)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", height: 32, display: "flex", alignItems: "center", gap: 8, padding: "0 24px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--color-light-secondary-70)" }}>
          <path d="M5 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6 4h11l-2.5 3L17 10H6V4z" fill="currentColor" />
        </svg>
        <span style={{ font: "400 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>{text}</span>
      </div>
    </div>
  );
}

export default Masthead;
