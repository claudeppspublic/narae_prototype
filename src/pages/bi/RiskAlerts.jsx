// SCR-RB-02 — 리스크 알림 (헤더 알림 벨 진입 · 알림센터 대체)
// RB02-01 리스크 항목→업무 상세(WF-02) 이동 · RB02-02 권한자 라우팅 제안→승인 시 알림
// FN-RB02-2(리스크 목록) · FN-RB02-3(권한자 라우팅) · 상태 5종
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/mock'
import { useAsync } from '@/lib/useAsync'
import { useUiStore } from '@/store/useUiStore'
import Card from '@/components/Card'
import Badge from '@/components/Badge'
import Tabs from '@/components/Tabs'
import SideNav, { BI_ITEMS } from '@/components/SideNav'
import { AsyncView } from '@/components/StateViews'

const SEV = { RISK: { label: '위험', variant: 'risk' }, WARN: { label: '경고', variant: 'warn' }, OK: { label: '정상', variant: 'ok' } }

export default function RiskAlerts() {
  const navigate = useNavigate()
  const toast = useUiStore((s) => s.toast)
  const { data: risks, loading, error, reload } = useAsync(() => api.getRisks({ delay: 400 }), [])
  const [tab, setTab] = useState('all')
  const [approved, setApproved] = useState(() => new Set())

  const filtered = (risks ?? []).filter((r) => tab === 'all' || r.type === tab)

  const propose = (riskId, e) => {
    e.stopPropagation()
    setApproved((s) => new Set(s).add(riskId))
    toast('권한자 라우팅 제안이 승인되어 알림이 발송되었습니다 (mock)', 'ok')
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={BI_ITEMS} title="모니터링" />
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)' }}>
      <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-4)' }}>리스크 알림</h1>
      <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }}>
        일정·병목 리스크를 등급별로 확인하고 담당 업무로 이동합니다.
      </p>

      <div style={{ marginBottom: 'var(--krds-space-8)' }}>
        <Tabs items={[{ key: 'all', label: '전체' }, { key: '일정', label: '일정' }, { key: '병목', label: '병목' }]}
          value={tab} onChange={setTab} />
      </div>

      <AsyncView loading={loading} error={error} data={filtered} reload={reload}
        empty={<div style={{ padding: 'var(--krds-space-11)', textAlign: 'center', color: 'var(--color-text-assistive,#9ca3af)' }}>해당 유형의 리스크가 없습니다.</div>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-5)' }}>
          {filtered.map((r) => {
            const sev = SEV[r.severity]
            return (
              <Card key={r.riskId} hoverable onClick={() => navigate(`/work/table?drawer=${r.refId}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)' }}>
                  <Badge variant={sev.variant}>{sev.label}</Badge>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'var(--krds-weight-medium)' }}>{r.title}</div>
                    <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>
                      {r.type} · 대상 {r.refId} · {r.detectedAt}
                    </div>
                  </div>
                  {approved.has(r.riskId) ? (
                    <Badge variant="ok">라우팅 승인됨</Badge>
                  ) : (
                    <button onClick={(e) => propose(r.riskId, e)} style={proposeBtn}>권한자 라우팅 제안</button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </AsyncView>
      </div>
    </div>
  )
}

const proposeBtn = {
  height: 'var(--krds-control-xsmall)', padding: '0 var(--krds-space-7)', cursor: 'pointer',
  borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--narae-accent)',
  background: 'var(--color-background-white)', color: 'var(--narae-accent)', fontWeight: 'var(--krds-weight-medium)',
  fontSize: 'var(--krds-body-small)', whiteSpace: 'nowrap',
}
