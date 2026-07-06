// APPROVAL_LINE 시드 — WF-05 전결사항 (화면설계서 p10: 기안→리더→담당).
// 스키마: lineId, taskId, seq, role(DRAFT/LEADER/OWNER), approverNm, title, 전결, 대결
//   + REF-23 §4.1 확장: approvalStatus, decidedAt, dueAt, elapsedDays, rejectReason, delegation
// 미도달 라인은 approvalStatus=DRAFTING — §4.2가 4값 enum(DRAFTING/APPROVING/APPROVED/REJECTED)만 허용.
// 시연 케이스(§4.5): T-001-02=지연(검토 5일·기한초과) · T-001-03=정상 결재중 · T-001-05=반려(MTG-001 연계)
export const approvalLines = [
  // T-001-02 부서별 예산요구 취합 — 지연: 검토(LEADER) 단계 5일 정체·dueAt 경과
  { lineId: 'AL-001-1', taskId: 'T-001-02', seq: 1, role: 'DRAFT', approverNm: '손승현', title: '주무관', '전결': '업무 관급', '대결': false,
    approvalStatus: 'APPROVED', decidedAt: '2026-07-01', dueAt: '2026-07-01', elapsedDays: 1, rejectReason: null, delegation: '전결' },
  { lineId: 'AL-001-2', taskId: 'T-001-02', seq: 2, role: 'LEADER', approverNm: '허민준', title: '팀장', '전결': null, '대결': false,
    approvalStatus: 'APPROVING', decidedAt: null, dueAt: '2026-07-04', elapsedDays: 5, rejectReason: null, delegation: null },
  { lineId: 'AL-001-3', taskId: 'T-001-02', seq: 3, role: 'OWNER', approverNm: '안지우', title: '과장', '전결': null, '대결': false,
    approvalStatus: 'DRAFTING', decidedAt: null, dueAt: '2026-07-08', elapsedDays: 0, rejectReason: null, delegation: null },

  // T-001-03 재정위험 관리체계 검토 — 정상 결재중: 검토 단계 1일차·기한 내
  { lineId: 'AL-002-1', taskId: 'T-001-03', seq: 1, role: 'DRAFT', approverNm: '황도경', title: '주무관', '전결': '업무 관급', '대결': false,
    approvalStatus: 'APPROVED', decidedAt: '2026-07-03', dueAt: '2026-07-03', elapsedDays: 1, rejectReason: null, delegation: '전결' },
  { lineId: 'AL-002-2', taskId: 'T-001-03', seq: 2, role: 'LEADER', approverNm: '송지훈', title: '팀장', '전결': null, '대결': false,
    approvalStatus: 'APPROVING', decidedAt: null, dueAt: '2026-07-08', elapsedDays: 1, rejectReason: null, delegation: null },
  { lineId: 'AL-002-3', taskId: 'T-001-03', seq: 3, role: 'OWNER', approverNm: '정예은', title: '과장', '전결': null, '대결': false,
    approvalStatus: 'DRAFTING', decidedAt: null, dueAt: '2026-07-10', elapsedDays: 0, rejectReason: null, delegation: null },

  // T-001-05 국회 예산심의 대응자료 — 반려: 검토(LEADER) 단계에서 REJECTED (WF-001=MTG-001 연계 업무)
  { lineId: 'AL-003-1', taskId: 'T-001-05', seq: 1, role: 'DRAFT', approverNm: '손하준', title: '주무관', '전결': '업무 관급', '대결': false,
    approvalStatus: 'APPROVED', decidedAt: '2026-07-02', dueAt: '2026-07-02', elapsedDays: 1, rejectReason: null, delegation: '전결' },
  { lineId: 'AL-003-2', taskId: 'T-001-05', seq: 2, role: 'LEADER', approverNm: '남수빈', title: '팀장', '전결': null, '대결': false,
    approvalStatus: 'REJECTED', decidedAt: '2026-07-04', dueAt: '2026-07-05', elapsedDays: 2, rejectReason: '예산 산출 근거 미비', delegation: null },
  { lineId: 'AL-003-3', taskId: 'T-001-05', seq: 3, role: 'OWNER', approverNm: '전민재', title: '과장', '전결': null, '대결': true,
    approvalStatus: 'DRAFTING', decidedAt: null, dueAt: '2026-07-09', elapsedDays: 0, rejectReason: null, delegation: '대결' },

  // T-001-04 예산요구서 초안 작성 — 미상신(전 라인 DRAFTING): INT-WF02-12 상신 전이 시연용 (§4.5 분포)
  { lineId: 'AL-004-1', taskId: 'T-001-04', seq: 1, role: 'DRAFT', approverNm: '구한결', title: '주무관', '전결': null, '대결': false,
    approvalStatus: 'DRAFTING', decidedAt: null, dueAt: '2026-07-08', elapsedDays: 0, rejectReason: null, delegation: null },
  { lineId: 'AL-004-2', taskId: 'T-001-04', seq: 2, role: 'LEADER', approverNm: '손승현', title: '팀장', '전결': null, '대결': false,
    approvalStatus: 'DRAFTING', decidedAt: null, dueAt: '2026-07-10', elapsedDays: 0, rejectReason: null, delegation: null },
  { lineId: 'AL-004-3', taskId: 'T-001-04', seq: 3, role: 'OWNER', approverNm: '정가은', title: '과장', '전결': null, '대결': false,
    approvalStatus: 'DRAFTING', decidedAt: null, dueAt: '2026-07-13', elapsedDays: 0, rejectReason: null, delegation: null },

  // T-001-01 예산 편성지침 분석(COMPLETED) — 전 라인 APPROVED: 상신 버튼 비활성 확인용 (§4.5 분포)
  { lineId: 'AL-005-1', taskId: 'T-001-01', seq: 1, role: 'DRAFT', approverNm: '정가은', title: '과장', '전결': '업무 관급', '대결': false,
    approvalStatus: 'APPROVED', decidedAt: '2026-02-10', dueAt: '2026-02-10', elapsedDays: 1, rejectReason: null, delegation: '전결' },
  { lineId: 'AL-005-2', taskId: 'T-001-01', seq: 2, role: 'LEADER', approverNm: '손승현', title: '팀장', '전결': null, '대결': false,
    approvalStatus: 'APPROVED', decidedAt: '2026-02-11', dueAt: '2026-02-12', elapsedDays: 1, rejectReason: null, delegation: null },
  { lineId: 'AL-005-3', taskId: 'T-001-01', seq: 3, role: 'OWNER', approverNm: '안지우', title: '과장', '전결': null, '대결': false,
    approvalStatus: 'APPROVED', decidedAt: '2026-02-12', dueAt: '2026-02-13', elapsedDays: 1, rejectReason: null, delegation: null },
]

export const approvalLinesOf = (taskId) =>
  approvalLines.filter((a) => a.taskId === taskId).sort((x, y) => x.seq - y.seq)
