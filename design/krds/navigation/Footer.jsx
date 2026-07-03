import React from "react";

/**
 * KRDS Footer — government site footer: link rows, agency info, copyright.
 * `links` as [{label,href}]; `agency` describes the issuing organization.
 */
export function Footer({
  links = [],
  agency = { name: "정부기관", address: "(00000) 세종특별자치시 도움5로 19", tel: "대표전화 110" },
  copyright = "© Government of the Republic of Korea. All rights reserved.",
  style,
  ...rest
}) {
  return (
    <footer style={{ background: "var(--color-light-secondary-80)", color: "var(--color-text-basic-inverse)", ...style }} {...rest}>
      <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "0 24px" }}>
        {links.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 28px", padding: "24px 0", borderBottom: "1px solid rgba(255,255,255,0.16)" }}>
            {links.map((l, i) => (
              <a key={i} href={l.href || "#"} style={{ font: `${l.strong ? 700 : 400} 15px/1.5 var(--krds-font-sans)`, color: "rgba(255,255,255,0.92)", textDecoration: "none" }}>{l.label}</a>
            ))}
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", padding: "28px 0 36px" }}>
          <div>
            <p style={{ margin: "0 0 8px", font: "800 19px/1.4 var(--krds-font-sans)" }}>{agency.name}</p>
            <p style={{ margin: 0, font: "400 14px/1.7 var(--krds-font-sans)", color: "rgba(255,255,255,0.72)" }}>
              {agency.address}<br />
              {agency.tel}
            </p>
            <p style={{ margin: "16px 0 0", font: "400 13px/1.5 var(--krds-font-sans)", color: "rgba(255,255,255,0.56)" }}>{copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
