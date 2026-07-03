// FilterChip — 선택형 필터 칩(단일/토글). variant: 'tint'(연한 강조) | 'solid'(선택 시 강조색 채움).
// onRemove 지정 시 삭제(×) 버튼이 있는 태그 칩으로 렌더.
const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--krds-space-3)',
  height: 'var(--krds-control-xsmall)', padding: '0 var(--krds-space-7)',
  borderRadius: 'var(--krds-radius-pill)',
  fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-medium)',
}

const states = {
  tint: {
    on: { border: '1px solid var(--narae-accent)', background: 'color-mix(in srgb, var(--narae-accent) 10%, transparent)', color: 'var(--narae-accent)' },
    off: { border: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-white)', color: 'var(--color-text-basic)' },
  },
  solid: {
    on: { border: '1px solid var(--narae-accent)', background: 'var(--narae-accent)', color: '#fff', fontWeight: 'var(--krds-weight-bold)' },
    off: { border: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-white)', color: 'var(--color-text-basic)' },
  },
}

export default function FilterChip({ label, active, onClick, variant = 'tint', onRemove }) {
  if (onRemove) {
    return (
      <span style={{ ...base, ...states.tint.on, border: 'none' }}>
        {label}
        <button
          onClick={onRemove} aria-label={`${label} 삭제`}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--narae-accent)', fontSize: '1rem', padding: 0 }}
        >
          ×
        </button>
      </span>
    )
  }
  return (
    <button onClick={onClick} aria-pressed={active} style={{ ...base, cursor: 'pointer', ...states[variant][active ? 'on' : 'off'] }}>
      {label}
    </button>
  )
}
