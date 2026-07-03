// 공용 Toggle — ON/OFF 스위치(role="switch"). label 지정 시 우측 라벨 포함. ST-02·ST-03 공용.
export default function Toggle({ checked, onChange, label }) {
  const btn = (
    <button
      type="button" role="switch" aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 'var(--krds-radius-pill)', border: 'none', cursor: 'pointer',
        background: checked ? 'var(--narae-accent)' : 'var(--color-border-basic,#cbd5e1)',
        position: 'relative', transition: 'background 0.15s',
      }}
    >
      <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
    </button>
  )
  if (!label) return btn
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-3)', fontSize: 'var(--krds-body-small)', cursor: 'pointer' }}>
      {btn}
      {label}
    </label>
  )
}
