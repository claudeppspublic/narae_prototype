// KRDS Design System — Calendar component

/**
 * Calendar — date picker calendar with month/year navigation.
 *
 * @param {Date|null}       [value]              Currently selected date.
 * @param {(date:Date)=>void} [onChange]          Called when a date is selected.
 * @param {Date}            [minDate]            Earliest selectable date.
 * @param {Date}            [maxDate]            Latest selectable date.
 * @param {Date[]}          [disabledDates]      Specific dates to disable.
 * @param {string}          [locale="ko-KR"]     Locale for formatting.
 * @param {boolean}         [showAdjacentMonths=true]  Show dates from adjacent months.
 * @param {string}          [className]
 * @param {object}          [style]
 */

/* ── helpers ──────────────────────────────────────────────────── */

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateDisabled(date, minDate, maxDate, disabledDates) {
  if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
  if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
  if (disabledDates && disabledDates.some(function (d) { return isSameDay(d, date); })) return true;
  return false;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

function buildCalendarGrid(year, month, showAdjacentMonths) {
  var weeks = [];
  var firstDay = getFirstDayOfWeek(year, month);
  var daysInMonth = getDaysInMonth(year, month);
  var daysInPrevMonth = getDaysInMonth(year, month - 1);
  var day = 1;
  var nextDay = 1;

  for (var w = 0; w < 6; w++) {
    var week = [];
    for (var d = 0; d < 7; d++) {
      var cellIndex = w * 7 + d;
      if (cellIndex < firstDay) {
        /* previous month */
        var prevDate = daysInPrevMonth - firstDay + d + 1;
        week.push(
          showAdjacentMonths
            ? { date: new Date(year, month - 1, prevDate), adjacent: true }
            : { date: null, adjacent: true }
        );
      } else if (day > daysInMonth) {
        /* next month */
        week.push(
          showAdjacentMonths
            ? { date: new Date(year, month + 1, nextDay++), adjacent: true }
            : { date: null, adjacent: true }
        );
      } else {
        week.push({ date: new Date(year, month, day), adjacent: false });
        day++;
      }
    }
    /* skip entirely empty trailing rows */
    if (week.every(function (c) { return c.date === null; })) break;
    weeks.push(week);
  }
  return weeks;
}

/* ── weekday headers ──────────────────────────────────────────── */
var WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

/* ── styles ───────────────────────────────────────────────────── */
var S = {
  wrapper: {
    display: "inline-flex",
    flexDirection: "column",
    fontFamily: "var(--krds-font-sans)",
    background: "var(--color-surface-white)",
    border: "1px solid var(--color-border-gray-light)",
    borderRadius: "var(--krds-radius-xlarge)",
    boxShadow: "var(--krds-shadow-2)",
    padding: "var(--krds-space-8)",
    userSelect: "none",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "var(--krds-space-7)",
  },
  navBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    padding: 0,
    border: "1px solid var(--color-border-gray-light)",
    borderRadius: "var(--krds-radius-small)",
    background: "var(--color-surface-white)",
    color: "var(--color-text-basic)",
    cursor: "pointer",
    fontSize: "var(--krds-body-medium)",
    lineHeight: 1,
  },
  title: {
    fontSize: "var(--krds-heading-small)",
    fontWeight: "var(--krds-weight-bold)",
    color: "var(--color-text-bolder)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },
  th: {
    padding: "var(--krds-space-2)",
    fontSize: "var(--krds-body-xsmall)",
    fontWeight: "var(--krds-weight-medium)",
    color: "var(--color-text-subtle)",
    textAlign: "center",
    lineHeight: 1,
  },
  thSunday: {
    color: "var(--color-text-danger)",
  },
  td: {
    padding: "var(--krds-space-2)",
    textAlign: "center",
  },
  dayBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    padding: 0,
    border: "2px solid transparent",
    borderRadius: "var(--krds-radius-pill)",
    background: "transparent",
    color: "var(--color-text-basic)",
    fontSize: "var(--krds-body-small)",
    fontWeight: "var(--krds-weight-regular)",
    cursor: "pointer",
    lineHeight: 1,
    transition: "background 0.15s, color 0.15s, border-color 0.15s",
  },
};

