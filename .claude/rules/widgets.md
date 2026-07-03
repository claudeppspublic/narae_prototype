---
description: 복합 위젯 라이브러리 사용 규칙
globs: ["src/pages/**", "src/components/canvas/**", "src/components/gantt/**", "src/components/calendar/**"]
---

## 복합 위젯 매핑

| 용도 | 라이브러리 | 사용 화면 |
|------|-----------|----------|
| 노드 캔버스/플로우/조직도 | `@xyflow/react` + `dagre` | CM-03, WS-01, PM-02, WS-10 |
| 간트 차트 | `wx-react-gantt` (SVAR) | WS-06, PM-03 |
| 캘린더 | `@fullcalendar/react` + daygrid/timegrid/interaction | WS-05 |
| 드래그앤드롭 | `@dnd-kit/core` + sortable | CM-03 도구부착 |
| 차트/BI | `recharts` | RB-01, CM-03 BiDrawer |
| AI 챗 | `@assistant-ui/react` (mock 런타임) | AS-01 |

## 주의사항
- `wx-react-gantt`: React 19 peer-dep 미지원 → `--legacy-peer-deps` 설치 필수
- `recharts`: `react-is` 빌드 오류 → vite.config.js에 `'react-is': 'react'` alias 적용됨
- `@fullcalendar`: `@fullcalendar/core` 의존성 반드시 포함
