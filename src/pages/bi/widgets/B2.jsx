// B2 단계별 병목 히트맵 — 기안·검토·승인 × 부서 셀. DEF-05: 정체율↑=risk 틴트(수치 병기).
import { biWidget } from '@/mock/biMetrics'
import WidgetCard from './WidgetCard'

const STAGES = ['기안', '검토', '승인']
// 정체율(%)에 비례한 risk 틴트 — 최대 62% 기준 0~55% 혼합
const cellBg = (v) => `color-mix(in srgb, var(--color-risk-base) ${Math.round((v / 70) * 55)}%, var(--color-background-white))`

export default function B2() {
  const w = biWidget('B2')
  return (
    <WidgetCard widget={w} tone="risk">
      <div style={{ display: 'grid', gridTemplateColumns: '96px repeat(3, 1fr)', gap: 3, fontSize: 'var(--krds-body-small)' }}>
        <span />
        {STAGES.map((s) => (
          <span key={s} style={{ textAlign: 'center', color: 'var(--color-text-assistive,#6b7280)', fontSize: 'var(--narae-caption)' }}>{s}</span>
        ))}
        {w.series.map((row) => (
          [
            <span key={row.dept} style={{ alignSelf: 'center', fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.dept}>
              {row.dept}
            </span>,
            ...STAGES.map((s) => (
              <span key={`${row.dept}-${s}`} title={`${row.dept} · ${s} 정체율 ${row[s]}%`}
                style={{
                  textAlign: 'center', padding: 'var(--krds-space-4) 0', borderRadius: 'var(--krds-radius-small)',
                  background: cellBg(row[s]),
                  color: row[s] >= 45 ? 'var(--color-risk-text)' : 'var(--color-text-basic)',
                  fontWeight: row[s] >= 45 ? 'var(--krds-weight-bold)' : 'var(--krds-weight-regular)',
                }}>
                {row[s]}%
              </span>
            )),
          ]
        ))}
      </div>
    </WidgetCard>
  )
}
