// SCR-WS-02 — 조직도 · 조직도뷰 (전개형 인피니티 캔버스)
// WS02-01 조직 노드 클릭→하위 전개 · WS02-02 검색→포커스 · WS02-03 줌 컨트롤(−/+/fit)
// FN-WS02-1 · 좌 트리 공유(폭 확대) + 우 조직 캔버스(루트부터 클릭 전개·줌/팬/미니맵)
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from 'dagre'
import { nodeTypes } from '@/components/canvas/CanvasNodes'
import OrgTree from '@/components/OrgTree'
import SrOnly from '@/components/SrOnly'
import { SegToggle } from '@/components/Tabs'
import { AsyncView, EmptyState } from '@/components/StateViews'
import { api } from '@/mock'
import { useAsync } from '@/lib/useAsync'
import { rootOrgs, childrenOf, findOrg } from '@/mock/orgUnits'
import { usersOf, findUser } from '@/mock/users'
import { tasksByAssignee } from '@/mock/tasks'
import { ORG_LEVEL } from '@/lib/codes'

const LEVEL_LABEL = { [ORG_LEVEL.OFFICE]: '실', [ORG_LEVEL.BUREAU]: '관', [ORG_LEVEL.DIVISION]: '과' }
const ROOT_ID = 'CO-ROOT'
const chiefOf = (orgUnitId) => usersOf(orgUnitId).find((u) => u.position?.includes('장'))?.empNm

// 보이는 노드 집합 → dagre LR 레이아웃
function layout(visibleOrgs, workerIds, edges) {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', nodesep: 20, ranksep: 90 })
  g.setDefaultEdgeLabel(() => ({}))
  g.setNode(ROOT_ID, { width: 180, height: 66 })
  visibleOrgs.forEach((o) => g.setNode(o.orgUnitId, { width: 180, height: 66 }))
  workerIds.forEach((empNo) => g.setNode(`W-${empNo}`, { width: 180, height: 72 }))
  edges.forEach((e) => g.setEdge(e.source, e.target))
  dagre.layout(g)
  const pos = (id) => { const p = g.node(id); return p ? { x: p.x, y: p.y } : { x: 0, y: 0 } }
  return { pos }
}

