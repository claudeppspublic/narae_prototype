// SCR-AD-01 — 역할·권한 관리 (멀티스텝: 조직 DB 등록→역할 부여)
// AD01-01 조직 DB 파일 첨부→역할 부여 화면 이동 · AD01-02 역할 부여 · FN-AD01-1/2 · ADMIN 전용
import { useState } from 'react'
import { useRoleStore } from '@/store/useRoleStore'
import { useUiStore } from '@/store/useUiStore'
import { users } from '@/mock/users'
import { findOrg } from '@/mock/orgUnits'
import { ROLE } from '@/lib/codes'
import SideNav, { ADMIN_ITEMS } from '@/components/SideNav'
import AdminGate from '@/components/AdminGate'
import Stepper from '@/components/Stepper'
import Uploader from '@/components/Uploader'
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import { EmptyState } from '@/components/StateViews'

const ROLE_OPTIONS = ['ROLE_ADMIN', 'ROLE_DIR', 'ROLE_CHF', 'ROLE_TML', 'ROLE_STF']

export default function RolePermission() {
  const role = useRoleStore((s) => s.role) // role 직접 구독 → 역할 토글 시 리렌더
  const toast = useUiStore((s) => s.toast)
  const [step, setStep] = useState(0)
  const [assignments, setAssignments] = useState(() => Object.fromEntries(users.map((u) => [u.empNo, u.roleId])))

  if (role !== 'ROLE_ADMIN') return <AdminGate />

  const setRole = (empNo, roleId) => {
    setAssignments((a) => ({ ...a, [empNo]: roleId }))
    toast(`${empNo} 역할이 ${ROLE[roleId]}로 부여되었습니다 (mock)`, 'ok')
  }

  const columns = [
    { key: 'empNm', header: '성명', render: (u) => <b>{u.empNm}</b> },
    { key: 'org', header: '소속', render: (u) => findOrg(u.orgUnitId)?.orgUnitNm },
    { key: 'position', header: '직위', width: 100 },
    { key: 'role', header: '역할 부여', width: 180, render: (u) => (
      <select value={assignments[u.empNo]} onChange={(e) => setRole(u.empNo, e.target.value)} style={select}>
        {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{ROLE[r]}</option>)}
      </select>
    ) },
  ]

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={ADMIN_ITEMS} title="관리자" />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)' }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-3)' }}>역할·권한 관리</h1>

        {/* Stepper */}
        <Stepper steps={['조직 DB 등록', '역할 부여']} current={step} style={{ margin: 'var(--krds-space-6) 0 var(--krds-space-9)' }} />

        {step === 0 ? (
          <div style={{ maxWidth: 640 }}>
            <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-7)' }}>
              조직 DB 파일(xlsx/csv)을 첨부하면 파싱 후 역할 부여 화면으로 이동합니다.
            </p>
            <Uploader hint="XLSX · CSV" maxMB={20}
              onFiles={(fs) => { toast(`${fs[0].name} 파싱 완료 (mock) · 5실 114명`, 'ok'); setStep(1) }} />
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} style={{ marginTop: 'var(--krds-space-7)' }}>파일 없이 진행 (mock 조직 DB)</Button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 'var(--krds-space-5)', marginBottom: 'var(--krds-space-7)', alignItems: 'center' }}>
              <Badge variant="primary">5단계 역할</Badge>
              <span style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>사용자별 역할을 선택하면 즉시 부여됩니다 (mock)</span>
            </div>
            {users.length === 0 ? (
              <EmptyState title="등록된 사용자가 없습니다" description="조직 DB를 등록하면 사용자 목록이 표시됩니다." />
            ) : (
              <DataTable columns={columns} rows={users} rowKey={(u) => u.empNo} />
            )}
          </>
        )}
      </section>
    </div>
  )
}

const select = { height: 'var(--krds-control-xsmall)', padding: '0 var(--krds-space-5)', borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-white)' }