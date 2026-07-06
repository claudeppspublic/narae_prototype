// BiDrawer — 홈(CM-03) 목표관리 BI Drawer (FN-CM03-5, CM03-10/11).
// 단위별(조직/실무자/업무) 지표 카드 + recharts 그래프 + 상황요약 텍스트(필수).
// 업무 단위: 결재 프로세스 미니 요약(INT-CM03-13) + [결재 상세 보기]→WF-02(INT-CM03-14) + 반려 사유(INT-CM03-15)
import Drawer from '@/components/Drawer'
import Badge from '@/components/Badge'
import AiSummaryBanner from '@/components/AiSummaryBanner'
import ApprovalTimeline from '@/components/ApprovalTimeline'
import { useApprovalStore, effectiveLinesOf } from '@/store/useApprovalStore'
import { APPROVAL_STAGE } from '@/lib/approval'
import { biForNode } from '@/mock/bi'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

// 지표 값 '텍스트' 색 — 상태색상정책 §2.2: 텍스트는 -text 단계만(-base 금지)
const TONE = {
  ok: 'var(--color-ok-text)', warn: 'var(--color-warn-text)',
  risk: 'var(--color-risk-text)', primary: 'var(--narae-accent)',
  neutral: 'var(--color-text-basic)',
}

// --narae-caption(12px)과 동일 — recharts tick은 SVG 속성이라 var() 미지원
const CHART_TICK = { fontSize: 12 }
const PIE_COLORS = ['var(--narae-accent)', 'var(--color-border-basic, #e5e7eb)']

export default function BiDrawer({ open, node, onClose, onApprovalDetail }) {
  const bi = node ? biForNode(node) : null
  const submitted = useApprovalStore((s) => s.submitted)
  // INT-CM03-13: 업무 단위 + 결재선 존재 시에만 미니 섹션 (없으면 숨김 — spec 엣지)
  const approvalLines = node?.nodeType === 'TASK' ? effectiveLinesOf(node.refId, submitted) : []

  return (
    <Drawer open={open && !!bi} onClose={onClose} title={bi ? `${bi.unit} · 목표관리 BI` : 'BI'} width="var(--narae-drawer-md)">
      {bi && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-9)' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)' }}>
            {bi.title}
          </h3>

          {/* INT-CM03-13 결재 프로세스 미니 요약 (지표 카드 위) */}
          {approvalLines.length > 0 && (
            <ApprovalMini lines={approvalLines} taskId={node.refId} onDetail={onApprovalDetail} />
          )}

          {/* 지표 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--krds-space-5)' }}>
            {bi.metrics.map((m) => (
              <div key={m.label} style={metricCard}>
                <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>{m.label}</div>
                <div style={{ fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)', color: TONE[m.tone] ?? TONE.neutral }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* 그래프 */}
          {bi.statusChart && bi.statusChart.length > 0 && (
            <Section title="상태 분포">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={bi.statusChart}>
                  <XAxis dataKey="label" tick={CHART_TICK} />
                  <YAxis allowDecimals={false} tick={CHART_TICK} width={24} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--narae-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          )}

          {bi.workloadChart && bi.workloadChart.length > 0 && (
            <Section title="담당자 편중">
              <ResponsiveContainer width="100%" height={Math.max(120, bi.workloadChart.length * 28)}>
                <BarChart data={bi.workloadChart} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" allowDecimals={false} tick={CHART_TICK} />
                  <YAxis type="category" dataKey="name" tick={CHART_TICK} width={64} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--narae-status-info)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          )}

          {bi.progressChart && (
            <Section title="진행률">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={bi.progressChart} dataKey="value" nameKey="label" innerRadius={40} outerRadius={64}>
                    {bi.progressChart.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Section>
          )}

          {/* 관련 목표 (업무 단위) */}
          {bi.linkedGoals && bi.linkedGoals.length > 0 && (
            <Section title="관련 목표">
              {bi.linkedGoals.map((g) => (
                <div key={g.goalId} style={{ marginBottom: 'var(--krds-space-4)' }}>
                  <Badge variant="primary">목표</Badge>{' '}
                  <span style={{ fontWeight: 'var(--krds-weight-medium)' }}>{g.objective}</span>
                </div>
              ))}
            </Section>
          )}

          {/* 상황요약 (필수) */}
          <Section title="상황 요약">
            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-text-basic)' }}>{bi.summary}</p>
          </Section>
        </div>
      )}
    </Drawer>
  )
}

// 결재 프로세스 미니 요약 — ✦ AI 1줄 + 미니 스텝 + 현재 단계 메타 + [결재 상세 보기]
function ApprovalMini({ lines, taskId, onDetail }) {
  const current = lines.find((l) => l.approvalStatus === 'APPROVING' || l.approvalStatus === 'REJECTED') ?? lines[0]
  return (
    <div data-testid="cm03-22" style={{
      padding: 'var(--krds-space-7)', borderRadius: 'var(--krds-radius-medium)',
      border: '1px solid var(--color-border-basic,#e5e7eb)', background: 'var(--color-background-white)',
      display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-6)',
    }}>
      <div style={{ fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)' }}>
        결재 프로세스
      </div>
      <AiSummaryBanner screen="cm03" contextType="task" contextId={taskId} />
      <ApprovalTimeline lines={lines} compact testid="cm03-22-steps" />
      <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>
        현재 {APPROVAL_STAGE[current.role] ?? current.role} · {current.approverNm} {current.title} · {current.elapsedDays}일차
        {current.delegation ? ` · ${current.delegation}` : ''}
      </div>
      {onDetail && (
        <button data-testid="cm03-23" onClick={() => onDetail(taskId)} style={detailBtn}>
          결재 상세 보기
        </button>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-5)' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

const detailBtn = {
  alignSelf: 'flex-start', height: 'var(--krds-control-xsmall)', padding: '0 var(--krds-space-7)',
  cursor: 'pointer', borderRadius: 'var(--krds-radius-medium)',
  border: '1px solid var(--narae-accent)', background: 'var(--color-background-white)',
  color: 'var(--narae-accent)', fontSize: 'var(--krds-body-small)', fontWeight: 'var(--krds-weight-bold)',
}

const metricCard = {
  padding: 'var(--krds-space-6)', borderRadius: 'var(--krds-radius-medium)',
  background: 'var(--color-background-alternative, #f8f9fa)',
  display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-2)',
}
