// BiDrawer — 홈(CM-03) 목표관리 BI Drawer (FN-CM03-5, CM03-10/11).
// 단위별(조직/실무자/업무) 지표 카드 + recharts 그래프 + 상황요약 텍스트(필수).
import Drawer from '@/components/Drawer'
import Badge from '@/components/Badge'
import { biForNode } from '@/mock/bi'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

const TONE = {
  ok: 'var(--narae-status-ok)', warn: 'var(--narae-status-warn)',
  risk: 'var(--narae-status-risk)', primary: 'var(--narae-accent)',
  neutral: 'var(--color-text-basic)',
}

// --narae-caption(12px)과 동일 — recharts tick은 SVG 속성이라 var() 미지원
const CHART_TICK = { fontSize: 12 }
const PIE_COLORS = ['var(--narae-accent)', 'var(--color-border-basic, #e5e7eb)']

export default function BiDrawer({ open, node, onClose }) {
  const bi = node ? biForNode(node) : null

  return (
    <Drawer open={open && !!bi} onClose={onClose} title={bi ? `${bi.unit} · 목표관리 BI` : 'BI'} width="var(--narae-drawer-md)">
      {bi && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-9)' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)' }}>
            {bi.title}
          </h3>

          {/* 지표 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--krds-space-5)' }}>
            {bi.metrics.map((m) => (
              <div key={m.label} style={metricCard}>
                <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>{m.label}</div>
                <div style={{ fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)', color: TONE[m.tone] ?? TONE.neutral }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* 그래프 */}
          {bi.statusChart && bi.statusChart.length > 0 && (
            <Section title="상태 분포">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={bi.statusChart}>
                  <XAxis dataKey="label" tick={CHART_TICK} />
                  <YAxis allowDecimals={false} tick={CHART_TICK} width={24} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--narae-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          )}

          {bi.workloadChart && bi.workloadChart.length > 0 && (
            <Section title="담당자 편중">
              <ResponsiveContainer width="100%" height={Math.max(120, bi.workloadChart.length * 28)}>
                <BarChart data={bi.workloadChart} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" allowDecimals={false} tick={CHART_TICK} />
                  <YAxis type="category" dataKey="name" tick={CHART_TICK} width={64} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--narae-status-info)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          )}

          {bi.progressChart && (
            <Section title="진행률">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={bi.progressChart} dataKey="value" nameKey="label" innerRadius={40} outerRadius={64}>
                    {bi.progressChart.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Section>
          )}

          {/* 관련 목표 (업무 단위) */}
          {bi.linkedGoals && bi.linkedGoals.length > 0 && (
            <Section title="관련 목표">
              {bi.linkedGoals.map((g) => (
                <div key={g.goalId} style={{ marginBottom: 'var(--krds-space-4)' }}>
                  <Badge variant="primary">목표</Badge>{' '}
                  <span style={{ fontWeight: 'var(--krds-weight-medium)' }}>{g.objective}</span>
                </div>
              ))}
            </Section>
          )}

          {/* 상황요약 (필수) */}
          <Section title="상황 요약">
            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-text-basic)' }}>{bi.summary}</p>
          </Section>
        </div>
      )}
    </Drawer>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-5)' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

const metricCard = {
  padding: 'var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)',
  background: 'var(--color-background-alternative, #f8f9fa)',
  display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-2)',
}
