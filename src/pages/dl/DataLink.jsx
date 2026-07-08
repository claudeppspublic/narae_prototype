// SCR-DL-01 — DATA연계 (v1.1 REF-24 D10 신규 GNB 메뉴)
// [CONFIRM: DATA연계 화면 상세 기획] 상세 기획 전 placeholder — 기획 확정 시 재구현.
export default function DataLink() {
  return (
    <div style={wrap}>
      <div style={card}>
        <div aria-hidden style={{ fontSize: '2.2rem' }}>🔗</div>
        <h1 style={title}>DATA연계</h1>
        <p style={desc}>
          외부 시스템 데이터 연계 화면입니다. 상세 기획 확정 전 자리 표시 화면으로,
          기획 확정 후 구성이 제공될 예정입니다.
        </p>
        <span style={chip}>기획 확인 대기 — SCR-DL-01</span>
      </div>
    </div>
  )
}

const wrap = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - var(--krds-control-xlarge))', padding: 'var(--krds-space-10)' }
const card = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--krds-space-6)', textAlign: 'center', maxWidth: '28rem' }
const title = { fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-basic)', margin: 0 }
const desc = { fontSize: 'var(--krds-body-medium)', color: 'var(--color-text-assistive, #6b7280)', margin: 0, lineHeight: 1.6 }
const chip = {
  padding: 'var(--krds-space-3) var(--krds-space-7)', borderRadius: 'var(--krds-radius-pill)',
  background: 'var(--color-neutral-bg)', color: 'var(--color-neutral-text)', fontSize: 'var(--krds-body-small)',
}
