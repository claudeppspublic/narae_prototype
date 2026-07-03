// APPROVAL_LINE 시드 — WF-05 전결사항 (화면설계서 p10: 기안→리더→담당).
// 스키마: lineId, taskId, seq, role(DRAFT/LEADER/OWNER), approverNm, title, 전결, 대결
export const approvalLines = [
  { lineId: 'AL-005-1', taskId: 'T-005-01', seq: 1, role: 'DRAFT', approverNm: '이OO', title: '과장', 전결: '업무 관급', 대결: false },
  { lineId: 'AL-005-2', taskId: 'T-005-01', seq: 2, role: 'LEADER', approverNm: '이OO', title: '부장', 전결: '업무 관급', 대결: false },
  { lineId: 'AL-005-3', taskId: 'T-005-01', seq: 3, role: 'OWNER', approverNm: '박OO', title: '팀장', 전결: '업무 관급', 대결: false },
]

export const approvalLinesOf = (taskId) =>
  approvalLines.filter((a) => a.taskId === taskId).sort((x, y) => x.seq - y.seq)
