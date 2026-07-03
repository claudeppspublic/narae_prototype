// CANVAS_NODE / CANVAS_EDGE / TOOL_ATTACH — 홈(CM-03)·조직도뷰(WS-02) 인피니티 캔버스.
// 홈은 동적 전개(회사→조직 1~4depth→조직원→업무)라, 초기 시드는 회사 루트만 두고
// 나머지 노드는 orgUnits/users/tasks에서 파생 생성(useCanvasStore).
// 스키마:
//  CANVAS_NODE: nodeId, nodeType(회사/조직/근무자/업무/업무상세/도구), refId, label, status, regularYn
//  CANVAS_EDGE: edgeId, fromNodeId, toNodeId, edgeType(부모자식/업무관계/도구첨부)
//  TOOL_ATTACH: attachId, nodeId, tool(회의록/규정/업무평가/리스크평가)
import { HOME_TOOL } from '@/lib/codes'

// 회사 루트 노드 (초기 전개 시작점)
export const ROOT_NODE = {
  nodeId: 'NODE-ROOT',
  nodeType: 'COMPANY',
  refId: null,
  label: '행정안전부',
  status: 'OK',
  regularYn: false,
}

// 도구 팔레트 (홈 상단 도구 칩 5종 — 결정 07-01)
export const toolPalette = [
  { tool: 'MEETING', label: HOME_TOOL.MEETING },
  { tool: 'REGULATION', label: HOME_TOOL.REGULATION },
  { tool: 'WORK_EVAL', label: HOME_TOOL.WORK_EVAL },
  { tool: 'RISK_EVAL', label: HOME_TOOL.RISK_EVAL },
]

// 상단 카테고리 탭 (결정 07-01) — [확인필요] 각 탭 ↔ 업무 매핑 규칙
export const homeTabs = ['인사', '자금', '관리', '기술', '정보']

// 파생 헬퍼 — 엔터티 → 캔버스 노드
export const orgToNode = (org) => ({
  nodeId: `NODE-ORG-${org.orgUnitId}`,
  nodeType: 'ORG',
  refId: org.orgUnitId,
  label: org.orgUnitNm,
  status: 'OK',
  regularYn: false,
})

export const userToNode = (user) => ({
  nodeId: `NODE-USER-${user.empNo}`,
  nodeType: 'WORKER',
  refId: user.empNo,
  label: user.empNm,
  status: 'OK',
  regularYn: false,
})

export const taskToNode = (task) => ({
  nodeId: `NODE-TASK-${task.taskId}`,
  nodeType: 'TASK',
  refId: task.taskId,
  label: task.taskNm,
  status: task.riskGrade, // 위험등급 재사용
  regularYn: task.taskType === 'REGULAR',
  category: task.category, // 홈 상단탭 필터용
})

export const parentChildEdge = (fromNodeId, toNodeId) => ({
  edgeId: `EDGE-${fromNodeId}-${toNodeId}`,
  fromNodeId,
  toNodeId,
  edgeType: 'PARENT_CHILD',
})

// 초기 시드(빈 상태에서 시작; 홈 진입 시 store가 ROOT + 1depth 조직으로 채움)
export const canvasNodes = [ROOT_NODE]
export const canvasEdges = []
export const toolAttachments = []
