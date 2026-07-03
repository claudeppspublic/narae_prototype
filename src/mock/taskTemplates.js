// TASK_TEMPLATE 시드 — WF-04 부서정기 과제 자동생성 템플릿.
// 스키마: templateId, projectType(DEPT_REGULAR), taskSet[]
export const taskTemplates = [
  {
    templateId: 'TT-BUDGET',
    projectType: 'DEPT_REGULAR',
    orgUnitId: 'ORG-01-01-01',
    taskSet: [
      { taskNm: '예산 편성 지침 수립', taskType: 'REGULAR', priorityLevel: 'HIGH' },
      { taskNm: '분기별 재정집행 점검', taskType: 'REGULAR', priorityLevel: 'NORMAL' },
      { taskNm: '예산 결산 보고서 작성', taskType: 'REGULAR', priorityLevel: 'NORMAL' },
    ],
  },
  {
    templateId: 'TT-SATISFACTION',
    projectType: 'DEPT_REGULAR',
    orgUnitId: 'ORG-01-01-02',
    taskSet: [
      { taskNm: '만족도 설문 설계', taskType: 'REGULAR', priorityLevel: 'NORMAL' },
      { taskNm: '데이터 수집·분석', taskType: 'REGULAR', priorityLevel: 'HIGH' },
      { taskNm: '개선안 도출·보고', taskType: 'REGULAR', priorityLevel: 'NORMAL' },
    ],
  },
]

export const templatesOf = (orgUnitId) => taskTemplates.filter((t) => t.orgUnitId === orgUnitId)
