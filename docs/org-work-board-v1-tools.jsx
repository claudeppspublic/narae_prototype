import { useState } from 'react';
import {
  ChevronRight, Building2, Users, User, ClipboardList, BarChart3, X, CornerDownRight,
  Layers, FileText, Scale, ClipboardCheck, ShieldAlert, GripVertical, Target,
} from 'lucide-react';

const ORG = {
  id: 'root', name: '한빛 주식회사',
  children: [
    { id: 'mgmt', name: '경영본부', children: [
      { id: 'hr', name: '인사팀', employees: [
        { id: 'e1', name: '김서연', title: '책임' }, { id: 'e2', name: '박지호', title: '선임' }] },
      { id: 'fin', name: '재무팀', employees: [{ id: 'e3', name: '이준', title: '책임' }] },
    ] },
    { id: 'tech', name: '기술본부', children: [
      { id: 'dev', name: '개발실', children: [
        { id: 'platform', name: '플랫폼파트', employees: [
          { id: 'e4', name: '최유나', title: '리드' }, { id: 'e5', name: '정민호', title: '선임' }] },
        { id: 'data', name: '데이터파트', employees: [{ id: 'e6', name: '한도윤', title: '책임' }] },
      ] },
      { id: 'qa', name: '품질팀', employees: [{ id: 'e7', name: '오세라', title: '선임' }] },
    ] },
  ],
};
const CATEGORIES = ['인사', '자금', '관리', '기술', '정보'];
const RANGES = ['주', '월', '분기'];
const STATUS = {
  ok:   { label: '정상', fg: '#047857', bg: '#ecfdf5', dot: '#10b981' },
  warn: { label: '주의', fg: '#b45309', bg: '#fffbeb', dot: '#f59e0b' },
  risk: { label: '위험', fg: '#be123c', bg: '#fff1f2', dot: '#f43f5e' },
};
const TOOLS = [
  { id: 'minutes', name: '회의록', icon: FileText, color: '#0ea5e9' },
  { id: 'rules',   name: '규정',   icon: Scale, color: '#8b5cf6' },
  { id: 'eval',    name: '업무 평가', icon: ClipboardCheck, color: '#10b981' },
  { id: 'risk',    name: '리스크 평가', icon: ShieldAlert, color: '#f43f5e' },
];
const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

const NODE_MAP = {};
(function index(n) { NODE_MAP[n.id] = n; (n.children || []).forEach(index); })(ORG);
function empById(id) {
  for (const k in NODE_MAP) {
    const e = (NODE_MAP[k].employees || []).find((x) => x.id === id);
    if (e) return e;
  }
  return null;
}
function tasksFor(emp, category) {
  if (!emp) return [];
  const seed = emp.id.charCodeAt(1) + category.length;
  const n = 3 + (seed % 4);
  return Array.from({ length: n }, (_, i) => {
    const id = `${emp.id}-${category}-${i + 1}`;
    return {
      id, label: `${category} 업무 ${i + 1}`, status: ['ok', 'warn', 'risk'][(seed + i) % 3],
      detail: Array.from({ length: 2 + (i % 2) }, (_, j) => ({ id: `${id}-d${j + 1}`, label: j === 0 ? '현황' : `상세 ${j}` })),
    };
  });
}

