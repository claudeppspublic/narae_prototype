// KRDS Design System — DotBadge component

/**
 * DotBadge — small coloured dot indicator, typically overlaid on an icon or avatar.
 *
 * @param {"primary"|"danger"|"success"|"warning"|"information"|"point"} [color="danger"]
 * @param {"small"|"medium"|"large"} [size="medium"]
 * @param {boolean}  [visible=true]  Whether the dot is rendered.
 * @param {string}   [className]
 * @param {object}   [style]
 * @param {React.ReactNode} children  The element the dot is attached to.
 */

const DOT_SIZES = {
  small:  6,
  medium: 8,
  large:  10,
};

const DOT_COLORS = {
  primary:     "var(--color-element-primary)",
  danger:      "var(--color-element-danger)",
  success:     "var(--color-element-success)",
  warning:     "var(--color-element-warning)",
  information: "var(--color-element-information)",
  point:       "var(--color-element-point)",
};

function DotBadge({
  color = "danger",
  size = "medium",
  visible = true,
  className,
  style,
  children,
  ...rest
}) {
  const dotSize = DOT_SIZES[size] || DOT_SIZES.medium;
  const dotColor = DOT_COLORS[color] || DOT_COLORS.danger;

  // When there are no children, render a standalone dot.
  if (children == null) {
    if (!visible) return null;
    return React.createElement("span", {
      role: "status",
      "aria-label": color + " indicator",
      "data-krds-dot-badge": true,
      className,
      style: {
        display: "inline-block",
        width: dotSize,
        height: dotSize,
        borderRadius: "var(--krds-radius-pill)",
        backgroundColor: dotColor,
        flexShrink: 0,
        ...style,
      },
      ...rest,
    });
  }

  // Wrap children with a positioned container and overlay the dot.
  return React.createElement(
    "span",
    {
      "data-krds-dot-badge": true,
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
    visible &&
      React.createElement("span", {
        role: "status",
        "aria-label": color + " indicator",
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          transform: "translate(50%, -50%)",
          width: dotSize,
          height: dotSize,
          borderRadius: "var(--krds-radius-pill)",
          backgroundColor: dotColor,
          border: "2px solid var(--color-surface-white)",
          boxSizing: "content-box",
          pointerEvents: "none",
        },
      })
  );
}

window.KRDS_DotBadge = DotBadge;
export default DotBadge;
