// B4 반려·재상신율 — 단계별 100% 누적 막대. DEF-05: 정상=neutral·반려=risk·재상신=warn.
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { biWidget } from '@/mock/biMetrics'
import WidgetCard from './WidgetCard'

const CHART_TICK = { fontSize: 12 } // --narae-caption 동일(SVG 속성이라 var() 미지원)

export default function B4() {
  const w = biWidget('B4')
  return (
    <WidgetCard widget={w} tone="risk">
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={w.series} layout="vertical" stackOffset="expand" margin={{ left: 4 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="stage" tick={CHART_TICK} width={36} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Bar dataKey="정상" stackId="a" fill="var(--color-neutral-border)" />
          <Bar dataKey="반려" stackId="a" fill="var(--color-risk-base)" />
          <Bar dataKey="재상신" stackId="a" fill="var(--color-warn-base)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 'var(--krds-space-7)', fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>
        <LegendDot color="var(--color-neutral-border)" label="정상" />
        <LegendDot color="var(--color-risk-base)" label="반려" />
        <LegendDot color="var(--color-warn-base)" label="재상신" />
      </div>
    </WidgetCard>
  )
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />{label}
    </span>
  )
}
