// Login / authentication screen (간편인증 single-selection).
const { Breadcrumb, Tabs, TextInput, Button, Checkbox, Link, Infobox, Icon } = window.KRDSDesignSystem_416a36;

function LoginScreen({ onNavigate }) {
  const [tab, setTab] = React.useState("simple");
  const [picked, setPicked] = React.useState("kakao");
  const providers = [
    { key: "kakao", label: "카카오" }, { key: "naver", label: "네이버" },
    { key: "pass", label: "PASS" }, { key: "kb", label: "KB모바일" },
    { key: "payco", label: "PAYCO" }, { key: "toss", label: "토스" },
  ];
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 24px 80px" }}>
      <Breadcrumb items={[{ label: <span data-nav="home">홈</span> }, { label: "로그인" }]} />
      <h1 style={{ margin: "20px 0 8px", font: "800 36px var(--krds-font-sans)", color: "var(--color-text-bolder)", textAlign: "center" }}>로그인</h1>
      <p style={{ margin: "0 0 32px", font: "400 17px var(--krds-font-sans)", color: "var(--color-text-subtle)", textAlign: "center" }}>안전한 본인확인 후 전자민원을 이용하실 수 있습니다.</p>

      <Tabs value={tab} onChange={setTab} variant="fill" items={[
        { key: "simple", label: "간편인증" }, { key: "cert", label: "공동·금융인증서" }, { key: "id", label: "아이디" },
      ]} style={{ display: "flex", margin: "0 auto 28px", width: "fit-content" }} />

      {tab === "simple" && (
        <div>
          <p style={{ margin: "0 0 12px", font: "700 17px var(--krds-font-sans)", color: "var(--color-text-basic)" }}>인증 수단 선택</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {providers.map((p) => {
              const on = picked === p.key;
              return (
                <button key={p.key} onClick={() => setPicked(p.key)} aria-pressed={on}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 64, borderRadius: 8, cursor: "pointer",
                    border: on ? "2px solid var(--color-border-primary)" : "1px solid var(--color-border-gray)",
                    background: on ? "var(--color-surface-primary-subtler)" : "var(--color-surface-white)",
                    font: `${on ? 700 : 500} 17px var(--krds-font-sans)`, color: on ? "var(--color-text-primary)" : "var(--color-text-basic)" }}>
                  {p.label}{on && <Icon name="IconRoundCheck" size={20} />}
                </button>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <TextInput label="이름" placeholder="홍길동" />
            <TextInput label="생년월일" placeholder="YYYYMMDD" inputMode="numeric" />
            <TextInput label="휴대전화번호" placeholder="01000000000" inputMode="numeric" style={{ gridColumn: "1 / -1" }} />
          </div>
          <Checkbox label="전체 동의 (개인정보 수집·이용, 고유식별정보 처리)" style={{ marginBottom: 20 }} />
          <Button type="primary" size="xlarge" fullWidth onClick={() => onNavigate("home")}>인증 요청</Button>
        </div>
      )}

      {tab === "cert" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Infobox type="point" title="인증서 로그인">등록된 공동인증서 또는 금융인증서를 선택하세요.</Infobox>
          <Button type="tertiary" size="large" fullWidth leftIcon={<Icon name="IconCertified" size={24} />}>공동인증서</Button>
          <Button type="tertiary" size="large" fullWidth leftIcon={<Icon name="IconCertificationFinanace" size={24} />}>금융인증서</Button>
          <Button type="primary" size="xlarge" fullWidth onClick={() => onNavigate("home")}>로그인</Button>
        </div>
      )}

      {tab === "id" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextInput label="아이디" placeholder="아이디 입력" />
          <TextInput label="비밀번호" type="password" placeholder="비밀번호 입력" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Checkbox label="아이디 저장" />
            <Link href="#">아이디·비밀번호 찾기</Link>
          </div>
          <Button type="primary" size="xlarge" fullWidth onClick={() => onNavigate("home")}>로그인</Button>
        </div>
      )}
    </div>
  );
}

window.LoginScreen = LoginScreen;
