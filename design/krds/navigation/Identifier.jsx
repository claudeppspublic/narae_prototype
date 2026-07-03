import React from "react";

/**
 * KRDS Identifier — the government identity strip (정부 상징 + 기관명) shown
 * above the footer. Reinforces that the site is an official public-sector site.
 */
export function Identifier({ agency = "대한민국정부", department, style, ...rest }) {
  return (
    <div style={{ borderTop: "1px solid var(--color-border-gray-light)", borderBottom: "1px solid var(--color-border-gray-light)", background: "var(--color-surface-gray-subtler)", ...style }} {...rest}>
      <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 8, background: "var(--color-light-secondary-80)", color: "#fff", font: "800 13px/1.1 var(--krds-font-sans)", textAlign: "center" }}>
            정부<br />상징
        </span>
        <div>
          <p style={{ margin: 0, font: "800 19px/1.3 var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>{agency}</p>
          {department && <p style={{ margin: "2px 0 0", font: "400 14px/1.4 var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>{department}</p>}
        </div>
      </div>
    </div>
  );
}

export default Identifier;
