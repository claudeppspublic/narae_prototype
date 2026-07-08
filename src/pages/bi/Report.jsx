// SCR-RB-03 — 보고서 (자동 생성·발송 HITL)
// RB03-01 주기 선택→미리보기 갱신 · RB03-02 발송(승인 모달→발송) · 권한 과장+
// INT-RB03-04 결재·BI 반영 초안(from=bi/taskId 컨텍스트 — 직접 진입은 기존 주기 초안)
import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useRoleStore } from '@/store/useRoleStore'
import { useUiStore } from '@/store/useUiStore'
import { seed } from '@/mock'
import { SegToggle } from '@/components/Tabs'
import Card from '@/components/Card'
import SideNav, { BI_ITEMS } from '@/components/SideNav'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import ReportDraft from '@/components/ReportDraft'
import WorkDetailDrawer from '@/components/WorkDetailDrawer'

const PERIODS = [{ key: 'week', label: '주간' }, { key: 'month', label: '월간' }, { key: 'quarter', label: '분기' }]

export default function Report() {
  const role = useRoleStore((s) => s.role) // role 직접 구독 → 역할 토글 시 리렌더
  const toast = useUiStore((s) => s.toast)
  const navigate = useNavigate()
  const [period, setPeriod] = useState('week')
  const [confirm, setConfirm] = useState(false)
  const [sent, setSent] = useState(false)

  // INT-RB03-04: BI/결재 컨텍스트 감지 — biSnapshot은 정적 mock 단일 원천(INT-RB01-05 전달=from=bi)
  const [params] = useSearchParams()
  const fromBi = params.get('from') === 'bi'
  const ctxTaskId = params.get('taskId')
  const hasContext = fromBi || !!ctxTaskId
  const [drawerTaskId, setDrawerTaskId] = useState(null) // 결재 이력 역링크 → WF-02

  // INT-RB03-05: 필수 항목(기간·대상) — 비면 발송 차단·인라인 오류·포커스 (spec §7)
  const [range, setRange] = useState({ from: '2026-06-29', to: '2026-07-05' })
  const [recipient, setRecipient] = useState('기획조정실장')
  const [fieldErrors, setFieldErrors] = useState({})
  const requestSend = () => {
    const errs = {}
    if (!range.from || !range.to) errs.range = '기간을 입력하세요'
    if (!recipient.trim()) errs.recipient = '대상(수신처)을 입력하세요'
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      document.getElementById(errs.range ? 'rb03-range-from' : 'rb03-recipient')?.focus()
      return // 승인 모달 미표시 (발송 차단)
    }
    setConfirm(true)
  }

  const canSend = ['ROLE_ADMIN', 'ROLE_DIR', 'ROLE_CHF'].includes(role) // 과장+
  const stats = useMemo(() => {
    const t = seed.tasks
    return {
      total: t.length,
      done: t.filter((x) => x.status === 'COMPLETED').length,
      delayed: t.filter((x) => x.riskGrade === 'RISK' || x.status === 'DELAYED').length,
    }
  }, [])
  const label = PERIODS.find((p) => p.key === period).label

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={BI_ITEMS} title="모니터링" />
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--krds-space-9)', flexWrap: 'wrap', gap: 'var(--krds-space-6)' }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: 0 }}>보고서</h1>
        <SegToggle items={PERIODS} value={period} onChange={(v) => { setPeriod(v); setSent(false) }} size="sm" />
      </div>

      {/* 미리보기 — 컨텍스트 진입=결재·BI 초안(INT-RB03-04) / 직접 진입=기존 주기 초안 */}
      <Card style={{ marginBottom: 'var(--krds-space-8)' }}>
        {hasContext ? (
          <>
            <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)', marginBottom: 'var(--krds-space-6)' }}>
              미리보기 · 결재·BI 분석 초안 (mock 자동 생성 · 편집 가능)
            </div>
            <ReportDraft taskId={ctxTaskId}
              onApprovalLink={(tid) => setDrawerTaskId(tid)}
              onBiLink={() => navigate(ctxTaskId ? `/monitoring/dashboard?taskId=${ctxTaskId}` : '/monitoring/dashboard')} />
          </>
        ) : (
          <>
            <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)', marginBottom: 'var(--krds-space-5)' }}>미리보기 · {label} 업무 보고서 (mock 자동 생성)</div>
            <h2 style={{ fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-6)' }}>{label} 업무 추진 현황 보고</h2>
            <ul style={{ lineHeight: 2, paddingLeft: 'var(--krds-space-8)' }}>
              <li>총 관리 업무: <b>{stats.total}건</b></li>
              <li>완료: <b>{stats.done}건</b> · 지연·위험: <b style={{ color: 'var(--color-risk-text)' }}>{stats.delayed}건</b></li>
              <li>주요 리스크: 디지털 예산관리 시스템 구축 지연, AI 민원처리 담당자 과부하</li>
              <li>{label} 중점 추진 사항 및 다음 기간 계획 (mock 요약)</li>
            </ul>
          </>
        )}
      </Card>

      {/* INT-RB03-05 필수 항목(기간·대상) — 비면 발송 차단·인라인 오류 */}
      <Card style={{ marginBottom: 'var(--krds-space-8)' }}>
        <div style={{ display: 'flex', gap: 'var(--krds-space-9)', flexWrap: 'wrap' }}>
          <div>
            <FieldLabel required>기간</FieldLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-4)' }}>
              <input id="rb03-range-from" type="date" value={range.from} aria-label="기간 시작"
                onChange={(e) => { setRange((r) => ({ ...r, from: e.target.value })); if (e.target.value && range.to) setFieldErrors((f) => ({ ...f, range: undefined })) }}
                style={{ ...formInput, ...(fieldErrors.range ? formError : {}) }} />
              <span aria-hidden>~</span>
              <input type="date" value={range.to} aria-label="기간 종료"
                onChange={(e) => { setRange((r) => ({ ...r, to: e.target.value })); if (range.from && e.target.value) setFieldErrors((f) => ({ ...f, range: undefined })) }}
                style={{ ...formInput, ...(fieldErrors.range ? formError : {}) }} />
            </div>
            {fieldErrors.range && <FieldError id="rb03-err-range">{fieldErrors.range}</FieldError>}
          </div>
          <div>
            <FieldLabel required>대상(수신처)</FieldLabel>
            <input id="rb03-recipient" value={recipient} aria-label="대상(수신처)"
              onChange={(e) => { setRecipient(e.target.value); if (e.target.value.trim()) setFieldErrors((f) => ({ ...f, recipient: undefined })) }}
              style={{ ...formInput, width: 220, ...(fieldErrors.recipient ? formError : {}) }} />
            {fieldErrors.recipient && <FieldError id="rb03-err-recipient">{fieldErrors.recipient}</FieldError>}
          </div>
        </div>
      </Card>

      {/* 발송 (승인 HITL) — INT-RB03-05 유효성 통과 시에만 승인 모달 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--krds-space-5)', alignItems: 'center' }}>
        {!canSend && <span style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>발송은 과장+ 권한이 필요합니다</span>}
        {sent ? <span style={{ color: 'var(--color-ok-text)', fontWeight: 'var(--krds-weight-bold)' }}>✓ 발송 완료</span>
          : <span data-testid="rb03-05"><Button size="md" onClick={requestSend} disabled={!canSend}>발송</Button></span>}
      </div>

      {/* 승인 모달 */}
      <Modal open={confirm} onClose={() => setConfirm(false)} title="보고서 발송 승인"
        footer={<>
          <Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>취소</Button>
          <Button size="sm" onClick={() => { setConfirm(false); setSent(true); toast('보고서가 발송되었습니다 (mock)', 'ok') }}>승인·발송</Button>
        </>}>
        <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }}>{label} 업무 보고서를 상급자에게 발송합니다. 진행하시겠습니까?</p>
      </Modal>

      {/* INT-RB03-04 ⑦ 결재 이력 역링크 → 근거 결재(WF-02) */}
      <WorkDetailDrawer taskId={drawerTaskId} open={!!drawerTaskId} onClose={() => setDrawerTaskId(null)} />
      </div>
    </div>
  )
}

function FieldLabel({ children, required }) {
  return (
    <div style={{ fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-3)' }}>
      {children}{required && <span aria-hidden style={{ color: 'var(--color-risk-text)' }}> *</span>}
    </div>
  )
}
function FieldError({ id, children }) {
  return (
    <div id={id} role="alert" style={{ marginTop: 'var(--krds-space-3)', fontSize: 'var(--narae-caption)', color: 'var(--color-risk-text)', fontWeight: 'var(--krds-weight-medium)' }}>
      {children}
    </div>
  )
}

const formInput = {
  height: 'var(--krds-control-small)', padding: '0 var(--krds-space-6)',
  borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic,#e5e7eb)',
  background: 'var(--color-background-white)', color: 'var(--color-text-basic)', fontSize: 'var(--krds-body-small)',
}
const formError = { border: '1.5px solid var(--color-risk-border)', background: 'var(--color-risk-bg)' }
