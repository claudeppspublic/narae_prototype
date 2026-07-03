import React from "react";

export function StepIndicator({ steps = [], current = 0, style, ...rest }) {
  return (
    <ol style={{ display: "flex", listStyle: "none", margin: 0, padding: 0, ...style }} {...rest}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const state = done ? "done" : active ? "active" : "todo";
        const circleBg = state === "todo" ? "var(--color-surface-white)" : "var(--color-element-primary)";
        const circleBorder = state === "todo" ? "2px solid var(--color-border-gray)" : "2px solid var(--color-element-primary)";
        const circleColor = state === "todo" ? "var(--color-text-disabled)" : "#fff";
        return (
          <li key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
            {i > 0 && <span aria-hidden="true" style={{ position: "absolute", top: 18, right: "50%", width: "100%", height: 2, background: done || active ? "var(--color-element-primary)" : "var(--color-border-gray-light)" }} />}
            <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: circleBg, border: circleBorder, color: circleColor, font: "700 15px/1 var(--krds-font-sans)" }}>
              {done ? "✓" : i + 1}
            </span>
            <span style={{ font: `${active ? 700 : 400} 15px/1.4 var(--krds-font-sans)`, color: active ? "var(--color-text-primary)" : "var(--color-text-subtle)", textAlign: "center" }}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default StepIndicator;
