import React from "react";

/**
 * KRDS Tabs — horizontal tab bar. `items` as [{key,label}].
 * style: line (underline) \u00b7 fill (pill). Controlled via `value`/`onChange` or uncontrolled.
 */
export function Tabs({ items = [], value, defaultValue, onChange, variant = "line", style, ...rest }) {
  const [internal, setInternal] = React.useState(defaultValue ?? (items[0] && items[0].key));
  const active = value != null ? value : internal;
  const select = (k) => { setInternal(k); onChange && onChange(k); };
  if (variant === "fill") {
    return (
      <div role="tablist" style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 999, background: "var(--color-surface-gray-subtle)", ...style }} {...rest}>
        {items.map((it) => {
          const on = it.key === active;
          return (
            <button key={it.key} role="tab" aria-selected={on} onClick={() => select(it.key)}
              style={{ height: 40, padding: "0 18px", border: "none", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
                background: on ? "var(--color-surface-white)" : "transparent", color: on ? "var(--color-text-primary)" : "var(--color-text-subtle)",
                font: `${on ? 700 : 500} 15px/1.5 var(--krds-font-sans)`, boxShadow: on ? "var(--krds-shadow-1)" : "none" }}>
              {it.label}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div role="tablist" style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--color-border-gray-light)", ...style }} {...rest}>
      {items.map((it) => {
        const on = it.key === active;
        return (
          <button key={it.key} role="tab" aria-selected={on} onClick={() => select(it.key)}
            style={{ position: "relative", height: 48, padding: "0 16px", border: "none", background: "none", cursor: "pointer", whiteSpace: "nowrap",
              color: on ? "var(--color-text-primary)" : "var(--color-text-subtle)", font: `${on ? 700 : 500} 17px/1.5 var(--krds-font-sans)`,
              boxShadow: on ? "inset 0 -3px 0 var(--color-element-primary)" : "none" }}>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
