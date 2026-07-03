import React from "react";

export function Card({
  orientation = "vertical",
  image,
  imageAlt = "",
  badge,
  title,
  description,
  meta,
  footer,
  href,
  interactive = true,
  children,
  style,
  ...rest
}) {
  const horizontal = orientation === "horizontal";
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      href={href}
      style={{
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        overflow: "hidden",
        background: "var(--color-surface-white)",
        border: "1px solid var(--color-border-gray-light)",
        borderRadius: 12,
        textDecoration: "none",
        color: "inherit",
        transition: "box-shadow .15s ease, border-color .15s ease",
        ...style,
      }}
      onMouseEnter={interactive ? (e) => { e.currentTarget.style.boxShadow = "var(--krds-shadow-2)"; e.currentTarget.style.borderColor = "var(--color-border-gray)"; } : undefined}
      onMouseLeave={interactive ? (e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--color-border-gray-light)"; } : undefined}
      {...rest}
    >
      {image && (
        <div
          style={{
            flex: horizontal ? "0 0 200px" : "none",
            aspectRatio: horizontal ? "auto" : "16 / 9",
            background: `var(--color-surface-gray-subtle) center/cover no-repeat`,
            backgroundImage: `url("${image}")`,
            minHeight: horizontal ? 140 : undefined,
          }}
          role="img"
          aria-label={imageAlt}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 20, flex: 1 }}>
        {badge && <div>{badge}</div>}
        {title && (
          <h3 style={{ margin: 0, font: "700 19px/1.4 var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>
            {title}
          </h3>
        )}
        {description && (
          <p style={{ margin: 0, font: "400 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>
            {description}
          </p>
        )}
        {children}
        {meta && <div style={{ font: "400 13px/1.5 var(--krds-font-sans)", color: "var(--color-text-disabled)" }}>{meta}</div>}
        {footer && <div style={{ marginTop: 4 }}>{footer}</div>}
      </div>
    </Wrapper>
  );
}

export default Card;
