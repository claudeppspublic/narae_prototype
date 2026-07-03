// TASK_TEMPLATE 시드 — WF-04 부서정기 과제 자동생성 템플릿.
// 스키마: templateId, projectType(DEPT_REGULAR), taskSet[]
export const taskTemplates = [
  {
    templateId: 'TT-001',
    projectType: 'DEPT_REGULAR',
    orgUnitId: null,
    name: '월간 행정업무 세트',
    taskSet: [
      { taskNm: '월간 업무보고 작성', taskType: 'REGULAR', priorityLevel: 'NORMAL' },
      { taskNm: '부서 회의록 정리', taskType: 'REGULAR', priorityLevel: 'NORMAL' },
      { taskNm: '정기 통계 갱신', taskType: 'REGULAR', priorityLevel: 'NORMAL' },
    ],
  },
  {
    templateId: 'TT-002',
    projectType: 'DEPT_REGULAR',
    orgUnitId: null,
    name: '분기 성과점검 세트',
    taskSet: [
      { taskNm: '분기 성과지표 점검', taskType: 'REGULAR', priorityLevel: 'NORMAL' },
      { taskNm: '관리과제 진도 점검', taskType: 'REGULAR', priorityLevel: 'NORMAL' },
    ],
  },
]

export const templatesOf = (orgUnitId) => taskTemplates.filter((t) => t.orgUnitId === orgUnitId)
