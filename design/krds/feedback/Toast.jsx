// KRDS Design System — Toast component

/**
 * Toast — brief notification that appears temporarily to confirm an action
 * or convey status information.
 *
 * @param {boolean}  open                     Whether the toast is visible.
 * @param {function} onClose                  Called when the toast should close.
 * @param {string|React.ReactNode} message    Content to display.
 * @param {"information"|"success"|"warning"|"danger"} [severity="information"]
 * @param {number}   [duration=3000]          Auto-dismiss delay in ms (0 = no auto-dismiss).
 * @param {"top"|"top-right"|"top-left"|"bottom"|"bottom-right"|"bottom-left"} [position="bottom"]
 * @param {React.ReactNode} [action]          Optional action element (e.g. button).
 * @param {boolean}  [showCloseButton=true]   Show the close (x) button.
 * @param {string}   [className]
 * @param {object}   [style]
 */

const { useState, useEffect, useRef, useCallback } = React;

/* ── severity → accent colour + icon ────────────────────────── */
const SEVERITY_MAP = {
  information: {
    accent: "var(--color-element-information)",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  },
  success: {
    accent: "var(--color-element-success)",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  },
  warning: {
    accent: "var(--color-element-warning)",
    icon: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  },
  danger: {
    accent: "var(--color-element-danger)",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
  },
};

/* ── position → CSS placement ───────────────────────────────── */
const POSITION_MAP = {
  top:           { top: "var(--krds-space-8)", left: "50%", transform: "translateX(-50%)", slideFrom: "translateX(-50%) translateY(-24px)" },
  "top-right":   { top: "var(--krds-space-8)", right: "var(--krds-space-8)", slideFrom: "translateX(24px)" },
  "top-left":    { top: "var(--krds-space-8)", left: "var(--krds-space-8)", slideFrom: "translateX(-24px)" },
  bottom:        { bottom: "var(--krds-space-8)", left: "50%", transform: "translateX(-50%)", slideFrom: "translateX(-50%) translateY(24px)" },
  "bottom-right":{ bottom: "var(--krds-space-8)", right: "var(--krds-space-8)", slideFrom: "translateX(24px)" },
  "bottom-left": { bottom: "var(--krds-space-8)", left: "var(--krds-space-8)", slideFrom: "translateX(-24px)" },
};

/* ── close icon SVG ─────────────────────────────────────────── */
function CloseIcon() {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: { display: "block", flexShrink: 0 },
  },
    React.createElement("line", { x1: 4, y1: 4, x2: 12, y2: 12 }),
    React.createElement("line", { x1: 12, y1: 4, x2: 4, y2: 12 }),
  );
}

/* ── severity icon SVG ──────────────────────────────────────── */
function SeverityIcon({ severity }) {
  const s = SEVERITY_MAP[severity] || SEVERITY_MAP.information;
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: s.accent,
    "aria-hidden": "true",
    style: { display: "block", flexShrink: 0 },
  },
    React.createElement("path", { d: s.icon }),
  );
}

function Toast({
  open = false,
  onClose,
  message,
  severity = "information",
  duration = 3000,
  position = "bottom",
  action,
  showCloseButton = true,
  className,
  style,
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /* mount / unmount lifecycle for enter/exit animation */
  useEffect(() => {
    if (open) {
      setMounted(true);
      /* request animation frame to allow DOM paint before transition */
      const raf = requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  /* auto-dismiss */
  useEffect(() => {
    clearTimer();
    if (open && duration > 0) {
      timerRef.current = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
    }
    return clearTimer;
  }, [open, duration, onClose, clearTimer]);

  if (!mounted) return null;

  const sev = SEVERITY_MAP[severity] || SEVERITY_MAP.information;
  const pos = POSITION_MAP[position] || POSITION_MAP.bottom;

  const baseTransform = pos.transform || "none";
  const enterTransform = baseTransform;
  const exitTransform = pos.slideFrom || "translateY(24px)";

  const toastEl = React.createElement("div", {
    role: "status",
    "aria-live": "polite",
    "data-krds-toast": true,
    "data-krds-severity": severity,
    className,
    style: {
      position: "fixed",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "var(--krds-space-6)",
      minWidth: 280,
      maxWidth: 480,
      padding: "var(--krds-space-6) var(--krds-space-7)",
      borderRadius: "var(--krds-radius-medium)",
      background: "var(--color-surface-inverse)",
      color: "var(--color-text-inverse-static)",
      fontFamily: "var(--krds-font-sans)",
      fontSize: "var(--krds-body-small)",
      fontWeight: "var(--krds-weight-regular)",
      lineHeight: 1.5,
      boxShadow: "var(--krds-shadow-3)",
      borderLeft: `4px solid ${sev.accent}`,
      boxSizing: "border-box",
      pointerEvents: "auto",
      opacity: visible ? 1 : 0,
      transform: visible ? enterTransform : exitTransform,
      transition: "opacity .2s ease, transform .2s ease",
      /* placement */
      ...Object.fromEntries(
        Object.entries(pos).filter(([k]) => !["slideFrom", "transform"].includes(k))
      ),
      ...style,
    },
    ...rest,
  },
    /* severity icon */
    React.createElement(SeverityIcon, { severity }),

    /* message */
    React.createElement("span", {
      style: { flex: 1, minWidth: 0, wordBreak: "break-word" },
    }, message),

    /* action slot */
    action ? React.createElement("span", {
      style: { flexShrink: 0 },
    }, action) : null,

    /* close button */
    showCloseButton ? React.createElement("button", {
      type: "button",
      "aria-label": "Close notification",
      onClick: onClose,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        padding: 0,
        margin: 0,
        background: "transparent",
        border: "none",
        color: "var(--color-icon-inverse)",
        cursor: "pointer",
        borderRadius: "var(--krds-radius-small)",
        flexShrink: 0,
        opacity: 0.7,
        transition: "opacity .12s ease",
      },
      onMouseEnter: (e) => { e.currentTarget.style.opacity = "1"; },
      onMouseLeave: (e) => { e.currentTarget.style.opacity = "0.7"; },
    }, React.createElement(CloseIcon)) : null,
  );

  return ReactDOM.createPortal(toastEl, document.body);
}

window.KRDS_Toast = Toast;
export default Toast;
