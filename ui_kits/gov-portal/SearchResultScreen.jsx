// Integrated search results screen (통합검색): tabs + filters + results.
const { Breadcrumb, SearchField, Tabs, Chip, Badge, Pagination, Link, Tag, Icon } = window.KRDSDesignSystem_416a36;

function SearchResultScreen({ onNavigate }) {
  const [tab, setTab] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState("rel");
  const tabs = [
    { key: "all", label: "전체 1,284" }, { key: "svc", label: "민원서비스 248" },
    { key: "policy", label: "정책정보 612" }, { key: "news", label: "보도자료 312" }, { key: "form", label: "서식 112" },
  ];
  const results = [
    { tag: "민원서비스", title: "주민등록표 등본 발급", desc: "본인 및 세대원의 주민등록 등본을 인터넷으로 무료 발급합니다.", url: "민원서비스 > 증명·발급", date: "2025.06.18" },
    { tag: "정책정보", title: "2025년 청년 주거지원 정책 안내", desc: "청년 월세 한시 특별지원 및 주거급여 분리지급 대상과 신청 방법을 안내합니다.", url: "정책정보 > 주거", date: "2025.06.14" },
    { tag: "보도자료", title: "디지털 정부혁신 우수사례 발표회 개최", desc: "행정기관의 디지털 전환 우수사례를 공유하는 발표회가 개최됩니다.", url: "알림소식 > 보도자료", date: "2025.06.12" },
    { tag: "서식", title: "주민등록 정정 신청서 (HWP)", desc: "주민등록 사항 정정을 위한 신청 서식입니다.", url: "자료실 > 서식", date: "2025.05.30" },
  ];
  return (
    <div style={{ maxWidth: "var(--krds-container-max)", margin: "0 auto", padding: "20px 24px 64px" }}>
      <Breadcrumb items={[{ label: <span data-nav="home">홈</span> }, { label: "통합검색" }]} />
      <div style={{ maxWidth: 720, margin: "20px 0 8px" }}>
        <SearchField size="large" buttonLabel="검색" placeholder="검색어를 입력하세요" defaultValue="주민등록등본" />
      </div>
      <p style={{ margin: "0 0 24px", font: "400 15px var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>
        <strong style={{ color: "var(--color-text-primary)" }}>'주민등록등본'</strong> 검색결과 총 <strong>1,284</strong>건
      </p>

      <Tabs value={tab} onChange={setTab} items={tabs} style={{ marginBottom: 20, overflowX: "auto" }} />

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32 }}>
        {/* Filters */}
        <aside>
          <div style={{ border: "1px solid var(--color-border-gray-light)", borderRadius: 12, padding: 20 }}>
            <p style={{ margin: "0 0 12px", font: "700 17px var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>필터</p>
            <p style={{ margin: "0 0 8px", font: "700 14px var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>기간</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {["전체", "1주", "1개월", "1년"].map((t, i) => <Chip key={t} size="small" selected={i === 0}>{t}</Chip>)}
            </div>
            <p style={{ margin: "0 0 8px", font: "700 14px var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>유형</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["온라인 신청", "방문", "첨부 서식"].map((t) => <Chip key={t} size="small">{t}</Chip>)}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
            {[{ k: "rel", t: "정확도순" }, { k: "date", t: "최신순" }].map((s) => (
              <button key={s.k} onClick={() => setSort(s.k)} style={{ border: "none", background: "none", cursor: "pointer", font: `${sort === s.k ? 700 : 400} 14px var(--krds-font-sans)`, color: sort === s.k ? "var(--color-text-primary)" : "var(--color-text-subtle)" }}>{s.t}</button>
            ))}
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "2px solid var(--color-light-gray-90)" }}
            onClick={() => onNavigate("detail")}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: "20px 4px", borderBottom: "1px solid var(--color-border-gray-light)", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Badge type="soft" color="secondary">{r.tag}</Badge>
                  <span style={{ font: "400 13px var(--krds-font-sans)", color: "var(--color-text-disabled)" }}>{r.url}</span>
                </div>
                <p style={{ margin: "0 0 4px", font: "700 19px var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>{r.title}</p>
                <p style={{ margin: "0 0 6px", font: "400 15px/1.6 var(--krds-font-sans)", color: "var(--color-text-subtle)" }}>{r.desc}</p>
                <span style={{ font: "400 13px var(--krds-font-sans)", color: "var(--color-text-disabled)" }}>{r.date}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
            <Pagination page={page} total={20} onChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

window.SearchResultScreen = SearchResultScreen;
