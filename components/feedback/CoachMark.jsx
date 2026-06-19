// KRDS Design System — CoachMark component

/**
 * CoachMark — onboarding spotlight / coach mark component.
 *
 * Renders a semi-transparent backdrop with a spotlight cutout around the
 * target element and a popover with step-by-step guidance.
 *
 * @param {boolean}  open         Whether the coach mark is visible.
 * @param {function} onClose      Called when the coach mark should close.
 * @param {React.RefObject} target  Ref to the element to highlight.
 * @param {string}   [title]      Heading for the step.
 * @param {string}   [description] Body text for the step.
 * @param {number}   [step]       Current step number (1-based).
 * @param {number}   [totalSteps] Total number of steps.
 * @param {function} [onNext]     Called when the "다음" button is clicked.
 * @param {function} [onPrev]     Called when the "이전" button is clicked.
 * @param {function} [onSkip]     Called when the "건너뛰기" button is clicked.
 * @param {"top"|"right"|"bottom"|"left"} [placement="bottom"]
 * @param {string}   [className]
 * @param {object}   [style]
 */

/* ── helpers ────────────────────────────────────────────────────── */

var SPOTLIGHT_PADDING = 8;
var POPOVER_GAP = 12;

function getTargetRect(target) {
  if (!target || !target.current) return null;
  return target.current.getBoundingClientRect();
}

function computePopoverPosition(rect, placement, popoverW, popoverH) {
  if (!rect) return { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };

  var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  var scrollY = window.pageYOffset || document.documentElement.scrollTop;
  var cx = rect.left + rect.width / 2 + scrollX;
  var cy = rect.top + rect.height / 2 + scrollY;
  var pos = {};

  switch (placement) {
    case "top":
      pos.left = cx - popoverW / 2;
      pos.top = rect.top + scrollY - SPOTLIGHT_PADDING - POPOVER_GAP - popoverH;
      break;
    case "right":
      pos.left = rect.right + scrollX + SPOTLIGHT_PADDING + POPOVER_GAP;
      pos.top = cy - popoverH / 2;
      break;
    case "left":
      pos.left = rect.left + scrollX - SPOTLIGHT_PADDING - POPOVER_GAP - popoverW;
      pos.top = cy - popoverH / 2;
      break;
    case "bottom":
    default:
      pos.left = cx - popoverW / 2;
      pos.top = rect.bottom + scrollY + SPOTLIGHT_PADDING + POPOVER_GAP;
      break;
  }

  return { top: pos.top, left: pos.left };
}

/* ── close icon ─────────────────────────────────────────────────── */

function CloseIcon() {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 16, height: 16, viewBox: "0 0 16 16",
    fill: "none", stroke: "currentColor",
    strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
    "aria-hidden": "true",
    style: { display: "block", flexShrink: 0 },
  },
    React.createElement("line", { x1: 4, y1: 4, x2: 12, y2: 12 }),
    React.createElement("line", { x1: 12, y1: 4, x2: 4, y2: 12 }),
  );
}

/* ── CoachMark component ────────────────────────────────────────── */

