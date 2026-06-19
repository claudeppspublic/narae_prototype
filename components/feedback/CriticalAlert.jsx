// KRDS Design System — CriticalAlert component

/**
 * CriticalAlert — critical/blocking alert dialog for destructive or
 * irreversible actions. Renders as a modal overlay via React.createPortal.
 *
 * @param {boolean}  open                       Whether the dialog is visible.
 * @param {function} onClose                    Called when the dialog should be dismissed.
 * @param {string}   [title="주의"]              Heading text.
 * @param {string|React.ReactNode} [message]    Explanatory message body.
 * @param {string}   [confirmLabel="확인"]        Confirm button label.
 * @param {string}   [cancelLabel="취소"]         Cancel button label.
 * @param {function} [onConfirm]                Called when the confirm button is clicked.
 * @param {function} [onCancel]                 Called when the cancel button is clicked.
 * @param {"danger"|"warning"} [severity="danger"]  Severity determines icon & button colour.
 * @param {string}   [className]
 * @param {object}   [style]
 */

/* ── severity colour tokens ──────────────────────────────────── */
var SEVERITY_TOKENS = {
  danger: {
    element:   "var(--color-element-danger)",
    text:      "var(--color-text-danger)",
    icon:      "var(--color-icon-danger)",
    buttonBg:  "var(--color-element-danger)",
    buttonHover: "var(--color-button-primary-fill-hover, #c0392b)",
  },
  warning: {
    element:   "var(--color-element-warning)",
    text:      "var(--color-text-warning)",
    icon:      "var(--color-icon-warning)",
    buttonBg:  "var(--color-element-warning)",
    buttonHover: "var(--color-button-primary-fill-hover, #e67e22)",
  },
};

/* ── large severity icons ────────────────────────────────────── */
function DangerLargeIcon() {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 48, height: 48, viewBox: "0 0 48 48",
    fill: "none", "aria-hidden": "true",
    style: { display: "block", flexShrink: 0 },
  },
    React.createElement("circle", {
      cx: 24, cy: 24, r: 22,
      fill: "var(--color-surface-danger-subtler)",
      stroke: "var(--color-element-danger)",
      strokeWidth: 2,
    }),
    React.createElement("path", {
      d: "M24 14v12",
      stroke: "var(--color-icon-danger)",
      strokeWidth: 3,
      strokeLinecap: "round",
    }),
    React.createElement("circle", {
      cx: 24, cy: 33, r: 2,
      fill: "var(--color-icon-danger)",
    }),
  );
}

function WarningLargeIcon() {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 48, height: 48, viewBox: "0 0 48 48",
    fill: "none", "aria-hidden": "true",
    style: { display: "block", flexShrink: 0 },
  },
    React.createElement("path", {
      d: "M24 4L2 44h44L24 4z",
      fill: "var(--color-surface-warning-subtler)",
      stroke: "var(--color-element-warning)",
      strokeWidth: 2,
      strokeLinejoin: "round",
    }),
    React.createElement("path", {
      d: "M24 18v12",
      stroke: "var(--color-icon-warning)",
      strokeWidth: 3,
      strokeLinecap: "round",
    }),
    React.createElement("circle", {
      cx: 24, cy: 36, r: 2,
      fill: "var(--color-icon-warning)",
    }),
  );
}

var SEVERITY_ICONS = {
  danger:  DangerLargeIcon,
  warning: WarningLargeIcon,
};

