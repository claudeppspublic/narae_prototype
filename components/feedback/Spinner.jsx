// KRDS Design System — Spinner component

/**
 * Spinner — circular loading indicator.
 *
 * @param {"small"|"medium"|"large"} [size="medium"]
 * @param {"primary"|"secondary"|"inverse"|"inherit"} [color="primary"]
 * @param {string}  [label="로딩 중"]  Accessible label for screen readers.
 * @param {string}  [className]
 * @param {object}  [style]
 */

/* ── size presets (px) ──────────────────────────────────────── */
const SIZE_MAP = {
  small:  20,
  medium: 32,
  large:  48,
};

/* ── border width scales with size ──────────────────────────── */
const BORDER_MAP = {
  small:  2,
  medium: 3,
  large:  4,
};

/* ── colour tokens ──────────────────────────────────────────── */
const COLOR_MAP = {
  primary:   "var(--color-element-primary)",
  secondary: "var(--color-element-gray)",
  inverse:   "var(--color-text-inverse-static)",
  inherit:   "currentColor",
};

/* ── keyframe animation id ──────────────────────────────────── */
const ANIM_ID = "krds-spinner-keyframes";

function ensureKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(ANIM_ID)) return;

  const styleEl = document.createElement("style");
  styleEl.id = ANIM_ID;
  styleEl.textContent = `
@keyframes krds-spin {
  0%   { transform: rotate(0deg);   }
  100% { transform: rotate(360deg); }
}
`;
  document.head.appendChild(styleEl);
}

function Spinner({
  size = "medium",
  color = "primary",
  label = "로딩 중",
  className,
  style,
  ...rest
}) {
  /* inject keyframes once */
  React.useEffect(() => {
    ensureKeyframes();
  }, []);

  const dim = SIZE_MAP[size] || SIZE_MAP.medium;
  const borderWidth = BORDER_MAP[size] || BORDER_MAP.medium;
  const spinnerColor = COLOR_MAP[color] || COLOR_MAP.primary;

  const spinnerStyle = {
    display: "inline-block",
    width: dim,
    height: dim,
    borderRadius: "50%",
    border: `${borderWidth}px solid var(--color-element-gray-light)`,
    borderTopColor: spinnerColor,
    boxSizing: "border-box",
    animation: "krds-spin 0.75s linear infinite",
    flexShrink: 0,
  };

  return React.createElement("span", {
    role: "status",
    "aria-label": label,
    "data-krds-spinner": true,
    "data-krds-size": size,
    "data-krds-color": color,
    className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    },
    ...rest,
  },
    React.createElement("span", {
      style: spinnerStyle,
      "aria-hidden": "true",
    }),
    /* visually hidden label for screen readers */
    React.createElement("span", {
      style: {
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      },
    }, label),
  );
}

window.KRDS_Spinner = Spinner;
export default Spinner;
