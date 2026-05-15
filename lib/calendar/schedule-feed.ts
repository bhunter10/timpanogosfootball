import {
  scheduleTeamLevels,
  type ScheduleGame,
  type ScheduleTeamLevel,
} from "@/types/firestore";

const teamLevelLabels = new Map(
  scheduleTeamLevels.map((level) => [level.value, level.label]),
);

function escapeICalText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldICalLine(line: string) {
  const limit = 75;
  if (line.length <= limit) return line;

  const chunks = [];
  let remaining = line;
  while (remaining.length > limit) {
    chunks.push(remaining.slice(0, limit));
    remaining = ` ${remaining.slice(limit)}`;
  }
  chunks.push(remaining);
  return chunks.join("\r\n");
}

function formatICalDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    "T",
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    "Z",
  ].join("");
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function getTeamLevelLabel(teamLevel: ScheduleTeamLevel) {
  return teamLevelLabels.get(teamLevel) ?? "Varsity";
}

function getEventSummary(game: ScheduleGame) {
  const matchup = `${game.isHome ? "vs" : "at"} ${game.opponent}`;
  return `Timpanogos ${getTeamLevelLabel(game.teamLevel)} Football ${matchup}`;
}

function getEventDescription(game: ScheduleGame) {
  const details = [
    `${game.isHome ? "Home" : "Away"} game`,
    game.result ? `Result: ${game.result}` : undefined,
    game.notes,
    game.address ? `Address: ${game.address}` : undefined,
  ].filter(Boolean);

  return details.join("\n");
}

function eventToICal(game: ScheduleGame, origin: string, timestamp: string) {
  const startsAt = new Date(game.dateISO);
  if (Number.isNaN(startsAt.getTime())) return [];

  const endsAt = addHours(startsAt, 3);
  const uid = `${game.id}-${game.teamLevel}@timpanogosfootball`;
  const lines = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${formatICalDate(startsAt)}`,
    `DTEND:${formatICalDate(endsAt)}`,
    `SUMMARY:${escapeICalText(getEventSummary(game))}`,
    `LOCATION:${escapeICalText(game.location || "Location TBD")}`,
    `DESCRIPTION:${escapeICalText(getEventDescription(game))}`,
    `URL:${origin}/schedule?team=${game.teamLevel}`,
    "END:VEVENT",
  ];

  return lines;
}

export function isScheduleTeamLevel(value: string): value is ScheduleTeamLevel {
  return scheduleTeamLevels.some((level) => level.value === value);
}

export function buildScheduleICalFeed({
  games,
  origin,
  teamLevel,
}: {
  games: ScheduleGame[];
  origin: string;
  teamLevel: ScheduleTeamLevel;
}) {
  const label = getTeamLevelLabel(teamLevel);
  const timestamp = formatICalDate(new Date());
  const events = games
    .filter((game) => game.teamLevel === teamLevel)
    .flatMap((game) => eventToICal(game, origin, timestamp));

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//Timpanogos Football//Schedule Feed//EN",
    `X-WR-CALNAME:${escapeICalText(`Timpanogos Football - ${label}`)}`,
    "X-WR-TIMEZONE:America/Denver",
    ...events,
    "END:VCALENDAR",
  ];

  return `${lines.map(foldICalLine).join("\r\n")}\r\n`;
}
