// SCR-RB-03 — 결재·BI 반영 초안(8개 섹션) 공용 렌더러 (INT-RB03-04 · REF-22 §3.4).
// RB-03 페이지(편집 가능)와 WF-02 보고서 탭(compact·비편집)에서 공용.
// 섹션: 제목 → ✦ AI 요약 → 핵심 지표(biSnapshot) → 문제점(risk) → 원인 → 조치 제안 → 결재 이력 → 첨부
import { useState } from 'react'
import { ApprovalBadge } from '@/components/Badge'
import { aiSummaryFor } from '@/mock/aiSummary'
import { biSnapshot, biWidget } from '@/mock/biMetrics'
import { approvalLines } from '@/mock/approvalLines'
import { findTask } from '@/mock/tasks'
import { APPROVAL_STAGE } from '@/lib/approval'

// [CONFIRM: 첨부 항목 구성] — 파일명 리스트 mock 가정(spec §12)
const ATTACHMENTS = ['결재프로세스_분석_상세.xlsx', '지연결재_목록_주간.pdf']
// 조치 제안 — 초안 템플릿(시드 병합 전 기본 문구, spec 처리 명세 '초안 템플릿+시드 병합')
const ACTION_TEMPLATE = [
  '검토 단계 위임전결 범위 확대(과부하 41% 해소)',
  '고부하·고지연 담당자 3명 업무 재배치 검토',
  '기한 임박 결재 자동 알림(D-1) 활성화',
].join('\n')

