// 공용 Stepper — 멀티스텝 진행 표시(24px 도트 + 라벨 + › 구분자). AD-01·WF-04 공용.
export default function Stepper({ steps, current, style }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--krds-space-6)', ...style }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-4)', opacity: i <= current ? 1 : 0.4 }}>
          <span style={{ ...dot, background: i <= current ? 'var(--narae-accent)' : 'var(--color-border-basic,#cbd5e1)' }}>{i + 1}</span>
          <span style={{ fontWeight: i === current ? 'var(--krds-weight-bold)' : 'var(--krds-weight-regular)' }}>{s}</span>
          {i < steps.length - 1 && <span style={{ color: 'var(--color-text-assistive,#cbd5e1)' }}>›</span>}
        </div>
      ))}
    </div>
  )
}

const dot = {
  width: 24, height: 24, borderRadius: '50%', color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 'var(--narae-caption)', fontWeight: 'var(--krds-weight-bold)',
}
