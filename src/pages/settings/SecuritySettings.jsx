// SCR-ST-03 — 보안 설정 (2FA·세션·로그인 기록) · FN-ST03-1
import { useState } from 'react'
import { useUiStore } from '@/store/useUiStore'
import SideNav, { SETTINGS_ITEMS } from '@/components/SideNav'
import Card from '@/components/Card'
import Toggle from '@/components/Toggle'
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'
import { EmptyState } from '@/components/StateViews'

const LOGIN_HISTORY = [
  { at: '2026-07-02 09:12', ip: '10.10.24.5', device: 'Chrome · Windows', result: '성공' },
  { at: '2026-07-01 18:40', ip: '10.10.24.5', device: 'Chrome · Windows', result: '성공' },
  { at: '2026-06-30 08:55', ip: '10.10.31.2', device: 'Safari · macOS', result: '성공' },
  { at: '2026-06-29 22:03', ip: '203.0.113.9', device: 'Unknown', result: '실패' },
]

export default function SecuritySettings() {
  const toast = useUiStore((s) => s.toast)
  const [twoFA, setTwoFA] = useState(true)
  const [session, setSession] = useState('30')

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={SETTINGS_ITEMS} title="내 정보" />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)', maxWidth: 860 }}>
        <h1 style={h1}>보안 설정</h1>

        <Card style={{ marginBottom: 'var(--krds-space-7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'var(--krds-weight-bold)' }}>2단계 인증 (2FA)</div>
              <div style={sub2}>로그인 시 추가 인증을 요구합니다.</div>
            </div>
            <Toggle checked={twoFA} onChange={() => { setTwoFA((v) => !v); toast('2FA 설정이 변경되었습니다 (mock)', 'ok') }} />
          </div>
        </Card>

        <Card style={{ marginBottom: 'var(--krds-space-7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'var(--krds-weight-bold)' }}>세션 만료</div>
              <div style={sub2}>미활동 시 자동 로그아웃 시간</div>
            </div>
            <select value={session} onChange={(e) => { setSession(e.target.value); toast('세션 설정이 저장되었습니다 (mock)', 'ok') }} style={select}>
              <option value="15">15분</option><option value="30">30분</option><option value="60">1시간</option>
            </select>
          </div>
        </Card>

        <h2 style={{ fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)', margin: 'var(--krds-space-9) 0 var(--krds-space-6)' }}>로그인 기록</h2>
        {LOGIN_HISTORY.length === 0 ? (
          <EmptyState title="로그인 기록이 없습니다" description="최근 로그인 이력이 생기면 여기에 표시됩니다." />
        ) : (
          <DataTable
            columns={[
              { key: 'at', header: '일시', width: '28%' },
              { key: 'ip', header: 'IP', width: '20%' },
              { key: 'device', header: '기기', width: '32%' },
              { key: 'result', header: '결과', width: '20%', render: (r) => <Badge variant={r.result === '성공' ? 'ok' : 'risk'}>{r.result}</Badge> },
            ]}
            rows={LOGIN_HISTORY} rowKey={(r, i) => i}
          />
        )}
      </section>
    </div>
  )
}

const h1 = { fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-8)' }
const sub2 = { fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }
const select = { height: 'var(--krds-control-small)', padding: '0 var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-white)' }
