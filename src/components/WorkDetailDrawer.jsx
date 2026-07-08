// SCR-WF-02 — 업무 상세 (v1.1 REF-24 D11: Drawer→중앙 팝업 전환). 간트/캘린더/테이블/홈 간트에서 업무 클릭 진입.
// 헤더 좌=개요·기본 정보+핵심 BI 그래프(WF02-15) · 헤더 우=소요시간·원가(사업비) · 탭 5=워크플로우/규정/리스크/보고서/모니터링(WF02-03)
// 워크플로우=프로세스 맵(WF02-04·16·17)+결재선 타임라인(INT-WF02-11)+AI 요약 배너 · 결재 상신(INT-WF02-12) · 모니터링=업무 컨텍스트 BI(WF02-18)
// [CONFIRM: 평가·댓글 콘텐츠 거취] v1.1 5탭에서 제외(D11) — 완전 폐지 vs 개요 이동 기획 확인 대기
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PopupShell from '@/components/PopupShell'
import Tabs from '@/components/Tabs'
import Badge, { StatusBadge, RiskBadge } from '@/components/Badge'
import { EmptyState } from '@/components/StateViews'
import AiSummaryBanner from '@/components/AiSummaryBanner'
import ApprovalTimeline from '@/components/ApprovalTimeline'
import ProcessMap from '@/components/ProcessMap'
import ReportDraft from '@/components/ReportDraft'
import B1 from '@/pages/bi/widgets/B1'
import B4 from '@/pages/bi/widgets/B4'
import B6 from '@/pages/bi/widgets/B6'
import B7 from '@/pages/bi/widgets/B7'
import { useUiStore } from '@/store/useUiStore'
import { useApprovalStore, effectiveLinesOf } from '@/store/useApprovalStore'
import { taskApprovalStatus, lineDelayDays } from '@/lib/approval'
import { findTask } from '@/mock/tasks'
import { findUser } from '@/mock/users'
import { stepsOf } from '@/mock/steps'
import { regulationsOfStep } from '@/mock/regulations'
import { goalsForTask } from '@/mock/goals'
import { subTasksOf } from '@/mock/subTasks'
import { biWidget } from '@/mock/biMetrics'
import { RISK_GRADE, PRIORITY_LEVEL, SECURITY_LEVEL, RISK_TOKEN } from '@/lib/codes'

export default function WorkDetailDrawer({ taskId, open, onClose }) {
  const toast = useUiStore((s) => s.toast)
  const navigate = useNavigate()
  const submitted = useApprovalStore((s) => s.submitted)
  const submit = useApprovalStore((s) => s.submit)
  const baseTask = taskId ? findTask(taskId) : null
  const [tab, setTab] = useState('workflow')

  useEffect(() => { setTab('workflow') }, [taskId])

  if (!baseTask) return null
  const task = baseTask
  const steps = stepsOf(task.projectId)
  // INT-WF02-12: 상신 오버레이 반영 결재선 (store 동기 → 타임라인·배지 즉시 갱신)
  const approvals = effectiveLinesOf(task.taskId, submitted)
  const subtasks = subTasksOf(task.taskId)
  const goals = goalsForTask(task.taskId)
  const linkedRegs = steps.flatMap((s) => regulationsOfStep(s.stepId))

  // INT-WF02-12 전이: DRAFTING→상신 가능 · APPROVING/APPROVED→비활성 · REJECTED→'재상신'(전이는 [CONFIRM])
  const approvalState = taskApprovalStatus(approvals)
  const submitApproval = () => {
    if (approvalState === 'DRAFTING' && approvals.length > 0) submit(task.taskId)
    toast(approvalState === 'REJECTED' ? '재상신되었습니다 (mock)' : '결재가 상신되었습니다 (mock)', 'ok')
  }
  const submitDisabled = approvalState === 'APPROVING' || approvalState === 'APPROVED'
  const submitLabel = approvalState === 'REJECTED' ? '재상신' : '결재 상신'

  // INT-WF02-14: [BI로 원인 분석] → RB-01 컨텍스트 이동(taskId·orgUnitId·period). 팝업 닫고 이동.
  const orgUnitId = findUser(task.assigneeId)?.orgUnitId ?? ''
  const goBi = () => { onClose?.(); navigate(`/monitoring/dashboard?taskId=${task.taskId}&orgUnitId=${orgUnitId}&period=weekly`) }
  // [보고서 작성] — RB-03 이동(초안 자동생성 연계 INT-RB03-04)
  const goReport = () => { onClose?.(); navigate(`/monitoring/report?taskId=${task.taskId}`) }

  // v1.1 D11: 탭 6→5 — 평가·댓글 제외([CONFIRM: 거취]), 모니터링 신설(WF02-18)
  const tabs = [
    { key: 'workflow', label: '워크플로우' },
    { key: 'regulations', label: '규정', count: linkedRegs.length },
    { key: 'risk', label: '리스크' },
    { key: 'report', label: '보고서' },
    { key: 'monitoring', label: '모니터링' },
  ]

  return (
    <PopupShell open={open} onClose={onClose} title={task.taskNm}
      header={<PopupHeader task={task} goals={goals} linkedRegs={linkedRegs} />}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button data-testid="wf02-12" onClick={submitApproval} disabled={submitDisabled}
            title={submitDisabled ? '결재가 이미 진행·완료된 업무입니다' : undefined}
            style={{ ...primaryBtn, ...(submitDisabled ? disabledBtn : {}) }}>
            {submitLabel}
          </button>
        </div>
      }
    >
      <Tabs items={tabs} value={tab} onChange={setTab} />

      <div style={{ marginTop: 'var(--krds-space-8)' }}>
        {tab === 'workflow' && (
          <>
            {/* INT-WF02-11 ① 상단 AI 요약 배너 — 컨텍스트 문장 없으면 wf02 기본, 그것도 없으면 숨김 */}
            <AiSummaryBanner screen="wf02" contextType="task" contextId={task.taskId}
              style={{ marginBottom: 'var(--krds-space-7)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-9)' }}>
              {/* v1.1 WF02-04: 프로세스 맵(일/주/월·타부서 연계·회의/규정 연결성) — 구 진행단계·프로세스 간트 통합 */}
              <ProcessMap task={task} onClose={onClose} />
              <div>
                {/* INT-WF02-11 ③ 결재선 타임라인 · INT-WF02-13 지연 판정(dueAt 경과/평균 초과→risk·"+n일") */}
                <div style={flowLabel}>결재 과정</div>
                <ApprovalTimeline lines={approvals} />
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
            {/* INT-WF02-13 ④ 하단 CTA(문제 시 risk 강조) · INT-WF02-14 RB-01 컨텍스트 이동 */}
            <CtaBar approvals={approvals} onBi={goBi} onReport={goReport} />
          </>
        )}
        {tab === 'regulations' && <Regulations items={linkedRegs} />}
        {tab === 'risk' && <Risk task={task} />}
        {tab === 'report' && <Report task={task} />}
        {tab === 'monitoring' && <Monitoring task={task} />}
      </div>
    </PopupShell>
  )
}

