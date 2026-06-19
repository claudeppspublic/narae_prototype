// KRDS Design System — ContextualHelp component

/**
 * ContextualHelp — question-mark icon button that shows a help popover.
 *
 * @param {string}            [title]            Popover heading.
 * @param {string|React.ReactNode} [description] Popover body content.
 * @param {string}            [learnMoreUrl]     Optional "learn more" link URL.
 * @param {string}            [learnMoreLabel="자세히 보기"]  Link text.
 * @param {"top"|"right"|"bottom"|"left"} [placement="bottom"]
 * @param {string}            [className]
 * @param {object}            [style]
 */

/* ── arrow geometry ─────────────────────────────────────────────── */

var ARROW_SIZE = 8;
var POPOVER_GAP = 8;

function arrowStyle(placement) {
  var base = {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
  };
  switch (placement) {
    case "top":
      return Object.assign({}, base, {
        bottom: -ARROW_SIZE,
        left: "50%",
        transform: "translateX(-50%)",
        borderWidth: ARROW_SIZE + "px " + ARROW_SIZE + "px 0 " + ARROW_SIZE + "px",
        borderColor: "var(--color-surface-white) transparent transparent transparent",
      });
    case "right":
      return Object.assign({}, base, {
        left: -ARROW_SIZE,
        top: "50%",
        transform: "translateY(-50%)",
        borderWidth: ARROW_SIZE + "px " + ARROW_SIZE + "px " + ARROW_SIZE + "px 0",
        borderColor: "transparent var(--color-surface-white) transparent transparent",
      });
    case "left":
      return Object.assign({}, base, {
        right: -ARROW_SIZE,
        top: "50%",
        transform: "translateY(-50%)",
        borderWidth: ARROW_SIZE + "px 0 " + ARROW_SIZE + "px " + ARROW_SIZE + "px",
        borderColor: "transparent transparent transparent var(--color-surface-white)",
      });
    case "bottom":
    default:
      return Object.assign({}, base, {
        top: -ARROW_SIZE,
        left: "50%",
        transform: "translateX(-50%)",
        borderWidth: "0 " + ARROW_SIZE + "px " + ARROW_SIZE + "px " + ARROW_SIZE + "px",
        borderColor: "transparent transparent var(--color-surface-white) transparent",
      });
  }
}

/* ── question-mark icon ─────────────────────────────────────────── */

function QuestionIcon() {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 14, height: 14, viewBox: "0 0 16 16",
    fill: "currentColor", "aria-hidden": "true",
    style: { display: "block", flexShrink: 0 },
  },
    React.createElement("path", {
      d: "M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.5a.75.75 0 011.5 0c0 .414-.336.75-.75.75A.75.75 0 017.25 4.5zM7.25 7a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0V7z",
    }),
  );
}

/* ── ContextualHelp component ───────────────────────────────────── */

