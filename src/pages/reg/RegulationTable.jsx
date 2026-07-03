// SCR-AI-01 — 규정 테이블
// AI01-01 분류 필터 탭 · AI01-02 다운로드/바로보기 · AI01-03 수정/삭제(팀장+)
// FN-AI01-1 · 상태 5종
import { useState, useMemo } from 'react'
import { api } from '@/mock'
import { useAsync } from '@/lib/useAsync'
import { useRoleStore } from '@/store/useRoleStore'
import { useUiStore } from '@/store/useUiStore'
import { REGULATION_CATEGORY } from '@/lib/codes'
import RegNav from '@/components/RegNav'
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'
import FilterChip from '@/components/FilterChip'
import { AsyncView } from '@/components/StateViews'

const CATS = [['ALL', '전체'], ...Object.entries(REGULATION_CATEGORY)]

export default function RegulationTable() {
  const role = useRoleStore((s) => s.role) // role 직접 구독 → 역할 토글 시 리렌더
  const toast = useUiStore((s) => s.toast)
  const [cat, setCat] = useState('ALL')
  const { data, loading, error, reload } = useAsync(() => api.getRegulations(undefined, { delay: 400 }), [])
  const [deleted, setDeleted] = useState(() => new Set())

  const rows = useMemo(() => {
    const list = (data ?? []).filter((r) => !deleted.has(r.regulationId))
    return cat === 'ALL' ? list : list.filter((r) => r.category === cat)
  }, [data, cat, deleted])

  const canEdit = ['ROLE_ADMIN', 'ROLE_DIR', 'ROLE_CHF', 'ROLE_TML'].includes(role) // 팀장+

  const columns = [
    { key: 'name', header: '규정/서식명', width: '38%', render: (r) => <span style={{ fontWeight: 'var(--krds-weight-medium)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span> },
    { key: 'category', header: '분류', width: '14%', render: (r) => <Badge variant="neutral">{REGULATION_CATEGORY[r.category]}</Badge> },
    { key: 'fileType', header: '형식', width: '10%', render: (r) => r.fileType.toUpperCase() },
    { key: 'sizeKB', header: '크기', width: '12%', render: (r) => `${r.sizeKB} KB` },
    { key: 'links', header: '보기', width: 150, render: (r) => (
      <span style={{ display: 'flex', gap: 'var(--krds-space-5)' }}>
        <a href={r.url} onClick={(e) => { e.preventDefault(); toast(`${r.name} 다운로드 (mock)`, 'info') }} style={linkStyle}>다운로드</a>
        <a href={r.url} onClick={(e) => { e.preventDefault(); toast(`${r.name} 바로보기 (mock)`, 'info') }} style={linkStyle}>바로보기</a>
      </span>
    ) },
    ...(canEdit ? [{ key: 'manage', header: '관리', width: 110, render: (r) => (
      <span style={{ display: 'flex', gap: 'var(--krds-space-5)' }}>
        <button onClick={() => toast(`${r.name} 수정 (mock)`, 'info')} style={miniBtn}>수정</button>
        <button onClick={() => { setDeleted((s) => new Set(s).add(r.regulationId)); toast(`${r.name} 삭제됨 (mock)`, 'ok') }} style={{ ...miniBtn, color: 'var(--color-risk-text)', borderColor: 'var(--color-risk-border)' }}>삭제</button>
      </span>
    ) }] : []),
  ]

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <RegNav />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-9)' }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-4)' }}>규정 테이블</h1>
        <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }}>
          지식베이스 규정 목록 · 분류별 필터 {canEdit ? '· 수정/삭제 가능' : '(수정/삭제는 팀장+ 권한)'}
        </p>

        {/* 분류 탭 */}
        <div style={{ display: 'flex', gap: 'var(--krds-space-2)', marginBottom: 'var(--krds-space-7)', flexWrap: 'wrap' }}>
          {CATS.map(([key, label]) => (
            <FilterChip key={key} label={label} variant="solid" active={cat === key} onClick={() => setCat(key)} />
          ))}
        </div>

        <AsyncView loading={loading} error={error} data={rows} reload={reload}
          empty={<div style={{ padding: 'var(--krds-space-11)', textAlign: 'center', color: 'var(--color-text-assistive,#9ca3af)' }}>해당 분류의 규정이 없습니다.</div>}>
          <DataTable columns={columns} rows={rows} rowKey={(r) => r.regulationId} />
        </AsyncView>
      </section>
    </div>
  )
}

const linkStyle = { color: 'var(--narae-accent)', cursor: 'pointer', fontSize: 'var(--krds-body-small)' }
const miniBtn = {
  padding: '2px var(--krds-space-5)', cursor: 'pointer', borderRadius: 'var(--krds-radius-small)',
  border: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-white)',
  fontSize: 'var(--krds-body-small)', color: 'var(--color-text-basic)',
}
