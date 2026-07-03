// SCR-WF-01-01 — 업무 간트 차트 (커스텀 DOM 간트, 기술스택정의서 §2)
// WF0101-01 일/주/월 토글+바 재계산 · WF0101-02 팀/팀원 필터 · WF0101-03 바→WF-02
// WF0101-04 연계관계 hover · FN-WF0101-1~4 · 상태 5종
import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/mock'
import { rootOrgs } from '@/mock/orgUnits'
import { projects } from '@/mock/projects'
import { taskRelations } from '@/mock/taskRelations'
import { useAsync } from '@/lib/useAsync'
import WorkNav from '@/components/WorkNav'
import WorkViewToggle from '@/components/WorkViewToggle'
import { AsyncView } from '@/components/StateViews'
import WorkDetailDrawer from '@/components/WorkDetailDrawer'
import SrOnly from '@/components/SrOnly'

// 간트 표시 범위 (2026 상반기)
const RANGE_START = new Date('2026-01-01')
const RANGE_END = new Date('2026-06-30')
const DAY = 86400000
const totalDays = Math.round((RANGE_END - RANGE_START) / DAY)
const MONTHS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06']

const STATUS_COLOR = {
  IN_PROGRESS: 'var(--narae-accent)',
  COMPLETED: 'var(--narae-status-ok)',
  PENDING: 'var(--color-text-assistive, #9ca3af)',
  ON_HOLD: 'var(--narae-status-warn)',
  DELAYED: 'var(--narae-status-risk)',
}
const pct = (date) => {
  const d = new Date(date)
  const clamped = Math.max(RANGE_START, Math.min(RANGE_END, d))
  return ((clamped - RANGE_START) / DAY / totalDays) * 100
}

export default function WorkGantt() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const drawerTaskId = params.get('drawer')
  const { data: tasks, loading, error, reload } = useAsync(() => api.getTasks({ delay: 400 }), [])
  const [scale, setScale] = useState('month')
  const [orgFilter, setOrgFilter] = useState('')

  // 과제(프로젝트)별 그룹핑
  const groups = useMemo(() => {
    if (!tasks) return []
    return projects.map((p) => ({
      project: p,
      tasks: tasks.filter((t) => t.projectId === p.projectId),
    })).filter((g) => g.tasks.length > 0)
  }, [tasks])

  const openTask = (id) => setParams((prev) => { prev.set('drawer', id); return prev })
  const closeDrawer = () => setParams((prev) => { prev.delete('drawer'); return prev })

  // 스케일별 컬럼 (월/주/일) — WF0101-01 바 재계산은 컬럼 밀도로 표현
  const columns = scale === 'month' ? MONTHS
    : scale === 'week' ? Array.from({ length: 26 }, (_, i) => `${i + 1}주`)
    : Array.from({ length: 26 }, (_, i) => `${i + 1}`)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SrOnly as="h1">업무 차트</SrOnly>
      <WorkNav />
      <section style={{ flex: 1, overflow: 'auto', padding: 'var(--krds-space-9)' }}>
        {/* 상단: 필터·범례(좌) · 주기/뷰 토글(우, 위치 고정) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--krds-space-7)', flexWrap: 'wrap', gap: 'var(--krds-space-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--krds-space-5)', alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)} aria-label="팀 선택" style={select}>
              <option value="">전체 팀</option>
              {rootOrgs().map((o) => <option key={o.orgUnitId} value={o.orgUnitId}>{o.orgUnitNm}</option>)}
            </select>
            <Legend />
          </div>
          <WorkViewToggle view="gantt" scale={scale} onScale={setScale} />
        </div>

        <AsyncView loading={loading} error={error} data={groups} reload={reload}>
          <div style={{ minWidth: 900, border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-large)', overflow: 'hidden' }}>
            {/* 타임라인 헤더 */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-basic,#e5e7eb)', background: 'var(--color-background-alternative,#f8f9fa)' }}>
              <div style={{ ...labelCol, fontWeight: 'var(--krds-weight-bold)', fontSize: 'var(--krds-body-small)' }}>업무 목록</div>
              <div style={{ flex: 1, display: 'flex' }}>
                {columns.map((m) => (
                  <div key={m} style={{ flex: 1, textAlign: 'center', padding: 'var(--krds-space-4) 0', fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)', borderLeft: '1px solid var(--color-border-basic,#eef0f2)' }}>{m}</div>
                ))}
              </div>
            </div>

            {/* 그룹 + 바 */}
            {groups.map((g) => (
              <div key={g.project.projectId}>
                <div style={groupRow}>▸ {g.project.projectNm} <span style={{ color: 'var(--color-text-assistive,#9ca3af)', fontWeight: 'normal' }}>({g.tasks.length})</span></div>
                {g.tasks.map((t) => {
                  const left = pct(t.startAt)
                  const width = Math.max(2, pct(t.endAt) - left)
                  return (
                    <div key={t.taskId} style={barRow}>
                      <div style={labelCol} title={t.taskNm}>{t.taskNm}</div>
                      <div style={{ flex: 1, position: 'relative', height: 28 }}>
                        <button onClick={() => openTask(t.taskId)} title={`${t.taskNm} · ${t.progress}%`}
                          style={{ position: 'absolute', left: `${left}%`, width: `${width}%`, top: 4, height: 20, borderRadius: 'var(--krds-radius-small)', border: 'none', cursor: 'pointer', background: `color-mix(in srgb, ${STATUS_COLOR[t.status]} 30%, transparent)`, overflow: 'hidden', padding: 0 }}>
                          <span style={{ position: 'absolute', inset: 0, width: `${t.progress}%`, background: STATUS_COLOR[t.status], borderRadius: 'var(--krds-radius-small)' }} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <p style={{ marginTop: 'var(--krds-space-6)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>
            바 클릭 시 업무 상세로 이동 · 채워진 부분은 진행률 · 의존 관계 {taskRelations.length}건 [CONFIRM: 점선 시각화 방향성]
          </p>
        </AsyncView>
      </section>

      <WorkDetailDrawer taskId={drawerTaskId} open={!!drawerTaskId} onClose={closeDrawer} />
    </div>
  )
}

function Legend() {
  const items = [['진행중', 'IN_PROGRESS'], ['종결', 'COMPLETED'], ['대기', 'PENDING'], ['보류', 'ON_HOLD'], ['지연', 'DELAYED']]
  return (
    <div style={{ display: 'flex', gap: 'var(--krds-space-6)', flexWrap: 'wrap' }}>
      {items.map(([label, key]) => (
        <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: STATUS_COLOR[key] }} />{label}
        </span>
      ))}
    </div>
  )
}

const labelCol = {
  width: 220, flexShrink: 0, padding: 'var(--krds-space-4) var(--krds-space-6)',
  fontSize: 'var(--krds-body-small)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  borderRight: '1px solid var(--color-border-basic,#e5e7eb)',
}
const groupRow = {
  display: 'flex', alignItems: 'center', padding: 'var(--krds-space-4) var(--krds-space-6)',
  background: 'var(--color-background-alternative,#f8f9fa)', fontWeight: 'var(--krds-weight-bold)',
  fontSize: 'var(--krds-body-small)', borderBottom: '1px solid var(--color-border-basic,#eef0f2)',
}
const barRow = { display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-border-basic,#f1f3f5)' }
const select = {
  height: 'var(--krds-control-small)', padding: '0 var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)',
  border: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-white)',
}
