// SCR-WF-02 — 업무 프로세스 맵 (v1.1 REF-24 D11 · WF02-04 재구현)
// WF02-16 일/주/월 뷰 토글 · WF02-17 참조 회의/규정 연결 노드 · 타부서 연계 저오퍼시티(점선 연결)
// 데이터: STEP(단계)·TASK_RELATION(선후행)·MEETING(참조 회의)·REGULATION(단계 연계 규정) — 전부 mock 재사용
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SegToggle } from '@/components/Tabs'
import { EmptyState } from '@/components/StateViews'
import { findTask, tasksOf } from '@/mock/tasks'
import { findUser } from '@/mock/users'
import { stepsOf } from '@/mock/steps'
import { regulationsOfStep } from '@/mock/regulations'
import { meetings } from '@/mock/meetings'
import { relationsFrom, relationsTo } from '@/mock/taskRelations'
import { PROCESS_STEP, PROCESS_VIEW, RISK_TOKEN } from '@/lib/codes'

const STEP_COLOR = { COMPLETED: 'var(--color-ok-base)', IN_PROGRESS: 'var(--color-ok-base)', PENDING: 'var(--color-neutral-border)' }
const DAY = 86400000

export default function ProcessMap({ task, onClose }) {
  const navigate = useNavigate()
  const [view, setView] = useState('WEEK') // PROCESS_VIEW: DAY/WEEK/MONTH

  const steps = stepsOf(task.projectId)
  const projectTasks = tasksOf(task.projectId)
  const myOrg = findUser(task.assigneeId)?.orgUnitId

  // 선후행 연계 — from=선행/to=후행. 담당자 소속이 다르면 타부서(저오퍼시티) 표시
  const relations = useMemo(() => {
    const rels = [
      ...relationsTo(task.taskId).map((r) => ({ ...r, dir: '선행', otherId: r.fromTaskId })),
      ...relationsFrom(task.taskId).map((r) => ({ ...r, dir: '후행', otherId: r.toTaskId })),
    ]
    return rels.map((r) => {
      const other = findTask(r.otherId)
      const crossDept = other && findUser(other.assigneeId)?.orgUnitId !== myOrg
      return { ...r, other, crossDept }
    }).filter((r) => r.other)
  }, [task.taskId, myOrg])

  const refMeetings = meetings.filter((m) => m.projectId === task.projectId).slice(0, 2)

  if (steps.length === 0 && relations.length === 0) return <EmptyState icon="🗺" title="프로세스 정보가 없습니다" />

  return (
    <div data-testid="wf02-04" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-8)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={mapLabel}>업무 프로세스</div>
        {/* WF02-16 일/주/월 뷰 토글 */}
        <span data-testid="wf02-16">
          <SegToggle size="sm" value={view} onChange={setView}
            items={Object.entries(PROCESS_VIEW).map(([key, label]) => ({ key, label }))} />
        </span>
      </div>

      {/* 단계 Flow — 단계 카드 + 단계별 참조 회의/규정 연결 노드(점선) */}
      <div style={{ display: 'flex', gap: 'var(--krds-space-6)', alignItems: 'stretch', overflowX: 'auto', paddingBottom: 4 }}>
        {steps.map((s, i) => {
          const regs = regulationsOfStep(s.stepId).slice(0, 2)
          const mtg = refMeetings[i]
          return (
            <div key={s.stepId} style={{ display: 'flex', alignItems: 'flex-start' }}>
              {i > 0 && <span style={arrow}>→</span>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-4)', minWidth: 150 }}>
                <div style={{ ...stepCard, borderColor: STEP_COLOR[s.status] }}>
                  <div style={{ fontWeight: 'var(--krds-weight-bold)' }}>{PROCESS_STEP[s.name]}</div>
                  <div style={metaSm}>{{ PENDING: '대기', IN_PROGRESS: '진행', COMPLETED: '완료' }[s.status]} · {s.ownerNm}</div>
                </div>
                {/* WF02-17 연결 노드 — 회의(DO-01)·규정(AI-01). [CONFIRM: 이동 방식] 현행=해당 화면 라우팅 */}
                {mtg && (
                  <button data-testid="wf02-17" onClick={() => { onClose?.(); navigate('/meeting') }} style={refChip}>
                    📋 {mtg.meetingNm}
                  </button>
                )}
                {regs.map((r) => (
                  <button key={r.regulationId} onClick={() => { onClose?.(); navigate('/reg/table') }} style={refChip}>
                    📄 {r.name}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 선후행·타부서 연계 — 점선 연결, 타부서=저오퍼시티 */}
      {relations.length > 0 && (
        <div>
          <div style={mapLabel}>선후행·타부서 연계</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-4)' }}>
            {relations.map((r) => (
              <div key={r.dir + r.otherId} style={{ ...relRow, opacity: r.crossDept ? 0.5 : 1 }}>
                <span style={relTag}>{r.dir} · {r.relationType}</span>
                <span style={{ borderTop: '2px dashed var(--color-neutral-border)', flex: '0 0 28px' }} aria-hidden />
                <span style={{ flex: 1 }}>{r.other.taskNm}</span>
                <span style={metaSm}>{r.other.assigneeNm}{r.crossDept && ' · 타부서'}</span>
                <span aria-hidden style={{ width: 8, height: 8, borderRadius: 4, background: RISK_TOKEN[r.other.riskGrade] }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 뷰 스코프 타임라인 — 일/주/월에 따라 축·바 재구성 (조회 기간 따라 유기적 변동) */}
      <Timeline task={task} projectTasks={projectTasks} relations={relations} view={view} />
    </div>
  )
}

// 일/주/월 스코프 미니 타임라인 — 본 업무 + 연계 업무 바(타부서 저오퍼시티)
function Timeline({ task, projectTasks, relations, view }) {
  const rows = useMemo(() => {
    const rel = relations.map((r) => ({ t: r.other, crossDept: r.crossDept }))
    const mine = { t: task, crossDept: false }
    const rest = projectTasks.filter((t) => t.taskId !== task.taskId && !rel.some((r) => r.t.taskId === t.taskId))
      .slice(0, 2).map((t) => ({ t, crossDept: false }))
    return [mine, ...rel, ...rest]
  }, [task, projectTasks, relations])

  const range = useMemo(() => {
    const start = Math.min(...rows.map((r) => +new Date(r.t.startAt)))
    const end = Math.max(...rows.map((r) => +new Date(r.t.endAt)))
    return { start, span: Math.max(end - start, DAY) }
  }, [rows])

  const unit = view === 'DAY' ? DAY : view === 'WEEK' ? DAY * 7 : DAY * 30
  const tickCount = Math.min(Math.ceil(range.span / unit) + 1, view === 'DAY' ? 14 : 12)
  const ticks = Array.from({ length: tickCount }, (_, i) => new Date(range.start + i * unit))
  const fmt = (d) => view === 'MONTH' ? `${d.getMonth() + 1}월` : `${d.getMonth() + 1}/${d.getDate()}`

  return (
    <div>
      <div style={mapLabel}>타임라인 ({{ DAY: '일', WEEK: '주', MONTH: '월' }[view]} 단위)</div>
      <div style={{ border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)', padding: 'var(--krds-space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--krds-space-4)' }}>
          {ticks.map((d, i) => <span key={i} style={metaSm}>{fmt(d)}</span>)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-4)' }}>
          {rows.map(({ t, crossDept }) => {
            const left = ((+new Date(t.startAt) - range.start) / range.span) * 100
            const w = Math.max(((+new Date(t.endAt) - +new Date(t.startAt)) / range.span) * 100, 2)
            return (
              <div key={t.taskId} style={{ position: 'relative', height: 20, background: 'var(--color-background-alternative,#f8f9fa)', borderRadius: 4 }}>
                <div title={t.taskNm} style={{
                  position: 'absolute', left: `${left}%`, width: `${w}%`, top: 2, bottom: 2,
                  borderRadius: 4, background: RISK_TOKEN[t.riskGrade], opacity: crossDept ? 0.45 : 0.9,
                  display: 'flex', alignItems: 'center', paddingLeft: 6, overflow: 'hidden',
                }}>
                  <span style={{ fontSize: 'var(--narae-caption)', color: '#fff', whiteSpace: 'nowrap' }}>
                    {t.taskNm}{t.taskId === task.taskId ? ' (본 업무)' : ''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const mapLabel = { fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-5)' }
const arrow = { padding: '10px var(--krds-space-4) 0', color: 'var(--color-text-assistive,#cbd5e1)' }
const stepCard = { padding: 'var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)', border: '1.5px solid var(--color-border-basic,#e5e7eb)', background: 'var(--color-background-white)', textAlign: 'center' }
const metaSm = { fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#9ca3af)' }
const refChip = {
  display: 'flex', alignItems: 'center', gap: 4, padding: 'var(--krds-space-3) var(--krds-space-5)',
  border: '1.5px dashed var(--color-neutral-border)', borderRadius: 'var(--krds-radius-pill)',
  background: 'var(--color-background-white)', cursor: 'pointer', fontSize: 'var(--narae-caption)',
  color: 'var(--color-text-basic)', textAlign: 'left', maxWidth: 190, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
}
const relRow = { display: 'flex', alignItems: 'center', gap: 'var(--krds-space-5)', padding: 'var(--krds-space-5) var(--krds-space-6)', border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)', fontSize: 'var(--krds-body-small)' }
const relTag = { flexShrink: 0, padding: '1px 8px', borderRadius: 'var(--krds-radius-pill)', background: 'var(--color-neutral-bg)', color: 'var(--color-neutral-text)', fontSize: 'var(--narae-caption)' }
