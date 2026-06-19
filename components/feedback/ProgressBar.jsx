// KRDS Design System — ProgressBar component

/**
 * ProgressBar — horizontal bar indicating task completion or indeterminate loading.
 *
 * @param {number}  [value=0]           Current progress (0–100).
 * @param {number}  [max=100]           Maximum value (normalises to percentage).
 * @param {"small"|"medium"|"large"} [size="medium"]
 * @param {"primary"|"success"|"danger"|"warning"} [color="primary"]
 * @param {boolean} [showLabel=false]   Show percentage or custom label.
 * @param {string}  [label]            Custom label text (overrides percentage).
 * @param {boolean} [indeterminate=false]  Animated sliding bar instead of fill.
 * @param {string}  [className]
 * @param {object}  [style]
 */

/* ── size presets (track height in px) ───────────────────────── */
const SIZE_MAP = {
  small:  4,
  medium: 8,
  large:  12,
};

/* ── colour tokens per semantic colour ──────────────────────── */
const COLOR_MAP = {
  primary: "var(--color-element-primary)",
  success: "var(--color-element-success)",
  danger:  "var(--color-element-danger)",
  warning: "var(--color-element-warning)",
};

/* ── keyframe animation id ──────────────────────────────────── */
const ANIM_ID = "krds-progress-indeterminate";

function ensureKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(ANIM_ID)) return;

  const styleEl = document.createElement("style");
  styleEl.id = ANIM_ID;
  styleEl.textContent = `
@keyframes krds-progress-slide {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
`;
  document.head.appendChild(styleEl);
}

function ProgressBar({
  value = 0,
  max = 100,
  size = "medium",
  color = "primary",
  showLabel = false,
  label,
  indeterminate = false,
  className,
  style,
  ...rest
}) {
  /* inject keyframes once */
  React.useEffect(() => {
    if (indeterminate) ensureKeyframes();
  }, [indeterminate]);

  const height = SIZE_MAP[size] || SIZE_MAP.medium;
  const fillColor = COLOR_MAP[color] || COLOR_MAP.primary;
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const displayLabel = label != null ? label : `${Math.round(pct)}%`;

  /* ── track (outer) ───────────────────────────────────────── */
  const trackStyle = {
    position: "relative",
    width: "100%",
    height,
    borderRadius: "var(--krds-radius-pill)",
    background: "var(--color-element-gray-light)",
    overflow: "hidden",
    boxSizing: "border-box",
  };

  /* ── fill (inner) ────────────────────────────────────────── */
  const fillStyle = indeterminate
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "33%",
        height: "100%",
        borderRadius: "var(--krds-radius-pill)",
        background: fillColor,
        animation: "krds-progress-slide 1.4s ease-in-out infinite",
      }
    : {
        width: `${pct}%`,
        height: "100%",
        borderRadius: "var(--krds-radius-pill)",
        background: fillColor,
        transition: "width 0.25s ease",
      };

  /* ── label style ─────────────────────────────────────────── */
  const labelStyle = {
    fontFamily: "var(--krds-font-sans)",
    fontSize: "var(--krds-body-xsmall)",
    fontWeight: "var(--krds-weight-medium)",
    lineHeight: 1,
    color: "var(--color-text-subtle)",
    marginBottom: "var(--krds-space-2)",
  };

  /* ── aria attributes ─────────────────────────────────────── */
  const ariaProps = {
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": max,
  };

  if (!indeterminate) {
    ariaProps["aria-valuenow"] = Math.round(pct);
  }

  if (label) {
    ariaProps["aria-label"] = label;
  }

  return React.createElement(
    "div",
    {
      "data-krds-progressbar": true,
      "data-krds-size": size,
      "data-krds-color": color,
      "data-krds-indeterminate": indeterminate || undefined,
      className,
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        ...style,
      },
      ...ariaProps,
      ...rest,
    },
    /* label row */
    showLabel
      ? React.createElement(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              ...labelStyle,
            },
            "aria-hidden": "true",
          },
          React.createElement("span", null, label || ""),
          !indeterminate
            ? React.createElement("span", null, `${Math.round(pct)}%`)
            : null,
        )
      : null,
    /* track + fill */
    React.createElement(
      "div",
      { style: trackStyle },
      React.createElement("div", { style: fillStyle }),
    ),
  );
}

window.KRDS_ProgressBar = ProgressBar;
export default ProgressBar;
