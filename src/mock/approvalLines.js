// APPROVAL_LINE 시드 — WF-05 전결사항 (화면설계서 p10: 기안→리더→담당).
// 스키마: lineId, taskId, seq, role(DRAFT/LEADER/OWNER), approverNm, title, 전결, 대결
export const approvalLines = [
  { lineId: 'AL-001-1', taskId: 'T-001-02', seq: 1, role: 'DRAFT', approverNm: '손승현', title: '주무관', '전결': '업무 관급', '대결': false },
  { lineId: 'AL-001-2', taskId: 'T-001-02', seq: 2, role: 'LEADER', approverNm: '허민준', title: '팀장', '전결': null, '대결': false },
  { lineId: 'AL-001-3', taskId: 'T-001-02', seq: 3, role: 'OWNER', approverNm: '안지우', title: '과장', '전결': null, '대결': false },
  { lineId: 'AL-002-1', taskId: 'T-001-03', seq: 1, role: 'DRAFT', approverNm: '황도경', title: '주무관', '전결': '업무 관급', '대결': false },
  { lineId: 'AL-002-2', taskId: 'T-001-03', seq: 2, role: 'LEADER', approverNm: '송지훈', title: '팀장', '전결': null, '대결': false },
  { lineId: 'AL-002-3', taskId: 'T-001-03', seq: 3, role: 'OWNER', approverNm: '정예은', title: '과장', '전결': null, '대결': false },
  { lineId: 'AL-003-1', taskId: 'T-001-05', seq: 1, role: 'DRAFT', approverNm: '손하준', title: '주무관', '전결': '업무 관급', '대결': false },
  { lineId: 'AL-003-2', taskId: 'T-001-05', seq: 2, role: 'LEADER', approverNm: '남수빈', title: '팀장', '전결': null, '대결': false },
  { lineId: 'AL-003-3', taskId: 'T-001-05', seq: 3, role: 'OWNER', approverNm: '전민재', title: '과장', '전결': null, '대결': true },
]

export const approvalLinesOf = (taskId) =>
  approvalLines.filter((a) => a.taskId === taskId).sort((x, y) => x.seq - y.seq)