export default function OrgWorkBoardV1Tools() {
  const [path, setPath] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [category, setCategory] = useState('인사');
  const [range, setRange] = useState('월');
  const [taskId, setTaskId] = useState(null);
  const [panel, setPanel] = useState(null);            // {type:'detail',node} | {type:'tool',toolId,hostId}
  const [attachments, setAttachments] = useState({});  // hostId -> [toolId]
  const [dragOver, setDragOver] = useState(null);

  const current = path.length ? NODE_MAP[path[path.length - 1]] : ORG;
  const childOrgs = current.children || null;
  const employees = current.employees || null;
  const emp = employeeId ? empById(employeeId) : null;
  const tasks = tasksFor(emp, category);
  const task = tasks.find((t) => t.id === taskId) || null;

  function resetDown() { setEmployeeId(null); setTaskId(null); }
  function drill(id) { setPath((p) => [...p, id]); resetDown(); }
  function collapseTo(i) { setPath((p) => p.slice(0, i)); resetDown(); setPanel(null); }
  function attach(hostId, toolId) {
    setAttachments((prev) => {
      const cur = prev[hostId] || [];
      if (cur.includes(toolId)) return prev;
      return { ...prev, [hostId]: [...cur, toolId] };
    });
  }
  function dropProps(hostId) {
    return {
      onDragOver: (e) => { e.preventDefault(); setDragOver(hostId); },
      onDragLeave: () => setDragOver((d) => (d === hostId ? null : d)),
      onDrop: (e) => { e.preventDefault(); const t = e.dataTransfer.getData('text/tool'); if (t) attach(hostId, t); setDragOver(null); },
    };
  }
  function hostLabel(id) {
    if (NODE_MAP[id]) return NODE_MAP[id].name;
    const e = empById(id); if (e) return e.name;
    const t = tasks.find((x) => x.id === id); if (t) return t.label;
    return '노드';
  }

  return (
    <div className="w-full" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">

        {/* 상단 바 */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4" style={{ height: 52 }}>
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">조직·업무 보드</span>
            <div className="ml-3 flex items-center gap-1">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => { setCategory(c); setTaskId(null); }}
                  className="rounded-md px-3 py-1 text-xs font-medium transition-colors"
                  style={category === c ? { background: '#4f46e5', color: '#fff' } : { color: '#64748b' }}>{c}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {RANGES.map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                style={range === r ? { background: '#fff', color: '#0f172a' } : { color: '#64748b' }}>{r}</button>
            ))}
          </div>
        </div>

        {/* 도구 팔레트 (탭 하위) */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4" style={{ height: 46 }}>
          <span className="mr-1 text-[11px] font-medium text-slate-400">도구</span>
          {TOOLS.map((t) => (
            <div key={t.id} draggable
                 onDragStart={(e) => e.dataTransfer.setData('text/tool', t.id)}
                 className="flex cursor-grab items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 active:cursor-grabbing"
                 style={{ userSelect: 'none' }}>
              <GripVertical size={11} className="text-slate-300" />
              <t.icon size={13} style={{ color: t.color }} />{t.name}
            </div>
          ))}
          <span className="ml-2 text-[11px] text-slate-400">드래그해서 업무·실무자·팀 행에 놓기</span>
        </div>

        {/* 본문 */}
        <div className="flex" style={{ height: 528 }}>
          <div className="flex min-w-0 flex-1 overflow-x-auto">
            {/* 접힌 스파인 */}
            {path.map((id, i) => (
              <button key={id} onClick={() => collapseTo(i)}
                className="flex shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50 transition-colors hover:bg-slate-100"
                style={{ width: 34 }} title="이 단계로 돌아가기">
                <span className="text-xs text-slate-500" style={{ writingMode: 'vertical-rl' }}>{NODE_MAP[id].name}</span>
              </button>
            ))}

            {/* 조직 컬럼 (팀 = 드롭 대상) */}
            {childOrgs && (
              <Column icon={<Building2 size={13} />} title={`조직 (${path.length + 1}depth)`}>
                {childOrgs.map((o) => (
                  <div key={o.id}>
                    <Row onClick={() => drill(o.id)} active={false} over={dragOver === o.id} dnd={dropProps(o.id)}
                         trailing={<ChevronRight size={14} className="text-slate-300" />}>{o.name}</Row>
                    <AttachChips ids={attachments[o.id]} onOpen={(tid) => setPanel({ type: 'tool', toolId: tid, hostId: o.id })} />
                  </div>
                ))}
              </Column>
            )}

            {/* 근무자 컬럼 (실무자 = 드롭 대상) */}
            {employees && (
              <Column icon={<Users size={13} />} title="소속 근무자">
                {employees.map((e) => (
                  <div key={e.id}>
                    <Row onClick={() => { setEmployeeId(e.id); setTaskId(null); }} active={employeeId === e.id}
                         over={dragOver === e.id} dnd={dropProps(e.id)}
                         trailing={<span className="text-[11px] text-slate-400">{e.title}</span>}>{e.name}</Row>
                    <AttachChips ids={attachments[e.id]} onOpen={(tid) => setPanel({ type: 'tool', toolId: tid, hostId: e.id })} />
                  </div>
                ))}
              </Column>
            )}

            {/* 업무 스택 (업무 = 드롭 대상) */}
            {emp && (
              <div className="shrink-0 border-r border-slate-200" style={{ width: 230 }}>
                <ColHeader icon={<ClipboardList size={13} />} title={`${emp.name} · ${category}`} />
                <div className="space-y-2 overflow-y-auto p-2" style={{ height: 476 }}>
                  {tasks.map((t) => {
                    const st = STATUS[t.status], on = taskId === t.id, over = dragOver === t.id;
                    return (
                      <div key={t.id}>
                        <button onClick={() => { setTaskId(t.id); setPanel(null); }} {...dropProps(t.id)}
                          className="w-full rounded-lg border p-3 text-left transition-all"
                          style={{ borderColor: over || on ? '#4f46e5' : '#e2e8f0', background: over || on ? '#eef2ff' : '#fff' }}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">{t.label}</span>
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]" style={{ background: st.bg, color: st.fg }}>
                              <span style={{ width: 5, height: 5, borderRadius: 9, background: st.dot }} />{st.label}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-slate-400">상세 {t.detail.length}단계 · {range}</div>
                        </button>
                        <AttachChips ids={attachments[t.id]} onOpen={(tid) => setPanel({ type: 'tool', toolId: tid, hostId: t.id })} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 상세 체인 */}
            {task && (
              <div className="shrink-0 border-r border-slate-200 bg-slate-50" style={{ width: 480 }}>
                <ColHeader icon={<CornerDownRight size={13} />} title={`${task.label} · 상세`} muted="줌/팬 영역 (React Flow)" />
                <div className="flex items-center overflow-x-auto p-4" style={{ height: 476 }}>
                  {task.detail.map((d, i) => (
                    <div key={d.id} className="flex items-center">
                      {i > 0 && <div style={{ width: 28, height: 1, background: '#cbd5e1' }} />}
                      <button onClick={() => setPanel({ type: 'detail', node: d })}
                        className="shrink-0 rounded-lg border bg-white p-3 text-left transition-all hover:border-indigo-300"
                        style={{ width: 132, borderColor: panel?.type === 'detail' && panel.node.id === d.id ? '#4f46e5' : '#e2e8f0' }}>
                        <div className="text-xs font-medium text-slate-700">{d.label}</div>
                        <div className="mt-2 flex items-end gap-1" style={{ height: 28 }}>
                          {[40, 70, 55, 85].map((h, k) => <span key={k} style={{ width: 6, height: `${h}%`, background: '#c7d2fe', borderRadius: 2 }} />)}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!emp && !childOrgs && !employees && <Empty />}
          </div>

          {/* 우측 고정 BI */}
          <div className="shrink-0 border-l border-slate-200 bg-slate-50" style={{ width: 180 }}>
            <ColHeader icon={<BarChart3 size={13} />} title="목표관리 BI" />
            <div className="space-y-3 p-3 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">대상</span><span className="font-medium text-slate-700">{emp ? emp.name : '전사'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">카테고리</span><span className="font-medium text-slate-700">{category}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">기간</span><span className="font-medium text-slate-700">{range}</span></div>
              <div className="pt-1 text-[11px] text-slate-400">달성률 (예시)</div>
              {[['목표 A', 72], ['목표 B', 48], ['목표 C', 90]].map(([n, v]) => (
                <div key={n}>
                  <div className="flex justify-between text-[11px] text-slate-500"><span>{n}</span><span>{v}%</span></div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 4 }}><div style={{ width: `${v}%`, height: 6, background: '#6366f1', borderRadius: 4 }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오버레이 Drawer: 상세 현황 또는 도구 */}
        <div className="absolute inset-y-0 right-0 border-l border-slate-200 bg-white shadow-xl transition-transform"
             style={{ width: 320, transform: panel ? 'translateX(0)' : 'translateX(100%)' }}>
          {panel?.type === 'tool'
            ? <ToolPanel toolId={panel.toolId} host={hostLabel(panel.hostId)} range={range} onClose={() => setPanel(null)} />
            : <DetailPanel node={panel?.type === 'detail' ? panel.node : null} task={task} emp={emp} category={category} range={range} onClose={() => setPanel(null)} />}
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        도구를 드래그→업무·실무자·팀 행에 드롭 → 아래에 도구 칩으로 연결 · 칩 클릭 시 도구 Drawer
      </p>
    </div>
  );
}

// ── 부속 컴포넌트 ───────────────────────────────────────────
function AttachChips({ ids, onOpen }) {
  if (!ids || !ids.length) return null;
  return (
    <div className="mb-1 ml-3 mt-0.5 flex flex-wrap gap-1 border-l-2 pl-2" style={{ borderColor: '#e2e8f0' }}>
      {ids.map((tid) => {
        const t = TOOL_MAP[tid];
        return (
          <button key={tid} onClick={() => onOpen(tid)}
            className="flex items-center gap-1 rounded-md border bg-white px-1.5 py-0.5 text-[10px] text-slate-600"
            style={{ borderColor: '#e2e8f0', borderLeft: `3px solid ${t.color}` }}>
            <t.icon size={10} style={{ color: t.color }} />{t.name}
          </button>
        );
      })}
    </div>
  );
}
function Column({ icon, title, children }) {
  return (
    <div className="shrink-0 border-r border-slate-200" style={{ width: 190 }}>
      <ColHeader icon={icon} title={title} />
      <div className="overflow-y-auto p-1.5" style={{ height: 476 }}>{children}</div>
    </div>
  );
}
function ColHeader({ icon, title, muted }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-slate-200 bg-white px-3" style={{ height: 36 }}>
      <span className="text-slate-400">{icon}</span>
      <span className="text-xs font-medium text-slate-600">{title}</span>
      {muted && <span className="ml-auto text-[10px] text-slate-300">{muted}</span>}
    </div>
  );
}
function Row({ children, onClick, active, trailing, over, dnd }) {
  return (
    <button onClick={onClick} {...dnd}
      className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition-colors"
      style={over ? { background: '#eef2ff', color: '#3730a3', outline: '1px solid #4f46e5' }
                  : active ? { background: '#eef2ff', color: '#3730a3' } : { color: '#334155' }}>
      <span className="truncate">{children}</span>{trailing}
    </button>
  );
}
function Empty() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center"><User size={28} className="mx-auto text-slate-300" />
        <p className="mt-2 text-sm text-slate-400">조직을 선택해 탐색을 시작하세요</p></div>
    </div>
  );
}
function Head({ icon, title, onClose }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-4" style={{ height: 50 }}>
      <div className="flex items-center gap-2">{icon}<span className="text-sm font-medium text-slate-700">{title}</span></div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
    </div>
  );
}
function DetailPanel({ node, task, emp, category, range, onClose }) {
  return (
    <>
      <Head icon={<Target size={15} className="text-indigo-600" />} title="목표관리 BI" onClose={onClose} />
      {node ? (
        <div className="space-y-4 p-4">
          <div className="text-xs text-slate-400">{task?.label} · {emp?.name} · {category} · {range}</div>
          <div className="text-base font-semibold text-slate-800">{node.label}</div>
          <div className="grid grid-cols-2 gap-2">
            {[['처리량', '1,240'], ['지연', '37'], ['완료율', '82%'], ['이슈', '4']].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-200 p-3"><div className="text-[11px] text-slate-400">{k}</div><div className="mt-1 text-lg font-semibold text-slate-800">{v}</div></div>
            ))}
          </div>
        </div>
      ) : <div className="p-4 text-xs text-slate-400">노드를 선택하세요.</div>}
    </>
  );
}
function ToolPanel({ toolId, host, range, onClose }) {
  const t = TOOL_MAP[toolId];
  return (
    <>
      <Head icon={<t.icon size={15} style={{ color: t.color }} />} title={t.name} onClose={onClose} />
      <div className="space-y-4 overflow-y-auto p-4" style={{ height: 478 }}>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">대상 노드</div>
          <div className="text-base font-semibold text-slate-800">{host}</div>
          <div className="mt-0.5 text-[11px] text-slate-400">{range} 기준</div>
        </div>
        {toolId === 'minutes' && <Sec title="최근 회의록">{[['07/24', '주간 스프린트 리뷰'], ['07/17', '분기 목표 점검'], ['07/10', '리스크 공유']].map(([d, ti]) => <Ln key={d} l={ti} r={d} />)}</Sec>}
        {toolId === 'rules' && <Sec title="적용 규정">{[['정보보안 지침', 'v2.3'], ['업무 위임전결', 'v1.1'], ['외주 관리 규정', 'v3.0']].map(([n, v]) => <Ln key={n} l={n} r={v} />)}</Sec>}
        {toolId === 'eval' && <Sec title="업무 평가">{[['성과', 82], ['역량', 76], ['협업', 88]].map(([n, v]) => (
          <div key={n} className="mb-2"><div className="flex justify-between text-[11px] text-slate-500"><span>{n}</span><span>{v}점</span></div>
            <div style={{ height: 7, background: '#e2e8f0', borderRadius: 4 }}><div style={{ width: `${v}%`, height: 7, background: '#10b981', borderRadius: 4 }} /></div></div>
        ))}</Sec>}
        {toolId === 'risk' && <Sec title="리스크 평가">{[['일정 지연', 'risk'], ['인력 공백', 'warn'], ['외부 의존', 'ok']].map(([n, s]) => {
          const st = STATUS[s];
          return <div key={n} className="mb-1.5 flex items-center justify-between"><span className="text-xs text-slate-600">{n}</span>
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]" style={{ background: st.bg, color: st.fg }}><span style={{ width: 5, height: 5, borderRadius: 9, background: st.dot }} />{st.label}</span></div>;
        })}</Sec>}
        <p className="text-[11px] leading-relaxed text-slate-400">* 도구별 상세 항목은 기획 확정 전 예시입니다.</p>
      </div>
    </>
  );
}
function Sec({ title, children }) {
  return <div className="rounded-lg border border-slate-200 p-3"><div className="mb-2 text-xs font-medium text-slate-500">{title}</div>{children}</div>;
}
function Ln({ l, r }) {
  return <div className="flex justify-between py-1 text-xs"><span className="text-slate-600">{l}</span><span className="text-slate-400">{r}</span></div>;
}
