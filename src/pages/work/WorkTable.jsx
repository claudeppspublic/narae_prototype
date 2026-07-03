// SCR-WF-01-03 — 업무 테이블
// WF0103-01 상태탭 · WF0103-02 팀 선택 · WF0103-03 기간 · WF0103-04 행→WF-02 Drawer
// WF0103-05 페이징 · WF0103-06 뷰 토글(테이블/캘린더/간트) · [등록]→WF-04
// FN-WF0103-1~2 · 상태 5종
import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/mock'
import { rootOrgs } from '@/mock/orgUnits'
import { useAsync } from '@/lib/useAsync'
import { TASK_STATUS } from '@/lib/codes'
import WorkNav from '@/components/WorkNav'
import WorkViewToggle from '@/components/WorkViewToggle'
import DataTable from '@/components/DataTable'
import { StatusBadge, RiskBadge } from '@/components/Badge'
import { AsyncView } from '@/components/StateViews'
import WorkDetailDrawer from '@/components/WorkDetailDrawer'
import Button from '@/components/Button'
import SrOnly from '@/components/SrOnly'

const STATUS_TABS = [
  { key: 'ALL', label: '모든' },
  { key: 'IN_PROGRESS', label: '진행' },
  { key: 'COMPLETED', label: '종결' },
  { key: 'PENDING', label: '대기' },
]
const PAGE_SIZE = 8

export default function WorkTable() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const drawerTaskId = params.get('drawer')

  const { data: tasks, loading, error, reload } = useAsync(() => api.getTasks({ delay: 400 }), [])
  const [status, setStatus] = useState('ALL')
  const [orgFilter, setOrgFilter] = useState('')
  const [range, setRange] = useState({ startAt: '', endAt: '' })
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!tasks) return []
    return tasks.filter((t) => {
      if (status !== 'ALL' && t.status !== status) return false
      if (range.startAt && t.endAt < range.startAt) return false
      if (range.endAt && t.startAt > range.endAt) return false
      return true
    })
  }, [tasks, status, range])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openTask = (taskId) => setParams((p) => { p.set('drawer', taskId); return p }, { replace: false })
  const closeDrawer = () => setParams((p) => { p.delete('drawer'); return p })

  const columns = [
    { key: 'taskNm', header: '업무명', render: (r) => <span style={{ fontWeight: 'var(--krds-weight-medium)' }}>{r.taskNm}</span> },
    { key: 'status', header: '상태', width: 90, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'assigneeNm', header: '담당자', width: 100 },
    { key: 'period', header: '기간', width: 200, render: (r) => `${r.startAt} ~ ${r.endAt}` },
    { key: 'risk', header: '위험', width: 70, render: (r) => <RiskBadge grade={r.riskGrade} /> },
  ]

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SrOnly as="h1">업무 테이블</SrOnly>
      <WorkNav />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-9)' }}>
        {/* 상단: 상태 탭 + 필터 + 뷰 토글 + 등록 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--krds-space-7)', flexWrap: 'wrap', gap: 'var(--krds-space-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--krds-space-2)' }}>
            {STATUS_TABS.map((t) => (
              <button key={t.key} onClick={() => { setStatus(t.key); setPage(1) }}
                style={{ ...tab, ...(status === t.key ? tabActive : {}) }}>{t.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'var(--krds-space-5)', alignItems: 'center' }}>
            <Button size="sm" onClick={() => navigate('/work/projects/new')}>+ 등록</Button>
            <WorkViewToggle view="table" />
          </div>
        </div>

        {/* 필터: 팀·기간 */}
        <div style={{ display: 'flex', gap: 'var(--krds-space-5)', marginBottom: 'var(--krds-space-7)', flexWrap: 'wrap' }}>
          <select value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)} aria-label="팀 선택" style={select}>
            <option value="">전체 팀</option>
            {rootOrgs().map((o) => <option key={o.orgUnitId} value={o.orgUnitId}>{o.orgUnitNm}</option>)}
          </select>
          <input type="date" aria-label="시작일" value={range.startAt}
            onChange={(e) => setRange((r) => ({ ...r, startAt: e.target.value }))} style={select} />
          <input type="date" aria-label="종료일" value={range.endAt}
            onChange={(e) => setRange((r) => ({ ...r, endAt: e.target.value }))} style={select} />
        </div>

        <AsyncView loading={loading} error={error} data={filtered} reload={reload}
          empty={<div style={{ padding: 'var(--krds-space-11)', textAlign: 'center', color: 'var(--color-text-assistive,#9ca3af)' }}>조건에 맞는 업무가 없습니다.</div>}>
          <DataTable columns={columns} rows={pageRows} rowKey={(r) => r.taskId} onRowClick={(r) => openTask(r.taskId)} />

          {/* 페이징 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--krds-space-4)', marginTop: 'var(--krds-space-8)', alignItems: 'center' }}>
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>이전</Button>
            <span style={{ fontSize: 'var(--krds-body-small)' }}>{page} / {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>다음</Button>
          </div>
        </AsyncView>
      </section>

      {/* WF-02 업무 상세 Drawer */}
      <WorkDetailDrawer taskId={drawerTaskId} open={!!drawerTaskId} onClose={closeDrawer} />
    </div>
  )
}

const tab = {
  height: 'var(--krds-control-xsmall)', padding: '0 var(--krds-space-7)', cursor: 'pointer', border: 'none',
  background: 'transparent', borderRadius: 'var(--krds-radius-medium)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-basic)',
}
const tabActive = { background: 'var(--narae-accent)', color: '#fff', fontWeight: 'var(--krds-weight-bold)' }
const select = {
  height: 'var(--krds-control-small)', padding: '0 var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)',
  border: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-white)',
}
