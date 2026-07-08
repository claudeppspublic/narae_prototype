// SCR-CM-03 — 홈 · 조직 간트 보드 (v1.1 REF-24 D8 전면 개편 — 노드 캔버스/컬럼 드릴다운 폐지)
// 좌 LNB=조직 트리(CM03-25)+업무 카테고리 7종(CM03-17) · 중앙=담당자별 간트(주간/월간/연간 CM03-18 ·
// 업무명 바·정기 뱃지·상태색·연관 점선·타부서 저오퍼시티 CM03-27 · 결재 칩 CM03-22) ·
// 우측=목표 BI 패널(CM03-28)+DATA 패널(선택 업무의 규정/양식/결재 현황 CM03-26)
// 바 클릭=선택→DATA 패널 · 더블클릭/DATA 패널 [업무 상세]=WF-02 팝업(CM03-19) — [CONFIRM: 클릭/더블클릭 구분]
// [CONFIRM: 하위 부서 포함 범위] 선택 부서+하위 전체 인원 포함 채택 · [CONFIRM: 결재 칩 표시 위치] 간트 바 칩 채택(트리 롤업 보류)
// [CONFIRM: 기간별 시드] 시연 기준일 2026-03-02(시드 기간 내) 채택
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import OrgTree from '@/components/OrgTree'
import WorkDetailDrawer from '@/components/WorkDetailDrawer'
import ApprovalMini from '@/components/ApprovalMini'
import AiSummaryBanner from '@/components/AiSummaryBanner'
import { EmptyState } from '@/components/StateViews'
import { SegToggle } from '@/components/Tabs'
import { findOrg, childrenOf } from '@/mock/orgUnits'
import { usersOf, findUser } from '@/mock/users'
import { tasksByAssignee, findTask } from '@/mock/tasks'
import { taskRelations } from '@/mock/taskRelations'
import { stepsOf } from '@/mock/steps'
import { regulationsOfStep } from '@/mock/regulations'
import { formTemplates } from '@/mock/formTemplates'
import { goals } from '@/mock/goals'
import { biWidget } from '@/mock/biMetrics'
import { useApprovalStore, effectiveLinesOf } from '@/store/useApprovalStore'
import { taskApprovalStatus } from '@/lib/approval'
import { HOME_CATEGORY, GANTT_SCOPE, APPROVAL_STATUS, APPROVAL_TOKEN, RISK_TOKEN, RISK_GRADE } from '@/lib/codes'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'

const DAY = 86400000
// 시연 기준일 — 시드 일정(2026-01~05) 내 앵커 [CONFIRM: 기간별 시드]
const ANCHOR = new Date('2026-03-02')
const SCOPE_WINDOW = {
  WEEKLY: { start: ANCHOR, days: 7, tickUnit: 1, fmt: (d) => `${d.getMonth() + 1}/${d.getDate()}` },
  MONTHLY: { start: new Date('2026-03-01'), days: 31, tickUnit: 7, fmt: (d) => `${d.getMonth() + 1}/${d.getDate()}` },
  YEARLY: { start: new Date('2026-01-01'), days: 365, tickUnit: 30.4, fmt: (d) => `${d.getMonth() + 1}월` },
}
const ROW_H = 34
const GUTTER_W = 200 // 간트 좌측 담당자/업무 거터 폭(px) — 점선 오버레이 기준
const CHART_TICK = { fontSize: 12 }
const DONUT_COLORS = ['var(--color-risk-base)', 'var(--narae-accent)', 'var(--color-neutral-border)', 'var(--color-warn-base)']

// [CONFIRM: 하위 부서 포함 범위] 선택 부서 직속+하위 전체 인원 수집(시연 상한 10명)
function membersOf(orgUnitId, cap = 10) {
  const out = []
  const walk = (id) => {
    if (out.length >= cap) return
    usersOf(id).forEach((u) => out.length < cap && out.push(u))
    childrenOf(id).forEach((c) => walk(c.orgUnitId))
  }
  walk(orgUnitId)
  return out
}

