// Badge — 상태/위험등급/일반 뱃지. 색은 토큰만 사용.
import { TASK_STATUS, RISK_GRADE } from '@/lib/codes'

const VARIANT = {
  ok: { bg: 'color-mix(in srgb, var(--narae-status-ok) 14%, transparent)', fg: 'var(--narae-status-ok)' },
  warn: { bg: 'color-mix(in srgb, var(--narae-status-warn) 16%, transparent)', fg: 'var(--narae-status-warn)' },
  risk: { bg: 'color-mix(in srgb, var(--narae-status-risk) 14%, transparent)', fg: 'var(--narae-status-risk)' },
  info: { bg: 'color-mix(in srgb, var(--narae-status-info) 14%, transparent)', fg: 'var(--narae-status-info)' },
  neutral: { bg: 'var(--color-background-alternative, #f1f3f5)', fg: 'var(--color-text-basic)' },
  primary: { bg: 'color-mix(in srgb, var(--narae-accent) 12%, transparent)', fg: 'var(--narae-accent)' },
}

export default function Badge({ variant = 'neutral', children }) {
  const v = VARIANT[variant] ?? VARIANT.neutral
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '2px var(--krds-space-5)', borderRadius: 'var(--krds-radius-pill)',
        fontSize: 'var(--krds-body-xsmall, 13px)', fontWeight: 'var(--krds-weight-medium)',
        background: v.bg, color: v.fg, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

// 위험등급(OK/WARN/RISK) → Badge
export function RiskBadge({ grade }) {
  const map = { OK: 'ok', WARN: 'warn', RISK: 'risk' }
  return <Badge variant={map[grade] ?? 'neutral'}>{RISK_GRADE[grade] ?? grade}</Badge>
}

// 업무 상태(PENDING/IN_PROGRESS/…) → Badge
export function StatusBadge({ status }) {
  const map = {
    PENDING: 'neutral', IN_PROGRESS: 'primary', COMPLETED: 'ok', ON_HOLD: 'warn', DELAYED: 'risk',
  }
  return <Badge variant={map[status] ?? 'neutral'}>{TASK_STATUS[status] ?? status}</Badge>
}
