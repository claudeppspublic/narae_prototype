// B8 담당자 부하 vs 지연 — 산점도. DEF-05: 우상단 위험군(risk:true)=risk 점, 나머지 primary.
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { biWidget } from '@/mock/biMetrics'
import WidgetCard from './WidgetCard'

const CHART_TICK = { fontSize: 12 }

export default function B8() {
  const w = biWidget('B8')
  return (
    <WidgetCard widget={w} tone="risk">
      <ResponsiveContainer width="100%" height={180}>
        <ScatterChart margin={{ top: 8, right: 12 }}>
          <XAxis type="number" dataKey="load" name="부하(건)" tick={CHART_TICK} label={{ value: '부하(건)', position: 'insideBottomRight', offset: -4, fontSize: 12 }} />
          <YAxis type="number" dataKey="delay" name="평균 지연(일)" tick={CHART_TICK} width={28} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }}
            formatter={(v, name) => [v, name]}
            labelFormatter={() => ''}
            content={({ payload }) => payload?.length ? (
              <div style={{ background: 'var(--color-background-white)', border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}>
                <b>{payload[0].payload.name}</b> · 부하 {payload[0].payload.load}건 · 지연 {payload[0].payload.delay}일
              </div>
            ) : null} />
          <Scatter data={w.series}>
            {w.series.map((d) => (
              <Cell key={d.name} fill={d.risk ? 'var(--color-risk-base)' : 'var(--narae-accent)'} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </WidgetCard>
  )
}
