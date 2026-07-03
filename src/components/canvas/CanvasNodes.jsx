// 홈/조직도 캔버스 커스텀 노드 (회사/조직/조직원/업무 + 도구 부착 배지).
// 홈 설명서: 조직=회색 박스, 조직원/업무=카드. 업무는 위험등급 색 테두리.
import { Handle, Position } from '@xyflow/react'
import { HOME_TOOL } from '@/lib/codes'

const RISK_BORDER = {
  OK: 'var(--color-border-basic, #e5e7eb)',
  WARN: 'var(--narae-status-warn)',
  RISK: 'var(--narae-status-risk)',
}

function Shell({ children, style, selected, onBi }) {
  return (
    <div
      style={{
        position: 'relative',
        minWidth: 150, padding: 'var(--krds-space-6) var(--krds-space-7)',
        borderRadius: 'var(--krds-radius-medium)', fontSize: 'var(--krds-body-small)',
        boxShadow: selected ? 'var(--krds-shadow-2)' : 'var(--krds-shadow-1)',
        outline: selected ? '2px solid var(--narae-accent)' : 'none',
        ...style,
      }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      {children}
      {onBi && <BiButton onBi={onBi} />}
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  )
}

// 노드 내부 BI 버튼 — 클릭 시 전개(노드클릭)와 분리되어 BI Drawer만 연다.
function BiButton({ onBi }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onBi() }}
      title="목표관리 BI 보기"
      style={{
        position: 'absolute', top: 4, right: 4,
        padding: '1px 6px', borderRadius: 'var(--krds-radius-pill)',
        border: '1px solid var(--narae-accent)', background: 'var(--color-background-white)',
        color: 'var(--narae-accent)', fontSize: 'var(--narae-caption)', fontWeight: 'var(--krds-weight-bold)',
        cursor: 'pointer', lineHeight: 1.4,
      }}
    >
      BI
    </button>
  )
}

export function CompanyNode({ data, selected }) {
  return (
    <Shell selected={selected} onBi={data.onBi} style={{ background: 'var(--narae-header-bg)', color: '#fff', fontWeight: 'var(--krds-weight-bold)' }}>
      🏛 {data.label}
    </Shell>
  )
}

export function OrgNode({ data, selected }) {
  return (
    <Shell selected={selected} onBi={data.onBi} style={{ minWidth: 168, background: 'var(--color-background-alternative, #eef1f5)', color: 'var(--color-text-basic)', fontWeight: 'var(--krds-weight-medium)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 'var(--narae-caption)', padding: '0 4px', borderRadius: 3, background: 'var(--narae-accent)', color: '#fff' }}>{data.levelLabel ?? '조직'}</span>
        <span>{data.label}</span>
      </div>
      <div style={metaRow}>
        {data.empCount != null && <span>👥 {data.empCount}명</span>}
        {data.chief && <span>· {data.chief}</span>}
      </div>
      <ToolBadges tools={data.tools} />
    </Shell>
  )
}

export function WorkerNode({ data, selected }) {
  return (
    <Shell selected={selected} onBi={data.onBi} style={{ minWidth: 168, background: 'var(--color-background-white)', border: '1px solid var(--color-border-basic,#e5e7eb)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={avatarSm}>{data.label?.[0]}</span>
        <span style={{ fontWeight: 'var(--krds-weight-medium)' }}>{data.label}</span>
      </div>
      <div style={metaRow}>
        {data.position && <span>{data.position}</span>}
        {data.taskCount != null && <span>· 업무 {data.taskCount}건</span>}
      </div>
      {data.jobTags?.length > 0 && (
        <div style={{ display: 'flex', gap: 3, marginTop: 3, flexWrap: 'wrap' }}>
          {data.jobTags.slice(0, 2).map((t) => (
            <span key={t} style={{ fontSize: 'var(--narae-caption)', padding: '0 5px', borderRadius: 'var(--krds-radius-pill)', background: 'var(--color-background-alternative,#f1f3f5)', color: 'var(--color-text-assistive,#6b7280)' }}>{t}</span>
          ))}
        </div>
      )}
      <ToolBadges tools={data.tools} />
    </Shell>
  )
}

export function TaskNode({ data, selected }) {
  return (
    <Shell
      selected={selected}
      onBi={data.onBi}
      style={{ background: 'var(--color-background-white)', border: `1.5px solid ${RISK_BORDER[data.status] ?? RISK_BORDER.OK}` }}
    >
      <div style={{ fontWeight: 'var(--krds-weight-medium)', maxWidth: 200 }}>{data.label}</div>
      <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>
        {data.regularYn ? '정기' : '수시'} · {data.progress != null ? `${data.progress}%` : ''}
      </div>
      <ToolBadges tools={data.tools} />
    </Shell>
  )
}

function ToolBadges({ tools }) {
  if (!tools?.length) return null
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
      {tools.map((t) => (
        <span key={t} style={{
          fontSize: 'var(--narae-caption)', padding: '1px 6px', borderRadius: 'var(--krds-radius-pill)',
          background: 'color-mix(in srgb, var(--narae-accent) 12%, transparent)', color: 'var(--narae-accent)',
        }}>
          {HOME_TOOL[t] ?? t}
        </span>
      ))}
    </div>
  )
}

const handleStyle = { opacity: 0, width: 1, height: 1 }
const metaRow = { display: 'flex', gap: 4, marginTop: 3, fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }
const avatarSm = { width: 18, height: 18, borderRadius: '50%', background: 'var(--narae-accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--narae-caption)', fontWeight: 700 }

export const nodeTypes = {
  company: CompanyNode,
  org: OrgNode,
  worker: WorkerNode,
  task: TaskNode,
}