function ContextualHelp({
  title,
  description,
  learnMoreUrl,
  learnMoreLabel = "자세히 보기",
  placement = "bottom",
  className,
  style,
  ...rest
}) {
  var _o = React.useState(false);
  var isOpen = _o[0], setIsOpen = _o[1];
  var triggerRef = React.useRef(null);
  var popoverRef = React.useRef(null);
  var _pos = React.useState({ top: 0, left: 0 });
  var pos = _pos[0], setPos = _pos[1];

  /* Toggle popover */
  function toggle(e) {
    e.stopPropagation();
    setIsOpen(function (v) { return !v; });
  }

  /* Position popover relative to trigger */
  React.useEffect(function () {
    if (!isOpen || !triggerRef.current || !popoverRef.current) return;

    function reposition() {
      var tr = triggerRef.current.getBoundingClientRect();
      var pop = popoverRef.current;
      var pw = pop.offsetWidth;
      var ph = pop.offsetHeight;

      var newPos = {};
      switch (placement) {
        case "top":
          newPos.left = tr.left + tr.width / 2 - pw / 2;
          newPos.top = tr.top - ph - POPOVER_GAP;
          break;
        case "right":
          newPos.left = tr.right + POPOVER_GAP;
          newPos.top = tr.top + tr.height / 2 - ph / 2;
          break;
        case "left":
          newPos.left = tr.left - pw - POPOVER_GAP;
          newPos.top = tr.top + tr.height / 2 - ph / 2;
          break;
        case "bottom":
        default:
          newPos.left = tr.left + tr.width / 2 - pw / 2;
          newPos.top = tr.bottom + POPOVER_GAP;
          break;
      }

      setPos(newPos);
    }

    reposition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    return function () {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [isOpen, placement]);

  /* Click outside to close */
  React.useEffect(function () {
    if (!isOpen) return;
    function handleClick(e) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        popoverRef.current && !popoverRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return function () { document.removeEventListener("mousedown", handleClick); };
  }, [isOpen]);

  /* Escape to close */
  React.useEffect(function () {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return function () { document.removeEventListener("keydown", handleKey); };
  }, [isOpen]);

  /* ── trigger button ─────────────────────────────────────────── */
  var triggerEl = React.createElement("button", {
    ref: triggerRef,
    type: "button",
    "aria-label": "도움말",
    "aria-expanded": isOpen,
    "aria-haspopup": "dialog",
    onClick: toggle,
    className: className,
    style: Object.assign({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 24,
      height: 24,
      padding: 0,
      margin: 0,
      background: "transparent",
      border: "1px solid var(--color-border-gray-light)",
      borderRadius: "50%",
      color: "var(--color-icon-gray)",
      cursor: "pointer",
      flexShrink: 0,
      transition: "color .12s ease, border-color .12s ease, background-color .12s ease",
    }, style),
    onMouseEnter: function (e) {
      e.currentTarget.style.color = "var(--color-icon-primary)";
      e.currentTarget.style.borderColor = "var(--color-border-primary)";
      e.currentTarget.style.background = "var(--color-surface-primary-subtler)";
    },
    onMouseLeave: function (e) {
      e.currentTarget.style.color = "var(--color-icon-gray)";
      e.currentTarget.style.borderColor = "var(--color-border-gray-light)";
      e.currentTarget.style.background = "transparent";
    },
    ...rest,
  }, React.createElement(QuestionIcon));

  /* ── popover ────────────────────────────────────────────────── */
  var popoverEl = isOpen ? ReactDOM.createPortal(
    React.createElement("div", {
      ref: popoverRef,
      role: "dialog",
      "aria-label": title || "도움말",
      "data-krds-contextualhelp": true,
      style: {
        position: "fixed",
        zIndex: 9990,
        top: pos.top,
        left: pos.left,
        width: 260,
        maxWidth: "calc(100vw - 32px)",
        background: "var(--color-surface-white)",
        borderRadius: "var(--krds-radius-large)",
        boxShadow: "var(--krds-shadow-3)",
        fontFamily: "var(--krds-font-sans)",
        boxSizing: "border-box",
        padding: "var(--krds-space-8)",
        animation: "krds-ctxhelp-in .15s ease-out",
      },
    },
      /* arrow */
      React.createElement("div", {
        "aria-hidden": "true",
        style: arrowStyle(placement),
      }),

      /* title */
      title ? React.createElement("div", {
        style: {
          fontSize: "var(--krds-heading-xsmall)",
          fontWeight: "var(--krds-weight-bold)",
          color: "var(--color-text-bolder)",
          lineHeight: 1.4,
          marginBottom: description ? "var(--krds-space-4)" : 0,
        },
      }, title) : null,

      /* description */
      description ? React.createElement("div", {
        style: {
          fontSize: "var(--krds-body-small)",
          fontWeight: "var(--krds-weight-regular)",
          color: "var(--color-text-basic)",
          lineHeight: 1.6,
        },
      }, description) : null,

      /* learn more link */
      learnMoreUrl ? React.createElement("a", {
        href: learnMoreUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        style: {
          display: "inline-block",
          marginTop: "var(--krds-space-6)",
          fontSize: "var(--krds-body-xsmall)",
          fontWeight: "var(--krds-weight-medium)",
          color: "var(--color-text-primary)",
          textDecoration: "none",
          transition: "text-decoration .12s ease",
        },
        onMouseEnter: function (e) { e.currentTarget.style.textDecoration = "underline"; },
        onMouseLeave: function (e) { e.currentTarget.style.textDecoration = "none"; },
      }, learnMoreLabel + " →") : null,
    ),
    document.body,
  ) : null;

  return React.createElement(React.Fragment, null, triggerEl, popoverEl);
}

window.KRDS_ContextualHelp = ContextualHelp;
export default ContextualHelp;
