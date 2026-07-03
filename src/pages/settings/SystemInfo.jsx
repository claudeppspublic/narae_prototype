// SCR-ST-04 — 시스템 정보 (버전·라이선스)
import SideNav, { SETTINGS_ITEMS } from '@/components/SideNav'
import Card from '@/components/Card'

const INFO = [
  ['제품명', '나래 AI (Narae AI)'],
  ['버전', 'v0.8 (프로토타입)'],
  ['빌드일', '2026-07-02'],
  ['런타임', 'React 19 · Vite 5'],
  ['디자인시스템', 'KRDS (정부 표준)'],
  ['라이선스', '내부용 · 프로토타입'],
  ['문의', 'narae-support@example.go.kr'],
]

export default function SystemInfo() {
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={SETTINGS_ITEMS} title="내 정보" />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)', maxWidth: 640 }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-8)' }}>시스템 정보</h1>
        <Card>
          <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)' }}>
            {INFO.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-basic,#eef0f2)', paddingBottom: 'var(--krds-space-5)' }}>
                <dt style={{ color: 'var(--color-text-assistive,#6b7280)' }}>{k}</dt>
                <dd style={{ margin: 0, fontWeight: 'var(--krds-weight-medium)' }}>{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>
    </div>
  )
}
