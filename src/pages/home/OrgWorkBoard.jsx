// SCR-CM-03 — 홈 · 조직·업무 보드 (컬럼 드릴다운)
// docs/org-work-board-v1-tools.jsx 예시 디자인 채택(도구 영역 제외).
// 흐름: 조직 depth 드릴 → 소속 근무자 → 업무 스택 → 상세 체인 → (BI 버튼) 목표관리 BI Drawer
// CM03-14 카테고리(상단 탭) 필터 · CM03-17 상단 탭 · 우측 고정 BI 요약
// [CONFIRM] BI 지표·산출식·탭↔업무 매핑은 기획확인 대상(mock). 도구별 Drawer는 최종 진입 시 확정.
import { useState, useMemo } from 'react'
import BiDrawer from '@/components/BiDrawer'
import WorkDetailDrawer from '@/components/WorkDetailDrawer'
import { EmptyState } from '@/components/StateViews'
import { RiskBadge } from '@/components/Badge'
import { HOME_CATEGORY, ORG_LEVEL, PROCESS_STEP, APPROVAL_ROLE } from '@/lib/codes'
import { rootOrgs, childrenOf, findOrg } from '@/mock/orgUnits'
import { usersOf, findUser } from '@/mock/users'
import { tasksByAssignee } from '@/mock/tasks'
import { stepsOf } from '@/mock/steps'
import { approvalLinesOf } from '@/mock/approvalLines'
import { goals } from '@/mock/goals'

const LEVEL_LABEL = { [ORG_LEVEL.OFFICE]: '실', [ORG_LEVEL.BUREAU]: '관', [ORG_LEVEL.DIVISION]: '과' }
const CATEGORY_ENTRIES = Object.entries(HOME_CATEGORY) // [KEY, 라벨]

