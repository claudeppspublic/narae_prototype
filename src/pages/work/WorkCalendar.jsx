// SCR-WF-01-02 — 업무 캘린더 (fullcalendar)
// WF0102-01 일/주/월 토글 · WF0102-02 이전/다음 · WF0102-03 +N 더보기 · 업무 클릭→WF-02
// 피드백: 기간 전체가 아닌 시작일·마감일만 표시 · 뷰/주기 토글 위치 고정
import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { api } from '@/mock'
import { useAsync } from '@/lib/useAsync'
import WorkNav from '@/components/WorkNav'
import WorkViewToggle from '@/components/WorkViewToggle'
import { AsyncView } from '@/components/StateViews'
import WorkDetailDrawer from '@/components/WorkDetailDrawer'

const STATUS_COLOR = {
  IN_PROGRESS: 'var(--narae-accent)', COMPLETED: 'var(--narae-status-ok)', PENDING: 'var(--color-text-assistive)',
  ON_HOLD: 'var(--narae-status-warn)', DELAYED: 'var(--narae-status-risk)',
}

export default function WorkCalendar() {
  const calRef = useRef(null)
  const [params, setParams] = useSearchParams()
  const drawerTaskId = params.get('drawer')
  const [scale, setScale] = useState('month')
  const { data: tasks, loading, error, reload } = useAsync(() => api.getTasks({ delay: 400 }), [])

  // 피드백: 기간 바 대신 시작일·마감일 point 이벤트 2개로 분리
  const events = useMemo(() => (tasks ?? []).flatMap((t) => [
    { id: `${t.taskId}__s`, title: `▶ ${t.taskNm} (시작)`, start: t.startAt, allDay: true, color: STATUS_COLOR[t.status], extendedProps: { taskId: t.taskId } },
    { id: `${t.taskId}__e`, title: `■ ${t.taskNm} (마감)`, start: t.endAt, allDay: true, color: STATUS_COLOR[t.status], extendedProps: { taskId: t.taskId } },
  ]), [tasks])

  const onScale = (v) => {
    setScale(v)
    const map = { day: 'timeGridDay', week: 'timeGridWeek', month: 'dayGridMonth' }
    calRef.current?.getApi().changeView(map[v])
  }

  const openTask = (id) => setParams((p) => { p.set('drawer', id); return p })
  const closeDrawer = () => setParams((p) => { p.delete('drawer'); return p })

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <WorkNav />
      <section style={{ flex: 1, overflow: 'auto', padding: 'var(--krds-space-9)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--krds-space-7)', flexWrap: 'wrap', gap: 'var(--krds-space-6)' }}>
          <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: 0 }}>업무 캘린더</h1>
          <WorkViewToggle view="calendar" scale={scale} onScale={onScale} />
        </div>

        <AsyncView loading={loading} error={error} data={tasks} reload={reload}>
          <div className="narae-calendar">
            <FullCalendar
              ref={calRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate="2026-01-15"
              headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
              locale="ko"
              buttonText={{ today: '오늘' }}
              events={events}
              eventClick={(info) => { info.jsEvent.preventDefault(); openTask(info.event.extendedProps.taskId) }}
              dayMaxEvents={3}
              moreLinkText={(n) => `+${n} 더보기`}
              height="auto"
            />
          </div>
        </AsyncView>
      </section>

      <WorkDetailDrawer taskId={drawerTaskId} open={!!drawerTaskId} onClose={closeDrawer} />
    </div>
  )
}
