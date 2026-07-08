// SCR-RB-01 — 부서 대시보드 (BI)
// RB01-01 역할 토글→KPI·범위 갱신 · RB01-02 리스크 카드→과제 이동
// INT-RB01-03 결재 BI(✦ AI 요약+B1~B9) · biContext(taskId·orgUnitId·period) 수신(INT-WF02-14)
// FN-RB01-1(KPI) · FN-RB01-2(편중·병목) · 권한 팀장+ · 상태 5종
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/mock'
import { projects } from '@/mock/projects'
import { riskItems } from '@/mock/riskItems'
import { findTask } from '@/mock/tasks'
import { findOrg } from '@/mock/orgUnits'
import { useAsync } from '@/lib/useAsync'
import { useRoleStore } from '@/store/useRoleStore'
import { ROLE } from '@/lib/codes'
import Card from '@/components/Card'
import Badge from '@/components/Badge'
import SideNav, { BI_ITEMS } from '@/components/SideNav'
import AiSummaryBanner from '@/components/AiSummaryBanner'
import WorkDetailDrawer from '@/components/WorkDetailDrawer'
import { SegToggle } from '@/components/Tabs'
import { AsyncView } from '@/components/StateViews'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import B1 from './widgets/B1'
import B2 from './widgets/B2'
import B3 from './widgets/B3'
import B4 from './widgets/B4'
import B5 from './widgets/B5'
import B6 from './widgets/B6'
import B7 from './widgets/B7'
import B8 from './widgets/B8'
import B9 from './widgets/B9'

// 기간 스코프 라벨 — 진입 컨텍스트(period) 표시·전환. REF-23 §4.4가 위젯별 단일 시드를
// 정의하므로 기간별 시드 전환은 미구현. [CONFIRM: 기간별 시드(REF-22 §7-4)]
const PERIODS = [{ key: 'weekly', label: '주' }, { key: 'monthly', label: '월' }, { key: 'quarterly', label: '분기' }]

// --narae-caption(12px)과 동일 — recharts tick은 SVG 속성이라 var() 미지원
const CHART_TICK = { fontSize: 12 }

export default function DeptDashboard() {
  const navigate = useNavigate()
  const role = useRoleStore((s) => s.role)
  const { data: tasks, loading, error, reload } = useAsync(() => api.getTasks({ delay: 400 }), [])

  // INT-RB01-03: biContext 해석 — 없으면 부서 전체 기본(스펙 예외 규칙)
  const [params] = useSearchParams()
  const ctxTask = params.get('taskId') ? findTask(params.get('taskId')) : null
  const ctxOrg = params.get('orgUnitId') ? findOrg(params.get('orgUnitId')) : null
  const [period, setPeriod] = useState(PERIODS.some((p) => p.key === params.get('period')) ? params.get('period') : 'monthly')
  // INT-RB01-04: B3 지연 Top 행 클릭 → WF-02 Drawer(워크플로우 탭·타임라인)
  const [drawerTaskId, setDrawerTaskId] = useState(null)

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
      <SideNav items={BI_ITEMS} title="모니터링" />
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--krds-space-9)', flexWrap: 'wrap', gap: 'var(--krds-space-6)' }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: 0 }}>부서 대시보드</h1>
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-7)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>
          <span>조회 범위: <b style={{ color: 'var(--narae-accent)' }}>{ROLE[role]}</b> (상단 역할 토글로 전환)</span>
          {/* INT-RB01-05 — 현재 BI 스냅샷(biSnapshot mock)을 RB-03 초안에 전달(from=bi) */}
          <button data-testid="rb01-05" onClick={() => navigate('/monitoring/report?from=bi')} style={reportBtn}>
            보고서 작성
          </button>
        </span>
      </div>

      <AsyncView loading={loading} error={error} data={tasks} reload={reload}>
        {kpi && (
          <>
            {/* INT-RB01-03 ① ✦ AI 요약 배너(상시) + 컨텍스트 표시줄 */}
            <div data-testid="rb01-03" style={{ marginBottom: 'var(--krds-space-8)' }}>
              <AiSummaryBanner screen="rb01" contextType="dept" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)', marginTop: 'var(--krds-space-5)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>
                <span>
                  분석 컨텍스트: <b style={{ color: 'var(--color-text-basic)' }}>
                    {ctxTask ? `${ctxTask.taskNm}` : '부서 전체'}{ctxOrg ? ` · ${ctxOrg.orgUnitNm}` : ''}
                  </b>
                </span>
                <span style={{ marginLeft: 'auto' }}>
                  <SegToggle items={PERIODS} value={period} onChange={setPeriod} size="sm" />
                </span>
              </div>
            </div>

            {/* INT-RB01-03 ② 결재 프로세스 BI — B1~B9 위젯 그리드 */}
            <h3 style={{ ...chartTitle, marginBottom: 'var(--krds-space-6)' }}>결재 프로세스 BI</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--krds-space-8)', marginBottom: 'var(--krds-space-10)' }}>
              <B1 />
              <B2 />
              <B3 onDrill={setDrawerTaskId} />
              <B4 />
              <B5 />
              <B6 />
              <B7 />
              <B8 />
              <B9 />
            </div>

            {/* KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--krds-space-6)', marginBottom: 'var(--krds-space-10)' }}>
              <Kpi label="진행중" value={kpi.inProgress} tone="ok" />
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

      {/* INT-RB01-04 — B3 drill 대상 업무 상세(WF-02) Drawer */}
      <WorkDetailDrawer taskId={drawerTaskId} open={!!drawerTaskId} onClose={() => setDrawerTaskId(null)} />
    </div>
  )
}

function Kpi({ label, value, tone }) {
  // KPI 값 텍스트 — 정책 §2.2: -text 단계만 사용
  const color = { primary: 'var(--narae-accent)', ok: 'var(--color-ok-text)', warn: 'var(--color-warn-text)', risk: 'var(--color-risk-text)' }[tone]
  return (
    <Card>
      <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>{label}</div>
      <div style={{ fontSize: 'var(--krds-display-small, 28px)', fontWeight: 'var(--krds-weight-bold)', color, marginTop: 'var(--krds-space-3)' }}>{value}</div>
    </Card>
  )
}

const chartTitle = { fontSize: 'var(--krds-body-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-6)' }
const reportBtn = {
  height: 'var(--krds-control-small)', padding: '0 var(--krds-space-8)', cursor: 'pointer',
  borderRadius: 'var(--krds-radius-medium)', border: 'none',
  background: 'var(--narae-accent)', color: '#fff', fontWeight: 'var(--krds-weight-bold)', fontSize: 'var(--krds-body-small)',
}
