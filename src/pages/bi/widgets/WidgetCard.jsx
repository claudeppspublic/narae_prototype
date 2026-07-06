// SCR-RB-01 — 결재 BI 위젯 카드 셸 (INT-RB01-03 · REF-22 §2 카탈로그).
// 제목 + 콘텐츠 + "✦ AI 한 줄"(tone별 --color-*-text). 데이터 없으면 빈상태.
import Card from '@/components/Card'
import { EmptyState } from '@/components/StateViews'

const TONE_TEXT = {
  risk: 'var(--color-risk-text)',
  warn: 'var(--color-warn-text)',
  neutral: 'var(--color-neutral-text)',
}

export default function WidgetCard({ widget, tone = 'neutral', children, testid }) {
  if (!widget) return <Card><EmptyState icon="📊" title="위젯 데이터 없음" /></Card>
  return (
    <Card>
      <div data-testid={testid ?? `rb01-w-${widget.widgetId}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 'var(--krds-space-6)' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--krds-body-medium)', fontWeight: 'var(--krds-weight-bold)' }}>
            <span style={{ color: 'var(--color-text-assistive,#9ca3af)', fontSize: 'var(--narae-caption)', marginRight: 6 }}>{widget.widgetId}</span>
            {widget.title}
          </h3>
        </div>
        {children}
        <div style={{ marginTop: 'var(--krds-space-6)', fontSize: 'var(--krds-body-small)', color: TONE_TEXT[tone] ?? TONE_TEXT.neutral, fontWeight: 'var(--krds-weight-medium)' }}>
          <span aria-hidden>✦</span> {widget.aiLine}
        </div>
      </div>
    </Card>
  )
}
