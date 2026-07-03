import React from "react";

const SIZES = {
  large: { h: 56, fs: 17, radius: 8 },
  medium: { h: 48, fs: 17, radius: 6 },
  small: { h: 40, fs: 17, radius: 6 },
};

export function TextInput({
  label,
  hint,
  error,
  required = false,
  size = "medium",
  disabled = false,
  leadingIcon,
  trailingIcon,
  id,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.medium;
  const [focused, setFocused] = React.useState(false);
  const fieldId = id || React.useId();
  const borderColor = disabled
    ? "var(--color-input-border-disabled)"
    : error
    ? "var(--color-input-border-error)"
    : focused
    ? "var(--color-input-border-active)"
    : "var(--color-input-border)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{ font: "700 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>
          {label}
          {required && <span style={{ color: "var(--color-text-danger)", marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: s.h,
          padding: "0 16px",
          borderRadius: s.radius,
          border: `1px solid ${borderColor}`,
          boxShadow: focused && !error ? "0 0 0 1px var(--color-input-border-active)" : "none",
          background: disabled ? "var(--color-input-surface-disabled)" : "var(--color-input-surface)",
          transition: "border-color .12s ease, box-shadow .12s ease",
        }}
      >
        {leadingIcon && <span style={{ color: "var(--color-icon-gray)", display: "inline-flex" }}>{leadingIcon}</span>}
        <input
          id={fieldId}
          disabled={disabled}
          aria-invalid={!!error}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            font: `400 ${s.fs}px/1.5 var(--krds-font-sans)`,
            color: "var(--color-text-basic)",
          }}
          {...rest}
        />
        {trailingIcon && <span style={{ color: "var(--color-icon-gray)", display: "inline-flex" }}>{trailingIcon}</span>}
      </div>
      {(hint || error) && (
        <p style={{ margin: 0, font: "400 13px/1.5 var(--krds-font-sans)", color: error ? "var(--color-text-danger)" : "var(--color-text-subtle)" }}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export default TextInput;
