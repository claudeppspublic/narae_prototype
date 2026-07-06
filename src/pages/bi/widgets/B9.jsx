// B9 예측(AI) — 배너 + 지연 위험 카드 3. DEF-05: 위험=risk 틴트.
// 카드 클릭 drill 목적지는 [CONFIRM: 위젯별 drill 목적지] — 비클릭 리스트.
import { biWidget } from '@/mock/biMetrics'
import WidgetCard from './WidgetCard'

export default function B9() {
  const w = biWidget('B9')
  return (
    <WidgetCard widget={w} tone="risk">
      <div style={{
        padding: 'var(--krds-space-5) var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)',
        background: 'var(--color-risk-bg)', border: '1px solid var(--color-risk-border)',
        color: 'var(--color-risk-text)', fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)',
        marginBottom: 'var(--krds-space-5)',
      }}>
        <span aria-hidden>⚠</span> 이번 주 지연 위험 결재 {w.series.length}건 예측 (AI mock)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-3)' }}>
        {w.series.map((d) => (
          <div key={d.taskId} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--krds-space-5)',
            padding: 'var(--krds-space-4) var(--krds-space-5)', borderRadius: 'var(--krds-radius-small)',
            border: '1px solid var(--color-risk-border)', background: 'var(--color-background-white)',
            fontSize: 'var(--krds-body-small)',
          }}>
            <span style={{ fontWeight: 'var(--krds-weight-medium)' }}>{d.taskNm}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--color-text-assistive,#6b7280)', fontSize: 'var(--narae-caption)' }}>{d.reason}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}
