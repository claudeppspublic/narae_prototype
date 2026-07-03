// Tabs — 밑줄형 탭. items=[{key,label,count?}], value/onChange.
export default function Tabs({ items, value, onChange }) {
  return (
    <div
      role="tablist"
      style={{ display: 'flex', gap: 'var(--krds-space-8)', borderBottom: '1px solid var(--color-border-basic, #e5e7eb)' }}
    >
      {items.map((it) => {
        const active = it.key === value
        return (
          <button
            key={it.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.key)}
            style={{
              padding: 'var(--krds-space-6) var(--krds-space-2)',
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 'var(--krds-body-medium)',
              fontWeight: active ? 'var(--krds-weight-bold)' : 'var(--krds-weight-regular)',
              color: active ? 'var(--narae-accent)' : 'var(--color-text-basic)',
              borderBottom: active ? '2px solid var(--narae-accent)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {it.label}
            {it.count != null && (
              <span style={{ marginLeft: 'var(--krds-space-3)', color: 'var(--color-text-assistive, #6b7280)' }}>
                {it.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// SegToggle — 세그먼트 토글(일/주/월, 리스트/조직도 등)
export function SegToggle({ items, value, onChange, size = 'md' }) {
  const h = size === 'sm' ? 'var(--krds-control-xsmall)' : 'var(--krds-control-small)'
  return (
    <div
      style={{
        display: 'inline-flex', padding: '2px', gap: '2px',
        background: 'var(--color-background-alternative, #f1f3f5)',
        borderRadius: 'var(--krds-radius-medium)',
      }}
    >
      {items.map((it) => {
        const key = typeof it === 'string' ? it : it.key
        const label = typeof it === 'string' ? it : it.label
        const active = key === value
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              height: h, padding: '0 var(--krds-space-7)', border: 'none', cursor: 'pointer',
              borderRadius: 'var(--krds-radius-small)',
              background: active ? 'var(--color-background-white)' : 'transparent',
              color: active ? 'var(--narae-accent)' : 'var(--color-text-basic)',
              // 활성/비활성 폰트 두께 동일 → 선택 시 버튼 폭 변동 방지 (피드백)
              fontWeight: 'var(--krds-weight-medium)',
              boxShadow: active ? 'var(--krds-shadow-1)' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
