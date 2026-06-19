// KRDS Design System — NumberBadge component

/**
 * NumberBadge — numeric indicator badge, typically overlaid on an icon or button.
 *
 * @param {number}  count           The number to display.
 * @param {number}  [maxCount=99]   Numbers above this show as "maxCount+".
 * @param {"primary"|"danger"|"success"|"warning"} [color="danger"]
 * @param {"small"|"medium"|"large"} [size="medium"]
 * @param {boolean} [showZero=false] Whether to show the badge when count is 0.
 * @param {string}  [className]
 * @param {object}  [style]
 * @param {React.ReactNode} children  The element the badge is attached to.
 */

const NUM_SIZES = {
  small:  { height: 16, minWidth: 16, fontSize: "var(--krds-body-xsmall)", padding: "0 var(--krds-space-2)" },
  medium: { height: 20, minWidth: 20, fontSize: "var(--krds-body-xsmall)", padding: "0 var(--krds-space-3)" },
  large:  { height: 24, minWidth: 24, fontSize: "var(--krds-body-small)",  padding: "0 var(--krds-space-3)" },
};

const NUM_COLORS = {
  primary: "var(--color-element-primary)",
  danger:  "var(--color-element-danger)",
  success: "var(--color-element-success)",
  warning: "var(--color-element-warning)",
};

function NumberBadge({
  count = 0,
  maxCount = 99,
  color = "danger",
  size = "medium",
  showZero = false,
  className,
  style,
  children,
  ...rest
}) {
  const s = NUM_SIZES[size] || NUM_SIZES.medium;
  const bg = NUM_COLORS[color] || NUM_COLORS.danger;

  const shouldShow = count > 0 || showZero;
  const displayText = count > maxCount ? maxCount + "+" : String(count);

  const badgeNode = shouldShow
    ? React.createElement("span", {
        role: "status",
        "aria-label": count + " notifications",
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: s.height,
          minWidth: s.minWidth,
          padding: s.padding,
          borderRadius: "var(--krds-radius-pill)",
          backgroundColor: bg,
          color: "var(--color-text-inverse-static)",
          fontFamily: "var(--krds-font-sans)",
          fontSize: s.fontSize,
          fontWeight: "var(--krds-weight-bold)",
          lineHeight: 1,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
        },
      }, displayText)
    : null;

  // Standalone (no children): render badge inline.
  if (children == null) {
    if (!shouldShow) return null;
    return React.createElement("span", {
      "data-krds-number-badge": true,
      className,
      style: { display: "inline-flex", verticalAlign: "middle", ...style },
      ...rest,
    }, badgeNode);
  }

  // Wrapping children: overlay badge at top-right.
  return React.createElement(
    "span",
    {
      "data-krds-number-badge": true,
      className,
      style: {
        position: "relative",
        display: "inline-flex",
        verticalAlign: "middle",
        flexShrink: 0,
        ...style,
      },
      ...rest,
    },
    children,
    shouldShow &&
      React.createElement("span", {
        role: "status",
        "aria-label": count + " notifications",
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          transform: "translate(50%, -50%)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: s.height,
          minWidth: s.minWidth,
          padding: s.padding,
          borderRadius: "var(--krds-radius-pill)",
          backgroundColor: bg,
          color: "var(--color-text-inverse-static)",
          fontFamily: "var(--krds-font-sans)",
          fontSize: s.fontSize,
          fontWeight: "var(--krds-weight-bold)",
          lineHeight: 1,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          border: "2px solid var(--color-surface-white)",
          pointerEvents: "none",
        },
      }, displayText)
  );
}

window.KRDS_NumberBadge = NumberBadge;
export default NumberBadge;
