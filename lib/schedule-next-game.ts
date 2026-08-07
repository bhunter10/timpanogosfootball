import type { ScheduleGame } from "@/types/firestore";

export function getNextGameByKickoff(games: ScheduleGame[], now = new Date()) {
  return games.find((game) => {
    const kickoff = new Date(game.dateISO);
    return !Number.isNaN(kickoff.getTime()) && kickoff.getTime() > now.getTime();
  });
}
