// Shared chrome for the KRDS gov-portal UI kit: masthead + header + footer.
const { Masthead, Header, Footer, Identifier, TopButton, Icon } = window.KRDSDesignSystem_416a36;

function useHighContrast() {
  const [hc, setHc] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-mode", hc ? "high-contrast" : "");
  }, [hc]);
  return [hc, setHc];
}

function AppShell({ active, onNavigate, children }) {
  const [hc, setHc] = useHighContrast();
  const menus = [
    { label: "민원서비스", key: "list" },
    { label: "정책정보", key: "policy" },
    { label: "기관소개", key: "about" },
    { label: "알림소식", key: "news" },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-background-white)" }}>
      <Masthead />
      <div onClick={(e) => {
        if (e.target.closest("[data-hc]")) { setHc((v) => !v); return; }
        const a = e.target.closest("[data-nav]");
        if (a) { e.preventDefault(); onNavigate(a.getAttribute("data-nav")); }
      }}>
        <Header
          siteName="○○부"
          onSearch={() => onNavigate("list")}
          utility={[
            { label: <span data-nav="login">로그인</span> },
            { label: "회원가입" },
            { label: <span data-hc role="button" tabIndex={0} style={{ cursor: "pointer" }}>{hc ? "기본 대비" : "고대비"}</span> },
            { label: "EN" },
          ]}
          menus={menus.map((m) => ({ label: <span data-nav={m.key}>{m.label}</span> }))}
        />
      </div>
      <main id="main" style={{ flex: 1 }}>{children}</main>
      {Identifier && <Identifier agency="대한민국정부" department="○○부 · Ministry of ○○" />}
      <Footer
        links={[
          { label: "개인정보처리방침", strong: true },
          { label: "저작권정책" },
          { label: "웹접근성 정책" },
          { label: "이용약관" },
          { label: "찾아오시는 길" },
        ]}
        agency={{ name: "○○부", address: "(30113) 세종특별자치시 도움5로 19 정부세종청사", tel: "대표전화 110 · 044-000-0000" }}
      />
      <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 50 }}>
        <TopButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
      </div>
    </div>
  );
}

window.AppShell = AppShell;
