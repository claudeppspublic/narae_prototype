# specs 변경이력

## 2026-07-08 — 기획문서 4종 v1.0 발행 (REF-23 구현 현행화)

완성 화면 기준으로 정의서 3종을 v0.9→v1.0 갱신하고 목업데이터를 실 시드 코드에서 재추출. v0.9 원본은 보존.

| 문서 | 파일 | 주요 변경 |
|------|------|-----------|
| 기능상세정의서 | `docs/20260708_기능상세정의서_v1.0.xlsx` | REF-23 기능 11건 신설(FN-WF02-17~19·FN-CM03-9~11·FN-RB01-3~5·FN-RB03-3~4) · FN-WF02-16 상태 전이 격상 · FN-WF02-15 ReportDraft 공용화 반영 |
| 입출력데이터정의서 | `docs/20260708_화면별_입출력데이터정의서_v1.0.xlsx` | APPROVAL_LINE 6키 확장(§4.1 정확 일치) · AI_SUMMARY/BI_METRIC/BI_SNAPSHOT 엔터티 신설 · 공통코드 결재상태 REJECTED 신설(색 토큰 매핑) · 입력 6건·출력 9건 추가(실코드 키 일치: range.from/to·recipient·fieldErrors 등) |
| 화면상세정의서 | `docs/20260708_화면상세정의서_v1.0.xlsx` | 인터랙션 12건 등재(WF02-11~14·CM03-22~24·RB01-03~05·RB03-04~05) · WF02-09 전이 격상·WF02-03 구현 확정 · 연결화면 drill 체인 갱신 · 개선요구 '결재 과정 포함' 반영완료 처리 |
| 목업데이터 | `docs/20260708_목업데이터_v1.0.json` | `src/mock/*.js` 29개 export 자동 추출(esbuild) — aiSummaries·biMetrics·biSnapshot 신규 수록, approvalLines 15행 확장분, notifications 26건 등 |

- [CONFIRM] 잔존(정의서에도 표기): 지연 판정 기준값 · SLA 임계 90/70 · B3 외 위젯 drill · 첨부 구성 · REJECTED→재상신 전이 · 초안 재생성 모달.

## 2026-07-07 — REF-23 「결재→BI→보고서 흐름」 Phase 0~4 구현 완료

- **Phase 0** mock 보강(MOCK-01~05): APPROVAL_LINE 확장 6키(15행) · REJECTED 코드+`APPROVAL_TOKEN` · `aiSummary.js` · `biMetrics.js`(B1~B9·biSnapshot) · 결재 알림 2건. 시연 케이스: 지연=T-001-02·반려=T-001-05·미상신=T-001-04·완료=T-001-01.
- **Phase 1** WF-02 INT-11~14: `ApprovalTimeline`·`AiSummaryBanner` 신설, 상신 전이(`useApprovalStore`), 기한 초과 risk·CTA, [BI로 원인 분석] 컨텍스트 이동.
- **Phase 2** CM-03 INT-13~15: 업무/조직 결재 칩·롤업(`ApprovalBadge`), BI Drawer 결재 미니 요약, [결재 상세 보기]→WF-02, 반려 사유 노출. 상신 시 홈 칩 동기 갱신.
- **Phase 3** RB-01 INT-03~05: B1~B9 위젯(`src/pages/bi/widgets/`) + AI 요약 배너 + biContext, B3→WF-02 drill, [보고서 작성]→RB-03.
- **Phase 4** RB-03 INT-04~05: 결재·BI 반영 초안 8섹션(`ReportDraft`, WF-02 보고서 탭 공용) + 역링크 2종, 필수 항목(기간·대상) 발송 차단. INT-02 완료 토스트 검증.
- **§9 DoD**: E2E 시연 12단계 통과(홈→WF-02→RB-01→RB-03→발송 HITL·역링크 포함, 캡처 e2e-01~08) · 신규 파일 hex 0건 · `/verify-interaction-spec` WF-02/CM-03/RB-01/RB-03 신규 INT 전부 DONE.
- **[CONFIRM] 잔존(지시서 §8 가정값 채택·유지)**: 지연 기준값·SLA 임계 90/70·기간별 시드·B3 외 drill·첨부 구성·재상신 전이·평가 탭 mock.

## 2026-07-06 — REF-23 전환: specs v0.3 4종 + 구현작업지시서 등록

- `20260706_구현작업지시서_결재BI보고서흐름_v0.1.md`(REF-23)와 specs v0.3 4종(SCR-CM-03/WF-02/RB-01/RB-03 전체 명세) 등록 — **결재→BI→보고서 흐름이 현 구현 대상**(사용자 결정, 2026-07-06).
- 아래 델타 스펙 중 v0.3 전체 명세와 중복·INT 번호 충돌하는 `SCR-WF-02.md`·`SCR-CM-03.md`는 **삭제(대체)**. WF-02·CM-03의 SoT는 v0.3 파일(`SCR-WF-02_업무_상세.md`·`SCR-CM-03_홈_조직_업무_보드_인피니티_노드_캔버스.md`).
- `SCR-WS-02.md`·`SCR-AI-01.md` 델타 스펙과 그 코드작업(v0.9 to-be 잔여 3건)은 **보류** — REF-23 완료 후 재개.

## 2026-07-06 — 델타 스펙 최초 작성 (v0.9 to-be 잔여분)

`docs/20260703_화면상세정의서_v0.9.xlsx` §4 개선요구(to-be)의 미반영 3건·부분반영 2건을 델타 스펙으로 문서화. 스펙은 **추가분만 수록**(기존 기능 전체 명세 아님).

| 파일 | INT | 내용 | 처리 |
|------|-----|------|------|
| SCR-WS-02.md | INT-WS02-01·02 | 구성원 노드 전개 + 노드 정보 확장(사번·재직상태·태그) | 구현 |
| SCR-WF-02.md | INT-WF02-01~03 | 개요 4항목(참여자=하위업무 담당자 파생)·워크플로우 탭(단계+결재)·결재 상신 | INT-WF02-01 구현, 02·03 기구현 검증 |
| SCR-CM-03.md | INT-CM03-01 | 우측 BI 영역 반응형 폭 | 현행 유지 확정(2026-07-06 사용자 결정) — 코드 변경 없음 |
| SCR-AI-01.md | INT-AI01-01 | 규정 테이블 컬럼 균형·반응형 | 구현 |

- 참여자 파생 규칙(SUB_TASK 담당자, 담당자 제외·중복 제거)은 TASK 스키마에 참여자 필드가 없어 채택한 프로토타입 규칙 — 정의서 차기 버전에 반영 필요.
