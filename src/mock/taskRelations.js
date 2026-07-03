// TASK_RELATION 시드 — 간트 선후행/협조 (화면설계서 p5 점선 연계).
// 스키마: fromTaskId, toTaskId, relationType(의존/협조)
// [확인필요] TASK_REL 방향성 규약 → 여기선 from=선행, to=후행 가정.
export const taskRelations = [
  { fromTaskId: 'T-001-01', toTaskId: 'T-001-02', relationType: '의존' },
  { fromTaskId: 'T-001-02', toTaskId: 'T-001-03', relationType: '의존' },
  { fromTaskId: 'T-001-03', toTaskId: 'T-001-04', relationType: '의존' },
]

export const relationsFrom = (taskId) => taskRelations.filter((r) => r.fromTaskId === taskId)
export const relationsTo = (taskId) => taskRelations.filter((r) => r.toTaskId === taskId)