export default function OrgChart() {
  const navigate = useNavigate()
  // 상태 5종: 조직 데이터 로딩/에러/빈 상태 (노드 구성 자체는 기존 시드 동기 로직 유지)
  const { data: orgData, loading, error, reload } = useAsync(() => api.getOrgTree({ delay: 400 }), [])
  const [keyword, setKeyword] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  // 초기: 회사 루트 + 5실
  const [visible, setVisible] = useState(() => new Set([ROOT_ID, ...rootOrgs().map((o) => o.orgUnitId)]))
  const [workers, setWorkers] = useState(() => new Set()) // 전개된 구성원(empNo)

  const visibleOrgs = useMemo(() => {
    const set = visible
    return [...set].filter((id) => id !== ROOT_ID).map(findOrg).filter(Boolean)
  }, [visible])

  const workerIds = useMemo(() => [...workers].filter((empNo) => visible.has(findUser(empNo)?.orgUnitId)), [workers, visible])

  const edges = useMemo(() => {
    const set = visible
    const es = []
    visibleOrgs.forEach((o) => {
      const parent = o.parentId ?? ROOT_ID
      if (set.has(parent) || parent === ROOT_ID) es.push({ id: `E-${o.orgUnitId}`, source: parent, target: o.orgUnitId, type: 'smoothstep' })
    })
    workerIds.forEach((empNo) => {
      const u = findUser(empNo)
      es.push({ id: `EW-${empNo}`, source: u.orgUnitId, target: `W-${empNo}`, type: 'smoothstep' })
    })
    return es
  }, [visibleOrgs, visible, workerIds])

  const { pos } = useMemo(() => layout(visibleOrgs, workerIds, edges), [visibleOrgs, workerIds, edges])
  const kw = keyword.trim()

  const nodes = useMemo(() => {
    const root = { id: ROOT_ID, type: 'company', position: pos(ROOT_ID), data: { label: '행정기관' }, selected: false }
    const orgNodes = visibleOrgs.map((o) => ({
      id: o.orgUnitId, type: 'org', position: pos(o.orgUnitId),
      selected: selectedId === o.orgUnitId || (kw && o.orgUnitNm.includes(kw)),
      data: { label: o.orgUnitNm, levelLabel: LEVEL_LABEL[o.level], empCount: o.empCount, chief: chiefOf(o.orgUnitId) },
    }))
    const workerNodes = workerIds.map((empNo) => {
      const u = findUser(empNo)
      return {
        id: `W-${empNo}`, type: 'worker', position: pos(`W-${empNo}`),
        selected: selectedId === `W-${empNo}` || (kw && u.empNm.includes(kw)),
        data: { label: u.empNm, position: u.position, taskCount: tasksByAssignee(empNo).length, jobTags: u.jobTags },
      }
    })
    return [root, ...orgNodes, ...workerNodes]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleOrgs, workerIds, pos, selectedId, kw])

  // 조직 클릭 → 하위 조직 or (말단이면) 구성원 전개
  const expand = (orgUnitId) => {
    const subs = childrenOf(orgUnitId)
    if (subs.length > 0) setVisible((v) => { const n = new Set(v); subs.forEach((c) => n.add(c.orgUnitId)); return n })
    else setWorkers((w) => { const n = new Set(w); usersOf(orgUnitId).forEach((u) => n.add(u.empNo)); return n })
  }

  const onNodeClick = (_e, node) => {
    if (node.id === ROOT_ID) return
    setSelectedId(node.id)
    if (!node.id.startsWith('W-')) expand(node.id)
  }

  // 트리에서 선택 → 경로 전개 + 포커스
  const selectFromTree = (id) => {
    setVisible((v) => {
      const n = new Set(v)
      let cur = id
      while (cur) { n.add(cur); cur = findOrg(cur)?.parentId }
      childrenOf(id).forEach((c) => n.add(c.orgUnitId))
      return n
    })
    if (childrenOf(id).length === 0) setWorkers((w) => { const n = new Set(w); usersOf(id).forEach((u) => n.add(u.empNo)); return n })
    setSelectedId(id)
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SrOnly as="h1">조직도 — 조직도뷰</SrOnly>
      <aside style={leftPane}>
        <SegToggle items={[{ key: 'list', label: '리스트뷰' }, { key: 'chart', label: '조직도뷰' }]}
          value="chart" onChange={(v) => v === 'list' && navigate('/org/list')} size="sm" />
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
          placeholder="실·관·과 검색" aria-label="조직 검색"
          style={{ ...searchInput, margin: 'var(--krds-space-6) 0' }} />
        <p style={{ fontSize: 'var(--krds-body-small)', color: 'var(--narae-accent)', fontWeight: 'var(--krds-weight-bold)', marginBottom: 'var(--krds-space-6)' }}>
          5개 실 · 114명
        </p>
        <div style={{ overflowY: 'auto', overflowX: 'hidden', flex: 1 }}>
          <OrgTree selectedId={selectedId} onSelect={selectFromTree} keyword={keyword} />
        </div>
      </aside>

      <div style={{ flex: 1, position: 'relative' }}>
        <AsyncView loading={loading} error={error} data={orgData} reload={reload}
          empty={<EmptyState icon="🏢" title="조직 정보가 없습니다" description="표시할 조직 데이터가 없습니다." />}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.25, maxZoom: 1 }}
            minZoom={0.3}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={20} color="var(--color-border-basic, #eef0f2)" />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable style={{ background: 'var(--color-background-alternative, #f8f9fa)' }} />
          </ReactFlow>
        </AsyncView>
      </div>
    </div>
  )
}

const leftPane = {
  width: '26rem', flexShrink: 0, borderRight: '1px solid var(--color-border-basic, #e5e7eb)',
  padding: 'var(--krds-space-8)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
}
const searchInput = {
  height: 'var(--krds-control-small)', padding: '0 var(--krds-space-7)',
  borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #e5e7eb)',
  background: 'var(--color-background-white)',
}