/* ── chevron SVGs ─────────────────────────────────────────────── */
function ChevronLeft() {
  return React.createElement(
    "svg",
    { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true" },
    React.createElement("path", {
      d: "M10 12L6 8l4-4",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

function ChevronRight() {
  return React.createElement(
    "svg",
    { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true" },
    React.createElement("path", {
      d: "M6 4l4 4-4 4",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

/* ── component ────────────────────────────────────────────────── */
function Calendar({
  value = null,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  locale = "ko-KR",
  showAdjacentMonths = true,
  className,
  style,
  ...rest
}) {
  var today = new Date();
  var initYear = value ? value.getFullYear() : today.getFullYear();
  var initMonth = value ? value.getMonth() : today.getMonth();

  var _viewState = React.useState({ year: initYear, month: initMonth });
  var view = _viewState[0];
  var setView = _viewState[1];

  var weeks = buildCalendarGrid(view.year, view.month, showAdjacentMonths);

  function goMonth(delta) {
    setView(function (prev) {
      var m = prev.month + delta;
      var y = prev.year;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  }

  /* format title */
  var monthTitle;
  try {
    var fmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" });
    monthTitle = fmt.format(new Date(view.year, view.month, 1));
  } catch (e) {
    monthTitle = view.year + "년 " + (view.month + 1) + "월";
  }

  return React.createElement(
    "div",
    {
      "data-krds-calendar": true,
      className: className,
      style: Object.assign({}, S.wrapper, style),
      ...rest,
    },

    /* ── header ── */
    React.createElement(
      "div",
      { style: S.header },
      React.createElement(
        "button",
        {
          type: "button",
          "aria-label": "이전 달",
          style: S.navBtn,
          onClick: function () { goMonth(-1); },
        },
        React.createElement(ChevronLeft)
      ),
      React.createElement("span", { style: S.title, "aria-live": "polite" }, monthTitle),
      React.createElement(
        "button",
        {
          type: "button",
          "aria-label": "다음 달",
          style: S.navBtn,
          onClick: function () { goMonth(1); },
        },
        React.createElement(ChevronRight)
      )
    ),

    /* ── calendar grid ── */
    React.createElement(
      "table",
      { role: "grid", "aria-label": monthTitle, style: S.table },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          WEEKDAYS_KO.map(function (wd, i) {
            return React.createElement(
              "th",
              {
                key: wd,
                scope: "col",
                abbr: wd,
                style: Object.assign({}, S.th, i === 0 ? S.thSunday : null),
              },
              wd
            );
          })
        )
      ),
      React.createElement(
        "tbody",
        null,
        weeks.map(function (week, wi) {
          return React.createElement(
            "tr",
            { key: wi },
            week.map(function (cell, di) {
              if (!cell.date) {
                return React.createElement("td", { key: di, style: S.td });
              }

              var d = cell.date;
              var disabled = isDateDisabled(d, minDate, maxDate, disabledDates);
              var selected = isSameDay(d, value);
              var isToday = isSameDay(d, today);
              var isSunday = d.getDay() === 0;

              var btnStyle = Object.assign({}, S.dayBtn);

              if (cell.adjacent) {
                btnStyle.color = "var(--color-text-disabled)";
                btnStyle.cursor = "default";
              } else if (disabled) {
                btnStyle.color = "var(--color-text-disabled)";
                btnStyle.cursor = "not-allowed";
              } else if (selected) {
                btnStyle.background = "var(--color-element-primary)";
                btnStyle.color = "var(--color-text-inverse-static)";
                btnStyle.fontWeight = "var(--krds-weight-bold)";
              } else {
                if (isSunday) {
                  btnStyle.color = "var(--color-text-danger)";
                }
                if (isToday) {
                  btnStyle.borderColor = "var(--color-border-primary)";
                  btnStyle.fontWeight = "var(--krds-weight-bold)";
                }
              }

              return React.createElement(
                "td",
                { key: di, style: S.td, role: "gridcell" },
                React.createElement(
                  "button",
                  {
                    type: "button",
                    "aria-label": d.getFullYear() + "년 " + (d.getMonth() + 1) + "월 " + d.getDate() + "일",
                    "aria-selected": selected || undefined,
                    "aria-disabled": disabled || cell.adjacent || undefined,
                    "aria-current": isToday ? "date" : undefined,
                    tabIndex: selected ? 0 : -1,
                    disabled: disabled || cell.adjacent,
                    style: btnStyle,
                    onClick: function () {
                      if (!disabled && !cell.adjacent && onChange) {
                        onChange(d);
                      }
                    },
                  },
                  d.getDate()
                )
              );
            })
          );
        })
      )
    )
  );
}

window.KRDS_Calendar = Calendar;
export default Calendar;
