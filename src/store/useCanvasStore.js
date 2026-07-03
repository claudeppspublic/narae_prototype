// useCanvasStore — 홈(CM-03)·조직도뷰(WS-02) 인피니티 캔버스 상태.
// 노드/엣지/전개 경로(단일 활성 경로)·도구 부착·선택 노드·기간/탭/필터.
// 전개 규칙(홈 설명서): 회사→조직 1~4depth→조직원→업무 순차. 아이레벨 불변.
import { create } from 'zustand'
import { rootOrgs, childrenOf } from '@/mock/orgUnits'
import { usersOf } from '@/mock/users'
import { tasksByAssignee } from '@/mock/tasks'
import { ROOT_NODE, orgToNode, userToNode, taskToNode, parentChildEdge } from '@/mock/canvas'

let attachSeq = 0

export const useCanvasStore = create((set, get) => ({
  nodes: [ROOT_NODE],
  edges: [],
  expandedPath: [], // 현재 활성 전개 경로(nodeId 배열)
  selectedNodeId: null,
  toolAttachments: [],

  // 홈 필터·스코프 (CM-03)
  activeTab: '인사',
  periodScope: '월', // 주/월/분기
  taskFilters: { category: null, regularYn: null, statusFilter: null },

  setActiveTab: (activeTab) => set({ activeTab }),
  setPeriodScope: (periodScope) => set({ periodScope }),
  setTaskFilter: (patch) => set((s) => ({ taskFilters: { ...s.taskFilters, ...patch } })),

  // 초기화: 회사 루트 + 1depth 조직 전개
  init: () => {
    const roots = rootOrgs().map(orgToNode)
    const edges = roots.map((n) => parentChildEdge(ROOT_NODE.nodeId, n.nodeId))
    set({
      nodes: [ROOT_NODE, ...roots],
      edges,
      expandedPath: [ROOT_NODE.nodeId],
      selectedNodeId: null,
      toolAttachments: [],
    })
  },

  // 노드 클릭 → 직속 하위 전개만 (조직→하위조직 or 조직원, 조직원→업무).
  // BI Drawer는 전개와 분리 — 노드 내부 'BI' 버튼(selectNode)에서 연다.
  expandNode: (nodeId) => {
    const node = get().nodes.find((n) => n.nodeId === nodeId)
    if (!node) return
    let childNodes = []
    if (node.nodeType === 'COMPANY') {
      childNodes = rootOrgs().map(orgToNode)
    } else if (node.nodeType === 'ORG') {
      const subOrgs = childrenOf(node.refId)
      if (subOrgs.length > 0) childNodes = subOrgs.map(orgToNode)
      else childNodes = usersOf(node.refId).map(userToNode) // 말단 조직 → 조직원
    } else if (node.nodeType === 'WORKER') {
      childNodes = tasksByAssignee(node.refId).map(taskToNode) // 조직원 → 업무
    }
    if (childNodes.length === 0) return // 말단(업무) → 전개 없음
    const existing = new Set(get().nodes.map((n) => n.nodeId))
    const newNodes = childNodes.filter((n) => !existing.has(n.nodeId))
    const newEdges = childNodes.map((c) => parentChildEdge(nodeId, c.nodeId))
    set((s) => ({
      nodes: [...s.nodes, ...newNodes],
      edges: [...s.edges, ...newEdges.filter((e) => !s.edges.some((x) => x.edgeId === e.edgeId))],
    }))
  },

  // BI Drawer 열기 (노드 내부 'BI' 버튼)
  selectNode: (selectedNodeId) => set({ selectedNodeId }),

  // 도구 D&D 부착 (중복 방지 — 동일 노드+도구)
  attachTool: (nodeId, tool) => {
    const exists = get().toolAttachments.some((a) => a.nodeId === nodeId && a.tool === tool)
    if (exists) return false
    const attach = { attachId: `ATT-${++attachSeq}`, nodeId, tool }
    set((s) => ({ toolAttachments: [...s.toolAttachments, attach] }))
    return true
  },
  detachTool: (attachId) =>
    set((s) => ({ toolAttachments: s.toolAttachments.filter((a) => a.attachId !== attachId) })),

  reset: () => set({ nodes: [ROOT_NODE], edges: [], expandedPath: [], selectedNodeId: null, toolAttachments: [] }),
}))
