import type { MetadataRoute } from "next";
import { getScheduleGames } from "@/lib/data/schedule";
import { getSiteUrl } from "@/lib/seo";

const staticRoutes = [
  "/",
  "/schedule",
  "/roster",
  "/records",
  "/staff",
  "/recruiting",
  "/tickets",
  "/shop",
  "/prospects",
  "/team-calendar",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getScheduleGames();
  const teamLevels = new Set(games.map((game) => game.teamLevel));
  const scheduleRoutes = [...teamLevels]
    .filter((teamLevel) => teamLevel !== "varsity")
    .map((teamLevel) => `/schedule?team=${teamLevel}`);

  return [...staticRoutes, ...scheduleRoutes].map((path) => ({
    url: getSiteUrl(path).toString(),
    lastModified: new Date(),
    changeFrequency: path === "/schedule" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/schedule" ? 0.9 : 0.7,
  }));
}
