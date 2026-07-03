// 공용 Button — 높이 규칙: 주 CTA=md(48px), 인라인·보조=sm(40px)
const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 'var(--krds-space-3)', borderRadius: 'var(--krds-radius-medium)',
  cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 'var(--krds-weight-bold)',
  transition: 'background .15s',
}

const sizes = {
  md: { height: 'var(--krds-control-medium)', padding: '0 var(--krds-space-8)', fontSize: 'var(--krds-body-medium)' },
  sm: { height: 'var(--krds-control-small)', padding: '0 var(--krds-space-7)', fontSize: 'var(--krds-body-small)' },
}

const variants = {
  primary: { background: 'var(--narae-accent)', color: '#fff', border: 'none' },
  ghost: { background: 'var(--color-background-white)', color: 'var(--color-text-basic)', border: '1px solid var(--color-border-basic)' },
}

export default function Button({ variant = 'primary', size = 'md', style, children, ...rest }) {
  const merged = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(rest.disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...style, // 호출측 style이 최종 우선 (width '100%' 등)
  }
  return (
    <button type="button" {...rest} style={merged}>
      {children}
    </button>
  )
}
