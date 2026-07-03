import React from "react";

export function Radio({ label, size = "medium", checked, defaultChecked, disabled = false, name, value, id, onChange, style, ...rest }) {
  const box = size === "small" ? 18 : 24;
  const fieldId = id || React.useId();
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const isChecked = checked != null ? checked : internal;
  return (
    <label htmlFor={fieldId} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style }}>
      <span style={{ position: "relative", width: box, height: box, flex: "none" }}>
        <input
          id={fieldId}
          type="radio"
          name={name}
          value={value}
          checked={checked != null ? checked : undefined}
          defaultChecked={checked == null ? defaultChecked : undefined}
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
            borderRadius: "50%",
            border: isChecked ? `${box * 0.28}px solid var(--color-element-primary)` : "1px solid var(--color-input-border)",
            background: "var(--color-input-surface)",
            transition: "border-color .12s ease, border-width .1s ease",
            boxSizing: "border-box",
          }}
        />
      </span>
      {label && <span style={{ font: `400 ${size === "small" ? 15 : 17}px/1.5 var(--krds-font-sans)`, color: "var(--color-text-basic)" }}>{label}</span>}
    </label>
  );
}

export default Radio;
