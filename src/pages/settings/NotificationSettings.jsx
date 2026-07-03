// SCR-ST-02 — 알림 설정 (알림 ON/OFF)
import { useState } from 'react'
import { useUiStore } from '@/store/useUiStore'
import SideNav, { SETTINGS_ITEMS } from '@/components/SideNav'
import Card from '@/components/Card'
import Toggle from '@/components/Toggle'

const CATEGORIES = [
  { key: 'risk', label: '리스크 알림', desc: '일정·병목 위험 발생 시' },
  { key: 'approval', label: '결재 알림', desc: '결재 요청·승인·반려' },
  { key: 'mention', label: '멘션 알림', desc: '회의록·댓글에서 언급될 때' },
  { key: 'notice', label: '공지 알림', desc: '시스템 공지·업데이트' },
]
const CHANNELS = [{ key: 'app', label: '앱 알림' }, { key: 'email', label: '이메일' }]

export default function NotificationSettings() {
  const toast = useUiStore((s) => s.toast)
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.key, { app: true, email: c.key === 'approval' }])))

  const toggle = (cat, ch) => {
    setPrefs((p) => ({ ...p, [cat]: { ...p[cat], [ch]: !p[cat][ch] } }))
    toast('알림 설정이 저장되었습니다 (mock)', 'ok')
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={SETTINGS_ITEMS} title="내 정보" />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)', maxWidth: 760 }}>
        <h1 style={h1}>알림 설정</h1>
        <p style={sub}>알림 유형과 채널별 수신 여부를 설정합니다.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-5)' }}>
          {CATEGORIES.map((c) => (
            <Card key={c.key}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--krds-space-6)' }}>
                <div>
                  <div style={{ fontWeight: 'var(--krds-weight-bold)' }}>{c.label}</div>
                  <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>{c.desc}</div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--krds-space-7)' }}>
                  {CHANNELS.map((ch) => (
                    <Toggle key={ch.key} checked={prefs[c.key][ch.key]} onChange={() => toggle(c.key, ch.key)} label={ch.label} />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

const h1 = { fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-4)' }
const sub = { color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }
