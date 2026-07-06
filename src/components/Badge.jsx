// Badge — 상태/위험등급/일반 뱃지. UI/UX 상태색상정책서 v0.1 (docs/20260703) 준수.
// 기본형=틴트(-bg 배경 · -text 글자 · -border 테두리) + 라벨 텍스트 필수.
// 강조형(solid)=-text 배경+흰 글자 — 빨강·초록·회색만(노랑 솔리드 금지, 대비 미달).
import { TASK_STATUS, RISK_GRADE, APPROVAL_STATUS } from '@/lib/codes'

const VARIANT = {
  ok: { bg: 'var(--color-ok-bg)', fg: 'var(--color-ok-text)', bd: 'var(--color-ok-border)' },
  warn: { bg: 'var(--color-warn-bg)', fg: 'var(--color-warn-text)', bd: 'var(--color-warn-border)' },
  risk: { bg: 'var(--color-risk-bg)', fg: 'var(--color-risk-text)', bd: 'var(--color-risk-border)' },
  neutral: { bg: 'var(--color-neutral-bg)', fg: 'var(--color-neutral-text)', bd: 'var(--color-neutral-border)' },
  // 브랜드 분류용(상태 아님) — 목표 태그 등. 상태 표기에 사용 금지.
  primary: { bg: 'color-mix(in srgb, var(--narae-accent) 12%, transparent)', fg: 'var(--narae-accent)', bd: 'color-mix(in srgb, var(--narae-accent) 35%, transparent)' },
}
// 솔리드 허용 계열(-text 배경+흰 글자). 노랑 제외.
const SOLID_BG = { ok: 'var(--color-ok-text)', risk: 'var(--color-risk-text)', neutral: 'var(--color-neutral-text)' }

export default function Badge({ variant = 'neutral', solid = false, children }) {
  const key = variant === 'info' ? 'neutral' : variant
  const v = VARIANT[key] ?? VARIANT.neutral
  const solidBg = solid ? SOLID_BG[key] : null
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--krds-space-2)',
        padding: '2px var(--krds-space-5)', borderRadius: 'var(--krds-radius-pill)',
        fontSize: 'var(--krds-body-xsmall, 13px)', fontWeight: 'var(--krds-weight-medium)',
        background: solidBg ?? v.bg, color: solidBg ? '#fff' : v.fg,
        border: `1px solid ${solidBg ?? v.bd}`, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

// 위험등급(OK/WARN/RISK) → Badge. 색각 대응: RISK에 '!' 아이콘 병기(정책 §6)
export function RiskBadge({ grade }) {
  const map = { OK: 'ok', WARN: 'warn', RISK: 'risk' }
  return (
    <Badge variant={map[grade] ?? 'neutral'}>
      {grade === 'RISK' && <b aria-hidden>!</b>}
      {RISK_GRADE[grade] ?? grade}
    </Badge>
  )
}

// 결재상태 → Badge. REF-23 §4.2: 기안=회색 솔리드 · 결재중=노랑 틴트(솔리드 금지) ·
// 결재완료=초록 솔리드 · 반려=빨강 솔리드+'!' (INT-CM03-13·15)
// tone 오버라이드: 지연된 결재중(approvalToneOf='risk')은 라벨 유지한 채 빨강 표시.
export function ApprovalBadge({ status, tone }) {
  const map = { DRAFTING: 'neutral', APPROVING: 'warn', APPROVED: 'ok', REJECTED: 'risk' }
  const variant = tone ?? map[status] ?? 'neutral'
  return (
    <Badge variant={variant} solid={variant !== 'warn'}>
      {variant === 'risk' && <b aria-hidden>!</b>}
      {APPROVAL_STATUS[status] ?? status}
    </Badge>
  )
}

// 업무 상태 → Badge. 정책 §3: 대기=회색 · 진행중=초록 틴트 · 완료=초록 솔리드+체크 ·
// 보류=노랑 · 지연=빨강
export function StatusBadge({ status }) {
  const map = {
    PENDING: 'neutral', IN_PROGRESS: 'ok', COMPLETED: 'ok', ON_HOLD: 'warn', DELAYED: 'risk',
  }
  const done = status === 'COMPLETED'
  return (
    <Badge variant={map[status] ?? 'neutral'} solid={done}>
      {done && <span aria-hidden>✓</span>}
      {status === 'DELAYED' && <b aria-hidden>!</b>}
      {TASK_STATUS[status] ?? status}
    </Badge>
  )
}
