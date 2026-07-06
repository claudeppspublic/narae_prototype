// B5 SLA 준수율(부서별) — 수평 게이지 4개. 임계 90↑ok · 70~89warn · 70↓risk.
// [CONFIRM: 임계값 확정(REF-22 §7-2)] — 정책 부록 제안값 90/70 채택.
import { biWidget } from '@/mock/biMetrics'
import WidgetCard from './WidgetCard'

const gaugeTone = (v) => (v >= 90 ? 'ok' : v >= 70 ? 'warn' : 'risk')
const FILL = { ok: 'var(--color-ok-base)', warn: 'var(--color-warn-base)', risk: 'var(--color-risk-base)' }
const TEXT = { ok: 'var(--color-ok-text)', warn: 'var(--color-warn-text)', risk: 'var(--color-risk-text)' }

export default function B5() {
  const w = biWidget('B5')
  return (
    <WidgetCard widget={w} tone="risk">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-5)' }}>
        {w.series.map((d) => {
          const tone = gaugeTone(d.value)
          return (
            <div key={d.dept}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--krds-body-small)', marginBottom: 2 }}>
                <span style={{ color: 'var(--color-text-assistive,#6b7280)' }}>{d.dept}</span>
                <b data-testid={`rb01-b5-${tone}`} style={{ color: TEXT[tone] }}>{d.value}%</b>
              </div>
              <div style={{ position: 'relative', height: 10, borderRadius: 5, background: 'var(--color-neutral-bg)' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${d.value}%`, borderRadius: 5, background: FILL[tone] }} />
                {/* 목표(90%) 마커 */}
                <div title={`목표 ${w.target}%`} style={{ position: 'absolute', left: `${w.target}%`, top: -2, bottom: -2, width: 2, background: 'var(--color-text-basic)' }} />
              </div>
            </div>
          )
        })}
      </div>
    </WidgetCard>
  )
}
