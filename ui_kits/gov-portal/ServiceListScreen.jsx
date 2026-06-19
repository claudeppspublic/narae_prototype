// Service list screen: breadcrumb + filters (chips) + result cards + pagination.
const { Breadcrumb, Chip, Card, Badge, Tag, Pagination, SearchField, Link, Icon } = window.KRDSDesignSystem_416a36;

function ServiceListScreen({ onNavigate }) {
  const [filter, setFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const cats = [
    { key: "all", label: "전체" }, { key: "cert", label: "증명·발급" },
    { key: "apply", label: "신청·접수" }, { key: "report", label: "신고·민원" },
    { key: "pay", label: "납부·조회" },
  ];
  const services = [
    { tag: "증명·발급", title: "주민등록표 등본 발급", desc: "본인 및 세대원의 주민등록 등본을 발급합니다.", fee: "무료", online: true },
    { tag: "증명·발급", title: "가족관계증명서 발급", desc: "가족관계 등록사항에 관한 증명서를 발급합니다.", fee: "1,000원", online: true },
    { tag: "신청·접수", title: "전입신고", desc: "거주지를 이전한 경우 14일 이내 신고합니다.", fee: "무료", online: true },
    { tag: "납부·조회", title: "지방세 납부 및 조회", desc: "재산세·자동차세 등 지방세를 조회·납부합니다.", fee: "무료", online: true },
    { tag: "신고·민원", title: "여권 재발급 신청", desc: "분실·훼손 시 여권을 재발급 신청합니다.", fee: "50,000원", online: false },
    { tag: "신청·접수", title: "국민기초생활보장 급여 신청", desc: "생계·의료·주거 급여를 신청합니다.", fee: "무료", online: false },
  ];
  return (
    <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "20px 24px 64px" }}>
      <Breadcrumb items={[{ label: <span data-nav="home">홈</span> }, { label: "민원서비스" }, { label: "전체 서비스" }]} />
      <h1 style={{ margin: "20px 0 8px", font: "800 36px var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>민원서비스</h1>
      <p style={{ margin: "0 0 28px", font: "400 17px var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>자주 찾는 전자민원을 한 곳에서 신청하세요.</p>

      <div style={{ maxWidth: 520, marginBottom: 24 }}>
        <SearchField buttonLabel="검색" placeholder="민원명을 입력하세요" />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {cats.map((c) => (
          <Chip key={c.key} selected={filter === c.key} onClick={() => setFilter(c.key)}>{c.label}</Chip>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ margin: 0, font: "500 15px var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>총 <strong style={{ color: "var(--color-text-primary)" }}>248</strong>건</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {services
          .filter((s) => filter === "all" || s.tag === cats.find((c) => c.key === filter)?.label)
          .map((s, i) => (
            <Card key={i} orientation="horizontal" interactive onClick={() => onNavigate("detail")}
              badge={<div style={{ display: "flex", gap: 6 }}><Badge type="soft" color="secondary">{s.tag}</Badge>{s.online && <Badge type="soft" color="success">온라인</Badge>}</div>}
              title={s.title} description={s.desc}
              footer={<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ font: "700 15px var(--krds-font-sans)", color: "var(--color-text-basic)" }}>수수료 {s.fee}</span><Link href="#">신청하기</Link></div>}
              style={{ cursor: "pointer" }} image={undefined} />
          ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
        <Pagination page={page} total={12} onChange={setPage} />
      </div>
    </div>
  );
}

window.ServiceListScreen = ServiceListScreen;