export default function OrgWorkBoard() {
  const [path, setPath] = useState([]) // orgUnitId 경로
  const [employeeId, setEmployeeId] = useState(null)
  const [categoryKey, setCategoryKey] = useState('ADMIN')
  const [taskId, setTaskId] = useState(null)
  const [biNode, setBiNode] = useState(null) // 오버레이 BI Drawer 대상
  const [drawerTaskId, setDrawerTaskId] = useState(null) // 업무 상세(WF-02) Drawer

  // 현재 조직 컨텍스트
  const currentOrgId = path.length ? path[path.length - 1] : null
  const childOrgs = currentOrgId ? childrenOf(currentOrgId) : rootOrgs()
  const employees = currentOrgId && childOrgs.length === 0 ? usersOf(currentOrgId) : null
  const emp = employeeId ? findUser(employeeId) : null

  const tasks = useMemo(() => {
    if (!emp) return []
    return tasksByAssignee(emp.empNo).filter((t) => t.category === categoryKey)
  }, [emp, categoryKey])
  const task = tasks.find((t) => t.taskId === taskId) || null
  const detailSteps = task ? stepsOf(task.projectId) : []
  const approvals = task ? approvalLinesOf(task.taskId) : []

  const resetDown = () => { setEmployeeId(null); setTaskId(null) }
  const drill = (id) => { setPath((p) => [...p, id]); resetDown() }
  const collapseTo = (i) => { setPath((p) => p.slice(0, i)); resetDown() }

  const openBi = (nodeType, refId, label) => setBiNode({ nodeType, refId, label })

  return (
    <div style={{ height: 'calc(100vh - var(--krds-control-xlarge))', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 바: 제목 + 카테고리 탭 */}
      <div style={topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)' }}>
          <h1 style={{ fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-basic)', margin: 0, fontSize: 'var(--krds-body-medium)' }}>조직·업무 보드</h1>
          <div style={{ display: 'flex', gap: 'var(--krds-space-2)' }}>
            {CATEGORY_ENTRIES.map(([key, label]) => (
              <button key={key} onClick={() => { setCategoryKey(key); setTaskId(null) }}
                style={{ ...tab, ...(categoryKey === key ? tabActive : {}) }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 본문: 가로 스크롤 컬럼 + 우측 고정 BI */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', overflowX: 'auto', minWidth: 0 }}>
          {/* 접힌 스파인 (뒤로 가기) */}
          {path.map((id, i) => (
            <button key={id} onClick={() => collapseTo(i)} title="이 단계로 돌아가기" style={spine}>
              <span style={{ writingMode: 'vertical-rl', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>
                {findOrg(id)?.orgUnitNm}
              </span>
            </button>
          ))}

          {/* 조직 컬럼 */}
          {childOrgs.length > 0 && (
            <Column icon="🏢" title={`조직 (${path.length + 1}depth)`} hint="행=하위 전개 · 📊=BI">
              {childOrgs.map((o) => (
                <Row key={o.orgUnitId} onClick={() => drill(o.orgUnitId)}
                  meta={`${o.empCount}명`} drillLabel="하위 조직 전개"
                  onBi={() => openBi('ORG', o.orgUnitId, o.orgUnitNm)}>
                  <span style={{ fontSize: 'var(--narae-caption)', padding: '0 4px', borderRadius: 3, background: 'var(--narae-accent)', color: '#fff', marginRight: 6 }}>{LEVEL_LABEL[o.level]}</span>
                  {o.orgUnitNm}
                </Row>
              ))}
            </Column>
          )}

          {/* 근무자 컬럼 */}
          {employees && (
            <Column icon="👥" title="소속 근무자" hint="행=업무 보기 · 📊=BI">
              {employees.length === 0
                ? <ColEmpty text="소속 인원 없음" />
                : employees.map((e) => (
                  <Row key={e.empNo} onClick={() => { setEmployeeId(e.empNo); setTaskId(null) }}
                    active={employeeId === e.empNo} meta={e.position} drillLabel="담당 업무 보기"
                    onBi={() => openBi('WORKER', e.empNo, e.empNm)}>
                    👤 {e.empNm}
                  </Row>
                ))}
            </Column>
          )}

          {/* 업무 스택 */}
          {emp && (
            <div style={{ ...colBase, width: 250 }}>
              <ColHeader icon="📋" title={`${emp.empNm} · ${HOME_CATEGORY[categoryKey]}`} />
              <div style={{ overflowY: 'auto', padding: 'var(--krds-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-4)' }}>
                {tasks.length === 0
                  ? <ColEmpty text={`'${HOME_CATEGORY[categoryKey]}' 업무 없음`} />
                  : tasks.map((t) => {
                    const on = taskId === t.taskId
                    return (
                      <button key={t.taskId} onClick={() => setTaskId(t.taskId)}
                        style={{ ...taskCard, ...(on ? taskCardOn : {}) }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                          <span style={{ fontWeight: 'var(--krds-weight-medium)', textAlign: 'left' }}>{t.taskNm}</span>
                          <RiskBadge grade={t.riskGrade} />
                        </div>
                        <div style={{ marginTop: 4, fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)', textAlign: 'left' }}>
                          {t.taskType === 'REGULAR' ? '정기' : '수시'} · 진척 {t.progress}%
                        </div>
                      </button>
                    )
                  })}
              </div>
            </div>
          )}

          {/* 워크플로우 (업무 진행 단계 + 결재 과정) — 클릭 시 업무 상세 Drawer */}
          {task && (
            <div style={{ ...colBase, flex: 1, minWidth: 420, background: 'var(--color-background-alternative, #f8f9fa)' }}>
              <ColHeader icon="↳" title={`${task.taskNm} · 워크플로우`}
                right={<button onClick={() => openBi('TASK', task.taskId, task.taskNm)} style={biMini}>목표관리 BI</button>} />
              <div style={{ overflowY: 'auto', padding: 'var(--krds-space-8)' }}>
                <p style={{ margin: '0 0 var(--krds-space-6)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>
                  단계를 클릭하면 업무 상세가 열립니다.
                </p>
                {/* 진행 단계 */}
                <div style={flowLabel}>진행 단계</div>
                <div style={flowRow}>
                  {detailSteps.length === 0 ? <ColEmpty text="단계 정보 없음" /> : detailSteps.map((d, i) => (
                    <div key={d.stepId} style={{ display: 'flex', alignItems: 'center' }}>
                      {i > 0 && <div style={arrow}>→</div>}
                      <button onClick={() => setDrawerTaskId(task.taskId)} style={{ ...flowCard, borderColor: STEP_COLOR[d.status] }}>
                        <div style={{ fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)' }}>{PROCESS_STEP[d.name]}</div>
                        <div style={{ marginTop: 4, fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>
                          {{ PENDING: '대기', IN_PROGRESS: '진행', COMPLETED: '완료' }[d.status]} · {d.ownerNm}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
                {/* 결재 과정 */}
                <div style={{ ...flowLabel, marginTop: 'var(--krds-space-9)' }}>결재 과정</div>
                {approvals.length === 0 ? (
                  <ColEmpty text="결재선 미설정" />
                ) : (
                  <div style={flowRow}>
                    {approvals.map((a, i) => (
                      <div key={a.lineId} style={{ display: 'flex', alignItems: 'center' }}>
                        {i > 0 && <div style={arrow}>→</div>}
                        <button onClick={() => setDrawerTaskId(task.taskId)} style={{ ...flowCard, borderColor: 'var(--narae-accent)' }}>
                          <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--narae-accent)', fontWeight: 'var(--krds-weight-bold)' }}>{APPROVAL_ROLE[a.role] ?? a.role}</div>
                          <div style={{ fontWeight: 'var(--krds-weight-medium)' }}>{a.approverNm}</div>
                          <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>{a.title}</div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!employees && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmptyState
                icon="🏢"
                title="조직을 클릭해 탐색을 시작하세요"
                description="하위 조직 → 근무자 → 담당 업무 → 워크플로우 순서로 펼쳐집니다. 📊 버튼은 해당 단위의 목표관리 BI를 엽니다."
              />
            </div>
          )}
        </div>

        {/* 우측 고정 BI 요약 */}
        <aside style={biSummary}>
          <ColHeader icon="📊" title="목표관리 BI" />
          <div style={{ padding: 'var(--krds-space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)', fontSize: 'var(--krds-body-small)' }}>
            <SummaryRow k="대상" v={emp ? emp.empNm : (currentOrgId ? findOrg(currentOrgId)?.orgUnitNm : '전사')} />
            <SummaryRow k="카테고리" v={HOME_CATEGORY[categoryKey]} />
            <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)', paddingTop: 4 }}>목표 달성률 (예시)</div>
            {goals.slice(0, 3).map((g) => {
              const kr = g.keyResults[0]
              return (
                <div key={g.goalId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--narae-caption)', color: 'var(--color-text-basic)' }}>
                    <span style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.objective}</span>
                    <span>{kr?.progress ?? 0}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-border-basic,#e2e8f0)', borderRadius: 4, marginTop: 3 }}>
                    <div style={{ width: `${kr?.progress ?? 0}%`, height: 6, background: 'var(--narae-accent)', borderRadius: 4 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </div>

      {/* 오버레이 목표관리 BI Drawer (조직/실무자/업무 단위) */}
      <BiDrawer open={!!biNode} node={biNode} onClose={() => setBiNode(null)} />
      {/* 업무 상세(WF-02) Drawer — 워크플로우 단계 클릭 시 */}
      <WorkDetailDrawer taskId={drawerTaskId} open={!!drawerTaskId} onClose={() => setDrawerTaskId(null)} />
    </div>
  )
}

const STEP_COLOR = { COMPLETED: 'var(--narae-status-ok)', IN_PROGRESS: 'var(--narae-accent)', PENDING: 'var(--color-border-basic,#cbd5e1)' }

/* 부속 */
function Column({ icon, title, children, hint }) {
  return (
    <div style={{ ...colBase, width: 250 }}>
      <ColHeader icon={icon} title={title} />
      {hint && <div style={colHint}>{hint}</div>}
      <div style={{ overflowY: 'auto', padding: 'var(--krds-space-3)' }}>{children}</div>
    </div>
  )
}
function ColHeader({ icon, title, right }) {
  return (
    <div style={colHeader}>
      <span aria-hidden>{icon}</span>
      <span style={{ fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-medium)', color: 'var(--color-text-basic)' }}>{title}</span>
      {right && <span style={{ marginLeft: 'auto' }}>{right}</span>}
    </div>
  )
}
// Row: [하위 전개 영역(클릭)] + [BI 버튼(상시)] 을 명확히 분리
function Row({ children, onClick, active, meta, onBi, drillLabel }) {
  return (
    <div style={{ ...rowWrap, ...(active ? rowActive : {}) }}>
      <button onClick={onClick} style={rowMain} title={drillLabel ? `클릭: ${drillLabel}` : undefined}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
        {meta && <span style={rowMeta}>{meta}</span>}
        {drillLabel && <span style={chev} aria-hidden>›</span>}
      </button>
      {onBi && (
        <button onClick={(e) => { e.stopPropagation(); onBi() }} title="목표관리 BI 열기" style={rowBiBtn}>
          📊 BI
        </button>
      )}
    </div>
  )
}
function SummaryRow({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--color-text-assistive,#6b7280)' }}>{k}</span>
      <span style={{ fontWeight: 'var(--krds-weight-medium)' }}>{v}</span>
    </div>
  )
}
function ColEmpty({ text }) {
  return <div style={{ padding: 'var(--krds-space-8)', textAlign: 'center', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>{text}</div>
}

/* 스타일 */
const topBar = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: 'var(--krds-space-5) var(--krds-space-9)', borderBottom: '1px solid var(--color-border-basic, #e5e7eb)',
}
const tab = {
  height: 'var(--krds-control-xsmall)', padding: '0 var(--krds-space-7)', cursor: 'pointer', border: 'none',
  background: 'transparent', borderRadius: 'var(--krds-radius-medium)', fontSize: 'var(--krds-body-small)',
  fontWeight: 'var(--krds-weight-medium)', color: 'var(--color-text-assistive,#64748b)',
}
const tabActive = { background: 'var(--narae-accent)', color: '#fff' }
const spine = {
  flexShrink: 0, width: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRight: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-alternative, #f8f9fa)',
  cursor: 'pointer',
}
const colBase = {
  flexShrink: 0, borderRight: '1px solid var(--color-border-basic, #e5e7eb)',
  display: 'flex', flexDirection: 'column', minHeight: 0,
}
const colHeader = {
  display: 'flex', alignItems: 'center', gap: 'var(--krds-space-4)', height: 40,
  padding: '0 var(--krds-space-7)', borderBottom: '1px solid var(--color-border-basic, #e5e7eb)',
  background: 'var(--color-background-white)', flexShrink: 0,
}
// Row: 하위 전개(rowMain) + BI 버튼(rowBiBtn) 분리
const rowWrap = {
  display: 'flex', alignItems: 'center', gap: 'var(--krds-space-3)',
  borderRadius: 'var(--krds-radius-small)', marginBottom: 2,
}
const rowActive = { background: 'color-mix(in srgb, var(--narae-accent) 12%, transparent)' }
const rowMain = {
  flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--krds-space-3)',
  padding: 'var(--krds-space-5) var(--krds-space-6)', border: 'none', background: 'transparent',
  borderRadius: 'var(--krds-radius-small)', cursor: 'pointer', textAlign: 'left',
  fontSize: 'var(--krds-body-medium)', color: 'var(--color-text-basic)',
}
const rowMeta = { flexShrink: 0, fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }
const rowBiBtn = {
  flexShrink: 0, padding: '3px var(--krds-space-5)', borderRadius: 'var(--krds-radius-pill)',
  border: '1px solid var(--narae-accent)', background: 'color-mix(in srgb, var(--narae-accent) 8%, transparent)',
  color: 'var(--narae-accent)', fontSize: 'var(--narae-caption)', fontWeight: 'var(--krds-weight-bold)', cursor: 'pointer', whiteSpace: 'nowrap',
}
const chev = { flexShrink: 0, color: 'var(--narae-accent)', fontWeight: 'var(--krds-weight-bold)' }
const colHint = {
  padding: 'var(--krds-space-3) var(--krds-space-6)', fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#9ca3af)',
  borderBottom: '1px solid var(--color-border-basic,#f1f3f5)', background: 'var(--color-background-alternative,#fafbfc)',
}
const taskCard = {
  width: '100%', padding: 'var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)',
  border: '1px solid var(--color-border-basic, #e2e8f0)', background: 'var(--color-background-white)',
  cursor: 'pointer',
}
const taskCardOn = { borderColor: 'var(--narae-accent)', background: 'color-mix(in srgb, var(--narae-accent) 8%, transparent)' }
// 워크플로우(단계/결재) 플로우 스타일
const flowLabel = { fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-5)' }
const flowRow = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--krds-space-2)' }
const arrow = { padding: '0 var(--krds-space-4)', color: 'var(--color-text-assistive,#cbd5e1)' }
const flowCard = {
  flexShrink: 0, minWidth: 120, padding: 'var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)',
  border: '1.5px solid var(--color-border-basic, #e2e8f0)', background: 'var(--color-background-white)',
  cursor: 'pointer', textAlign: 'left',
}
// 우측 고정 BI — 기존 대비 2배(반응형): clamp
const biSummary = {
  flexShrink: 0, width: 'clamp(240px, 26vw, 440px)', borderLeft: '1px solid var(--color-border-basic, #e5e7eb)',
  background: 'var(--color-background-alternative, #f8f9fa)', display: 'flex', flexDirection: 'column', overflowY: 'auto',
}
const biMini = {
  padding: '2px 8px', borderRadius: 'var(--krds-radius-pill)', border: '1px solid var(--narae-accent)',
  background: 'var(--color-background-white)', color: 'var(--narae-accent)', fontSize: 'var(--narae-caption)',
  fontWeight: 'var(--krds-weight-bold)', cursor: 'pointer',
}
