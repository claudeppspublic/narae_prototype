// Service detail / application screen: side nav + steps + form + FAQ + feedback.
const {
  Breadcrumb, SideNavigation, InPageNavigation, StepIndicator, StructuredList,
  TextInput, Select, DateInput, Radio, Checkbox, FileUpload, Button,
  Alert, Infobox, Accordion, UserFeedback, Badge, Modal, TextList, Icon,
} = window.KRDSDesignSystem_416a36;

function ServiceDetailScreen({ onNavigate }) {
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "20px 24px 64px" }}>
      <Breadcrumb items={[{ label: <span data-nav="home">홈</span> }, { label: <span data-nav="list">민원서비스</span> }, { label: "주민등록표 등본 발급" }]} />

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 40, marginTop: 20 }}>
        <aside>
          <SideNavigation title="민원서비스" items={[
            { label: "증명·발급", active: true, children: [
              { label: "주민등록표 등본", active: true }, { label: "가족관계증명서" }, { label: "건축물대장" },
            ] },
            { label: "신청·접수" },
            { label: "납부·조회" },
            { label: "신고·민원" },
          ]} />
        </aside>

        <div onClick={(e) => { const a = e.target.closest("[data-nav]"); if (a) onNavigate(a.getAttribute("data-nav")); }}>
          <h1 style={{ margin: "0 0 6px", font: "800 36px var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>주민등록표 등본 발급</h1>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <Badge type="soft" color="secondary">증명·발급</Badge>
            <Badge type="soft" color="success">온라인 신청</Badge>
            <Badge type="outline" color="primary">수수료 무료</Badge>
          </div>

          <StepIndicator current={1} steps={["약관 동의", "정보 입력", "신청 확인", "발급 완료"]} />

          <div style={{ height: 32 }} />
          <Alert type="info" title="안내">본인 확인을 위해 공동인증서 또는 간편인증이 필요합니다.</Alert>

          <h2 style={{ margin: "36px 0 16px", font: "700 24px var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>신청 정보 입력</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <TextInput label="신청인 성명" required placeholder="홍길동" />
            <TextInput label="주민등록번호 앞자리" required placeholder="000000" inputMode="numeric" />
            <Select label="발급 용도" required placeholder="선택하세요" options={["주소 확인", "금융기관 제출", "회사 제출", "기타"]} />
            <DateInput label="신청일" />
            <TextInput label="연락처" placeholder="010-0000-0000" style={{ gridColumn: "1 / -1" }} />
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ margin: "0 0 8px", font: "700 15px var(--krds-font-sans)", color: "var(--color-text-basic)" }}>세대원 포함 여부</p>
            <div style={{ display: "flex", gap: 20 }}>
              <Radio name="member" label="본인만 표시" defaultChecked />
              <Radio name="member" label="세대원 모두 표시" />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <FileUpload label="첨부 서류 (선택)" hint="위임 시 위임장 첨부 · 최대 10MB" />
          </div>

          <div style={{ marginTop: 20 }}>
            <Checkbox label="개인정보 수집 및 이용에 동의합니다. (필수)" />
          </div>

          <Infobox type="point" title="수수료 안내" style={{ marginTop: 24 }}>
            <TextList type="dash" items={["인터넷 발급: 무료", "무인민원발급기: 무료", "방문 발급(주민센터): 400원"]} />
          </Infobox>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 28 }}>
            <Button type="tertiary" size="large" onClick={() => onNavigate("list")}>취소</Button>
            <Button type="primary" size="large" rightIcon={<Icon name="IconArrowRight" size={24} />} onClick={() => setSubmitted(true)}>신청하기</Button>
          </div>

          <h2 style={{ margin: "48px 0 16px", font: "700 24px var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>자주 묻는 질문</h2>
          <Accordion defaultOpen={[0]} items={[
            { title: "발급된 등본의 유효기간은 어떻게 되나요?", content: "발급일로부터 3개월간 유효합니다." },
            { title: "타인의 등본도 발급할 수 있나요?", content: "위임장과 신분증 사본을 첨부하면 대리 발급이 가능합니다." },
            { title: "발급 내역은 어디서 확인하나요?", content: "마이페이지 > 발급내역에서 확인할 수 있습니다." },
          ]} />

          <div style={{ marginTop: 40 }}>
            <UserFeedback />
          </div>
        </div>
      </div>

      <Modal open={submitted} title="신청이 완료되었습니다" onClose={() => setSubmitted(false)}
        footer={<><Button type="tertiary" onClick={() => setSubmitted(false)}>닫기</Button><Button type="primary" onClick={() => { setSubmitted(false); onNavigate("home"); }}>홈으로</Button></>}>
        접수번호는 <strong>2025-06-0042</strong> 입니다. 발급 문서는 마이페이지에서 확인하실 수 있습니다.
      </Modal>
    </div>
  );
}

window.ServiceDetailScreen = ServiceDetailScreen;
