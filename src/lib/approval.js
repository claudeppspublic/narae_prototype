// 결재 판정 헬퍼 — REF-23 §4.2 전이·지연 규칙 (specs/SCR-WF-02 §4 INT-11~13).
// 순수 함수: APPROVAL_LINE(확장) 배열을 받아 상태/지연을 계산한다.

// 스테퍼 단계 라벨 — spec §2 '기안(DRAFT)→검토(LEADER)→승인(OWNER)' (codes.APPROVAL_ROLE '리더/담당'과 별개, 타임라인 전용)
export const APPROVAL_STAGE = { DRAFT: '기안', LEADER: '검토', OWNER: '승인' }

// 지연 판정 평균 기준(일) — mock. [CONFIRM: 평균 대비 +n일 기준값] (spec §12)
export const AVG_ELAPSED_DAYS = 2

// 업무 단위 결재상태 롤업: REJECTED > APPROVING > APPROVED(전 라인) > DRAFTING
export function taskApprovalStatus(lines) {
  if (!lines?.length) return 'DRAFTING'
  if (lines.some((l) => l.approvalStatus === 'REJECTED')) return 'REJECTED'
  if (lines.some((l) => l.approvalStatus === 'APPROVING')) return 'APPROVING'
  if (lines.every((l) => l.approvalStatus === 'APPROVED')) return 'APPROVED'
  return 'DRAFTING'
}

// 라인 지연 초과일: 진행중(APPROVING)이며 dueAt 경과 또는 elapsedDays>평균 → +n일 (spec INT-13)
export function lineDelayDays(line, today = new Date()) {
  if (line.approvalStatus !== 'APPROVING') return 0
  const byDue = line.dueAt ? Math.floor((today - new Date(line.dueAt)) / 86400000) : 0
  const byAvg = (line.elapsedDays ?? 0) - AVG_ELAPSED_DAYS
  return Math.max(byDue, byAvg, 0)
}

// 노드 결재 칩 색 — REF-22 §1 '칩(회색/노랑/초록/빨강)' · §4.5 지연→빨강 (INT-CM03-13·15)
// REJECTED·지연=risk > APPROVING=warn > 전부 APPROVED=ok > 그 외/결재선 없음=neutral
export function approvalToneOf(lines, today = new Date()) {
  if (!lines?.length) return 'neutral'
  if (lines.some((l) => l.approvalStatus === 'REJECTED' || lineDelayDays(l, today) > 0)) return 'risk'
  const status = taskApprovalStatus(lines)
  return { APPROVING: 'warn', APPROVED: 'ok' }[status] ?? 'neutral'
}

// 롤업(조직/과제 노드 칩): 빨강>노랑>초록>회색 (INT-CM03-13)
const TONE_RANK = { risk: 3, warn: 2, ok: 1, neutral: 0 }
export function worstTone(tones) {
  return tones.reduce((w, t) => (TONE_RANK[t] > TONE_RANK[w] ? t : w), 'neutral')
}

// 상신 전이(mock): DRAFTING --[상신]--> APPROVING — 기안(seq1) 완료, 검토(seq2) 진행 (spec INT-12 GWT)
export function applySubmit(lines, todayStr = '2026-07-06') {
  return lines.map((l) =>
    l.seq === 1 ? { ...l, approvalStatus: 'APPROVED', decidedAt: todayStr, elapsedDays: Math.max(l.elapsedDays, 1) }
    : l.seq === 2 ? { ...l, approvalStatus: 'APPROVING', elapsedDays: 0 }
    : l
  )
}
