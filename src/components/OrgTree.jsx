// OrgTree — 실>관>과 조직 트리 (접기/펼치기·검색·선택). WS-01/WF 좌측 공용.
import { useState, useMemo } from 'react'
import { orgUnits, rootOrgs, childrenOf } from '@/mock/orgUnits'
import { ORG_LEVEL } from '@/lib/codes'

const LEVEL_LABEL = { [ORG_LEVEL.OFFICE]: '실', [ORG_LEVEL.BUREAU]: '관', [ORG_LEVEL.DIVISION]: '과' }

// 검색어에 매칭되는 노드 + 그 조상 id 집합
function matchIds(keyword) {
  if (!keyword?.trim()) return null
  const kw = keyword.trim()
  const keep = new Set()
  const parentOf = (id) => orgUnits.find((o) => o.orgUnitId === id)?.parentId
  orgUnits.forEach((o) => {
    if (o.orgUnitNm.includes(kw)) {
      let cur = o.orgUnitId
      while (cur) { keep.add(cur); cur = parentOf(cur) }
    }
  })
  return keep
}

export default function OrgTree({ selectedId, onSelect, keyword }) {
  const keep = useMemo(() => matchIds(keyword), [keyword])
  const [collapsed, setCollapsed] = useState(() => new Set())

  const isCollapsed = (id) => collapsed.has(id) && !keyword // 검색 중엔 강제 펼침
  const toggle = (id) =>
    setCollapsed((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const roots = rootOrgs().filter((o) => !keep || keep.has(o.orgUnitId))
  if (keep && roots.length === 0) {
    return <p style={{ padding: 'var(--krds-space-8)', color: 'var(--color-text-assistive,#9ca3af)', fontSize: 'var(--krds-body-small)' }}>검색 결과가 없습니다.</p>
  }

  return <ul style={{ ...ulReset, overflowX: 'hidden' }}>{roots.map((o) => <Node key={o.orgUnitId} org={o} depth={0} {...{ selectedId, onSelect, keep, isCollapsed, toggle }} />)}</ul>
}

function Node({ org, depth, selectedId, onSelect, keep, isCollapsed, toggle }) {
  const children = childrenOf(org.orgUnitId).filter((c) => !keep || keep.has(c.orgUnitId))
  const hasChildren = children.length > 0
  const selected = selectedId === org.orgUnitId
  const collapsed = isCollapsed(org.orgUnitId)

  return (
    <li>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--krds-space-2)', minWidth: 0,
          padding: 'var(--krds-space-4) var(--krds-space-5)',
          paddingLeft: `calc(var(--krds-space-5) + ${depth} * 14px)`,
          borderRadius: 'var(--krds-radius-small)', cursor: 'pointer',
          background: selected ? 'color-mix(in srgb, var(--narae-accent) 12%, transparent)' : 'transparent',
          color: selected ? 'var(--narae-accent)' : 'var(--color-text-basic)',
        }}
        onClick={() => onSelect(org.orgUnitId)}
      >
        {hasChildren ? (
          <button onClick={(e) => { e.stopPropagation(); toggle(org.orgUnitId) }}
            aria-label={collapsed ? '펼치기' : '접기'} style={caret}>
            {collapsed ? '▸' : '▾'}
          </button>
        ) : <span style={{ width: 16, flexShrink: 0 }} />}
        <span style={{ fontSize: 'var(--narae-caption)', color: 'var(--narae-accent)', flexShrink: 0 }}>{LEVEL_LABEL[org.level]}</span>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: selected ? 'var(--krds-weight-bold)' : 'var(--krds-weight-regular)' }}>
          {org.orgUnitNm}
        </span>
        <span style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)', flexShrink: 0 }}>{org.empCount}명</span>
      </div>
      {hasChildren && !collapsed && (
        <ul style={ulReset}>
          {children.map((c) => <Node key={c.orgUnitId} org={c} depth={depth + 1} {...{ selectedId, onSelect, keep, isCollapsed, toggle }} />)}
        </ul>
      )}
    </li>
  )
}

const ulReset = { listStyle: 'none', margin: 0, padding: 0 }
const caret = { width: 16, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-assistive,#9ca3af)', fontSize: 'var(--narae-caption)', padding: 0 }
