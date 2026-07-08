// SCR-ID ↔ 경로 ↔ 컴포넌트 매핑 (기술스택정의서 §7, 화면상세정의서 v1.1 1_메뉴구조도)
// GNB 대메뉴 5개(v1.1 REF-24 D9·D10): 규정(/reg)·업무(/work)·DATA연계(/data-link)·AI(/ai)·모니터링(/monitoring)
// 조직도=홈 조직 트리 진입(GNB 제외·화면 유지) · 회의록=홈 도구 · 관리자/내 정보=별도 · 로그인=레이아웃 밖
import Login from '@/pages/common/Login'
import OrgWorkBoard from '@/pages/home/OrgWorkBoard'
import OrgList from '@/pages/org/OrgList'
import OrgChart from '@/pages/org/OrgChart'
import WorkGantt from '@/pages/work/WorkGantt'
import WorkCalendar from '@/pages/work/WorkCalendar'
import WorkTable from '@/pages/work/WorkTable'
import GoalSetting from '@/pages/work/GoalSetting'
import ProjectRegister from '@/pages/work/ProjectRegister'
import TaskEdit from '@/pages/work/TaskEdit'
import Meeting from '@/pages/meeting/Meeting'
import RegulationTable from '@/pages/reg/RegulationTable'
import RegulationUpload from '@/pages/reg/RegulationUpload'
import QnaAssistant from '@/pages/reg/QnaAssistant'
import DeptDashboard from '@/pages/bi/DeptDashboard'
import RiskAlerts from '@/pages/bi/RiskAlerts'
import Report from '@/pages/bi/Report'
import MyPage from '@/pages/settings/MyPage'
import NotificationSettings from '@/pages/settings/NotificationSettings'
import SecuritySettings from '@/pages/settings/SecuritySettings'
import SystemInfo from '@/pages/settings/SystemInfo'
import DataLink from '@/pages/dl/DataLink'
import RolePermission from '@/pages/admin/RolePermission'
import JobTags from '@/pages/admin/JobTags'
import CommonCodes from '@/pages/admin/CommonCodes'

// gnb: 'reg' | 'work' | 'datalink' | 'ai' | 'monitoring' | 'org'(GNB 제외) | 'home' | 'me' | 'admin' | null(로그인)
// index:true → 부모 경로(/)에 매핑되는 화면
export const routeMeta = [
  { scrId: 'SCR-CM-03', index: true, path: '/', element: OrgWorkBoard, gnb: 'home', title: '홈 — 조직·업무 보드' },
  { scrId: 'SCR-WS-01', path: '/org/list', element: OrgList, gnb: 'org', title: '조직도 — 리스트뷰' },
  { scrId: 'SCR-WS-02', path: '/org/chart', element: OrgChart, gnb: 'org', title: '조직도 — 조직도뷰' },
  { scrId: 'SCR-WF-01-01', path: '/work/gantt', element: WorkGantt, gnb: 'work', title: '업무 간트 차트' },
  { scrId: 'SCR-WF-01-02', path: '/work/calendar', element: WorkCalendar, gnb: 'work', title: '업무 캘린더' },
  { scrId: 'SCR-WF-01-03', path: '/work/table', element: WorkTable, gnb: 'work', title: '업무 테이블' },
  { scrId: 'SCR-WF-03', path: '/work/goals', element: GoalSetting, gnb: 'work', title: '조직 목표 설정' },
  { scrId: 'SCR-WF-04', path: '/work/projects/new', element: ProjectRegister, gnb: 'work', title: '과제 등록' },
  { scrId: 'SCR-WF-05', path: '/work/tasks/:taskId/edit', element: TaskEdit, gnb: 'work', title: '업무 상세/편집' },
  { scrId: 'SCR-DO-01', path: '/meeting', element: Meeting, gnb: 'home', title: '회의록' },
  { scrId: 'SCR-AI-01', path: '/reg/table', element: RegulationTable, gnb: 'reg', title: '규정 테이블' },
  { scrId: 'SCR-AI-02', path: '/reg/upload', element: RegulationUpload, gnb: 'reg', title: '규정 등록' },
  { scrId: 'SCR-AI-03', path: '/ai/qna', element: QnaAssistant, gnb: 'ai', title: 'QnA (AI 어시스턴트)' }, // v1.1 D10: 'AI' 대메뉴 독립
  { scrId: 'SCR-DL-01', path: '/data-link', element: DataLink, gnb: 'datalink', title: 'DATA연계' }, // v1.1 D10 신규 placeholder
  { scrId: 'SCR-RB-01', path: '/monitoring/dashboard', element: DeptDashboard, gnb: 'monitoring', title: '부서 대시보드(BI)' }, // v1.1 D9: /bi→/monitoring
  { scrId: 'SCR-RB-02', path: '/monitoring/risk', element: RiskAlerts, gnb: 'monitoring', title: '리스크 알림' },
  { scrId: 'SCR-RB-03', path: '/monitoring/report', element: Report, gnb: 'monitoring', title: '보고서' },
  { scrId: 'SCR-ST-01', path: '/me', element: MyPage, gnb: 'me', title: '마이페이지' },
  { scrId: 'SCR-ST-02', path: '/me/notifications', element: NotificationSettings, gnb: 'me', title: '알림 설정' },
  { scrId: 'SCR-ST-03', path: '/me/security', element: SecuritySettings, gnb: 'me', title: '보안 설정' },
  { scrId: 'SCR-ST-04', path: '/me/system', element: SystemInfo, gnb: 'me', title: '시스템 정보' },
  { scrId: 'SCR-AD-01', path: '/admin/roles', element: RolePermission, gnb: 'admin', title: '역할·권한 관리' },
  { scrId: 'SCR-AD-02', path: '/admin/tags', element: JobTags, gnb: 'admin', title: '사무분장 태그 관리' },
  { scrId: 'SCR-AD-03', path: '/admin/codes', element: CommonCodes, gnb: 'admin', title: '공통코드 관리' },
]

// 레이아웃 밖 라우트
export const publicRoutes = [
  { scrId: 'SCR-CM-01', path: '/login', element: Login, title: '로그인' },
]

// GNB 대메뉴 5개 (화면상세정의서 v1.1 1_메뉴구조도 — REF-24 D9·D10)
export const gnbMenus = [
  { key: 'reg', label: '규정', to: '/reg/table' },
  { key: 'work', label: '업무', to: '/work/table' },
  { key: 'datalink', label: 'DATA연계', to: '/data-link' },
  { key: 'ai', label: 'AI', to: '/ai/qna' },
  { key: 'monitoring', label: '모니터링', to: '/monitoring/dashboard' },
]