export default function OrgWorkBoard() {
  const navigate = useNavigate()
  const [orgUnitId, setOrgUnitId] = useState(null) // CM03-25 조직 트리 부서 선택
  const [categoryKey, setCategoryKey] = useState('ADMIN') // CM03-17 카테고리 7종
  const [scope, setScope] = useState('MONTHLY') // CM03-18 주간/월간/연간
  const [selectedTaskId, setSelectedTaskId] = useState(null) // CM03-26 간트 바 선택 → DATA 패널
  const [popupTaskId, setPopupTaskId] = useState(null) // CM03-19 상세 진입 → WF-02 팝업
  const submitted = useApprovalStore((s) => s.submitted) // 상신 오버레이 — 칩 동기(INT-WF02-12 ②)

  const org = orgUnitId ? findOrg(orgUnitId) : null
  const members = useMemo(() => (orgUnitId ? membersOf(orgUnitId) : []), [orgUnitId])

  // 담당자별 간트 행(assigneeGanttRows) + 타부서 연관(crossDeptTasks — 선택 부서 밖 포함, CM03-27)
  const { rows, deps } = useMemo(() => {
    const own = members.flatMap((u) =>
      tasksByAssignee(u.empNo).filter((t) => t.category === categoryKey).map((t) => ({ t, crossDept: false })))
    const ownIds = new Set(own.map((r) => r.t.taskId))
    const cross = []
    taskRelations.forEach((r) => {
      const pairs = [[r.fromTaskId, r.toTaskId], [r.toTaskId, r.fromTaskId]]
      pairs.forEach(([a, b]) => {
        if (ownIds.has(a) && !ownIds.has(b) && !cross.some((c) => c.t.taskId === b)) {
          const other = findTask(b)
          if (other) cross.push({ t: other, crossDept: true })
        }
      })
    })
    const all = [...own, ...cross]
    const idx = new Map(all.map((r, i) => [r.t.taskId, i]))
    const deps = taskRelations
      .filter((r) => idx.has(r.fromTaskId) && idx.has(r.toTaskId))
      .map((r) => ({ from: idx.get(r.fromTaskId), to: idx.get(r.toTaskId), type: r.relationType }))
    return { rows: all, deps }
  }, [members, categoryKey])

  const selectedTask = selectedTaskId ? findTask(selectedTaskId) : null

  return (
    <div style={{ height: 'calc(100vh - var(--krds-control-xlarge))', display: 'flex', minHeight: 0 }}>
      {/* ── 좌 LNB: 조직 트리 + 카테고리 (D8: 조직도 화면은 여기서 진입 — D9) */}
      <aside style={lnb}>
        <div style={lnbHeader}>
          <span>조직 / 부서</span>
          <button onClick={() => navigate('/org/list')} title="조직도 화면으로 이동(D9)" style={lnbLink}>조직도 →</button>
        </div>
        <div data-testid="cm03-25" style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-4)' }}>
          <OrgTree selectedId={orgUnitId} onSelect={(id) => { setOrgUnitId(id); setSelectedTaskId(null) }} />
        </div>
        <div style={lnbHeader}>업무</div>
        <div style={{ padding: 'var(--krds-space-4)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(HOME_CATEGORY).map(([key, label]) => (
            <button key={key} data-testid="cm03-17"
              onClick={() => { setCategoryKey(key); setSelectedTaskId(null) }}
              style={{ ...catBtn, ...(categoryKey === key ? catBtnOn : {}) }}>
              {label}
            </button>
          ))}
        </div>
      </aside>

      {/* ── 중앙: 담당자별 간트 */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={topBar}>
          <h1 style={{ margin: 0, fontSize: 'var(--krds-body-medium)', fontWeight: 'var(--krds-weight-bold)' }}>
            {org ? `${org.orgUnitNm} · ${HOME_CATEGORY[categoryKey]} 업무 간트` : '조직 간트 보드'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-7)', marginLeft: 'auto' }}>
            <Legend />
            {/* CM03-18 기간 토글 — 조회 기간에 따라 차트 유기적 변동 */}
            <span data-testid="cm03-18">
              <SegToggle size="sm" value={scope} onChange={setScope}
                items={Object.entries(GANTT_SCOPE).map(([key, label]) => ({ key, label }))} />
            </span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-8)' }}>
          <AiSummaryBanner screen="cm03" contextType="org" contextId={null} style={{ marginBottom: 'var(--krds-space-7)' }} />
          {!org ? (
            /* CM03-21 초기 EmptyState (v1.1 문구) */
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '14vh' }} data-testid="cm03-21">
              <EmptyState icon="🏢" title="부서를 선택해 조직 간트를 시작하세요"
                description="좌측 조직 트리에서 부서를 선택하면 담당자별 업무 간트가 표시됩니다. 간트 바 클릭=업무 선택(DATA 패널) · 더블클릭=업무 상세." />
            </div>
          ) : rows.length === 0 ? (
            <EmptyState icon="📋" title={`'${HOME_CATEGORY[categoryKey]}' 업무가 없습니다`}
              description="다른 카테고리를 선택하거나 상위 부서를 선택해 보세요." />
          ) : (
            <Gantt rows={rows} deps={deps} scope={scope} submitted={submitted}
              selectedTaskId={selectedTaskId}
              onSelect={(id) => setSelectedTaskId(id)}
              onDetail={(id) => setPopupTaskId(id)} />
          )}
        </div>
      </main>

      {/* ── 우: 목표 패널 (CM03-28) + DATA 패널 (CM03-26) */}
      <aside style={rightPane}>
        <GoalPanel org={org} />
        <DataPanel task={selectedTask} submitted={submitted} onDetail={(id) => setPopupTaskId(id)} />
      </aside>

      {/* CM03-19 업무 상세 — WF-02 팝업(v1.1 Drawer→팝업) */}
      <WorkDetailDrawer taskId={popupTaskId} open={!!popupTaskId} onClose={() => setPopupTaskId(null)} />
    </div>
  )
}

