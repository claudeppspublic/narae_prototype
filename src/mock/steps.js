// STEP 시드 — 프로세스 단계(접수/검토/추진). 스키마 name enum = RECEIPT/REVIEW/PROMOTE.
// 스키마: stepId, projectId, name, status, startDate, endDate, ownerNm
const mk = (projectId, prefix, owner, dates) => [
  { stepId: `STEP-${prefix}-1`, projectId, name: 'RECEIPT', status: 'COMPLETED', startDate: dates[0], endDate: dates[1], ownerNm: owner },
  { stepId: `STEP-${prefix}-2`, projectId, name: 'REVIEW', status: 'IN_PROGRESS', startDate: dates[2], endDate: dates[3], ownerNm: owner },
  { stepId: `STEP-${prefix}-3`, projectId, name: 'PROMOTE', status: 'PENDING', startDate: dates[4], endDate: dates[5], ownerNm: owner },
]

export const steps = [
  ...mk('PRJ-2026-001', '001', '김민준', ['2026-01-02', '2026-01-20', '2026-01-21', '2026-03-31', '2026-04-01', '2026-06-30']),
  ...mk('PRJ-2026-002', '002', '강현우', ['2026-01-06', '2026-01-31', '2026-02-01', '2026-04-15', '2026-04-16', '2026-05-29']),
  ...mk('PRJ-2026-003', '003', '이준혁', ['2026-01-05', '2026-01-31', '2026-02-01', '2026-04-30', '2026-05-01', '2026-06-15']),
  ...mk('PRJ-2026-004', '004', '문가영', ['2026-02-01', '2026-02-28', '2026-03-01', '2026-05-31', '2026-06-01', '2026-07-31']),
  ...mk('PRJ-2026-005', '005', '조하은', ['2024-11-26', '2024-12-10', '2024-12-11', '2025-01-15', '2025-01-16', '2025-01-31']),
  ...mk('PRJ-2026-006', '006', '윤태오', ['2026-01-02', '2026-02-15', '2026-02-16', '2026-06-30', '2026-07-01', '2026-12-31']),
]

export const stepsOf = (projectId) => steps.filter((s) => s.projectId === projectId)
export const findStep = (id) => steps.find((s) => s.stepId === id)
