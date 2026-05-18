const scheduleTimeZone = "America/Denver";

type GameDateParts = {
  month: string;
  day: string;
  weekday: string;
  time: string;
};

function getDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatScheduleGameDate(
  iso: string,
  fallbackDay = "",
): GameDateParts {
  const date = getDate(iso);
  if (!date) {
    return { month: "TBD", day: fallbackDay, weekday: "", time: "Time TBD" };
  }

  return {
    month: new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: scheduleTimeZone,
    }).format(date),
    day: new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      timeZone: scheduleTimeZone,
    }).format(date),
    weekday: new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: scheduleTimeZone,
    }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: scheduleTimeZone,
    }).format(date),
  };
}

export function formatScheduleAdminDate(iso: string) {
  const date = getDate(iso);
  if (!date) return "Date TBD";

  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: scheduleTimeZone,
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: scheduleTimeZone,
  }).format(date);

  return `${datePart} at ${timePart}`;
}

export function toScheduleDatetimeLocalValue(iso: string) {
  const date = getDate(iso);
  if (!date) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: scheduleTimeZone,
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function getScheduleTimeZoneOffsetMs(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone: scheduleTimeZone,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const localAsUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );

  return localAsUtc - date.getTime();
}

export function scheduleDatetimeLocalToIso(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (!match) return "";

  const [, year, month, day, hour, minute, second = "00"] = match;
  const localAsUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
  const firstGuess = new Date(localAsUtc);
  const secondGuess = new Date(localAsUtc - getScheduleTimeZoneOffsetMs(firstGuess));

  return secondGuess.toISOString();
}