function CoachMark({
  open,
  onClose,
  target,
  title,
  description,
  step,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  placement = "bottom",
  className,
  style,
  ...rest
}) {
  var popoverRef = React.useRef(null);
  var _f = React.useState(null);
  var rect = _f[0], setRect = _f[1];
  var _p = React.useState({ top: 0, left: 0 });
  var popoverPos = _p[0], setPopoverPos = _p[1];

  /* Recalculate target rect on open / resize / scroll */
  React.useEffect(function () {
    if (!open) return;

    function measure() {
      var r = getTargetRect(target);
      setRect(r);
    }

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return function () {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, target, step]);

  /* Position the popover after it renders */
  React.useEffect(function () {
    if (!open || !rect || !popoverRef.current) return;
    var el = popoverRef.current;
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    setPopoverPos(computePopoverPosition(rect, placement, w, h));
  }, [open, rect, placement]);

  /* Keyboard handling */
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

  if (!open) return null;

  var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  var scrollY = window.pageYOffset || document.documentElement.scrollTop;

  /* Spotlight clip path */
  var clipPath = "none";
  if (rect) {
    var sx = rect.left + scrollX - SPOTLIGHT_PADDING;
    var sy = rect.top + scrollY - SPOTLIGHT_PADDING;
    var sw = rect.width + SPOTLIGHT_PADDING * 2;
    var sh = rect.height + SPOTLIGHT_PADDING * 2;
    var rad = 8;
    // Create an inverted rounded-rect cutout using SVG clip-path in the backdrop
    clipPath = "none"; // We'll use a box-shadow trick instead
  }

  /* Build step indicator text */
  var stepText = (step != null && totalSteps != null) ? (step + "/" + totalSteps) : null;

  var isFirst = step != null && step <= 1;
  var isLast = step != null && totalSteps != null && step >= totalSteps;

  /* ── Backdrop ──────────────────────────────────────────────── */
  var backdropEl = React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 9998,
      pointerEvents: "auto",
    },
    onClick: function () { if (onClose) onClose(); },
  },
    /* Dark overlay with spotlight hole using box-shadow */
    rect ? React.createElement("div", {
      style: {
        position: "absolute",
        top: rect.top - SPOTLIGHT_PADDING,
        left: rect.left - SPOTLIGHT_PADDING,
        width: rect.width + SPOTLIGHT_PADDING * 2,
        height: rect.height + SPOTLIGHT_PADDING * 2,
        borderRadius: "var(--krds-radius-medium)",
        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
        pointerEvents: "none",
        zIndex: 9998,
      },
    }) : React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
      },
    }),
  );

  /* ── Navigation buttons ────────────────────────────────────── */
  var navBtnBase = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    padding: "0 var(--krds-space-7)",
    borderRadius: "var(--krds-radius-small)",
    fontFamily: "var(--krds-font-sans)",
    fontSize: "var(--krds-body-xsmall)",
    fontWeight: "var(--krds-weight-medium)",
    cursor: "pointer",
    border: "none",
    transition: "background-color .12s ease, color .12s ease",
    lineHeight: 1,
  };

  var navButtons = [];

  /* Skip button */
  if (onSkip) {
    navButtons.push(
      React.createElement("button", {
        key: "skip",
        type: "button",
        onClick: function (e) { e.stopPropagation(); onSkip(); },
        style: Object.assign({}, navBtnBase, {
          background: "transparent",
          color: "var(--color-text-subtle)",
          marginRight: "auto",
        }),
        onMouseEnter: function (e) { e.currentTarget.style.color = "var(--color-text-basic)"; },
        onMouseLeave: function (e) { e.currentTarget.style.color = "var(--color-text-subtle)"; },
      }, "건너뛰기"),
    );
  }

  /* Prev button */
  if (onPrev && !isFirst) {
    navButtons.push(
      React.createElement("button", {
        key: "prev",
        type: "button",
        onClick: function (e) { e.stopPropagation(); onPrev(); },
        style: Object.assign({}, navBtnBase, {
          background: "transparent",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border-primary)",
        }),
        onMouseEnter: function (e) { e.currentTarget.style.background = "var(--color-surface-primary-subtler)"; },
        onMouseLeave: function (e) { e.currentTarget.style.background = "transparent"; },
      }, "이전"),
    );
  }

  /* Next / finish button */
  if (onNext) {
    navButtons.push(
      React.createElement("button", {
        key: "next",
        type: "button",
        onClick: function (e) { e.stopPropagation(); onNext(); },
        style: Object.assign({}, navBtnBase, {
          background: "var(--color-button-primary-fill)",
          color: "var(--color-text-inverse-static)",
        }),
        onMouseEnter: function (e) { e.currentTarget.style.background = "var(--color-button-primary-fill-hover)"; },
        onMouseLeave: function (e) { e.currentTarget.style.background = "var(--color-button-primary-fill)"; },
      }, isLast ? "완료" : "다음"),
    );
  }

  /* ── Popover ───────────────────────────────────────────────── */
  var popoverEl = React.createElement("div", {
    ref: popoverRef,
    role: "dialog",
    "aria-modal": "false",
    "aria-label": title || "Coach mark",
    "data-krds-coachmark": true,
    className: className,
    tabIndex: -1,
    onClick: function (e) { e.stopPropagation(); },
    style: Object.assign({
      position: "absolute",
      zIndex: 9999,
      top: popoverPos.top,
      left: popoverPos.left,
      transform: popoverPos.transform || "none",
      width: 320,
      maxWidth: "calc(100vw - 32px)",
      background: "var(--color-surface-white)",
      borderRadius: "var(--krds-radius-xlarge)",
      boxShadow: "var(--krds-shadow-3)",
      fontFamily: "var(--krds-font-sans)",
      boxSizing: "border-box",
      overflow: "hidden",
      animation: "krds-coachmark-in .18s ease-out",
    }, style),
    ...rest,
  },
    /* header with title and close */
    React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "var(--krds-space-8) var(--krds-space-8) 0 var(--krds-space-8)",
      },
    },
      /* step badge + title */
      React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        stepText ? React.createElement("span", {
          "aria-label": "Step " + step + " of " + totalSteps,
          style: {
            display: "inline-block",
            fontSize: "var(--krds-body-xsmall)",
            fontWeight: "var(--krds-weight-bold)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--krds-space-2)",
          },
        }, stepText) : null,
        title ? React.createElement("div", {
          style: {
            fontSize: "var(--krds-heading-xsmall)",
            fontWeight: "var(--krds-weight-bold)",
            color: "var(--color-text-bolder)",
            lineHeight: 1.4,
          },
        }, title) : null,
      ),

      /* close button */
      onClose ? React.createElement("button", {
        type: "button",
        "aria-label": "닫기",
        onClick: function (e) { e.stopPropagation(); onClose(); },
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          padding: 0,
          margin: 0,
          background: "transparent",
          border: "none",
          borderRadius: "var(--krds-radius-small)",
          color: "var(--color-icon-gray)",
          cursor: "pointer",
          flexShrink: 0,
          opacity: 0.7,
          transition: "opacity .12s ease",
        },
        onMouseEnter: function (e) { e.currentTarget.style.opacity = "1"; },
        onMouseLeave: function (e) { e.currentTarget.style.opacity = "0.7"; },
      }, React.createElement(CloseIcon)) : null,
    ),

    /* description */
    description ? React.createElement("div", {
      style: {
        padding: "var(--krds-space-4) var(--krds-space-8) 0 var(--krds-space-8)",
        fontSize: "var(--krds-body-small)",
        fontWeight: "var(--krds-weight-regular)",
        color: "var(--color-text-basic)",
        lineHeight: 1.6,
      },
    }, description) : null,

    /* step dots + nav buttons */
    React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--krds-space-4)",
        padding: "var(--krds-space-7) var(--krds-space-8) var(--krds-space-8) var(--krds-space-8)",
      },
    },
      /* step dots */
      totalSteps > 1 ? React.createElement("div", {
        "aria-hidden": "true",
        style: {
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginRight: "auto",
        },
      },
        Array.from({ length: totalSteps }, function (_, i) {
          return React.createElement("span", {
            key: i,
            style: {
              width: i + 1 === step ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i + 1 === step
                ? "var(--color-element-primary)"
                : "var(--color-element-primary-lighter)",
              transition: "width .15s ease, background .15s ease",
            },
          });
        }),
      ) : null,

      /* navigation buttons */
      navButtons.length > 0 ? React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "var(--krds-space-4)",
          marginLeft: totalSteps > 1 ? 0 : "auto",
        },
      }, navButtons) : null,
    ),
  );

  /* ── Render via portal ─────────────────────────────────────── */
  return React.createElement(
    React.Fragment,
    null,
    ReactDOM.createPortal(
      React.createElement("div", {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          zIndex: 9998,
        },
      }, backdropEl, popoverEl),
      document.body,
    ),
  );
}

window.KRDS_CoachMark = CoachMark;
export default CoachMark;
