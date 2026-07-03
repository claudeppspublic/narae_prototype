import React from "react";

export function UserFeedback({ question = "이 페이지에서 제공하는 정보에 만족하십니까?", onRespond, style, ...rest }) {
  const [answer, setAnswer] = React.useState(null);
  const pick = (v) => { setAnswer(v); onRespond && onRespond(v); };
  return (
    <div style={{ padding: 24, borderRadius: 12, background: "var(--color-surface-gray-subtler)", textAlign: "center", ...style }} {...rest}>
      <p style={{ margin: "0 0 16px", font: "700 17px/1.5 var(--krds-font-sans)", color: "var(--color-text-bolder)" }}>{question}</p>
      {answer == null ? (
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          {[{ k: "yes", t: "만족" }, { k: "no", t: "불만족" }].map((o) => (
            <button key={o.k} type="button" onClick={() => pick(o.k)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 24px", borderRadius: 8, cursor: "pointer",
                border: "1px solid var(--color-button-tertiary-border)", background: "var(--color-surface-white)", font: "700 17px var(--krds-font-sans)", color: "var(--color-text-basic)" }}>
              {o.t}
            </button>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, font: "400 15px/1.5 var(--krds-font-sans)", color: "var(--color-text-primary)" }}>소중한 의견 감사합니다.</p>
      )}
    </div>
  );
}

export default UserFeedback;
