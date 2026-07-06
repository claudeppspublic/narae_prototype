// B7 지연 원인 분포 — 도넛. DEF-05: 최다 원인만 warn 강조, 나머지 neutral 계열.
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { biWidget } from '@/mock/biMetrics'
import WidgetCard from './WidgetCard'

const NEUTRALS = ['var(--color-neutral-border)', 'var(--color-neutral-bg)', 'var(--color-border-basic, #e5e7eb)']

export default function B7() {
  const w = biWidget('B7')
  const maxVal = Math.max(...w.series.map((d) => d.value))
  let n = 0
  return (
    <WidgetCard widget={w} tone="warn">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-7)' }}>
        <ResponsiveContainer width="55%" height={160}>
          <PieChart>
            <Pie data={w.series} dataKey="value" nameKey="cause" innerRadius={42} outerRadius={66}>
              {w.series.map((d) => (
                <Cell key={d.cause} fill={d.value === maxVal ? 'var(--color-warn-base)' : NEUTRALS[n++ % NEUTRALS.length]}
                  stroke="var(--color-background-white)" />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-4)', fontSize: 'var(--krds-body-small)' }}>
          {w.series.map((d) => (
            <span key={d.cause} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: d.value === maxVal ? 'var(--color-warn-base)' : 'var(--color-neutral-border)' }} />
              <span style={{ color: 'var(--color-text-assistive,#6b7280)' }}>{d.cause}</span>
              <b style={{ color: d.value === maxVal ? 'var(--color-warn-text)' : 'var(--color-text-basic)' }}>{d.value}%</b>
            </span>
          ))}
        </div>
      </div>
    </WidgetCard>
  )
}
