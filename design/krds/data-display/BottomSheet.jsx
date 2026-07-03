// KRDS Design System — BottomSheet component

/**
 * BottomSheet — mobile-style overlay panel that slides up from the bottom.
 *
 * @param {boolean}  open               Whether the sheet is visible.
 * @param {function} onClose            Called when the user dismisses the sheet.
 * @param {string}   [title]            Optional title shown in the header bar.
 * @param {"small"|"medium"|"large"|"full"} [size="medium"]  Max-height preset.
 * @param {boolean}  [showHandle=true]  Show the drag-handle bar at the top.
 * @param {boolean}  [showCloseButton=true]  Show the close (X) button.
 * @param {string}   [className]
 * @param {object}   [style]
 * @param {React.ReactNode} children
 */

/* ── size → max-height mapping ───────────────────────────────── */
const SIZE_MAP = {
  small:  "30vh",
  medium: "50vh",
  large:  "75vh",
  full:   "100vh",
};

/* ── close icon (inline SVG as React element) ────────────────── */
function CloseIcon() {
  return React.createElement("svg", {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
  },
    React.createElement("path", {
      d: "M15 5L5 15M5 5l10 10",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

function BottomSheet({
  open = false,
  onClose,
  title,
  size = "medium",
  showHandle = true,
  showCloseButton = true,
  className,
  style,
  children,
  ...rest
}) {
  const sheetRef = React.useRef(null);
  const previousFocusRef = React.useRef(null);
  const maxHeight = SIZE_MAP[size] || SIZE_MAP.medium;
  const isFullHeight = size === "full";

  /* ── focus trap & body scroll lock ──────────────────────────── */
  React.useEffect(() => {
    if (!open) return;

    // Save the currently focused element so we can restore it later.
    previousFocusRef.current = document.activeElement;

    // Focus the sheet itself (or first focusable child).
    const timer = setTimeout(() => {
      if (sheetRef.current) {
        const focusable = sheetRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) focusable.focus();
        else sheetRef.current.focus();
      }
    }, 50);

    // Prevent background scrolling.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      // Restore focus to the previously active element.
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  /* ── keyboard handling (Escape to close, tab-trap) ──────────── */
  const handleKeyDown = React.useCallback((e) => {
    if (e.key === "Escape" && onClose) {
      e.stopPropagation();
      onClose(e);
      return;
    }

    // Simple focus trap.
    if (e.key === "Tab" && sheetRef.current) {
      const focusableEls = sheetRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

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
  const handleBackdropClick = React.useCallback((e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose(e);
    }
  }, [onClose]);

  /* ── don't render anything when closed ──────────────────────── */
  if (!open) return null;

  return React.createElement(
    "div",
    {
      "data-krds-bottomsheet-overlay": true,
      role: "presentation",
      onClick: handleBackdropClick,
      onKeyDown: handleKeyDown,
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "var(--color-background-dim)",
        animation: "krds-fade-in .2s ease",
      },
    },

    /* ── sheet panel ────────────────────────────────────────────── */
    React.createElement(
      "div",
      {
        ref: sheetRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": title || "Bottom sheet",
        tabIndex: -1,
        "data-krds-bottomsheet": true,
        className,
        style: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 560,
          maxHeight: maxHeight,
          background: "var(--color-background-white)",
          borderTopLeftRadius: isFullHeight ? 0 : "var(--krds-radius-xlarge)",
          borderTopRightRadius: isFullHeight ? 0 : "var(--krds-radius-xlarge)",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          boxShadow: "var(--krds-shadow-3)",
          fontFamily: "var(--krds-font-sans)",
          overflow: "hidden",
          outline: "none",
          animation: "krds-slide-up .25s ease",
          ...style,
        },
        ...rest,
      },

      /* drag handle */
      showHandle && React.createElement("div", {
        "data-krds-bottomsheet-handle": true,
        "aria-hidden": "true",
        style: {
          display: "flex",
          justifyContent: "center",
          paddingTop: 12,
          paddingBottom: 4,
          cursor: "grab",
        },
      }, React.createElement("div", {
        style: {
          width: 36,
          height: 4,
          borderRadius: "var(--krds-radius-pill)",
          background: "var(--color-element-gray-dark)",
          opacity: 0.35,
        },
      })),

      /* title bar */
      (title || showCloseButton) && React.createElement("div", {
        "data-krds-bottomsheet-header": true,
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--krds-space-6) var(--krds-space-8)",
          paddingTop: showHandle ? "var(--krds-space-4)" : "var(--krds-space-7)",
          minHeight: 48,
          flexShrink: 0,
        },
      },
        /* title */
        title ? React.createElement("h2", {
          id: "krds-bottomsheet-title",
          style: {
            margin: 0,
            fontSize: "var(--krds-heading-small)",
            fontWeight: "var(--krds-weight-bold)",
            color: "var(--color-text-bolder)",
            lineHeight: 1.4,
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }, title) : React.createElement("span"),

        /* close button */
        showCloseButton && React.createElement("button", {
          type: "button",
          "aria-label": "Close",
          onClick: onClose,
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            padding: 0,
            background: "transparent",
            border: "none",
            borderRadius: "var(--krds-radius-medium)",
            cursor: "pointer",
            color: "var(--color-icon-gray)",
            flexShrink: 0,
            marginLeft: "var(--krds-space-4)",
            transition: "background .15s ease",
          },
          onMouseEnter: (e) => { e.currentTarget.style.background = "var(--color-surface-gray-subtler)"; },
          onMouseLeave: (e) => { e.currentTarget.style.background = "transparent"; },
        }, React.createElement(CloseIcon))
      ),

      /* content body */
      React.createElement("div", {
        "data-krds-bottomsheet-body": true,
        style: {
          flex: 1,
          overflowY: "auto",
          padding: "var(--krds-space-8)",
          paddingTop: (!title && !showCloseButton && !showHandle) ? "var(--krds-space-8)" : "var(--krds-space-4)",
          fontSize: "var(--krds-body-small)",
          color: "var(--color-text-basic)",
          lineHeight: 1.6,
          WebkitOverflowScrolling: "touch",
        },
      }, children)
    )
  );
}

/* ── inject keyframe animations once ─────────────────────────── */
if (typeof document !== "undefined") {
  const STYLE_ID = "krds-bottomsheet-keyframes";
  if (!document.getElementById(STYLE_ID)) {
    const sheet = document.createElement("style");
    sheet.id = STYLE_ID;
    sheet.textContent = [
      "@keyframes krds-fade-in { from { opacity: 0; } to { opacity: 1; } }",
      "@keyframes krds-slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }",
    ].join("\n");
    document.head.appendChild(sheet);
  }
}

window.KRDS_BottomSheet = BottomSheet;
export default BottomSheet;
