// SCR-AD-03 — 공통코드 관리 (상태·등급·결재 코드) · FN-AD03-1 · ADMIN
// 입출력정의서 4_공통코드 = lib/codes.js 단일 소스를 그룹별로 표시.
import { useState } from 'react'
import { useRoleStore } from '@/store/useRoleStore'
import SideNav, { ADMIN_ITEMS } from '@/components/SideNav'
import AdminGate from '@/components/AdminGate'
import DataTable from '@/components/DataTable'
import FilterChip from '@/components/FilterChip'
import { EmptyState } from '@/components/StateViews'
import {
  TASK_STATUS, RISK_GRADE, ROLE, EMPLOYMENT_STATUS, APPROVAL_STATUS,
  PRIORITY_LEVEL, SECURITY_LEVEL, PROCESS_STEP, PROJECT_TYPE, TASK_TYPE,
} from '@/lib/codes'

const GROUPS = [
  { key: 'TASK_STATUS', label: '과제/업무 상태', map: TASK_STATUS },
  { key: 'RISK_GRADE', label: '위험 등급', map: RISK_GRADE },
  { key: 'ROLE', label: '역할', map: ROLE },
  { key: 'EMPLOYMENT', label: '재직 상태', map: EMPLOYMENT_STATUS },
  { key: 'APPROVAL', label: '결재 상태', map: APPROVAL_STATUS },
  { key: 'PRIORITY', label: '중요도', map: PRIORITY_LEVEL },
  { key: 'SECURITY', label: '보안 등급', map: SECURITY_LEVEL },
  { key: 'PROCESS', label: '프로세스 단계', map: PROCESS_STEP },
  { key: 'PROJECT_TYPE', label: '과제 유형', map: PROJECT_TYPE },
  { key: 'TASK_TYPE', label: '업무 구분', map: TASK_TYPE },
]

export default function CommonCodes() {
  const role = useRoleStore((s) => s.role)
  const [groupKey, setGroupKey] = useState('TASK_STATUS')

  if (role !== 'ROLE_ADMIN') return <AdminGate />

  const group = GROUPS.find((g) => g.key === groupKey)
  const rows = Object.entries(group.map).map(([code, label]) => ({ code, label }))

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={ADMIN_ITEMS} title="관리자" />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)', maxWidth: 860 }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-4)' }}>공통코드 관리</h1>
        <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }}>
          상태·등급·결재 등 전 화면 공용 코드입니다. (입출력정의서 4_공통코드 기준)
        </p>

        <div style={{ display: 'flex', gap: 'var(--krds-space-2)', marginBottom: 'var(--krds-space-8)', flexWrap: 'wrap' }}>
          {GROUPS.map((g) => (
            <FilterChip key={g.key} label={g.label} variant="solid" active={groupKey === g.key} onClick={() => setGroupKey(g.key)} />
          ))}
        </div>

        {rows.length === 0 ? (
          <EmptyState title="해당 그룹의 코드가 없습니다" description="다른 코드 그룹을 선택해 주세요." />
        ) : (
          <DataTable
            columns={[
              { key: 'code', header: '코드값(KEY)', width: '40%', render: (r) => <code style={{ fontWeight: 'var(--krds-weight-medium)' }}>{r.code}</code> },
              { key: 'label', header: '한글명', width: '60%' },
            ]}
            rows={rows} rowKey={(r) => r.code}
          />
        )}
      </section>
    </div>
  )
}
