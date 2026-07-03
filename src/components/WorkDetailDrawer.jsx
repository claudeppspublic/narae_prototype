// SCR-WF-02 — 업무 상세 (우측 Drawer). 간트/캘린더/테이블/홈에서 업무 클릭 진입.
// 상단 업무개요(담당자·참여자·댓글·규정연계) + 탭: 워크플로우/규정/평가/리스크/댓글/보고서 (피드백)
// 워크플로우=진행단계+결재과정 · 결재 상신 버튼 · WF02-01/03/04/05/07
// [CONFIRM] 평가·보고서 탭은 mock (기획확인 대상)
import { useState, useEffect } from 'react'
import Drawer from '@/components/Drawer'
import Tabs from '@/components/Tabs'
import Badge, { StatusBadge, RiskBadge } from '@/components/Badge'
import { EmptyState } from '@/components/StateViews'
import { useUiStore } from '@/store/useUiStore'
import { findTask } from '@/mock/tasks'
import { stepsOf } from '@/mock/steps'
import { regulationsOfStep } from '@/mock/regulations'
import { approvalLinesOf } from '@/mock/approvalLines'
import { goalsForTask } from '@/mock/goals'
import { subTasksOf } from '@/mock/subTasks'
import { TASK_STATUS, PROCESS_STEP, RISK_GRADE, APPROVAL_ROLE, PRIORITY_LEVEL, SECURITY_LEVEL, RISK_TOKEN } from '@/lib/codes'

// 상태색상정책: 단계 상태 완료·진행=초록, 대기=회색(라벨 텍스트로 구분 — 색 단독 금지 원칙)
const STEP_COLOR = { COMPLETED: 'var(--color-ok-base)', IN_PROGRESS: 'var(--color-ok-base)', PENDING: 'var(--color-neutral-border)' }
const COMMENTS = [
  { who: '강현우', when: '2일 전', text: '진척이 계획 대비 다소 지연되고 있습니다. 리소스 보강 검토 필요.' },
  { who: '조하은', when: '1일 전', text: '하위 업무 재분배로 일정 조정하겠습니다.' },
  { who: '서지우', when: '3시간 전', text: '데이터 수집 완료했습니다.' },
]

export default function WorkDetailDrawer({ taskId, open, onClose }) {
  const toast = useUiStore((s) => s.toast)
  const baseTask = taskId ? findTask(taskId) : null
  const [tab, setTab] = useState('workflow')

  useEffect(() => { setTab('workflow') }, [taskId])

  if (!baseTask) return null
  const task = baseTask
  const steps = stepsOf(task.projectId)
  const approvals = approvalLinesOf(task.taskId)
  const subtasks = subTasksOf(task.taskId)
  const goals = goalsForTask(task.taskId)
  const linkedRegs = steps.flatMap((s) => regulationsOfStep(s.stepId))

  const submitApproval = () => toast('결재가 상신되었습니다 (mock)', 'ok')

  const tabs = [
    { key: 'workflow', label: '워크플로우' },
    { key: 'regulations', label: '규정', count: linkedRegs.length },
    { key: 'eval', label: '평가' },
    { key: 'risk', label: '리스크' },
    { key: 'comments', label: '댓글', count: COMMENTS.length },
    { key: 'report', label: '보고서' },
  ]

  return (
    <Drawer open={open} onClose={onClose} title={task.taskNm} width="var(--narae-drawer-lg)"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={submitApproval} style={primaryBtn}>결재 상신</button>
        </div>
      }
    >
      {/* 상단 업무 개요 (고정) */}
      <div style={overviewBox}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-5)', marginBottom: 'var(--krds-space-6)' }}>
          <StatusBadge status={task.status} />
          <RiskBadge grade={task.riskGrade} />
          <span style={{ color: 'var(--color-text-assistive,#6b7280)', fontSize: 'var(--krds-body-small)' }}>
            {task.startAt} ~ {task.endAt}
          </span>
          <span style={{ marginLeft: 'auto', fontWeight: 'var(--krds-weight-bold)', color: 'var(--narae-accent)' }}>{task.progress}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--color-border-basic,#e5e7eb)', borderRadius: 4, marginBottom: 'var(--krds-space-7)' }}>
          {/* 게이지 채움 = 연동 상태(riskGrade) 파생 — 정책 §4 */}
          <div style={{ width: `${task.progress}%`, height: 8, background: RISK_TOKEN[task.riskGrade] ?? 'var(--color-neutral-base)', borderRadius: 4 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--krds-space-6)' }}>
          <OverviewItem label="담당자"><Badge variant="primary">{task.assigneeNm}</Badge></OverviewItem>
          <OverviewItem label="참여자">
            <span style={{ display: 'flex', gap: 4 }}>
              <Badge variant="neutral">서지우</Badge><Badge variant="neutral">이도현</Badge><Badge variant="neutral">+2</Badge>
            </span>
          </OverviewItem>
          <OverviewItem label="댓글">{COMMENTS.length}건</OverviewItem>
          <OverviewItem label="규정 연계">{linkedRegs.length}건</OverviewItem>
          <OverviewItem label="구분">{task.taskType === 'REGULAR' ? '정기' : '수시'} · 중요도 {PRIORITY_LEVEL[task.priorityLevel]}</OverviewItem>
          <OverviewItem label="보안등급">{SECURITY_LEVEL[task.securityLevel]}</OverviewItem>
          {goals.length > 0 && (
            <OverviewItem label="관련 목표" full><Badge variant="primary">목표</Badge> {goals[0].objective}</OverviewItem>
          )}
        </div>
      </div>

      <Tabs items={tabs} value={tab} onChange={setTab} />

      <div style={{ marginTop: 'var(--krds-space-8)' }}>
        {tab === 'workflow' && <Workflow steps={steps} approvals={approvals} subtasks={subtasks} />}
        {tab === 'regulations' && <Regulations items={linkedRegs} />}
        {tab === 'eval' && <Evaluation />}
        {tab === 'risk' && <Risk task={task} />}
        {tab === 'comments' && <Comments />}
        {tab === 'report' && <Report task={task} />}
      </div>
    </Drawer>
  )
}

