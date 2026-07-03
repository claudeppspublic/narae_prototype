// TASK_RELATION 시드 — 간트 선후행/협조 (화면설계서 p5 점선 연계).
// 스키마: fromTaskId, toTaskId, relationType(의존/협조)
// [확인필요] TASK_REL 방향성 규약 → 여기선 from=선행, to=후행 가정.
export const taskRelations = [
  { fromTaskId: 'T-001-03', toTaskId: 'T-001-01', relationType: '의존' }, // 예산관리시스템 → 예산안 기획
  { fromTaskId: 'T-001-01', toTaskId: 'T-001-02', relationType: '의존' }, // 예산안 기획 → 재정집행 점검
  { fromTaskId: 'T-002-03', toTaskId: 'T-002-02', relationType: '의존' }, // 디자인 시범 → 품질개선 종합
  { fromTaskId: 'T-003-01', toTaskId: 'T-003-03', relationType: '협조' }, // AI민원 → 정보자원 통합
  { fromTaskId: 'T-004-03', toTaskId: 'T-004-01', relationType: '의존' }, // 다자협력 → 국제회의
]

export const relationsFrom = (taskId) => taskRelations.filter((r) => r.fromTaskId === taskId)
export const relationsTo = (taskId) => taskRelations.filter((r) => r.toTaskId === taskId)