export default function ReportDraft({ taskId, compact = false, onApprovalLink, onBiLink }) {
  const ctxTask = taskId ? findTask(taskId) : null
  const summary = aiSummaryFor('rb03', { contextType: 'report' })
  const b7 = biWidget('B7')
  const b2 = biWidget('B2')
  const [title, setTitle] = useState(ctxTask ? `'${ctxTask.taskNm}' 결재 지연 분석 보고` : '주간 결재 프로세스 분석 보고')
  const [causes, setCauses] = useState(`${b7.aiLine}. ${b2.aiLine}.`)
  const [actions, setActions] = useState(ACTION_TEMPLATE)

  // 결재 이력 — APPROVAL_LINE 확장 × TASK 조인 (taskId 컨텍스트면 해당 업무만)
  const history = approvalLines
    .filter((l) => !taskId || l.taskId === taskId)
    .map((l) => ({ ...l, taskNm: findTask(l.taskId)?.taskNm ?? l.taskId }))

  const metrics = [
    ['평균 리드타임', `${biSnapshot.leadTime}일`],
    ['병목', biSnapshot.bottleneck],
    ['반려율', biSnapshot.rejectRate],
    ['SLA 최저', biSnapshot.slaWorst],
  ]

  return (
    <div data-testid="rb03-04" style={{ display: 'flex', flexDirection: 'column', gap: compact ? 'var(--krds-space-7)' : 'var(--krds-space-8)' }}>
      {/* ① 제목 (편집 가능 — compact는 표시만) */}
      {compact ? (
        <h4 style={{ margin: 0, fontSize: 'var(--krds-body-medium)', fontWeight: 'var(--krds-weight-bold)' }}>{title}</h4>
      ) : (
        <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="보고서 제목"
          style={{ ...editInput, fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)' }} />
      )}

      {/* ② ✦ AI 요약 1줄 고정 */}
      {summary && (
        <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-neutral-text)', fontWeight: 'var(--krds-weight-medium)' }}>
          <span aria-hidden>✦</span> {summary.text}
        </div>
      )}

      {/* ③ 핵심 지표 (biSnapshot) */}
      <Section title="핵심 지표">
        <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 'var(--krds-space-4)' }}>
          {metrics.map(([k, v]) => (
            <div key={k} style={metricBox}>
              <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>{k}</div>
              <div style={{ fontWeight: 'var(--krds-weight-bold)' }}>{v}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ④ 문제점 — 빨강 (DEF-05: 문제 전용) */}
      <Section title="문제점">
        <ul style={{ margin: 0, paddingLeft: 'var(--krds-space-8)', lineHeight: 1.9 }}>
          {biSnapshot.problems.map((p) => (
            <li key={p} style={{ color: 'var(--color-risk-text)', fontWeight: 'var(--krds-weight-medium)' }}>{p}</li>
          ))}
        </ul>
      </Section>

      {/* ⑤ 원인 (편집 가능) */}
      <Section title="원인 분석">
        {compact ? <p style={pText}>{causes}</p> : (
          <textarea value={causes} onChange={(e) => setCauses(e.target.value)} rows={2} aria-label="원인 분석" style={editArea} />
        )}
      </Section>

      {/* ⑥ 조치 제안 (편집 가능) */}
      <Section title="조치 제안">
        {compact ? (
          <ul style={{ margin: 0, paddingLeft: 'var(--krds-space-8)', lineHeight: 1.9 }}>
            {actions.split('\n').map((a) => <li key={a}>{a}</li>)}
          </ul>
        ) : (
          <textarea value={actions} onChange={(e) => setActions(e.target.value)} rows={3} aria-label="조치 제안" style={editArea} />
        )}
      </Section>

      {/* ⑦ 결재 이력 — 상태색·역링크(근거 결재 점프) */}
      <Section title="결재 이력">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-3)' }}>
          {history.map((l) => (
            <button key={l.lineId} onClick={onApprovalLink ? () => onApprovalLink(l.taskId) : undefined}
              disabled={!onApprovalLink} title={onApprovalLink ? '근거 결재(WF-02) 보기' : undefined}
              style={{ ...historyRow, cursor: onApprovalLink ? 'pointer' : 'default' }}>
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                {l.taskNm}
              </span>
              <span style={{ color: 'var(--color-text-assistive,#6b7280)', fontSize: 'var(--narae-caption)' }}>
                {APPROVAL_STAGE[l.role] ?? l.role} · {l.approverNm}{l.decidedAt ? ` · ${l.decidedAt}` : ''}
              </span>
              <ApprovalBadge status={l.approvalStatus} />
            </button>
          ))}
        </div>
      </Section>

      {/* ⑧ 첨부 */}
      <Section title="첨부">
        <ul style={{ margin: 0, paddingLeft: 'var(--krds-space-8)', lineHeight: 1.9, fontSize: 'var(--krds-body-small)' }}>
          {ATTACHMENTS.map((f) => <li key={f}>📎 {f}</li>)}
        </ul>
      </Section>

      {/* 역링크 — 근거 BI */}
      {onBiLink && (
        <button onClick={onBiLink} style={biLinkBtn}>근거 BI 보기 →</button>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-4)' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

const pText = { margin: 0, lineHeight: 1.7, fontSize: 'var(--krds-body-small)' }
const editInput = {
  width: '100%', padding: 'var(--krds-space-5) var(--krds-space-6)',
  border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)',
  background: 'var(--color-background-white)', color: 'var(--color-text-basic)',
}
const editArea = { ...editInput, resize: 'vertical', lineHeight: 1.6, fontSize: 'var(--krds-body-small)', fontFamily: 'inherit' }
const metricBox = {
  padding: 'var(--krds-space-5) var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)',
  background: 'var(--color-background-alternative,#f8f9fa)',
}
const historyRow = {
  display: 'flex', alignItems: 'center', gap: 'var(--krds-space-5)',
  padding: 'var(--krds-space-4) var(--krds-space-5)', borderRadius: 'var(--krds-radius-small)',
  border: '1px solid var(--color-border-basic,#eef0f2)', background: 'var(--color-background-white)',
  fontSize: 'var(--krds-body-small)',
}
const biLinkBtn = {
  alignSelf: 'flex-start', padding: 'var(--krds-space-3) var(--krds-space-6)', cursor: 'pointer',
  borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--narae-accent)',
  background: 'var(--color-background-white)', color: 'var(--narae-accent)',
  fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)',
}
