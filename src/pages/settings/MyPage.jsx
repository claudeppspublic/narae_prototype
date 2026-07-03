// SCR-ST-01 — 마이페이지 (프로필·음성 등록·알림)
// FN-ST01-1 프로필 조회/음성 enrollment · 상태 5종
import { useState } from 'react'
import { useRoleStore } from '@/store/useRoleStore'
import { useUiStore } from '@/store/useUiStore'
import { findUser } from '@/mock/users'
import { findOrg } from '@/mock/orgUnits'
import { ROLE } from '@/lib/codes'
import SideNav, { SETTINGS_ITEMS } from '@/components/SideNav'
import Card from '@/components/Card'
import Badge from '@/components/Badge'
import Field from '@/components/Field'
import Button from '@/components/Button'

export default function MyPage() {
  const empNo = useRoleStore((s) => s.empNo)
  const role = useRoleStore((s) => s.role)
  const toast = useUiStore((s) => s.toast)
  const user = findUser(empNo)
  const [enrolled, setEnrolled] = useState(false)
  const [recording, setRecording] = useState(false)

  const enroll = () => {
    setRecording(true)
    setTimeout(() => { setRecording(false); setEnrolled(true); toast('음성이 등록되었습니다 (mock)', 'ok') }, 1500)
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={SETTINGS_ITEMS} title="내 정보" />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)', maxWidth: 760 }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-9)' }}>마이페이지</h1>

        {/* 프로필 */}
        <Card style={{ marginBottom: 'var(--krds-space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-8)' }}>
            <div style={avatar}>{user?.empNm?.[0] ?? '?'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)' }}>{user?.empNm}</div>
              <div style={{ color: 'var(--color-text-assistive,#6b7280)' }}>{user?.position} · {findOrg(user?.orgUnitId)?.orgUnitNm}</div>
              <div style={{ marginTop: 'var(--krds-space-4)', display: 'flex', gap: 'var(--krds-space-4)' }}>
                <Badge variant="primary">{ROLE[role]}</Badge>
                <Badge variant="neutral">사번 {user?.empNo}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* 음성 등록 */}
        <Card style={{ marginBottom: 'var(--krds-space-8)' }}>
          <h2 style={cardTitle}>음성 등록 (Enrollment)</h2>
          <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-6)' }}>
            회의록 화자 분리·음성 명령에 사용할 음성을 등록합니다.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)' }}>
            <Button size="sm" onClick={enroll} disabled={recording}>
              {recording ? '🔴 녹음 중…' : enrolled ? '재등록' : '음성 등록 시작'}
            </Button>
            {enrolled && <Badge variant="ok">등록 완료</Badge>}
          </div>
        </Card>

        {/* 알림 요약 */}
        <Card>
          <h2 style={cardTitle}>알림</h2>
          <p style={{ color: 'var(--color-text-assistive,#6b7280)' }}>세부 알림 설정은 좌측 <b>알림 설정</b>에서 관리합니다.</p>
        </Card>
      </section>
    </div>
  )
}

const avatar = { width: 72, height: 72, borderRadius: '50%', background: 'var(--narae-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700 }
const cardTitle = { fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-4)' }