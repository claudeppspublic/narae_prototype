import React from "react";

export function Accordion({ items = [], multiple = false, defaultOpen = [], style, ...rest }) {
  const [open, setOpen] = React.useState(new Set(defaultOpen));
  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };
  return (
    <div style={{ borderTop: "2px solid var(--color-light-gray-90)", ...style }} {...rest}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} style={{ borderBottom: "1px solid var(--color-border-gray-light)" }}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "18px 12px", border: "none", background: "none", cursor: "pointer", textAlign: "left",
                  font: `700 17px/1.5 var(--krds-font-sans)`, color: isOpen ? "var(--color-text-primary)" : "var(--color-text-bolder)" }}>
                {it.title}
                <span aria-hidden="true" style={{ flex: "none", transition: "transform .2s ease", transform: isOpen ? "rotate(180deg)" : "none", color: "var(--color-icon-gray)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </button>
            </h3>
            {isOpen && (
              <div style={{ padding: "0 12px 20px", font: "400 15px/1.6 var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>{it.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
