// KRDS Design System — Tooltip component

/**
 * Tooltip — small floating label that appears on hover, focus, or click
 * to provide supplementary information about a UI element.
 *
 * @param {string|React.ReactNode} content    Text or content to display in the tooltip.
 * @param {"top"|"right"|"bottom"|"left"} [placement="top"]  Position relative to trigger.
 * @param {"hover"|"focus"|"click"} [trigger="hover"]        Activation mode.
 * @param {number}  [delay=200]               Delay in ms before showing.
 * @param {number}  [maxWidth=240]            Maximum width in px.
 * @param {React.ReactNode} children          The trigger element.
 * @param {string}  [className]
 * @param {object}  [style]
 */

const { useState, useEffect, useRef, useCallback, useLayoutEffect } = React;

/* ── arrow size constant ────────────────────────────────────── */
const ARROW = 6;

/* ── compute tooltip + arrow position ───────────────────────── */
function computePosition(triggerRect, tooltipRect, placement) {
  const gap = ARROW + 4;
  let top = 0;
  let left = 0;
  let arrowStyle = {};

  switch (placement) {
    case "top":
      top = triggerRect.top + window.scrollY - tooltipRect.height - gap;
      left = triggerRect.left + window.scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
      arrowStyle = {
        bottom: -ARROW,
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: `${ARROW}px solid transparent`,
        borderRight: `${ARROW}px solid transparent`,
        borderTop: `${ARROW}px solid var(--color-surface-inverse)`,
      };
      break;
    case "bottom":
      top = triggerRect.bottom + window.scrollY + gap;
      left = triggerRect.left + window.scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
      arrowStyle = {
        top: -ARROW,
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: `${ARROW}px solid transparent`,
        borderRight: `${ARROW}px solid transparent`,
        borderBottom: `${ARROW}px solid var(--color-surface-inverse)`,
      };
      break;
    case "left":
      top = triggerRect.top + window.scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.left + window.scrollX - tooltipRect.width - gap;
      arrowStyle = {
        right: -ARROW,
        top: "50%",
        transform: "translateY(-50%)",
        borderTop: `${ARROW}px solid transparent`,
        borderBottom: `${ARROW}px solid transparent`,
        borderLeft: `${ARROW}px solid var(--color-surface-inverse)`,
      };
      break;
    case "right":
      top = triggerRect.top + window.scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.right + window.scrollX + gap;
      arrowStyle = {
        left: -ARROW,
        top: "50%",
        transform: "translateY(-50%)",
        borderTop: `${ARROW}px solid transparent`,
        borderBottom: `${ARROW}px solid transparent`,
        borderRight: `${ARROW}px solid var(--color-surface-inverse)`,
      };
      break;
  }

  return { top, left, arrowStyle };
}

function Tooltip({
  content,
  placement = "top",
  trigger = "hover",
  delay = 200,
  maxWidth = 240,
  children,
  className,
  style,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, arrowStyle: {} });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const delayTimerRef = useRef(null);
  const idRef = useRef("krds-tooltip-" + Math.random().toString(36).slice(2, 9));

  const clearDelay = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    clearDelay();
    if (delay > 0) {
      delayTimerRef.current = setTimeout(() => setOpen(true), delay);
    } else {
      setOpen(true);
    }
  }, [delay, clearDelay]);

  const hide = useCallback(() => {
    clearDelay();
    setOpen(false);
  }, [clearDelay]);

  const toggle = useCallback(() => {
    clearDelay();
    setOpen((prev) => !prev);
  }, [clearDelay]);

  /* reposition after open */
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setCoords(computePosition(triggerRect, tooltipRect, placement));
  }, [open, placement]);

  /* close on scroll / resize */
  useEffect(() => {
    if (!open) return;
    const handleClose = () => setOpen(false);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [open]);

  /* close on outside click for click trigger */
  useEffect(() => {
    if (!open || trigger !== "click") return;
    const handleClick = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        tooltipRef.current && !tooltipRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, trigger]);

  /* close on Escape */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  /* cleanup timer on unmount */
  useEffect(() => clearDelay, [clearDelay]);

  /* ── build trigger props based on trigger type ─────────────── */
  const triggerProps = { ref: triggerRef, "aria-describedby": open ? idRef.current : undefined };

  if (trigger === "hover") {
    triggerProps.onMouseEnter = show;
    triggerProps.onMouseLeave = hide;
    triggerProps.onFocus = show;
    triggerProps.onBlur = hide;
  } else if (trigger === "focus") {
    triggerProps.onFocus = show;
    triggerProps.onBlur = hide;
  } else if (trigger === "click") {
    triggerProps.onClick = toggle;
  }

  /* ── clone child element with trigger props ───────────────── */
  const triggerElement = React.isValidElement(children)
    ? React.cloneElement(children, triggerProps)
    : React.createElement("span", {
        ...triggerProps,
        tabIndex: 0,
        style: { display: "inline-flex" },
      }, children);

  /* ── tooltip portal ───────────────────────────────────────── */
  const tooltipEl = open
    ? ReactDOM.createPortal(
        React.createElement("div", {
          ref: tooltipRef,
          id: idRef.current,
          role: "tooltip",
          "data-krds-tooltip": true,
          "data-krds-placement": placement,
          className,
          style: {
            position: "absolute",
            zIndex: 10000,
            top: coords.top,
            left: coords.left,
            maxWidth,
            padding: "var(--krds-space-4) var(--krds-space-6)",
            borderRadius: "var(--krds-radius-small)",
            background: "var(--color-surface-inverse)",
            color: "var(--color-text-inverse-static)",
            fontFamily: "var(--krds-font-sans)",
            fontSize: "var(--krds-body-xsmall)",
            fontWeight: "var(--krds-weight-regular)",
            lineHeight: 1.5,
            boxShadow: "var(--krds-shadow-2)",
            pointerEvents: "none",
            wordBreak: "break-word",
            boxSizing: "border-box",
            opacity: 1,
            transition: "opacity .15s ease",
            ...style,
          },
          ...rest,
        },
          /* content */
          content,
          /* arrow */
          React.createElement("span", {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              width: 0,
              height: 0,
              borderStyle: "solid",
              ...coords.arrowStyle,
            },
          }),
        ),
        document.body,
      )
    : null;

  return React.createElement(React.Fragment, null, triggerElement, tooltipEl);
}

window.KRDS_Tooltip = Tooltip;
export default Tooltip;
