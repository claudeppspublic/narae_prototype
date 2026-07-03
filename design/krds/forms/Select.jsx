import React from "react";

const SIZES = { large: { h: 56, radius: 8 }, medium: { h: 48, radius: 6 }, small: { h: 40, radius: 6 } };

export function Select({ label, hint, error, required = false, size = "medium", disabled = false, options = [], placeholder, id, value, onChange, style, ...rest }) {
  const s = SIZES[size] || SIZES.medium;
  const fieldId = id || React.useId();
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const borderColor = disabled ? "var(--color-input-border-disabled)" : error ? "var(--color-input-border-error)" : "var(--color-input-border)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{ font: "700 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>
          {label}
          {required && <span style={{ color: "var(--color-text-danger)", marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative", display: "flex" }}>
        <select
          id={fieldId}
          disabled={disabled}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            width: "100%",
            height: s.h,
            padding: "0 44px 0 16px",
            borderRadius: s.radius,
            border: `1px solid ${borderColor}`,
            background: disabled ? "var(--color-input-surface-disabled)" : "var(--color-input-surface)",
            font: "400 17px/1.5 var(--krds-font-sans)",
            color: value || !placeholder ? "var(--color-text-basic)" : "var(--color-text-disabled)",
            cursor: disabled ? "not-allowed" : "pointer",
            outline: "none",
          }}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {opts.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span aria-hidden="true" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-icon-gray)", fontSize: 12 }}>▼</span>
      </div>
      {(hint || error) && (
        <p style={{ margin: 0, font: "400 13px/1.5 var(--krds-font-sans)", color: error ? "var(--color-text-danger)" : "var(--color-text-subtle)" }}>{error || hint}</p>
      )}
    </div>
  );
}

export default Select;
