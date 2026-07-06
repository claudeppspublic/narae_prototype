// 결재선 타임라인(스테퍼) — INT-WF02-11·13 (specs/SCR-WF-02 §2·§4).
// 기안(DRAFT)→검토(LEADER)→승인(OWNER). 상태색: 완료=ok · 현재=warn(틴트) · 대기=neutral · 반려/지연=risk.
// 지연 "+n일" risk 뱃지(INT-13에서 판정 활성) · 반려 시 rejectReason 1줄 · 전결/대결 뱃지.
// compact: CM-03 홈 결재 미니 스텝용(Phase 2).
import { EmptyState } from '@/components/StateViews'
import { APPROVAL_STATUS } from '@/lib/codes'
import { APPROVAL_STAGE, lineDelayDays } from '@/lib/approval'

// 노드 상태 → 4단계 토큰 세트 (DEF-05: 노랑=틴트, 솔리드 금지)
const NODE_TONE = {
  APPROVED: { border: 'var(--color-ok-border)', bg: 'var(--color-ok-bg)', text: 'var(--color-ok-text)' },
  APPROVING: { border: 'var(--color-warn-border)', bg: 'var(--color-warn-bg)', text: 'var(--color-warn-text)' },
  DRAFTING: { border: 'var(--color-neutral-border)', bg: 'var(--color-neutral-bg)', text: 'var(--color-neutral-text)' },
  REJECTED: { border: 'var(--color-risk-border)', bg: 'var(--color-risk-bg)', text: 'var(--color-risk-text)' },
}
const RISK_TONE = NODE_TONE.REJECTED

export default function ApprovalTimeline({ lines, compact = false, delayCheck = true, testid = 'wf02-11' }) {
  if (!lines?.length) return compact ? null : <EmptyState icon="🖋" title="결재선이 없습니다" />
  return (
    <div data-testid={testid} style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', gap: 'var(--krds-space-2)' }}>
      {lines.map((l, i) => {
        const delay = delayCheck ? lineDelayDays(l) : 0
        const rejected = l.approvalStatus === 'REJECTED'
        // 반려 우선, 다음 지연(risk), 그 외 상태색 (spec INT-13 엣지)
        const tone = rejected ? NODE_TONE.REJECTED : delay > 0 ? RISK_TONE : (NODE_TONE[l.approvalStatus] ?? NODE_TONE.DRAFTING)
        return (
          <div key={l.lineId} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <span aria-hidden style={{ padding: '0 var(--krds-space-3)', color: 'var(--color-neutral-border)' }}>→</span>}
            <div style={{
              minWidth: compact ? 92 : 132, padding: compact ? 'var(--krds-space-4)' : 'var(--krds-space-6)',
              borderRadius: 'var(--krds-radius-medium)', textAlign: 'center',
              border: `1.5px solid ${tone.border}`, background: tone.bg,
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 'var(--narae-caption)', fontWeight: 'var(--krds-weight-bold)', color: tone.text }}>
                  {APPROVAL_STAGE[l.role] ?? l.role}
                </span>
                {/* 스테퍼 상태 표기(spec §4 INT-11: 완료/현재/대기/반려) — 미도달(DRAFTING) 라인은 '대기' */}
                <span style={{ fontSize: 'var(--narae-caption)', color: tone.text }}>
                  {l.approvalStatus === 'DRAFTING' ? '대기' : APPROVAL_STATUS[l.approvalStatus]}
                </span>
                {delay > 0 && !rejected && (
                  <span title={`기한(${l.dueAt}) 초과 — 경과 ${l.elapsedDays}일`} style={delayBadge}>+{delay}일</span>
                )}
              </div>
              <div style={{ fontWeight: 'var(--krds-weight-medium)', marginTop: 2 }}>{l.approverNm}</div>
              {!compact && (
                <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)', marginTop: 2 }}>
                  {l.title} · {l.elapsedDays}일차{l.dueAt ? ` · 기한 ${l.dueAt.slice(5)}` : ''}
                  {l.delegation && <span style={delegBadge}> {l.delegation}</span>}
                </div>
              )}
              {!compact && rejected && l.rejectReason && (
                <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-risk-text)', marginTop: 3, fontWeight: 'var(--krds-weight-medium)' }}>
                  반려: {l.rejectReason}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const delayBadge = {
  padding: '0 5px', borderRadius: 'var(--krds-radius-pill)', fontSize: 'var(--narae-caption)',
  background: 'var(--color-risk-base)', color: 'var(--color-background-white,#fff)', fontWeight: 'var(--krds-weight-bold)',
}
const delegBadge = {
  padding: '0 4px', borderRadius: 3, fontSize: 'var(--narae-caption)',
  background: 'var(--color-neutral-bg)', border: '1px solid var(--color-neutral-border)', color: 'var(--color-neutral-text)',
}
