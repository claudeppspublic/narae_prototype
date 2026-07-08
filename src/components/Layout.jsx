// SCR-CM-02 — 글로벌 레이아웃 (GNB·탑바·AI질문창·알림·프로필·역할토글)
// CM02-00 로고→홈 · CM02-01 GNB→라우팅 · CM02-02 AI창→패널 · CM02-03 벨→RB-02
// CM02-04 프로필→드롭다운 · CM02-05 역할토글→전환·토스트
import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { gnbMenus } from '@/routes'
import ToastHost from '@/components/ToastHost'
import AiAssistantPanel from '@/components/AiAssistantPanel'
import { useRoleStore } from '@/store/useRoleStore'
import { useUiStore } from '@/store/useUiStore'
import { ROLE } from '@/lib/codes'
import { unreadCount, unreadSeverity } from '@/mock/notifications'

// 벨 배지 롤업 색 — 상태색상정책 §4: 노랑은 솔리드 금지 → 틴트(-bg/-text) 사용
const BELL_TONE = {
  risk: { bg: 'var(--color-risk-text)', fg: '#fff' },
  warn: { bg: 'var(--color-warn-bg)', fg: 'var(--color-warn-text)' },
  neutral: { bg: 'var(--color-neutral-text)', fg: '#fff' },
}

const ROLE_OPTIONS = ['ROLE_ADMIN', 'ROLE_DIR', 'ROLE_CHF', 'ROLE_TML', 'ROLE_STF']

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const role = useRoleStore((s) => s.role)
  const setRole = useRoleStore((s) => s.setRole)
  const toast = useUiStore((s) => s.toast)

  const [aiOpen, setAiOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [searchText, setSearchText] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const unread = unreadCount()

  useEffect(() => {
    const onDoc = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const isActive = (to) => pathname.startsWith('/' + to.split('/')[1])

  const submitAi = () => {
    const q = searchText.trim()
    if (!q) return // 빈 입력 무시
    setAiQuery(q)
    setAiOpen(true)
    setSearchText('')
  }

  const onRoleChange = (e) => {
    const r = e.target.value
    setRole(r)
    toast(`역할이 '${ROLE[r]}'(으)로 전환되었습니다`, 'info')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-white)' }}>
      <header style={header}>
        {/* CM02-00 로고 */}
        <NavLink to="/" style={logo}>Narae AI</NavLink>

        {/* CM02-01 GNB 5개 (v1.1 REF-24 D9·D10) */}
        <nav style={{ display: 'flex', gap: 'var(--krds-space-8)', marginLeft: 'var(--krds-space-6)' }}>
          {gnbMenus.map((m) => (
            <NavLink key={m.key} to={m.to} style={{ ...gnbLink, ...(isActive(m.to) ? gnbActive : {}) }}>
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)' }}>
          {/* CM02-05 역할 토글(데모) */}
          <select value={role} onChange={onRoleChange} aria-label="역할 전환(데모)" style={roleSelect}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{ROLE[r]}</option>
            ))}
          </select>

          {/* CM02-02 AI 질문창 */}
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAi()}
            placeholder="AI에게 질문해보세요!"
            aria-label="AI 질문창"
            style={aiInput}
          />

          {/* CM02-03 알림 벨 → RB-02. 배지 색=미읽음 최고 심각도 롤업 */}
          <button aria-label="알림" onClick={() => navigate('/monitoring/risk')} style={iconBtn}>
            <span aria-hidden>🔔</span>
            {unread > 0 && (
              <span style={{ ...badgeDot, background: BELL_TONE[unreadSeverity()].bg, color: BELL_TONE[unreadSeverity()].fg }}>
                {unread}
              </span>
            )}
          </button>

          {/* CM02-04 프로필 드롭다운 */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button aria-label="프로필" aria-haspopup="menu" aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)} style={{ ...iconBtn, borderRadius: 'var(--krds-radius-pill)', background: 'var(--color-background-white)' }}>
              👤
            </button>
            {profileOpen && (
              <div role="menu" style={menu}>
                <MenuItem onClick={() => { setProfileOpen(false); navigate('/me') }}>마이페이지</MenuItem>
                <MenuItem onClick={() => { setProfileOpen(false); navigate('/me/notifications') }}>설정</MenuItem>
                <div style={{ borderTop: '1px solid var(--color-border-basic, #eef0f2)' }} />
                <MenuItem onClick={() => { setProfileOpen(false); navigate('/login') }}>로그아웃</MenuItem>
              </div>
            )}
          </div>
        </div>
      </header>

      <main><Outlet /></main>

      <AiAssistantPanel open={aiOpen} onClose={() => setAiOpen(false)} initialQuery={aiQuery} />
      <ToastHost />
    </div>
  )
}

function MenuItem({ children, onClick }) {
  return (
    <button role="menuitem" onClick={onClick} className="narae-menu-item" style={menuItem}>
      {children}
      <style>{`.narae-menu-item:hover{background:var(--color-background-alternative,#f1f3f5)}`}</style>
    </button>
  )
}

const header = {
  display: 'flex', alignItems: 'center', gap: 'var(--krds-space-9)',
  height: 'var(--krds-control-xlarge)', padding: '0 var(--krds-space-10)',
  background: 'var(--narae-header-bg)', position: 'sticky', top: 0, zIndex: 20,
}
const logo = { fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--narae-header-text)', textDecoration: 'none' }
const gnbLink = {
  padding: 'var(--krds-space-4) var(--krds-space-2)', fontWeight: 'var(--krds-weight-medium)',
  textDecoration: 'none', color: 'color-mix(in srgb, var(--narae-header-text) 78%, transparent)', borderBottom: '2px solid transparent',
}
const gnbActive = { color: 'var(--narae-header-text)', borderBottom: '2px solid var(--narae-header-text)' }
const roleSelect = {
  height: 'var(--krds-control-xsmall)', padding: '0 var(--krds-space-5)',
  borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #e5e7eb)',
  background: 'var(--color-background-white)', color: 'var(--color-text-basic)', cursor: 'pointer',
  fontSize: 'var(--krds-body-small)',
}
const aiInput = {
  width: '18rem', height: 'var(--krds-control-small)', padding: '0 var(--krds-space-7)',
  borderRadius: 'var(--krds-radius-pill)', border: '1px solid var(--color-border-basic, #e5e7eb)',
  background: 'var(--color-background-alternative, #f5f6f8)',
}
const iconBtn = {
  position: 'relative', width: 'var(--krds-control-small)', height: 'var(--krds-control-small)',
  border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem',
  color: 'var(--narae-header-text)',
}
const badgeDot = {
  position: 'absolute', top: 2, right: 0, minWidth: '1rem', height: '1rem', padding: '0 3px',
  borderRadius: 'var(--krds-radius-pill)',
  fontSize: 'var(--narae-caption)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
}
const menu = {
  position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: '10rem',
  background: 'var(--color-background-white)', borderRadius: 'var(--krds-radius-medium)',
  boxShadow: 'var(--krds-shadow-2)', border: '1px solid var(--color-border-basic, #eef0f2)',
  padding: 'var(--krds-space-3)', zIndex: 30,
}
const menuItem = {
  display: 'flex', width: '100%', padding: 'var(--krds-space-5) var(--krds-space-6)',
  border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
  borderRadius: 'var(--krds-radius-small)', fontSize: 'var(--krds-body-medium)', color: 'var(--color-text-basic)',
}
