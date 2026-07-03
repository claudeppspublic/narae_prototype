// 공용 AdminGate — 관리자(ADMIN) 전용 화면 잠금 안내. AD-01/02/03 공용.
import SideNav, { ADMIN_ITEMS } from '@/components/SideNav'

export default function AdminGate({
  title = '관리자(ADMIN) 전용 화면입니다',
  description = '상단 역할 토글을 시스템관리자로 전환하세요.',
}) {
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={ADMIN_ITEMS} title="관리자" />
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem' }} aria-hidden>🔒</div>
          <p style={{ marginTop: 'var(--krds-space-5)', fontWeight: 'var(--krds-weight-bold)' }}>{title}</p>
          {description && (
            <p style={{ color: 'var(--color-text-assistive,#9ca3af)', fontSize: 'var(--krds-body-small)' }}>{description}</p>
          )}
        </div>
      </section>
    </div>
  )
}
