import React from "react";

export function DateInput({ label, hint, error, required = false, size = "medium", disabled = false, value, onChange, id, style, ...rest }) {
  const h = { large: 56, medium: 48, small: 40 }[size] || 48;
  const radius = size === "large" ? 8 : 6;
  const [focused, setFocused] = React.useState(false);
  const fieldId = id || React.useId();
  const borderColor = disabled ? "var(--color-input-border-disabled)" : error ? "var(--color-input-border-error)" : focused ? "var(--color-input-border-active)" : "var(--color-input-border)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{ font: "700 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>
          {label}{required && <span style={{ color: "var(--color-text-danger)", marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center", height: h, padding: "0 16px", borderRadius: radius, border: `1px solid ${borderColor}`, boxShadow: focused && !error ? "0 0 0 1px var(--color-input-border-active)" : "none", background: disabled ? "var(--color-input-surface-disabled)" : "var(--color-input-surface)" }}>
        <input
          id={fieldId}
          type="date"
          value={value}
          disabled={disabled}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", font: "400 17px/1.5 var(--krds-font-sans)", color: "var(--color-text-basic)" }}
          {...rest}
        />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "var(--color-icon-gray)", flex: "none" }} aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 9h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      {(hint || error) && (
        <p style={{ margin: 0, font: "400 13px/1.5 var(--krds-font-sans)", color: error ? "var(--color-text-danger)" : "var(--color-text-subtle)" }}>{error || hint}</p>
      )}
    </div>
  );
}

export default DateInput;