// v1.1 WF02-15 — 팝업 헤더: 좌=개요·기본 정보+핵심 BI 그래프 · 우=소요시간·원가(사업비)
function PopupHeader({ task, goals, linkedRegs }) {
  const trend = biWidget('B6') // 목표 BI 중 핵심 그래프(그럴싸한 그래프) — 결재 적체 추세 스파크라인
  return (
    <div data-testid="wf02-15" style={{ display: 'flex', gap: 'var(--krds-space-9)', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-4)' }}>
          {task.taskNm}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--krds-space-5)', marginBottom: 'var(--krds-space-5)' }}>
          <StatusBadge status={task.status} />
          <RiskBadge grade={task.riskGrade} />
          <span style={metaSm}>{task.startAt} ~ {task.endAt}</span>
          <span style={metaSm}>담당 <b style={{ color: 'var(--color-text-basic)' }}>{task.assigneeNm}</b></span>
          <span style={metaSm}>{task.taskType === 'REGULAR' ? '정기' : '수시'} · 중요도 {PRIORITY_LEVEL[task.priorityLevel]} · 보안 {SECURITY_LEVEL[task.securityLevel]}</span>
          <span style={metaSm}>규정 연계 {linkedRegs.length}건</span>
          {goals.length > 0 && <Badge variant="primary">목표 · {goals[0].objective}</Badge>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)' }}>
          {/* 진행률 게이지 — 채움 색=riskGrade 파생(정책 §4) */}
          <div style={{ flex: 1, maxWidth: '18rem', height: 8, background: 'var(--color-border-basic,#e5e7eb)', borderRadius: 4 }}>
            <div style={{ width: `${task.progress}%`, height: 8, background: RISK_TOKEN[task.riskGrade] ?? 'var(--color-neutral-base)', borderRadius: 4 }} />
          </div>
          <b style={{ color: 'var(--narae-accent)' }}>{task.progress}%</b>
          {/* 핵심 BI 그래프 — 목표 BI 스파크라인(mock) */}
          {trend && <Sparkline series={trend.series} label={trend.title} />}
        </div>
      </div>
      {/* 헤더 우측 — 소요시간·원가. [CONFIRM: 소요시간=계획기간 파생 · 원가 산정 기준] 값 없음→'—' */}
      <div style={kpiBox}>
        <HeaderKpi label="업무 소요시간" value={task.durationDays != null ? `${task.durationDays}일` : '—'} />
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--color-border-basic,#e5e7eb)' }} aria-hidden />
        <HeaderKpi label="원가(사업비)" value={task.costBudget != null ? `₩${task.costBudget.toLocaleString()}` : '—'} />
      </div>
    </div>
  )
}

