import { buildScheduleICalFeed, isScheduleTeamLevel } from "@/lib/calendar/schedule-feed";
import { getScheduleGames } from "@/lib/data/schedule";
import { getRequestOrigin } from "@/lib/site-url";

export const dynamic = "force-dynamic";

type CalendarRouteContext = {
  params: Promise<{ team: string }>;
};

export async function GET(request: Request, context: CalendarRouteContext) {
  const { team } = await context.params;

  if (!isScheduleTeamLevel(team)) {
    return new Response("Unknown schedule", { status: 404 });
  }

  const games = await getScheduleGames();
  const origin = getRequestOrigin(request);
  const feed = buildScheduleICalFeed({
    games,
    origin,
    teamLevel: team,
  });

  return new Response(feed, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "Content-Disposition": `inline; filename="timpanogos-${team}-football.ics"`,
      "Content-Type": "text/calendar; charset=utf-8",
    },
  });
}
