import React from "react";

export function Carousel({ slides = [], style, ...rest }) {
  const [i, setI] = React.useState(0);
  const n = slides.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "var(--color-surface-gray-subtle)", ...style }} {...rest}>
      <div style={{ display: "flex", transition: "transform .35s ease", transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, k) => (
          <div key={k} style={{ flex: "0 0 100%", minWidth: "100%" }}>{s}</div>
        ))}
      </div>
      {n > 1 && (
        <>
          <button type="button" aria-label="이전" onClick={() => go(-1)} style={{ ...arrow, left: 12 }}>{"‹"}</button>
          <button type="button" aria-label="다음" onClick={() => go(1)} style={{ ...arrow, right: 12 }}>{"›"}</button>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, display: "flex", justifyContent: "center", gap: 8 }}>
            {slides.map((_, k) => (
              <button key={k} aria-label={`${k + 1}번째 슬라이드`} onClick={() => setI(k)}
                style={{ width: k === i ? 24 : 8, height: 8, borderRadius: 999, border: "none", cursor: "pointer", transition: "width .2s ease",
                  background: k === i ? "var(--color-element-primary)" : "rgba(255,255,255,0.7)" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
const arrow = { position: "absolute", top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: 999, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.92)", boxShadow: "var(--krds-shadow-2)", fontSize: 22, color: "var(--color-icon-gray)", zIndex: 1 };

export default Carousel;
