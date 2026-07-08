// SideNav — 설정(내 정보)·관리자 영역 공용 좌측 LNB.
import { NavLink } from 'react-router-dom'

export const SETTINGS_ITEMS = [
  { to: '/me', label: '마이페이지' },
  { to: '/me/notifications', label: '알림 설정' },
  { to: '/me/security', label: '보안 설정' },
  { to: '/me/system', label: '시스템 정보' },
]
export const ADMIN_ITEMS = [
  { to: '/admin/roles', label: '역할·권한' },
  { to: '/admin/tags', label: '사무분장 태그' },
  { to: '/admin/codes', label: '공통코드' },
]
export const BI_ITEMS = [
  { to: '/monitoring/dashboard', label: '부서 대시보드' },
  { to: '/monitoring/risk', label: '리스크 알림' },
  { to: '/monitoring/report', label: '보고서' },
]

export default function SideNav({ items, title }) {
  return (
    <nav style={nav}>
      {title && <div style={{ fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', padding: 'var(--krds-space-4) var(--krds-space-6)' }}>{title}</div>}
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} end style={({ isActive }) => ({ ...link, ...(isActive ? linkActive : {}) })}>
          {it.label}
        </NavLink>
      ))}
    </nav>
  )
}

const nav = { width: '14rem', flexShrink: 0, borderRight: '1px solid var(--color-border-basic, #e5e7eb)', padding: 'var(--krds-space-8) var(--krds-space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-2)' }
const link = { padding: 'var(--krds-space-5) var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)', textDecoration: 'none', color: 'var(--color-text-basic)', fontSize: 'var(--krds-body-medium)' }
const linkActive = { background: 'color-mix(in srgb, var(--narae-accent) 12%, transparent)', color: 'var(--narae-accent)', fontWeight: 'var(--krds-weight-bold)' }