function HeaderKpi({ label, value }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>{label}</div>
      <div style={{ fontSize: 'var(--krds-body-large)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-basic)' }}>{value}</div>
    </div>
  )
}

// 미니 스파크라인 (SVG) — 헤더 핵심 BI 그래프
function Sparkline({ series, label }) {
  const vals = series.map((s) => s.value)
  const min = Math.min(...vals), max = Math.max(...vals)
  const W = 96, H = 28
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * W},${H - ((v - min) / (max - min || 1)) * (H - 4) - 2}`).join(' ')
  return (
    <span title={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <svg width={W} height={H} aria-label={`핵심 BI: ${label}`} role="img">
        <polyline points={pts} fill="none" stroke="var(--narae-accent)" strokeWidth="2" />
      </svg>
      <span style={metaSm}>{label}</span>
    </span>
  )
}

// 워크플로우 탭 하단 CTA — INT-WF02-13(강조)·14(이동). 문제(지연/반려) 존재 시 BI CTA risk 강조.
function CtaBar({ approvals, onBi, onReport }) {
  const hasProblem = approvals.some((l) => l.approvalStatus === 'REJECTED' || lineDelayDays(l) > 0)
  return (
    <div data-testid="wf02-13" style={{ display: 'flex', gap: 'var(--krds-space-5)', marginTop: 'var(--krds-space-8)', paddingTop: 'var(--krds-space-6)', borderTop: '1px solid var(--color-border-basic,#eef0f2)' }}>
      <button data-testid="wf02-14" onClick={onBi}
        style={{ ...ctaBtn, ...(hasProblem ? ctaRisk : {}) }}>
        {hasProblem ? '⚠ BI로 원인 분석' : 'BI로 원인 분석'}
      </button>
      <button onClick={onReport} style={ctaBtn}>보고서 작성</button>
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

// 보고서 탭 — 결재·BI 반영 초안 공용 로직 적용 (INT-RB03-04 · REF-23 Phase 4)
function Report({ task }) {
  return (
    <div>
      <p style={{ margin: '0 0 var(--krds-space-6)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>
        결재·BI 반영 초안 (mock 자동 생성 · 편집은 보고서 화면에서)
      </p>
      <ReportDraft taskId={task.taskId} compact />
    </div>
  )
}

// v1.1 WF02-18 — 모니터링 탭: 해당 업무 컨텍스트 BI 상세(RB-01 B위젯 재사용·taskId 스코프, D11)
function Monitoring({ task }) {
  return (
    <div data-testid="wf02-18">
      <AiSummaryBanner screen="rb01" contextType="task" contextId={task.taskId}
        style={{ marginBottom: 'var(--krds-space-7)' }} />
      <p style={{ margin: '0 0 var(--krds-space-6)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>
        '{task.taskNm}' 컨텍스트 BI 상세 — RB-01 위젯 재사용 (mock·시연용, taskId 스코프)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: 'var(--krds-space-7)' }}>
        <B1 /><B4 /><B6 /><B7 />
      </div>
    </div>
  )
}

const flowLabel = { fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-5)' }
const metaSm = { fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#9ca3af)' }
const rowCard = { display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)', padding: 'var(--krds-space-6) var(--krds-space-7)', border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)' }
const riskBox = { padding: 'var(--krds-space-7)', borderRadius: 'var(--krds-radius-medium)', background: 'var(--color-warn-bg)', border: '1px solid var(--color-warn-border)', fontSize: 'var(--krds-body-medium)', lineHeight: 1.6 }
const kpiBox = { display: 'flex', gap: 'var(--krds-space-8)', alignItems: 'center', padding: 'var(--krds-space-6) var(--krds-space-8)', borderRadius: 'var(--krds-radius-large)', background: 'var(--color-background-alternative,#f8f9fa)', flexShrink: 0 }
const primaryBtn = { height: 'var(--krds-control-small)', padding: '0 var(--krds-space-10)', border: 'none', cursor: 'pointer', borderRadius: 'var(--krds-radius-medium)', background: 'var(--narae-accent)', color: '#fff', fontWeight: 'var(--krds-weight-bold)' }
const disabledBtn = { background: 'var(--color-neutral-bg)', color: 'var(--color-neutral-text)', cursor: 'not-allowed' }
// CTA 버튼 — 기본(neutral 외곽)·문제 시 risk 강조(INT-WF02-13)
const ctaBtn = {
  height: 'var(--krds-control-small)', padding: '0 var(--krds-space-8)', cursor: 'pointer',
  borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic,#e5e7eb)',
  background: 'var(--color-background-white)', color: 'var(--color-text-basic)',
  fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)',
}
const ctaRisk = {
  border: '1.5px solid var(--color-risk-border)', background: 'var(--color-risk-bg)', color: 'var(--color-risk-text)',
}
