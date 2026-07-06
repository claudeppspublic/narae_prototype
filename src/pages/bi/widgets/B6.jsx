// B6 결재 적체 추세 — 8주 라인. DEF-05: 상승 추세 구간(최근 3주)만 warn 밴드, 라인은 neutral.
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceArea, ResponsiveContainer } from 'recharts'
import { biWidget } from '@/mock/biMetrics'
import WidgetCard from './WidgetCard'

const CHART_TICK = { fontSize: 12 }

export default function B6() {
  const w = biWidget('B6')
  const riseFrom = w.series[w.series.length - 3].week // 최근 3주 상승 구간
  const last = w.series[w.series.length - 1].week
  return (
    <WidgetCard widget={w} tone="warn">
      <ResponsiveContainer width="100%" height={170}>
        <LineChart data={w.series} margin={{ top: 6, right: 8 }}>
          <XAxis dataKey="week" tick={CHART_TICK} />
          <YAxis allowDecimals={false} tick={CHART_TICK} width={24} />
          <Tooltip formatter={(v) => `${v}${w.unit}`} />
          <ReferenceArea x1={riseFrom} x2={last} fill="var(--color-warn-bg)" />
          <Line type="monotone" dataKey="value" stroke="var(--color-neutral-text)" strokeWidth={2}
            dot={{ r: 2.5, fill: 'var(--color-neutral-text)' }} />
        </LineChart>
      </ResponsiveContainer>
    </WidgetCard>
  )
}
