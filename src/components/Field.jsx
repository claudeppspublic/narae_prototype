// Field — 라벨 + 입력 + 에러/힌트. 폼 화면 공용(토큰 기반).
export default function Field({
  label, required, error, hint, type = 'text', value, onChange, placeholder,
  onKeyDown, autoComplete, name,
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-3)' }}>
      {label && (
        <span style={{ fontSize: 'var(--krds-body-medium)', fontWeight: 'var(--krds-weight-medium)' }}>
          {label}
          {required && <span style={{ color: 'var(--color-risk-text)', marginLeft: 2 }}>*</span>}
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        style={{
          height: 'var(--krds-control-medium)',
          padding: '0 var(--krds-space-7)',
          borderRadius: 'var(--krds-radius-medium)',
          border: `1px solid ${error ? 'var(--color-risk-base)' : 'var(--color-border-basic, #d1d5db)'}`,
          background: 'var(--color-background-white)',
          fontSize: 'var(--krds-body-medium)',
        }}
      />
      {error && (
        <span role="alert" style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-risk-text)' }}>
          {error}
        </span>
      )}
      {!error && hint && (
        <span style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive, #6b7280)' }}>
          {hint}
        </span>
      )}
    </label>
  )
}
