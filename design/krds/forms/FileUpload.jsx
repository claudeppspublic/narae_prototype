import React from "react";

export function FileUpload({ label, hint = "최대 10MB · PDF, JPG, PNG", multiple = false, disabled = false, buttonLabel = "파일 선택", id, style, onChange, ...rest }) {
  const fieldId = id || React.useId();
  const [files, setFiles] = React.useState([]);
  const ref = React.useRef(null);
  const onPick = (e) => {
    setFiles(Array.from(e.target.files || []).map((f) => f.name));
    onChange && onChange(e);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {label && <span style={{ font: "700 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>{label}</span>}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 16,
          borderRadius: 8,
          border: "1px dashed var(--color-border-gray)",
          background: "var(--color-surface-gray-subtler)",
        }}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => ref.current && ref.current.click()}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 16px", borderRadius: 6, border: "1px solid var(--color-button-tertiary-border)", background: "var(--color-surface-white)", color: "var(--color-text-basic)", fontWeight: 700, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V4m0 0l-4 4m4-4l4 4M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {buttonLabel}
        </button>
        <span style={{ font: "400 13px/1.5 var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>{hint}</span>
        <input ref={ref} id={fieldId} type="file" multiple={multiple} disabled={disabled} onChange={onPick} style={{ display: "none" }} {...rest} />
      </div>
      {files.length > 0 && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {files.map((f, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, background: "var(--color-surface-primary-subtler)", font: "400 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-basic)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--color-icon-primary)" }}><path d="M14 3v5h5M14 3l5 5v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1h8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileUpload;
