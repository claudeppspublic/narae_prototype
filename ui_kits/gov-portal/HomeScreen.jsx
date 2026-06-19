// Home / landing screen for the gov-portal UI kit.
const { Carousel, SearchField, Card, Badge, Link, TextList, Icon } = window.KRDSDesignSystem_416a36;

function HomeScreen({ onNavigate }) {
  const quick = [
    { icon: "IconDocument", label: "증명서 발급" },
    { icon: "IconCalendar", label: "예약·접수" },
    { icon: "IconCall", label: "민원 상담" },
    { icon: "IconAnalytics", label: "통계·자료" },
    { icon: "IconMap", label: "기관 찾기" },
    { icon: "IconBookmarks", label: "자주 찾는 서비스" },
  ];
  const notices = [
    { tag: "공지", title: "2025년 상반기 전자민원 서비스 점검 안내", date: "2025.06.18" },
    { tag: "보도", title: "디지털 정부혁신 우수사례 발표회 개최", date: "2025.06.15" },
    { tag: "채용", title: "○○부 공무직 신규 채용 공고", date: "2025.06.12" },
    { tag: "공지", title: "여름철 자연재난 대비 국민 행동요령 안내", date: "2025.06.10" },
  ];
  return (
    <div>
      {/* Hero */}
      <section style={{ background: "var(--color-light-secondary-80)", color: "#fff" }}>
        <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "56px 24px 64px" }}>
          <p style={{ margin: 0, font: "700 17px var(--krds-font-sans)", color: "var(--color-light-primary-30)" }}>국민과 함께하는 디지털 정부</p>
          <h1 style={{ margin: "12px 0 28px", font: "800 44px/1.25 var(--krds-font-sans)", letterSpacing: "-0.02em" }}>
            필요한 민원, 한 곳에서 빠르게
          </h1>
          <div style={{ maxWidth: 640 }}>
            <SearchField size="large" buttonLabel="검색" placeholder="찾으시는 민원이나 정보를 입력하세요" onSearch={() => onNavigate("list")} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <span style={{ font: "400 14px var(--krds-font-sans)", color: "rgba(255,255,255,0.7)" }}>인기검색어</span>
            {["주민등록등본", "여권 재발급", "국민비서", "전입신고"].map((k) => (
              <a key={k} href="#" data-nav="list" style={{ font: "500 14px var(--krds-font-sans)", color: "rgba(255,255,255,0.92)" }}>{k}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}
          onClick={(e) => { if (e.target.closest("[data-q]")) onNavigate("list"); }}>
          {quick.map((q) => (
            <button key={q.label} data-q style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "28px 8px", borderRadius: 12, border: "1px solid var(--color-border-gray-light)", background: "var(--color-surface-white)", cursor: "pointer" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "var(--color-surface-primary-subtler)", color: "var(--color-icon-primary)" }}>
                <Icon name={q.icon} size={28} />
              </span>
              <span style={{ font: "700 15px var(--krds-font-sans)", color: "var(--color-text-basic)" }}>{q.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Service categories with illustrations */}
      <section style={{ background: "var(--color-surface-gray-subtler)" }}>
        <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "48px 24px" }}>
          <h2 style={{ margin: "0 0 24px", font: "700 24px var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>분야별 서비스</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}
            onClick={() => onNavigate("list")}>
            {[
              { img: "banner-1.png", label: "세금·금융" },
              { img: "banner-2.png", label: "교육·보육" },
              { img: "banner-3.png", label: "행정·민원" },
              { img: "banner-4.png", label: "에너지·환경" },
              { img: "banner-5.png", label: "교통·물류" },
            ].map((c) => (
              <button key={c.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 12px", borderRadius: 12, border: "1px solid var(--color-border-gray-light)", background: "var(--color-surface-white)", cursor: "pointer" }}>
                <img src={`../../assets/images/${c.img}`} alt="" style={{ width: 88, height: 88, objectFit: "contain" }} />
                <span style={{ font: "700 17px var(--krds-font-sans)", color: "var(--color-text-basic)" }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notices + banner */}
      <section style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "0 24px 64px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ margin: 0, font: "700 24px var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>알림소식</h2>
            <Link href="#" icon={<Icon name="IconArrowRight" size={16} />}>전체보기</Link>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "2px solid var(--color-light-gray-90)" }}
            onClick={() => onNavigate("detail")}>
            {notices.map((n, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 4px", borderBottom: "1px solid var(--color-border-gray-light)", cursor: "pointer" }}>
                <Badge type="soft" color={n.tag === "공지" ? "primary" : n.tag === "채용" ? "success" : "secondary"}>{n.tag}</Badge>
                <span style={{ flex: 1, font: "500 17px var(--krds-font-sans)", color: "var(--color-text-basic)" }}>{n.title}</span>
                <span style={{ font: "400 14px var(--krds-font-sans)", color: "var(--color-text-disabled)" }}>{n.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 style={{ margin: "0 0 16px", font: "700 24px var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>이용 안내</h2>
          <Carousel slides={[
            <div style={{ height: 220, background: "var(--color-light-primary-50)", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: 28 }}>
              <p style={{ margin: 0, font: "700 14px var(--krds-font-sans)", opacity: .85 }}>국민비서 구독</p>
              <p style={{ margin: "8px 0 0", font: "800 24px/1.3 var(--krds-font-sans)" }}>맞춤 행정정보를<br />알림으로 받아보세요</p>
            </div>,
            <div style={{ height: 220, background: "var(--color-light-secondary-70)", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: 28 }}>
              <p style={{ margin: 0, font: "700 14px var(--krds-font-sans)", opacity: .85 }}>모바일 신분증</p>
              <p style={{ margin: "8px 0 0", font: "800 24px/1.3 var(--krds-font-sans)" }}>휴대폰 하나로<br />간편하게 본인확인</p>
            </div>,
          ]} />
        </div>
      </section>
    </div>
  );
}

window.HomeScreen = HomeScreen;
