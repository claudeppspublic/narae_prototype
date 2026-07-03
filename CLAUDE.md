# CLAUDE.md — narae-ai-proto (프론트 프로토타입)

프론트엔드 전용·백엔드 없음(mock). 화면의 진실원천(SoT)은 `specs/SCR-*.md`의 인터랙션 표,
데이터·기능은 정의서(`docs/*정의서*`)다. **구현 전 해당 화면 spec을 반드시 읽는다.**

## 스택 (확정)
- Vite 5 · React 19 · JavaScript(ESM) · react-router-dom 7 · zustand 5
- krds-react 1.1.x (KRDS 정부 표준 디자인시스템) + Tailwind CSS 4
- 노드캔버스 `@xyflow/react` + `dagre` · 간트 `wx-react-gantt`(SVAR, --legacy-peer-deps)
- 캘린더 `@fullcalendar/react` · DnD `@dnd-kit` · 차트 `recharts` · AI챗 `@assistant-ui/react`
- 배포: Vercel · import alias `@/` → `src/`

## SoT 참조 경로
| 자원 | 경로 |
|------|------|
| 화면 스펙 (인터랙션 표) | `specs/SCR-*.md` |
| 정의서 4종 | `docs/` (기능·화면·입출력·스택) |
| 변경이력 | `specs/_CHANGELOG.md` |
| 디자인 토큰 (빌드용) | `src/design-tokens/` |
| 디자인 토큰 (참조) | `design/tokens.css` |
| mock 데이터 | `src/mock/<entity>.js` |

## 스펙 구현 규칙 (★ 인터랙션 누락 방지)
1. 인터랙션은 specs의 `INT-<SCR>-<nn>` ID를 참조해 **1개씩** 구현한다. 명세에 없는 동작 추가 금지.
2. 각 INT의 수용기준(Given-When-Then)을 통과해야 '완료'. 주장 대신 **증거**(스크린샷/테스트/콘솔)를 제시.
3. 명세에 없는 값·동작은 `[CONFIRM: 질문]`으로 남기고 **묻는다**(추측 금지).
4. mock 데이터 키는 입출력정의서 스키마와 **정확히 일치**. 임의 필드 금지.
5. 색·간격·타이포는 `var(--color-*)`, `var(--krds-*)`, `var(--narae-*)` 토큰만 사용(하드코딩 금지).

## 화면 완료 체크리스트 (DoD)
- [ ] specs 인터랙션 표 **모든 INT 행** 구현 + 각 행 증거
- [ ] 상태 5종(초기 / 로딩 / 데이터 있음 / 빈 상태 / 에러) 구현
- [ ] 필터·정렬·폼 유효성 명세대로
- [ ] mock 키가 스키마와 일치
- [ ] `[CONFIRM]` 잔존 없음 (모두 해소)
- [ ] `npm run build` 성공

## 작업 방식
- 화면 1개씩, 그 안에서 INT 1개씩. 시작 전 **플랜 모드**로 계획·검증전략을 확인받는다.
- 구현 후 `/verify-interaction-spec <SCR-ID>`로 전 행 점검.
- 파일 상단 `// SCR-*` ID 주석 필수.
- 커밋: `feat: INT-<SCR>-<nn> <요약>` (INT 단위 커밋 권장).

## 검증
- 가능하면 Playwright(MCP)로 각 INT의 트리거→결과를 브라우저에서 시연·캡처.
- 테스트/스크린샷이 없으면 "완료"로 보지 않는다.
- spec-validator 서브에이전트로 독립 검증 가능.

## 금지
- 백엔드·실 API·실인증 구현
- 토큰 외 하드코딩 색/픽셀
- 정의서에 없는 임의 데이터 (필요 시 `[CONFIRM]`)
- krds-react 컴포넌트 직접 스타일 덮어쓰기 (토큰으로 커스텀)

## 폴더 구조
```
specs/                  ← 화면별 스펙 MD (SoT)
docs/                   ← 정의서 4종
design/                 ← 참조용 토큰·목업 (빌드 미포함)
src/
  design-tokens/        ← 빌드용 토큰 (fig-tokens/fonts/typography/aliases/base/custom)
  tailwind.css          ← Tailwind v4 진입점
  components/           ← 공통 컴포넌트 (Layout/TopBar 등)
  pages/<area>/         ← 화면 컴포넌트 (SCR-* 1:1)
  mock/                 ← 엔터티별 시드 + sleep 유틸
  store/                ← zustand 스토어
  routes.jsx            ← 화면ID ↔ 경로 매핑
  App.jsx               ← 라우팅 + 레이아웃
```

## 명령어
```bash
npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

> 상세 규칙: `.claude/rules/` · 검증 커맨드: `.claude/commands/` · 명세 양식: `INTERACTION_SPEC_TEMPLATE_v2`
