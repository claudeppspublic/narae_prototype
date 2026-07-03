// SCR-WF-03 — 조직 목표 설정 (목표·핵심결과 계층·진척 롤업)
// WF03-01 목표 노드 클릭→하위 핵심결과 전개·진척 롤업 · FN-WF03-1/2 · 상태 5종
import { useState } from 'react'
import { api } from '@/mock'
import { findOrg } from '@/mock/orgUnits'
import { useAsync } from '@/lib/useAsync'
import WorkNav from '@/components/WorkNav'
import Card from '@/components/Card'
import Badge from '@/components/Badge'
import { AsyncView } from '@/components/StateViews'

// 진척 롤업: 핵심결과 진척 평균
const rollup = (g) => g.keyResults.length
  ? Math.round(g.keyResults.reduce((s, kr) => s + (kr.progress ?? 0), 0) / g.keyResults.length)
  : 0

export default function GoalSetting() {
  const { data: goals, loading, error, reload } = useAsync(() => api.getGoals({ delay: 400 }), [])
  const [openId, setOpenId] = useState(null)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <WorkNav />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-9)' }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-4)' }}>조직 목표 설정</h1>
        <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }}>
          목표(GOAL)·핵심결과 계층과 연결 업무 기반 진척 롤업을 확인합니다.
        </p>

        <AsyncView loading={loading} error={error} data={goals} reload={reload}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)' }}>
            {(goals ?? []).map((g) => {
              const open = openId === g.goalId
              const progress = rollup(g)
              return (
                <Card key={g.goalId}>
                  <button onClick={() => setOpenId(open ? null : g.goalId)}
                    style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 'var(--krds-space-5)', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    <span style={{ color: 'var(--color-text-assistive,#9ca3af)' }}>{open ? '▾' : '▸'}</span>
                    <Badge variant="primary">목표</Badge>
                    <span style={{ flex: 1, fontWeight: 'var(--krds-weight-bold)', fontSize: 'var(--krds-body-large)' }}>{g.objective}</span>
                    <span style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>
                      {findOrg(g.orgUnitId)?.orgUnitNm} · {g.level}
                    </span>
                    <b style={{ color: 'var(--narae-accent)', minWidth: 44, textAlign: 'right' }}>{progress}%</b>
                  </button>
                  <div style={{ height: 6, background: 'var(--color-border-basic,#e5e7eb)', borderRadius: 4, marginTop: 'var(--krds-space-5)' }}>
                    <div style={{ width: `${progress}%`, height: 6, background: 'var(--narae-accent)', borderRadius: 4 }} />
                  </div>

                  {open && (
                    <div style={{ marginTop: 'var(--krds-space-7)', paddingLeft: 'var(--krds-space-9)', borderLeft: '2px solid var(--color-border-basic,#eef0f2)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)' }}>
                      {g.keyResults.map((kr) => (
                        <div key={kr.krId}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--krds-space-3)' }}>
                            <span><Badge variant="neutral">KR</Badge> {kr.title}</span>
                            <b>{kr.progress}%</b>
                          </div>
                          <div style={{ height: 5, background: 'var(--color-border-basic,#e5e7eb)', borderRadius: 4 }}>
                            <div style={{ width: `${kr.progress}%`, height: 5, background: 'var(--narae-accent)', borderRadius: 4 }} />
                          </div>
                          <div style={{ marginTop: 'var(--krds-space-3)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>
                            연결 업무 {kr.linkedTaskIds?.length ?? 0}건
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </AsyncView>
      </section>
    </div>
  )
}
