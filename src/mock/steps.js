// STEP 시드 — 프로세스 단계(접수/검토/추진). 스키마 name enum = RECEIPT/REVIEW/PROMOTE.
// 스키마: stepId, projectId, name, status, startDate, endDate, ownerNm
const mk = (projectId, prefix, owner, dates) => [
  { stepId: `STEP-${prefix}-1`, projectId, name: 'RECEIPT', status: 'COMPLETED', startDate: dates[0], endDate: dates[1], ownerNm: owner },
  { stepId: `STEP-${prefix}-2`, projectId, name: 'REVIEW', status: 'IN_PROGRESS', startDate: dates[2], endDate: dates[3], ownerNm: owner },
  { stepId: `STEP-${prefix}-3`, projectId, name: 'PROMOTE', status: 'PENDING', startDate: dates[4], endDate: dates[5], ownerNm: owner },
]

export const steps = [
  { stepId: 'S-001-01', projectId: 'WF-001', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '정가은' },
  { stepId: 'S-001-02', projectId: 'WF-001', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '정가은' },
  { stepId: 'S-001-03', projectId: 'WF-001', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '정가은' },
  { stepId: 'S-002-01', projectId: 'WF-002', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '정가은' },
  { stepId: 'S-002-02', projectId: 'WF-002', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '정가은' },
  { stepId: 'S-002-03', projectId: 'WF-002', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '정가은' },
  { stepId: 'S-003-01', projectId: 'WF-003', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '정가은' },
  { stepId: 'S-003-02', projectId: 'WF-003', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '정가은' },
  { stepId: 'S-003-03', projectId: 'WF-003', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '정가은' },
  { stepId: 'S-004-01', projectId: 'WF-004', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '곽서윤' },
  { stepId: 'S-004-02', projectId: 'WF-004', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '곽서윤' },
  { stepId: 'S-004-03', projectId: 'WF-004', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '곽서윤' },
  { stepId: 'S-005-01', projectId: 'WF-005', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '곽서윤' },
  { stepId: 'S-005-02', projectId: 'WF-005', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '곽서윤' },
  { stepId: 'S-005-03', projectId: 'WF-005', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '곽서윤' },
  { stepId: 'S-006-01', projectId: 'WF-006', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '하현우' },
  { stepId: 'S-006-02', projectId: 'WF-006', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '하현우' },
  { stepId: 'S-006-03', projectId: 'WF-006', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '하현우' },
  { stepId: 'S-007-01', projectId: 'WF-007', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '하현우' },
  { stepId: 'S-007-02', projectId: 'WF-007', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '하현우' },
  { stepId: 'S-007-03', projectId: 'WF-007', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '하현우' },
  { stepId: 'S-008-01', projectId: 'WF-008', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '곽윤서' },
  { stepId: 'S-008-02', projectId: 'WF-008', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '곽윤서' },
  { stepId: 'S-008-03', projectId: 'WF-008', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '곽윤서' },
  { stepId: 'S-009-01', projectId: 'WF-009', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '곽윤서' },
  { stepId: 'S-009-02', projectId: 'WF-009', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '곽윤서' },
  { stepId: 'S-009-03', projectId: 'WF-009', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '곽윤서' },
  { stepId: 'S-010-01', projectId: 'WF-010', name: 'RECEIPT', status: 'COMPLETED', startDate: '2026-01-05', endDate: '2026-01-31', ownerNm: '황재영' },
  { stepId: 'S-010-02', projectId: 'WF-010', name: 'REVIEW', status: 'IN_PROGRESS', startDate: '2026-02-01', endDate: '2026-03-31', ownerNm: '황재영' },
  { stepId: 'S-010-03', projectId: 'WF-010', name: 'PROMOTE', status: 'PENDING', startDate: '2026-04-01', endDate: '2026-06-30', ownerNm: '황재영' },
]

export const stepsOf = (projectId) => steps.filter((s) => s.projectId === projectId)
export const findStep = (id) => steps.find((s) => s.stepId === id)
