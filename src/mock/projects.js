// PROJECT 시드 — 과제(업무의 상위). 담당관별 대표 과제.
// 스키마: projectId, projectNm, status, orgUnitId, ownerUserId, ownerUserNm,
//         startAt, endAt, progress, projectType, planDocId
export const projects = [
  {
    projectId: 'PRJ-2026-001',
    projectNm: '2026년도 예산 편성·집행 관리',
    status: 'IN_PROGRESS',
    orgUnitId: 'ORG-01-01-01',
    ownerUserId: 'U20260001',
    ownerUserNm: '김민준',
    startAt: '2026-01-02',
    endAt: '2026-06-30',
    progress: 42,
    projectType: 'DEPT_REGULAR',
    planDocId: 'DOC-PLAN-001',
  },
  {
    projectId: 'PRJ-2026-002',
    projectNm: '행정서비스 혁신 종합계획',
    status: 'IN_PROGRESS',
    orgUnitId: 'ORG-01-01-02',
    ownerUserId: 'U20260011',
    ownerUserNm: '강현우',
    startAt: '2026-01-06',
    endAt: '2026-05-29',
    progress: 55,
    projectType: 'GENERAL',
    planDocId: 'DOC-PLAN-002',
  },
  {
    projectId: 'PRJ-2026-003',
    projectNm: '정보시스템 고도화 사업',
    status: 'IN_PROGRESS',
    orgUnitId: 'ORG-01-01-03',
    ownerUserId: 'U20260021',
    ownerUserNm: '이준혁',
    startAt: '2026-01-05',
    endAt: '2026-06-15',
    progress: 38,
    projectType: 'GENERAL',
    planDocId: 'DOC-PLAN-003',
  },
  {
    projectId: 'PRJ-2026-004',
    projectNm: '국제협력 추진 사업',
    status: 'IN_PROGRESS',
    orgUnitId: 'ORG-01-02-01',
    ownerUserId: 'U20260031',
    ownerUserNm: '문가영',
    startAt: '2026-02-01',
    endAt: '2026-07-31',
    progress: 30,
    projectType: 'GENERAL',
    planDocId: null,
  },
  {
    projectId: 'PRJ-2026-005',
    projectNm: '민원서비스 품질 관리',
    status: 'COMPLETED',
    orgUnitId: 'ORG-01-01-02',
    ownerUserId: 'U20260012',
    ownerUserNm: '조하은',
    startAt: '2024-09-01',
    endAt: '2025-01-31',
    progress: 100,
    projectType: 'DEPT_REGULAR',
    planDocId: 'DOC-PLAN-005',
  },
  {
    projectId: 'PRJ-2026-006',
    projectNm: '운영지원 정기 업무',
    status: 'IN_PROGRESS',
    orgUnitId: 'ORG-02-01',
    ownerUserId: 'U20260041',
    ownerUserNm: '윤태오',
    startAt: '2026-01-02',
    endAt: '2026-12-31',
    progress: 40,
    projectType: 'DEPT_REGULAR',
    planDocId: null,
  },
]

export const findProject = (id) => projects.find((p) => p.projectId === id)
export const projectsOf = (orgUnitId) => projects.filter((p) => p.orgUnitId === orgUnitId)

// 조직 및 모든 하위 조직의 연계 과제 (WS-01 연계과제 탭)
import { childrenOf } from './orgUnits'
export const projectsInOrg = (orgUnitId) => {
  const ids = new Set()
  const walk = (id) => { ids.add(id); childrenOf(id).forEach((c) => walk(c.orgUnitId)) }
  walk(orgUnitId)
  return projects.filter((p) => ids.has(p.orgUnitId))
}