/* ── 간트 (커스텀) — CM03-26 바 클릭 선택 · CM03-27 연관 점선/상태색/정기 뱃지/타부서 저오퍼시티 */
function Gantt({ rows, deps, scope, submitted, selectedTaskId, onSelect, onDetail }) {
  const win = SCOPE_WINDOW[scope]
  const start = +win.start
  const span = win.days * DAY
  const pos = (t) => {
    const s = Math.max(+new Date(t.startAt), start)
    const e = Math.min(+new Date(t.endAt), start + span)
    if (e <= start || s >= start + span) return null // 조회 기간 밖
    return { left: ((s - start) / span) * 100, width: Math.max(((e - s) / span) * 100, 1.5) }
  }
  const ticks = Array.from({ length: Math.floor(win.days / win.tickUnit) + 1 },
    (_, i) => new Date(start + i * win.tickUnit * DAY))

  let prevAssignee = null
  return (
    <div style={{ border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)', overflow: 'hidden' }}>
      {/* 축 */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-basic,#e5e7eb)', background: 'var(--color-background-alternative,#f8f9fa)' }}>
        <div style={{ ...gutter, fontWeight: 'var(--krds-weight-bold)' }}>담당자 / 업무</div>
        <div style={{ flex: 1, position: 'relative', height: 30 }}>
          {ticks.map((d, i) => (
            <span key={i} style={{ position: 'absolute', left: `${(i * win.tickUnit / win.days) * 100}%`, top: 6, fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#9ca3af)' }}>
              {win.fmt(d)}
            </span>
          ))}
        </div>
      </div>
      {/* 행 + 연관 점선 오버레이 */}
      <div style={{ position: 'relative' }}>
        {rows.map(({ t, crossDept }, i) => {
          const p = pos(t)
          const lines = effectiveLinesOf(t.taskId, submitted)
          const aStatus = lines.length ? taskApprovalStatus(lines) : null
          const showAssignee = t.assigneeNm !== prevAssignee || crossDept
          prevAssignee = crossDept ? null : t.assigneeNm
          return (
            <div key={t.taskId} style={{ display: 'flex', height: ROW_H, borderBottom: '1px solid var(--color-border-basic,#f1f3f5)', opacity: crossDept ? 0.5 : 1 }}>
              <div style={gutter}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {showAssignee ? `👤 ${t.assigneeNm}` : ''}{crossDept && <em style={crossTag}> 타부서</em>}
                </span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                {p ? (
                  <button data-testid="cm03-26" title={`${t.taskNm} · ${t.startAt}~${t.endAt} · ${RISK_GRADE[t.riskGrade]}${crossDept ? ' · 타부서 연관' : ''}`}
                    onClick={() => onSelect(t.taskId)}
                    onDoubleClick={() => onDetail(t.taskId)} /* CM03-19 [CONFIRM: 클릭/더블클릭 구분] */
                    style={{
                      position: 'absolute', left: `${p.left}%`, width: `${p.width}%`, top: 5, height: ROW_H - 12,
                      borderRadius: 4, border: selectedTaskId === t.taskId ? '2px solid var(--color-text-basic)' : 'none',
                      background: RISK_TOKEN[t.riskGrade], cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 6, overflow: 'hidden',
                    }}>
                    {/* 간트 바=업무명 명시 · 정기 뱃지 · 결재 칩(CM03-22 이관) */}
                    <span style={barText}>{t.taskNm}</span>
                    {t.taskType === 'REGULAR' && <span style={regularBadge}>정기</span>}
                    {aStatus && (
                      <span style={{ ...apprChip, borderColor: APPROVAL_TOKEN[aStatus] }}>{APPROVAL_STATUS[aStatus]}</span>
                    )}
                  </button>
                ) : (
                  <span style={{ position: 'absolute', left: 6, top: 8, fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#c1c7cd)' }}>
                    조회 기간 밖 ({t.startAt}~{t.endAt})
                  </span>
                )}
              </div>
            </div>
          )
        })}
        {/* CM03-27 업무간 연관성 점선 (from 선행 → to 후행) — 타임라인 영역(거터 제외)만 덮는 오버레이, x=% 좌표 */}
        <svg aria-hidden style={{ position: 'absolute', top: 0, left: GUTTER_W, right: 0, height: '100%', pointerEvents: 'none' }}>
          {deps.map((d, i) => {
            const fromP = pos(rows[d.from].t); const toP = pos(rows[d.to].t)
            if (!fromP || !toP) return null
            return (
              <line key={i}
                x1={`${Math.min(fromP.left + fromP.width, 100)}%`} y1={d.from * ROW_H + ROW_H / 2}
                x2={`${toP.left}%`} y2={d.to * ROW_H + ROW_H / 2}
                stroke="var(--color-neutral-border)" strokeWidth="1.5" strokeDasharray="4 3" />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function Legend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-5)', fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>
      {[['정상', 'OK'], ['경고', 'WARN'], ['위험', 'RISK']].map(([label, k]) => (
        <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <i style={{ width: 10, height: 10, borderRadius: 3, background: RISK_TOKEN[k] }} aria-hidden />{label}
        </span>
      ))}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        <i style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--color-neutral-border)', opacity: 0.5 }} aria-hidden />타부서(연관)
      </span>
      <span style={{ borderTop: '2px dashed var(--color-neutral-border)', width: 18 }} aria-hidden /> 연관
    </div>
  )
}

/* ── CM03-28 목표 패널 — 조직 목표 + BI 그래프 다수(하단 영역 맞춤) */
function GoalPanel({ org }) {
  const trend = biWidget('B6'); const donut = biWidget('B7'); const sla = biWidget('B5')
  return (
    <section style={panel}>
      <div style={panelHeader}>🎯 목표 {org ? `· ${org.orgUnitNm}` : '· 전사'}</div>
      <div style={{ padding: 'var(--krds-space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-7)', overflowY: 'auto' }}>
        {/* 조직 목표 달성률 */}
        {goals.slice(0, 3).map((g) => {
          const kr = g.keyResults[0]
          return (
            <div key={g.goalId}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--narae-caption)' }}>
                <span style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.objective}</span>
                <span>{kr?.progress ?? 0}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-border-basic,#e2e8f0)', borderRadius: 4, marginTop: 3 }}>
                <div style={{ width: `${kr?.progress ?? 0}%`, height: 6, background: 'var(--narae-accent)', borderRadius: 4 }} />
              </div>
            </div>
          )
        })}
        {/* BI 그래프 다수 — B6 추세/B7 도넛/B5 부서 바 (RB-01 시드 재사용·시연용) */}
        {trend && (
          <ChartBlock title={trend.title}>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={trend.series}>
                <XAxis dataKey="week" tick={CHART_TICK} interval={2} /><Tooltip />
                <Line type="monotone" dataKey="value" stroke="var(--narae-accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBlock>
        )}
        {donut && (
          <ChartBlock title={donut.title}>
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie data={donut.series} dataKey="value" nameKey="cause" innerRadius={26} outerRadius={44}>
                  {donut.series.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBlock>
        )}
        {sla && (
          <ChartBlock title={sla.title}>
            <ResponsiveContainer width="100%" height={Math.max(80, sla.series.length * 24)}>
              <BarChart data={sla.series} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" domain={[0, 100]} tick={CHART_TICK} /><YAxis type="category" dataKey="dept" tick={CHART_TICK} width={70} /><Tooltip />
                <Bar dataKey="value" fill="var(--narae-accent)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBlock>
        )}
      </div>
    </section>
  )
}

function ChartBlock({ title, children }) {
  return (
    <div data-testid="cm03-28">
      <div style={{ fontSize: 'var(--narae-caption)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 4 }}>{title}</div>
      {children}
    </div>
  )
}

/* ── DATA 패널 — 선택 업무의 규정/양식/결재 현황 (CM03-26 · 결재 미니 이관 CM03-22~24) */
function DataPanel({ task, submitted, onDetail }) {
  const steps = task ? stepsOf(task.projectId) : []
  const regs = steps.flatMap((s) => regulationsOfStep(s.stepId)).slice(0, 4)
  const forms = task ? formTemplates.filter((f) => (task.linkedFormIds ?? []).includes(f.templateId)) : []
  const lines = task ? effectiveLinesOf(task.taskId, submitted) : []
  return (
    <section style={{ ...panel, borderTop: '1px solid var(--color-border-basic,#e5e7eb)' }}>
      <div style={panelHeader}>🗂 DATA {task ? `· ${task.taskNm}` : ''}</div>
      <div style={{ padding: 'var(--krds-space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)', overflowY: 'auto' }}>
        {!task ? (
          <p style={{ margin: 0, fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>
            간트에서 업무 바를 클릭하면 등록된 규정 · 양식 · 결재 현황이 표시됩니다.
          </p>
        ) : (
          <>
            <DataList title={`규정 (${regs.length})`} empty="연계 규정 없음"
              items={regs.map((r) => ({ id: r.regulationId, icon: '📄', name: r.name }))} />
            <DataList title={`양식 (${forms.length})`} empty="연결 양식 없음"
              items={forms.map((f) => ({ id: f.templateId, icon: '📑', name: f.name }))} />
            {lines.length > 0
              ? <ApprovalMini lines={lines} taskId={task.taskId} onDetail={onDetail} />
              : <DataList title="결재 현황" empty="결재선 미설정" items={[]} />}
            <button onClick={() => onDetail(task.taskId)} data-testid="cm03-19" style={detailFull}>업무 상세 열기</button>
          </>
        )}
      </div>
    </section>
  )
}

function DataList({ title, items, empty }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--narae-caption)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 4 }}>{title}</div>
      {items.length === 0
        ? <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#c1c7cd)' }}>{empty}</div>
        : items.map((it) => (
          <div key={it.id} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 'var(--krds-body-small)', padding: '3px 0', overflow: 'hidden' }}>
            <span aria-hidden>{it.icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</span>
          </div>
        ))}
    </div>
  )
}

/* ── 스타일 */
const lnb = { width: 'clamp(220px, 20vw, 300px)', flexShrink: 0, borderRight: '1px solid var(--color-border-basic,#e5e7eb)', display: 'flex', flexDirection: 'column', minHeight: 0 }
const lnbHeader = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  padding: 'var(--krds-space-5) var(--krds-space-7)', fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)',
  color: 'var(--color-text-basic)', borderBottom: '1px solid var(--color-border-basic,#e5e7eb)', background: 'var(--color-background-alternative,#f8f9fa)',
}
const lnbLink = { border: 'none', background: 'transparent', color: 'var(--narae-accent)', cursor: 'pointer', fontSize: 'var(--narae-caption)', fontWeight: 'var(--krds-weight-bold)' }
const catBtn = {
  textAlign: 'left', padding: 'var(--krds-space-4) var(--krds-space-7)', border: 'none', background: 'transparent',
  borderRadius: 'var(--krds-radius-small)', cursor: 'pointer', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-basic)',
}
const catBtnOn = { background: 'var(--narae-accent)', color: '#fff', fontWeight: 'var(--krds-weight-bold)' }
const topBar = {
  display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)', flexShrink: 0,
  padding: 'var(--krds-space-5) var(--krds-space-8)', borderBottom: '1px solid var(--color-border-basic,#e5e7eb)',
}
const gutter = {
  width: GUTTER_W, flexShrink: 0, display: 'flex', alignItems: 'center',
  padding: '0 var(--krds-space-6)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-basic)',
  borderRight: '1px solid var(--color-border-basic,#f1f3f5)',
}
const crossTag = { fontStyle: 'normal', fontSize: 'var(--narae-caption)', color: 'var(--color-neutral-text)' }
const barText = { fontSize: 'var(--narae-caption)', color: '#fff', fontWeight: 'var(--krds-weight-bold)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
const regularBadge = {
  flexShrink: 0, padding: '0 4px', borderRadius: 3, fontSize: 'var(--narae-caption)',
  background: 'color-mix(in srgb, #fff 88%, transparent)', color: 'var(--color-text-basic)', fontWeight: 'var(--krds-weight-bold)',
}
const apprChip = {
  flexShrink: 0, padding: '0 4px', borderRadius: 'var(--krds-radius-pill)', fontSize: 'var(--narae-caption)',
  background: 'var(--color-background-white)', color: 'var(--color-text-basic)', border: '1.5px solid', fontWeight: 'var(--krds-weight-bold)',
}
const rightPane = { width: 'clamp(280px, 26vw, 420px)', flexShrink: 0, borderLeft: '1px solid var(--color-border-basic,#e5e7eb)', display: 'flex', flexDirection: 'column', minHeight: 0 }
const panel = { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }
const panelHeader = {
  flexShrink: 0, padding: 'var(--krds-space-5) var(--krds-space-7)', fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)',
  borderBottom: '1px solid var(--color-border-basic,#e5e7eb)', background: 'var(--color-background-alternative,#f8f9fa)',
}
const detailFull = {
  height: 'var(--krds-control-xsmall)', borderRadius: 'var(--krds-radius-medium)', cursor: 'pointer',
  border: '1px solid var(--narae-accent)', background: 'color-mix(in srgb, var(--narae-accent) 8%, transparent)',
  color: 'var(--narae-accent)', fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)',
}
