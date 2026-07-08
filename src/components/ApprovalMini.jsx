// ApprovalMini — 결재 프로세스 미니 요약 (✦ AI 1줄 + 미니 스텝 + 현재 단계 메타 + [결재 상세 보기]).
// v1.0(REF-23 INT-CM03-13~15) BiDrawer 내장 → v1.1(REF-24 D8) 홈 DATA 패널 '결재 현황'으로 이관하며 공용화.
// INT-CM03-15: 반려 시 사유 1줄(--color-risk-text) 노출 (compact 스텝은 사유 미표시라 별도 라인)
import AiSummaryBanner from '@/components/AiSummaryBanner'
import ApprovalTimeline from '@/components/ApprovalTimeline'
import { APPROVAL_STAGE } from '@/lib/approval'

export default function ApprovalMini({ lines, taskId, onDetail }) {
  const current = lines.find((l) => l.approvalStatus === 'APPROVING' || l.approvalStatus === 'REJECTED') ?? lines[0]
  const rejected = lines.find((l) => l.approvalStatus === 'REJECTED')
  return (
    <div data-testid="cm03-22" style={{
      padding: 'var(--krds-space-7)', borderRadius: 'var(--krds-radius-medium)',
      border: '1px solid var(--color-border-basic,#e5e7eb)', background: 'var(--color-background-white)',
      display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)',
    }}>
      <div style={{ fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)' }}>
        결재 현황
      </div>
      <AiSummaryBanner screen="cm03" contextType="task" contextId={taskId} />
      <ApprovalTimeline lines={lines} compact testid="cm03-22-steps" />
      <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>
        현재 {APPROVAL_STAGE[current.role] ?? current.role} · {current.approverNm} {current.title} · {current.elapsedDays}일차
        {current.delegation ? ` · ${current.delegation}` : ''}
      </div>
      {rejected?.rejectReason && (
        <div data-testid="cm03-24" style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-risk-text)', fontWeight: 'var(--krds-weight-medium)' }}>
          반려: {rejected.rejectReason} — {rejected.approverNm} {rejected.title}
        </div>
      )}
      {onDetail && (
        <button data-testid="cm03-23" onClick={() => onDetail(taskId)} style={detailBtn}>
          결재 상세 보기
        </button>
      )}
    </div>
  )
}

const detailBtn = {
  alignSelf: 'flex-start', height: 'var(--krds-control-xsmall)', padding: '0 var(--krds-space-7)',
  cursor: 'pointer', borderRadius: 'var(--krds-radius-medium)',
  border: '1px solid var(--narae-accent)', background: 'var(--color-background-white)',
  color: 'var(--narae-accent)', fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)',
}
