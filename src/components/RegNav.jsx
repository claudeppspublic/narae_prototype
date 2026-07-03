// RegNav — 규정 영역 좌측 LNB (규정 테이블/규정 등록/QnA).
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/reg/table', label: '규정 테이블' },
  { to: '/reg/upload', label: '규정 등록' },
  { to: '/reg/qna', label: 'QnA' },
]

export default function RegNav() {
  return (
    <nav style={nav}>
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} end
          style={({ isActive }) => ({ ...link, ...(isActive ? linkActive : {}) })}>
          {it.label}
        </NavLink>
      ))}
    </nav>
  )
}

const nav = {
  width: '14rem', flexShrink: 0, borderRight: '1px solid var(--color-border-basic, #e5e7eb)',
  padding: 'var(--krds-space-8) var(--krds-space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-2)',
}
const link = {
  padding: 'var(--krds-space-5) var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)',
  textDecoration: 'none', color: 'var(--color-text-basic)', fontSize: 'var(--krds-body-medium)',
}
const linkActive = {
  background: 'color-mix(in srgb, var(--narae-accent) 12%, transparent)',
  color: 'var(--narae-accent)', fontWeight: 'var(--krds-weight-bold)',
}
