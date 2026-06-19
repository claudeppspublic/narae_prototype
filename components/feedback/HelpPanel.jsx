// KRDS Design System — HelpPanel component

/**
 * HelpPanel — slide-out help panel from the right edge of the viewport.
 *
 * @param {boolean}         open            Whether the panel is visible.
 * @param {function}        onClose         Called when the panel should close.
 * @param {string}          [title="도움말"] Header title.
 * @param {number}          [width=360]     Panel width in pixels.
 * @param {React.ReactNode} children        Scrollable body content.
 * @param {string}          [className]
 * @param {object}          [style]
 */

/* ── close icon ─────────────────────────────────────────────────── */

function CloseIcon() {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 18, height: 18, viewBox: "0 0 18 18",
    fill: "none", stroke: "currentColor",
    strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
    "aria-hidden": "true",
    style: { display: "block", flexShrink: 0 },
  },
    React.createElement("line", { x1: 4, y1: 4, x2: 14, y2: 14 }),
    React.createElement("line", { x1: 14, y1: 4, x2: 4, y2: 14 }),
  );
}

/* ── HelpPanel component ────────────────────────────────────────── */

function HelpPanel({
  open,
  onClose,
  title = "도움말",
  width = 360,
  children,
  className,
  style,
  ...rest
}) {
  var _v = React.useState(false);
  var visible = _v[0], setVisible = _v[1];
  var _a = React.useState(false);
  var animating = _a[0], setAnimating = _a[1];

  /* Drive mount / unmount with animation */
  React.useEffect(function () {
    if (open) {
      setVisible(true);
      /* Force reflow then animate in */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setAnimating(true);
        });
      });
    } else {
      setAnimating(false);
      /* Wait for slide-out transition to finish before unmounting */
      var timer = setTimeout(function () { setVisible(false); }, 250);
      return function () { clearTimeout(timer); };
    }
  }, [open]);

  /* Escape key to close */
  React.useEffect(function () {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (onClose) onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    return function () { document.removeEventListener("keydown", handleKey); };
  }, [open, onClose]);

  /* Trap focus return */
  var panelRef = React.useRef(null);
  React.useEffect(function () {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  if (!visible) return null;

  /* ── Backdrop ──────────────────────────────────────────────── */
  var backdropEl = React.createElement("div", {
    "aria-hidden": "true",
    onClick: function () { if (onClose) onClose(); },
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 9994,
      background: "var(--color-background-dim)",
      opacity: animating ? 1 : 0,
      transition: "opacity .25s ease",
      pointerEvents: animating ? "auto" : "none",
    },
  });

  /* ── Panel ─────────────────────────────────────────────────── */
  var panelEl = React.createElement("aside", {
    ref: panelRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    "data-krds-helppanel": true,
    tabIndex: -1,
    className: className,
    style: Object.assign({
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: 9995,
      width: width,
      maxWidth: "100vw",
      display: "flex",
      flexDirection: "column",
      background: "var(--color-surface-white)",
      boxShadow: "var(--krds-shadow-3)",
      fontFamily: "var(--krds-font-sans)",
      boxSizing: "border-box",
      transform: animating ? "translateX(0)" : "translateX(100%)",
      transition: "transform .25s cubic-bezier(.4,0,.2,1)",
      outline: "none",
    }, style),
    ...rest,
  },
    /* ── header ────────────────────────────────────────────────── */
    React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        padding: "var(--krds-space-8) var(--krds-space-9)",
        borderBottom: "1px solid var(--color-border-gray-light)",
      },
    },
      React.createElement("h2", {
        style: {
          margin: 0,
          fontSize: "var(--krds-heading-small)",
          fontWeight: "var(--krds-weight-bold)",
          color: "var(--color-text-bolder)",
          lineHeight: 1.3,
        },
      }, title),

      /* close button */
      React.createElement("button", {
        type: "button",
        "aria-label": "닫기",
        onClick: function () { if (onClose) onClose(); },
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          padding: 0,
          margin: 0,
          background: "transparent",
          border: "none",
          borderRadius: "var(--krds-radius-small)",
          color: "var(--color-icon-gray)",
          cursor: "pointer",
          flexShrink: 0,
          transition: "color .12s ease, background-color .12s ease",
        },
        onMouseEnter: function (e) {
          e.currentTarget.style.color = "var(--color-text-basic)";
          e.currentTarget.style.background = "var(--color-surface-primary-subtler)";
        },
        onMouseLeave: function (e) {
          e.currentTarget.style.color = "var(--color-icon-gray)";
          e.currentTarget.style.background = "transparent";
        },
      }, React.createElement(CloseIcon)),
    ),

    /* ── scrollable content area ───────────────────────────────── */
    React.createElement("div", {
      style: {
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "var(--krds-space-9)",
        fontSize: "var(--krds-body-small)",
        fontWeight: "var(--krds-weight-regular)",
        color: "var(--color-text-basic)",
        lineHeight: 1.6,
      },
    }, children),
  );

  /* ── Render via portal ─────────────────────────────────────── */
  return ReactDOM.createPortal(
    React.createElement(React.Fragment, null, backdropEl, panelEl),
    document.body,
  );
}

window.KRDS_HelpPanel = HelpPanel;
export default HelpPanel;