function OverviewItem({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
      <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 'var(--krds-weight-medium)' }}>{children}</div>
    </div>
  )
}

// 워크플로우 = 진행 단계 + 결재 과정 (피드백: 결재 과정 포함)
function Workflow({ steps, approvals, subtasks }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-9)' }}>
      <div>
        <div style={flowLabel}>진행 단계</div>
        {steps.length === 0 ? <EmptyState title="단계 정보 없음" /> : (
          <div style={flowRow}>
            {steps.map((s, i) => (
              <div key={s.stepId} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span style={arrow}>→</span>}
                <div style={{ ...flowCard, borderColor: STEP_COLOR[s.status] }}>
                  <div style={{ fontWeight: 'var(--krds-weight-bold)' }}>{PROCESS_STEP[s.name]}</div>
                  <div style={metaSm}>{{ PENDING: '대기', IN_PROGRESS: '진행', COMPLETED: '완료' }[s.status]} · {s.ownerNm}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div style={flowLabel}>결재 과정</div>
        {approvals.length === 0 ? <EmptyState title="결재선 미설정" /> : (
          <div style={flowRow}>
            {approvals.map((a, i) => (
              <div key={a.lineId} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span style={arrow}>→</span>}
                <div style={{ ...flowCard, borderColor: 'var(--narae-accent)' }}>
                  <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--narae-accent)', fontWeight: 'var(--krds-weight-bold)' }}>{APPROVAL_ROLE[a.role] ?? a.role}</div>
                  <div style={{ fontWeight: 'var(--krds-weight-medium)' }}>{a.approverNm}</div>
                  <div style={metaSm}>{a.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {subtasks.length > 0 && (
        <div>
          <div style={flowLabel}>하위 업무</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-4)' }}>
            {subtasks.map((s) => (
              <div key={s.subTaskId} style={rowCard}>
                <StatusBadge status={s.status} /><span style={{ flex: 1 }}>{s.taskNm}</span>
                <span style={metaSm}>{s.due} · {s.assigneeNm}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Regulations({ items }) {
  if (items.length === 0) return <EmptyState icon="📄" title="연계 규정이 없습니다" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-4)' }}>
      {items.map((r) => (
        <div key={r.regulationId} style={rowCard}>
          <span aria-hidden>📄</span><span style={{ flex: 1 }}>{r.name}</span>
          <a href={r.url} style={{ color: 'var(--narae-accent)', fontSize: 'var(--krds-body-small)' }}>다운로드</a>
        </div>
      ))}
    </div>
  )
}

// 평가 탭 — 업무 평가(mock, 홈 '업무평가' 도구 흡수)
function Evaluation() {
  const items = [['성과', 82], ['역량', 76], ['협업', 88], ['적시성', 71]]
  return (
    <div>
      <p style={{ margin: '0 0 var(--krds-space-7)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>업무 평가 지표 (mock · 기획 확정 전 예시)</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)' }}>
        {items.map(([k, v]) => (
          <div key={k}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><span>{k}</span><b>{v}점</b></div>
            <div style={{ height: 7, background: 'var(--color-border-basic,#e5e7eb)', borderRadius: 4 }}>
              <div style={{ width: `${v}%`, height: 7, background: 'var(--narae-accent)', borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 리스크 탭 — AI 리스크 근거 (구 PM-01)
function Risk({ task }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-5)' }}>
        <RiskBadge grade={task.riskGrade} />
        <span style={{ color: 'var(--color-text-assistive,#6b7280)' }}>AI 위험 등급 · {RISK_GRADE[task.riskGrade]}</span>
      </div>
      <div style={riskBox}>
        마감 대비 진척률({task.progress}%)과 선후행 의존을 분석한 결과 <b>{RISK_GRADE[task.riskGrade]}</b> 등급으로 판정되었습니다.
        {task.riskGrade !== 'OK' && ' 담당자 부하 재분배 또는 일정 조정을 검토하세요.'} (mock)
      </div>
    </div>
  )
}

function Comments() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)' }}>
      {COMMENTS.map((c, i) => (
        <div key={i} style={rowCard}>
          <div><div><b>{c.who}</b> <span style={metaSm}>{c.when}</span></div><div style={{ marginTop: 2 }}>{c.text}</div></div>
        </div>
      ))}
    </div>
  )
}

// 보고서 탭 — 업무 진행 보고서 초안 (mock)
function Report({ task }) {
  return (
    <div>
      <p style={{ margin: '0 0 var(--krds-space-6)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>업무 진행 보고서 초안 (mock · 기획 확정 전 예시)</p>
      <div style={{ ...riskBox, background: 'var(--color-background-alternative,#f8f9fa)' }}>
        <h4 style={{ margin: '0 0 var(--krds-space-5)' }}>{task.taskNm} 진행 보고</h4>
        <ul style={{ margin: 0, paddingLeft: 'var(--krds-space-8)', lineHeight: 1.8 }}>
          <li>현재 진척률: {task.progress}% ({TASK_STATUS[task.status]})</li>
          <li>담당자: {task.assigneeNm} · 기간: {task.startAt} ~ {task.endAt}</li>
          <li>주요 이슈 및 다음 단계 계획 (요약)</li>
        </ul>
      </div>
    </div>
  )
}

const overviewBox = { padding: 'var(--krds-space-8)', borderRadius: 'var(--krds-radius-large)', background: 'var(--color-background-alternative,#f8f9fa)', marginBottom: 'var(--krds-space-8)' }
const flowLabel = { fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-5)' }
const flowRow = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--krds-space-2)' }
const arrow = { padding: '0 var(--krds-space-4)', color: 'var(--color-text-assistive,#cbd5e1)' }
const flowCard = { flexShrink: 0, minWidth: 118, padding: 'var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)', border: '1.5px solid var(--color-border-basic,#e5e7eb)', background: 'var(--color-background-white)', textAlign: 'center' }
const metaSm = { fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#9ca3af)' }
const rowCard = { display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)', padding: 'var(--krds-space-6) var(--krds-space-7)', border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)' }
const riskBox = { padding: 'var(--krds-space-7)', borderRadius: 'var(--krds-radius-medium)', background: 'var(--color-warn-bg)', border: '1px solid var(--color-warn-border)', fontSize: 'var(--krds-body-medium)', lineHeight: 1.6 }
const primaryBtn = { height: 'var(--krds-control-small)', padding: '0 var(--krds-space-10)', border: 'none', cursor: 'pointer', borderRadius: 'var(--krds-radius-medium)', background: 'var(--narae-accent)', color: '#fff', fontWeight: 'var(--krds-weight-bold)' }
