// KRDS Design System — SplashScreen component

/**
 * SplashScreen — full-screen splash/loading overlay shown during app
 * initialisation or transition.
 *
 * @param {boolean}          open          Whether the splash screen is visible.
 * @param {React.ReactNode}  [logo]        Logo image or element displayed at the top.
 * @param {string}           [title]       Application or service name.
 * @param {string}           [subtitle]    Tagline or description.
 * @param {boolean}          [showSpinner=true]   Show a circular spinner below content.
 * @param {function}         [onComplete]  Called when the splash finishes (after duration).
 * @param {number}           [duration=2000]  Display duration in ms before fade-out starts.
 * @param {string}           [className]
 * @param {object}           [style]
 */

const { useState, useEffect, useRef, useCallback } = React;

/* ── keyframe animation ids ────────────────────────────────── */
const FADE_ANIM_ID = "krds-splash-fadeout";
const SPIN_ANIM_ID = "krds-splash-spinner";

function ensureKeyframes() {
  if (typeof document === "undefined") return;

  if (!document.getElementById(FADE_ANIM_ID)) {
    const fadeStyle = document.createElement("style");
    fadeStyle.id = FADE_ANIM_ID;
    fadeStyle.textContent = `
@keyframes krds-splash-fade-out {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
`;
    document.head.appendChild(fadeStyle);
  }

  if (!document.getElementById(SPIN_ANIM_ID)) {
    const spinStyle = document.createElement("style");
    spinStyle.id = SPIN_ANIM_ID;
    spinStyle.textContent = `
@keyframes krds-splash-spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
    document.head.appendChild(spinStyle);
  }
}

/* ── spinner sub-component ─────────────────────────────────── */
function Spinner() {
  return React.createElement("div", {
    role: "status",
    "aria-label": "Loading",
    style: {
      width: 36,
      height: 36,
      border: "3px solid var(--color-element-gray-light)",
      borderTopColor: "var(--color-element-primary)",
      borderRadius: "50%",
      boxSizing: "border-box",
      animation: "krds-splash-spin 0.8s linear infinite",
    },
  });
}

function SplashScreen({
  open = false,
  logo,
  title,
  subtitle,
  showSpinner = true,
  onComplete,
  duration = 2000,
  className,
  style,
  ...rest
}) {
  /* States: "visible" → showing, "fading" → fade-out running, "hidden" → unmounted */
  const [phase, setPhase] = useState(open ? "visible" : "hidden");
  const timerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  /* Inject keyframes on first render */
  useEffect(() => { ensureKeyframes(); }, []);

  /* When `open` becomes true, start the display → fade-out → complete cycle */
  useEffect(() => {
    if (open) {
      setPhase("visible");

      timerRef.current = setTimeout(() => {
        setPhase("fading");
      }, duration);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else {
      /* If externally closed, skip straight to hidden */
      setPhase("hidden");
    }
  }, [open, duration]);

  /* Handle end of fade-out animation */
  const handleAnimationEnd = useCallback(() => {
    if (phase === "fading") {
      setPhase("hidden");
      if (onCompleteRef.current) onCompleteRef.current();
    }
  }, [phase]);

  if (phase === "hidden") return null;

  const overlayEl = React.createElement("div", {
    "data-krds-splash": true,
    "aria-live": "polite",
    "aria-busy": phase === "visible",
    role: "status",
    className,
    onAnimationEnd: handleAnimationEnd,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--krds-space-8)",
      background: "var(--color-background-white)",
      fontFamily: "var(--krds-font-sans)",
      animation: phase === "fading" ? "krds-splash-fade-out 0.4s ease forwards" : "none",
      ...style,
    },
    ...rest,
  },
    /* logo */
    logo
      ? React.createElement("div", {
          "aria-hidden": "true",
          style: { display: "flex", alignItems: "center", justifyContent: "center" },
        }, logo)
      : null,

    /* title */
    title
      ? React.createElement("h1", {
          style: {
            margin: 0,
            fontSize: "var(--krds-heading-large)",
            fontWeight: "var(--krds-weight-bold)",
            color: "var(--color-text-bolder)",
            lineHeight: 1.3,
            textAlign: "center",
          },
        }, title)
      : null,

    /* subtitle */
    subtitle
      ? React.createElement("p", {
          style: {
            margin: 0,
            fontSize: "var(--krds-body-medium)",
            fontWeight: "var(--krds-weight-regular)",
            color: "var(--color-text-subtle)",
            lineHeight: 1.5,
            textAlign: "center",
          },
        }, subtitle)
      : null,

    /* spinner */
    showSpinner
      ? React.createElement("div", {
          style: { marginTop: "var(--krds-space-9)" },
        }, React.createElement(Spinner))
      : null,
  );

  return ReactDOM.createPortal(overlayEl, document.body);
}

window.KRDS_SplashScreen = SplashScreen;
export default SplashScreen;
