// SCR-RB-01 — 부서 대시보드 (BI)
// RB01-01 역할 토글→KPI·범위 갱신 · RB01-02 리스크 카드→과제 이동
// FN-RB01-1(KPI) · FN-RB01-2(편중·병목) · 권한 팀장+ · 상태 5종
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/mock'
import { projects } from '@/mock/projects'
import { riskItems } from '@/mock/riskItems'
import { useAsync } from '@/lib/useAsync'
import { useRoleStore } from '@/store/useRoleStore'
import { ROLE } from '@/lib/codes'
import Card from '@/components/Card'
import Badge from '@/components/Badge'
import SideNav, { BI_ITEMS } from '@/components/SideNav'
import { AsyncView } from '@/components/StateViews'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// --narae-caption(12px)과 동일 — recharts tick은 SVG 속성이라 var() 미지원
const CHART_TICK = { fontSize: 12 }

export default function DeptDashboard() {
  const navigate = useNavigate()
  const role = useRoleStore((s) => s.role)
  const { data: tasks, loading, error, reload } = useAsync(() => api.getTasks({ delay: 400 }), [])

  const kpi = useMemo(() => {
    if (!tasks) return null
    const total = tasks.length
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length
    const delayed = tasks.filter((t) => t.status === 'DELAYED' || t.riskGrade === 'RISK').length
    const critical = tasks.filter((t) => t.riskGrade === 'RISK').length
    const compliance = total ? Math.round(((total - delayed) / total) * 100) : 100
    return { total, inProgress, delayed, critical, compliance }
  }, [tasks])

  const workload = useMemo(() => {
    if (!tasks) return []
    const by = {}
    tasks.forEach((t) => { by[t.assigneeNm] = (by[t.assigneeNm] ?? 0) + 1 })
    return Object.entries(by).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8)
  }, [tasks])

  const bottleneck = useMemo(() => {
    if (!tasks) return []
    return projects.map((p) => ({
      name: p.projectNm.length > 12 ? p.projectNm.slice(0, 12) + '…' : p.projectNm,
      count: tasks.filter((t) => t.projectId === p.projectId && (t.riskGrade !== 'OK' || t.status === 'ON_HOLD')).length,
    })).filter((d) => d.count > 0)
  }, [tasks])

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={BI_ITEMS} title="BI · 리스크" />
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--krds-space-9)', flexWrap: 'wrap', gap: 'var(--krds-space-6)' }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: 0 }}>부서 대시보드</h1>
        <span style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>
          조회 범위: <b style={{ color: 'var(--narae-accent)' }}>{ROLE[role]}</b> (상단 역할 토글로 전환)
        </span>
      </div>

      <AsyncView loading={loading} error={error} data={tasks} reload={reload}>
        {kpi && (
          <>
            {/* KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--krds-space-6)', marginBottom: 'var(--krds-space-10)' }}>
              <Kpi label="진행중" value={kpi.inProgress} tone="primary" />
              <Kpi label="지연·위험" value={kpi.delayed} tone="risk" />
              <Kpi label="일정 준수율" value={`${kpi.compliance}%`} tone={kpi.compliance >= 80 ? 'ok' : 'warn'} />
              <Kpi label="즉시 개입" value={kpi.critical} tone="risk" />
            </div>

            {/* 편중 · 병목 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--krds-space-8)', marginBottom: 'var(--krds-space-10)' }}>
              <Card>
                <h3 style={chartTitle}>담당자 편중</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={workload} layout="vertical" margin={{ left: 12 }}>
                    <XAxis type="number" allowDecimals={false} tick={CHART_TICK} />
                    <YAxis type="category" dataKey="name" tick={CHART_TICK} width={64} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--narae-accent)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <h3 style={chartTitle}>과제별 병목(위험·보류)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={bottleneck}>
                    <XAxis dataKey="name" tick={CHART_TICK} interval={0} angle={-15} textAnchor="end" height={50} />
                    <YAxis allowDecimals={false} tick={CHART_TICK} width={24} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--narae-status-warn)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* 지연 리스크 카드 */}
            <h3 style={{ ...chartTitle, marginBottom: 'var(--krds-space-6)' }}>지연 리스크</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--krds-space-6)' }}>
              {riskItems.map((r) => (
                <Card key={r.riskId} hoverable onClick={() => navigate(`/work/table?drawer=${r.refId}`)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--krds-space-4)' }}>
                    <Badge variant={r.severity === 'RISK' ? 'risk' : r.severity === 'WARN' ? 'warn' : 'ok'}>
                      {{ RISK: '위험', WARN: '경고', OK: '정상' }[r.severity]}
                    </Badge>
                    <span style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>{r.type}</span>
                  </div>
                  <div style={{ fontWeight: 'var(--krds-weight-medium)' }}>{r.title}</div>
                </Card>
              ))}
            </div>
          </>
        )}
      </AsyncView>
      </div>
    </div>
  )
}

function Kpi({ label, value, tone }) {
  const color = { primary: 'var(--narae-accent)', ok: 'var(--narae-status-ok)', warn: 'var(--narae-status-warn)', risk: 'var(--narae-status-risk)' }[tone]
  return (
    <Card>
      <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>{label}</div>
      <div style={{ fontSize: 'var(--krds-display-small, 28px)', fontWeight: 'var(--krds-weight-bold)', color, marginTop: 'var(--krds-space-3)' }}>{value}</div>
    </Card>
  )
}

const chartTitle = { fontSize: 'var(--krds-body-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-6)' }