/* ── CriticalAlert component ─────────────────────────────────── */
function CriticalAlert({
  open = false,
  onClose,
  title = "주의",
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
  severity = "danger",
  className,
  style,
  ...rest
}) {
  var dialogRef = React.useRef(null);
  var previousFocusRef = React.useRef(null);
  var tokens = SEVERITY_TOKENS[severity] || SEVERITY_TOKENS.danger;
  var confirmHovered = React.useRef(false);

  /* ── focus management & body scroll lock ────────────────────── */
  React.useEffect(function () {
    if (!open) return;

    // Save the currently focused element so we can restore it later.
    previousFocusRef.current = document.activeElement;

    // Focus the dialog (or first focusable child) after mount.
    var timer = setTimeout(function () {
      if (dialogRef.current) {
        var focusable = dialogRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) focusable.focus();
        else dialogRef.current.focus();
      }
    }, 50);

    // Prevent background scrolling.
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return function () {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  /* ── keyboard handling (Escape to close, Tab trap) ─────────── */
  var handleKeyDown = React.useCallback(function (e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      if (onClose) onClose(e);
      return;
    }

    // Focus trap.
    if (e.key === "Tab" && dialogRef.current) {
      var focusableEls = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      var first = focusableEls[0];
      var last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onClose]);

  /* ── backdrop click ─────────────────────────────────────────── */
  var handleBackdropClick = React.useCallback(function (e) {
    if (e.target === e.currentTarget && onClose) {
      onClose(e);
    }
  }, [onClose]);

  /* ── action handlers ────────────────────────────────────────── */
  var handleCancel = React.useCallback(function (e) {
    if (onCancel) onCancel(e);
    else if (onClose) onClose(e);
  }, [onCancel, onClose]);

  var handleConfirm = React.useCallback(function (e) {
    if (onConfirm) onConfirm(e);
  }, [onConfirm]);

  /* ── don't render anything when closed ──────────────────────── */
  if (!open) return null;

  var IconComp = SEVERITY_ICONS[severity] || SEVERITY_ICONS.danger;

  /* ── render via portal ──────────────────────────────────────── */
  return ReactDOM.createPortal(
    React.createElement("div", {
      "data-krds-criticalalert-overlay": true,
      role: "presentation",
      onClick: handleBackdropClick,
      onKeyDown: handleKeyDown,
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background-dim)",
        animation: "krds-criticalalert-fade-in .15s ease",
      },
    },
      /* ── dialog panel ────────────────────────────────────────── */
      React.createElement("div", {
        ref: dialogRef,
        role: "alertdialog",
        "aria-modal": "true",
        "aria-labelledby": "krds-criticalalert-title",
        "aria-describedby": message ? "krds-criticalalert-message" : undefined,
        tabIndex: -1,
        "data-krds-criticalalert": true,
        "data-krds-severity": severity,
        className: className,
        style: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 420,
          margin: "var(--krds-space-8)",
          padding: "var(--krds-space-10)",
          paddingTop: "var(--krds-space-10)",
          background: "var(--color-background-white)",
          borderRadius: "var(--krds-radius-xlarge)",
          boxShadow: "var(--krds-shadow-3)",
          fontFamily: "var(--krds-font-sans)",
          outline: "none",
          animation: "krds-criticalalert-scale-in .2s ease",
          textAlign: "center",
          boxSizing: "border-box",
          ...style,
        },
        ...rest,
      },
        /* large icon */
        React.createElement("div", {
          style: {
            marginBottom: "var(--krds-space-8)",
            color: tokens.icon,
          },
        }, React.createElement(IconComp)),

        /* title */
        React.createElement("h2", {
          id: "krds-criticalalert-title",
          style: {
            margin: 0,
            marginBottom: message ? "var(--krds-space-6)" : "var(--krds-space-9)",
            fontSize: "var(--krds-heading-medium)",
            fontWeight: "var(--krds-weight-bold)",
            lineHeight: 1.3,
            color: "var(--color-text-bolder)",
          },
        }, title),

        /* message */
        message ? React.createElement("div", {
          id: "krds-criticalalert-message",
          style: {
            margin: 0,
            marginBottom: "var(--krds-space-9)",
            fontSize: "var(--krds-body-medium)",
            fontWeight: "var(--krds-weight-regular)",
            lineHeight: 1.6,
            color: "var(--color-text-subtle)",
            maxWidth: "100%",
            wordBreak: "keep-all",
          },
        }, message) : null,

        /* action buttons */
        React.createElement("div", {
          style: {
            display: "flex",
            gap: "var(--krds-space-6)",
            width: "100%",
          },
        },
          /* cancel button — tertiary/outline style */
          React.createElement("button", {
            type: "button",
            onClick: handleCancel,
            style: {
              flex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              padding: "0 var(--krds-space-8)",
              fontSize: "var(--krds-body-medium)",
              fontWeight: "var(--krds-weight-medium)",
              fontFamily: "var(--krds-font-sans)",
              lineHeight: 1,
              color: "var(--color-text-basic)",
              background: "var(--color-button-tertiary-fill, transparent)",
              border: "1px solid var(--color-button-tertiary-border, var(--color-border-gray-light))",
              borderRadius: "var(--krds-radius-medium)",
              cursor: "pointer",
              transition: "background-color .12s ease, border-color .12s ease",
              boxSizing: "border-box",
            },
            onMouseEnter: function (e) {
              e.currentTarget.style.background = "var(--color-surface-gray-subtler, #f5f5f5)";
            },
            onMouseLeave: function (e) {
              e.currentTarget.style.background = "var(--color-button-tertiary-fill, transparent)";
            },
          }, cancelLabel),

          /* confirm button — danger/warning filled style */
          React.createElement("button", {
            type: "button",
            onClick: handleConfirm,
            style: {
              flex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              padding: "0 var(--krds-space-8)",
              fontSize: "var(--krds-body-medium)",
              fontWeight: "var(--krds-weight-medium)",
              fontFamily: "var(--krds-font-sans)",
              lineHeight: 1,
              color: "var(--color-text-inverse-static)",
              background: tokens.buttonBg,
              border: "1px solid transparent",
              borderRadius: "var(--krds-radius-medium)",
              cursor: "pointer",
              transition: "background-color .12s ease, box-shadow .12s ease",
              boxSizing: "border-box",
            },
            onMouseEnter: function (e) {
              e.currentTarget.style.background = tokens.buttonHover;
              e.currentTarget.style.boxShadow = "var(--krds-shadow-2)";
            },
            onMouseLeave: function (e) {
              e.currentTarget.style.background = tokens.buttonBg;
              e.currentTarget.style.boxShadow = "none";
            },
          }, confirmLabel),
        ),
      ),
    ),
    document.body,
  );
}

/* ── inject keyframe animations once ─────────────────────────── */
if (typeof document !== "undefined") {
  var STYLE_ID = "krds-criticalalert-keyframes";
  if (!document.getElementById(STYLE_ID)) {
    var sheet = document.createElement("style");
    sheet.id = STYLE_ID;
    sheet.textContent = [
      "@keyframes krds-criticalalert-fade-in { from { opacity: 0; } to { opacity: 1; } }",
      "@keyframes krds-criticalalert-scale-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }",
    ].join("\n");
    document.head.appendChild(sheet);
  }
}

window.KRDS_CriticalAlert = CriticalAlert;
export default CriticalAlert;
