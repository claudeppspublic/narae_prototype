import React from "react";

export function Checkbox({ label, size = "medium", checked, defaultChecked, disabled = false, id, onChange, style, ...rest }) {
  const box = size === "small" ? 18 : 24;
  const fieldId = id || React.useId();
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const isChecked = checked != null ? checked : internal;
  return (
    <label htmlFor={fieldId} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style }}>
      <span style={{ position: "relative", width: box, height: box, flex: "none" }}>
        <input
          id={fieldId}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={(e) => { setInternal(e.target.checked); onChange && onChange(e); }}
          style={{ position: "absolute", opacity: 0, width: box, height: box, margin: 0, cursor: "inherit" }}
          {...rest}
        />
        <span
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: box,
            height: box,
            borderRadius: 4,
            border: isChecked ? "1px solid var(--color-element-primary)" : "1px solid var(--color-input-border)",
            background: isChecked ? "var(--color-element-primary)" : "var(--color-input-surface)",
            transition: "background-color .12s ease, border-color .12s ease",
          }}
        >
          {isChecked && (
            <svg width={box * 0.66} height={box * 0.66} viewBox="0 0 16 16" fill="none">
              <path d="M3.5 8.5l3 3 6-6.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </span>
      {label && <span style={{ font: `400 ${size === "small" ? 15 : 17}px/1.5 var(--krds-font-sans)`, color: "var(--color-text-basic)" }}>{label}</span>}
    </label>
  );
}

export default Checkbox;
