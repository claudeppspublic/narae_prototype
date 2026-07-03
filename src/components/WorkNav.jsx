// WorkNav — 업무 영역 좌측 LNB (테이블/캘린더/차트/등록). 화면설계서 간트·캘린더 좌측.
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/work/table', label: '업무 테이블' },
  { to: '/work/calendar', label: '업무 캘린더' },
  { to: '/work/gantt', label: '업무 차트' },
  { to: '/work/projects/new', label: '업무 등록' },
]

export default function WorkNav() {
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
