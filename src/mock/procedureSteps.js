// PROCEDURE_STEP 시드 — WF-05 절차도 (화면설계서 p10 실측).
// 스키마: procId, taskId, seq, name, 담당(MAIN/SUB), 선응
export const procedureSteps = [
  { procId: 'PROC-005-1', taskId: 'T-005-01', seq: 1, name: '요청의 수정 기한', 담당: 'MAIN', 선응: '검증 미요청' },
  { procId: 'PROC-005-2', taskId: 'T-005-01', seq: 2, name: '담당자 매칭 / 자격', 담당: 'SUB', 선응: '자격 검증 보고' },
  { procId: 'PROC-005-3', taskId: 'T-005-01', seq: 3, name: '공개 및 증명', 담당: 'MAIN', 선응: '전자 문서' },
]

export const proceduresOf = (taskId) => procedureSteps.filter((p) => p.taskId === taskId)
