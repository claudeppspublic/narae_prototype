// PROCEDURE_STEP 시드 — WF-05 절차도 (화면설계서 p10 실측).
// 스키마: procId, taskId, seq, name, 담당(MAIN/SUB), 선응
export const procedureSteps = [
  { procId: 'PS-001-1', taskId: 'T-001-02', seq: 1, name: '요청의 수정 기한', '담당': 'MAIN', '선응': '검증 미요청' },
  { procId: 'PS-001-2', taskId: 'T-001-02', seq: 2, name: '담당자 매칭/자격', '담당': 'SUB', '선응': '자격 검증 보고' },
  { procId: 'PS-001-3', taskId: 'T-001-02', seq: 3, name: '공개 및 증명', '담당': 'MAIN', '선응': '전자 문서' },
  { procId: 'PS-002-1', taskId: 'T-001-03', seq: 1, name: '요청의 수정 기한', '담당': 'MAIN', '선응': '검증 미요청' },
  { procId: 'PS-002-2', taskId: 'T-001-03', seq: 2, name: '담당자 매칭/자격', '담당': 'SUB', '선응': '자격 검증 보고' },
  { procId: 'PS-002-3', taskId: 'T-001-03', seq: 3, name: '공개 및 증명', '담당': 'MAIN', '선응': '전자 문서' },
  { procId: 'PS-003-1', taskId: 'T-001-05', seq: 1, name: '요청의 수정 기한', '담당': 'MAIN', '선응': '검증 미요청' },
  { procId: 'PS-003-2', taskId: 'T-001-05', seq: 2, name: '담당자 매칭/자격', '담당': 'SUB', '선응': '자격 검증 보고' },
  { procId: 'PS-003-3', taskId: 'T-001-05', seq: 3, name: '공개 및 증명', '담당': 'MAIN', '선응': '전자 문서' },
]

export const proceduresOf = (taskId) => procedureSteps.filter((p) => p.taskId === taskId)
