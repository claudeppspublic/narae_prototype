// PROJECT 시드 — 과제(업무의 상위). 담당관별 대표 과제.
// 스키마: projectId, projectNm, status, orgUnitId, ownerUserId, ownerUserNm,
//         startAt, endAt, progress, projectType, planDocId
export const projects = [
  { projectId: 'WF-001', projectNm: '2026년도 예산요구서 작성·제출', status: 'IN_PROGRESS', orgUnitId: 'MOI-DPI-02', ownerUserId: 'U2026-026', ownerUserNm: '정가은', startAt: '2026-01-05', endAt: '2026-06-30', progress: 39, projectType: 'GENERAL', planDocId: 'DOC-PLAN-001' },
  { projectId: 'WF-002', projectNm: '2026 예산편성지침 시달 대응', status: 'IN_PROGRESS', orgUnitId: 'MOI-DPI-02', ownerUserId: 'U2026-026', ownerUserNm: '정가은', startAt: '2026-01-05', endAt: '2026-06-30', progress: 62, projectType: 'GENERAL', planDocId: 'DOC-PLAN-002' },
  { projectId: 'WF-003', projectNm: '중기재정운용계획 수립', status: 'COMPLETED', orgUnitId: 'MOI-DPI-02', ownerUserId: 'U2026-026', ownerUserNm: '정가은', startAt: '2026-01-05', endAt: '2026-06-30', progress: 100, projectType: 'DEPT_REGULAR', planDocId: null },
  { projectId: 'WF-004', projectNm: '부내 미래전략 수립·총괄', status: 'ON_HOLD', orgUnitId: 'MOI-DPI-03', ownerUserId: 'U2026-033', ownerUserNm: '곽서윤', startAt: '2026-01-05', endAt: '2026-06-30', progress: 26, projectType: 'GENERAL', planDocId: 'DOC-PLAN-004' },
  { projectId: 'WF-005', projectNm: '청년정책 추진계획', status: 'DELAYED', orgUnitId: 'MOI-DPI-03', ownerUserId: 'U2026-033', ownerUserNm: '곽서윤', startAt: '2026-01-05', endAt: '2026-06-30', progress: 24, projectType: 'GENERAL', planDocId: 'DOC-PLAN-005' },
  { projectId: 'WF-006', projectNm: '2026 성과관리 시행계획 수립', status: 'PENDING', orgUnitId: 'MOI-DPI-04', ownerUserId: 'U2026-039', ownerUserNm: '하현우', startAt: '2026-01-05', endAt: '2026-06-30', progress: 0, projectType: 'GENERAL', planDocId: 'DOC-PLAN-006' },
  { projectId: 'WF-007', projectNm: '정부업무평가 자체평가 대응', status: 'IN_PROGRESS', orgUnitId: 'MOI-DPI-04', ownerUserId: 'U2026-039', ownerUserNm: '하현우', startAt: '2026-01-05', endAt: '2026-06-30', progress: 49, projectType: 'DEPT_REGULAR', planDocId: null },
  { projectId: 'WF-008', projectNm: '소관 법령 제·개정 관리', status: 'IN_PROGRESS', orgUnitId: 'MOI-DPI-05', ownerUserId: 'U2026-046', ownerUserNm: '곽윤서', startAt: '2026-01-05', endAt: '2026-06-30', progress: 55, projectType: 'GENERAL', planDocId: 'DOC-PLAN-008' },
  { projectId: 'WF-009', projectNm: '규제개혁 과제 관리', status: 'IN_PROGRESS', orgUnitId: 'MOI-DPI-05', ownerUserId: 'U2026-046', ownerUserNm: '곽윤서', startAt: '2026-01-05', endAt: '2026-06-30', progress: 54, projectType: 'GENERAL', planDocId: 'DOC-PLAN-009' },
  { projectId: 'WF-010', projectNm: '행정정보시스템 운영·고도화', status: 'COMPLETED', orgUnitId: 'MOI-DPI-11', ownerUserId: 'U2026-073', ownerUserNm: '황재영', startAt: '2026-01-05', endAt: '2026-06-30', progress: 100, projectType: 'DEPT_REGULAR', planDocId: null },
  { projectId: 'WF-011', projectNm: '부내 정보보호 강화', status: 'ON_HOLD', orgUnitId: 'MOI-DPI-11', ownerUserId: 'U2026-073', ownerUserNm: '황재영', startAt: '2026-01-05', endAt: '2026-06-30', progress: 24, projectType: 'GENERAL', planDocId: 'DOC-PLAN-011' },
  { projectId: 'WF-012', projectNm: '국제행정 협력사업 추진', status: 'DELAYED', orgUnitId: 'MOI-DPI-07', ownerUserId: 'U2026-053', ownerUserNm: '박유진', startAt: '2026-01-05', endAt: '2026-06-30', progress: 28, projectType: 'GENERAL', planDocId: 'DOC-PLAN-012' },
  { projectId: 'WF-013', projectNm: '정부조직·정원 진단', status: 'PENDING', orgUnitId: 'MOI-PIO-08', ownerUserId: 'U2026-088', ownerUserNm: '문도경', startAt: '2026-01-05', endAt: '2026-06-30', progress: 0, projectType: 'GENERAL', planDocId: 'DOC-PLAN-013' },
  { projectId: 'WF-014', projectNm: '정부혁신 종합계획 추진', status: 'IN_PROGRESS', orgUnitId: 'MOI-PIO-02', ownerUserId: 'U2026-078', ownerUserNm: '황도윤', startAt: '2026-01-05', endAt: '2026-06-30', progress: 68, projectType: 'GENERAL', planDocId: 'DOC-PLAN-014' },
  { projectId: 'WF-015', projectNm: 'AI 행정서비스 확대', status: 'IN_PROGRESS', orgUnitId: 'MOI-AIG-02', ownerUserId: 'U2026-106', ownerUserNm: '임한결', startAt: '2026-01-05', endAt: '2026-06-30', progress: 28, projectType: 'GENERAL', planDocId: 'DOC-PLAN-015' },
  { projectId: 'WF-016', projectNm: '공공데이터 개방 확대', status: 'IN_PROGRESS', orgUnitId: 'MOI-AIG-04', ownerUserId: 'U2026-108', ownerUserNm: '문민재', startAt: '2026-01-05', endAt: '2026-06-30', progress: 35, projectType: 'GENERAL', planDocId: 'DOC-PLAN-016' },
  { projectId: 'WF-017', projectNm: '디지털 공공서비스 혁신', status: 'COMPLETED', orgUnitId: 'MOI-AIG-08', ownerUserId: 'U2026-114', ownerUserNm: '윤정우', startAt: '2026-01-05', endAt: '2026-06-30', progress: 100, projectType: 'GENERAL', planDocId: 'DOC-PLAN-017' },
  { projectId: 'WF-018', projectNm: '지방자치 제도 개선', status: 'ON_HOLD', orgUnitId: 'MOI-LAI-02', ownerUserId: 'U2026-128', ownerUserNm: '한서윤', startAt: '2026-01-05', endAt: '2026-06-30', progress: 25, projectType: 'GENERAL', planDocId: 'DOC-PLAN-018' },
  { projectId: 'WF-019', projectNm: '지방재정 건전성 관리', status: 'DELAYED', orgUnitId: 'MOI-LFE-02', ownerUserId: 'U2026-141', ownerUserNm: '배시윤', startAt: '2026-01-05', endAt: '2026-06-30', progress: 38, projectType: 'GENERAL', planDocId: 'DOC-PLAN-019' },
  { projectId: 'WF-020', projectNm: '재난안전 예방대책 수립', status: 'PENDING', orgUnitId: 'MOI-DSM-02', ownerUserId: 'U2026-152', ownerUserNm: '고예준', startAt: '2026-01-05', endAt: '2026-06-30', progress: 0, projectType: 'GENERAL', planDocId: 'DOC-PLAN-020' },
  { projectId: 'WF-021', projectNm: '풍수해 대응체계 정비', status: 'IN_PROGRESS', orgUnitId: 'MOI-DSM-05', ownerUserId: 'U2026-156', ownerUserNm: '홍우진', startAt: '2026-01-05', endAt: '2026-06-30', progress: 16, projectType: 'DEPT_REGULAR', planDocId: null },
  { projectId: 'WF-022', projectNm: '국정감사 대응', status: 'IN_PROGRESS', orgUnitId: 'MOI-DPI-02', ownerUserId: 'U2026-026', ownerUserNm: '정가은', startAt: '2026-01-05', endAt: '2026-06-30', progress: 51, projectType: 'GENERAL', planDocId: 'DOC-PLAN-022' },
  { projectId: 'WF-023', projectNm: '정기 통계·정원표 발간', status: 'IN_PROGRESS', orgUnitId: 'MOI-PIO-09', ownerUserId: 'U2026-091', ownerUserNm: '전지훈', startAt: '2026-01-05', endAt: '2026-06-30', progress: 63, projectType: 'DEPT_REGULAR', planDocId: null },
  { projectId: 'WF-024', projectNm: '공공데이터 분석기반 구축', status: 'COMPLETED', orgUnitId: 'MOI-AIG-05', ownerUserId: 'U2026-111', ownerUserNm: '남우진', startAt: '2026-01-05', endAt: '2026-06-30', progress: 100, projectType: 'GENERAL', planDocId: 'DOC-PLAN-024' },
  { projectId: 'WF-025', projectNm: '국민참여 플랫폼 운영', status: 'ON_HOLD', orgUnitId: 'MOI-PIO-03', ownerUserId: 'U2026-080', ownerUserNm: '허유진', startAt: '2026-01-05', endAt: '2026-06-30', progress: 45, projectType: 'DEPT_REGULAR', planDocId: null },
  { projectId: 'WF-026', projectNm: '행정한류 수출 확대', status: 'DELAYED', orgUnitId: 'MOI-DPI-08', ownerUserId: 'U2026-059', ownerUserNm: '박정우', startAt: '2026-01-05', endAt: '2026-06-30', progress: 15, projectType: 'GENERAL', planDocId: 'DOC-PLAN-026' },
  { projectId: 'WF-027', projectNm: '통합포털 개편', status: 'PENDING', orgUnitId: 'MOI-AIG-11', ownerUserId: 'U2026-121', ownerUserNm: '허가은', startAt: '2026-01-05', endAt: '2026-06-30', progress: 0, projectType: 'GENERAL', planDocId: 'DOC-PLAN-027' },
  { projectId: 'WF-028', projectNm: '지방세 제도 개선', status: 'IN_PROGRESS', orgUnitId: 'MOI-LFE-05', ownerUserId: 'U2026-144', ownerUserNm: '성가은', startAt: '2026-01-05', endAt: '2026-06-30', progress: 31, projectType: 'GENERAL', planDocId: 'DOC-PLAN-028' },
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
