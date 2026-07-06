// B1 결재 리드타임 — 수평 게이지(0~P90·목표 마커). DEF-05: 목표 이내=neutral, 초과분만 risk.
import { biWidget } from '@/mock/biMetrics'
import WidgetCard from './WidgetCard'

export default function B1() {
  const w = biWidget('B1')
  const { avg, median, p90 } = w.value
  const max = p90 * 1.1
  const targetPct = (w.target / max) * 100
  const avgPct = (avg / max) * 100
  return (
    <WidgetCard widget={w} tone="risk">
      <div style={{ position: 'relative', height: 18, borderRadius: 9, background: 'var(--color-neutral-bg)', overflow: 'hidden' }}>
        {/* 목표 이내 구간(neutral) */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(avgPct, targetPct)}%`, background: 'var(--color-neutral-border)' }} />
        {/* 목표 초과분만 risk (DEF-05) */}
        {avg > w.target && (
          <div style={{ position: 'absolute', left: `${targetPct}%`, top: 0, bottom: 0, width: `${avgPct - targetPct}%`, background: 'var(--color-risk-base)' }} />
        )}
        {/* 목표 마커 */}
        <div title={`목표 ${w.target}${w.unit}`} style={{ position: 'absolute', left: `${targetPct}%`, top: -2, bottom: -2, width: 2, background: 'var(--color-text-basic)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--krds-space-5)', fontSize: 'var(--krds-body-small)' }}>
        <Stat label="평균" value={`${avg}${w.unit}`} strong risk={avg > w.target} />
        <Stat label="중앙" value={`${median}${w.unit}`} />
        <Stat label="P90" value={`${p90}${w.unit}`} />
        <Stat label="목표" value={`${w.target}${w.unit}`} />
      </div>
    </WidgetCard>
  )
}

function Stat({ label, value, strong, risk }) {
  return (
    <span style={{ color: 'var(--color-text-assistive,#6b7280)' }}>
      {label}{' '}
      <b style={{ color: risk ? 'var(--color-risk-text)' : 'var(--color-text-basic)', fontWeight: strong ? 'var(--krds-weight-bold)' : 'var(--krds-weight-medium)' }}>
        {value}
      </b>
    </span>
  )
}
