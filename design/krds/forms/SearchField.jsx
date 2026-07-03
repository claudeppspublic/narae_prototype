import React from "react";

const SIZES = { large: { h: 56, radius: 8, fs: 19 }, medium: { h: 48, radius: 6, fs: 17 }, small: { h: 40, radius: 6, fs: 15 } };

export function SearchField({ size = "medium", placeholder = "검색어를 입력하세요", value, onChange, onSearch, buttonLabel, style, ...rest }) {
  const s = SIZES[size] || SIZES.medium;
  const [focused, setFocused] = React.useState(false);
  return (
    <form
      role="search"
      onSubmit={(e) => { e.preventDefault(); onSearch && onSearch(e); }}
      style={{ display: "flex", alignItems: "stretch", gap: 8, ...style }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          height: s.h,
          padding: "0 16px",
          borderRadius: s.radius,
          border: `1px solid ${focused ? "var(--color-input-border-active)" : "var(--color-input-border)"}`,
          boxShadow: focused ? "0 0 0 1px var(--color-input-border-active)" : "none",
          background: "var(--color-input-surface)",
          transition: "border-color .12s ease, box-shadow .12s ease",
        }}
      >
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", font: `400 ${s.fs}px/1.5 var(--krds-font-sans)`, color: "var(--color-text-basic)" }}
          {...rest}
        />
      </div>
      <button
        type="submit"
        aria-label="검색"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          height: s.h,
          padding: buttonLabel ? "0 20px" : 0,
          width: buttonLabel ? undefined : s.h,
          borderRadius: s.radius,
          border: "none",
          background: "var(--color-button-primary-fill)",
          color: "#fff",
          fontWeight: 700,
          fontSize: s.fs,
          cursor: "pointer",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {buttonLabel}
      </button>
    </form>
  );
}

export default SearchField;
