export function getScheduleResultClassName(result: string) {
  const outcome = result.trim().charAt(0).toUpperCase();

  if (outcome === "W") {
    return "border-green-400/45 bg-green-500/15 text-green-200";
  }

  if (outcome === "L") {
    return "border-red-400/45 bg-red-500/15 text-red-200";
  }

  if (outcome === "T") {
    return "border-sky-400/45 bg-sky-500/15 text-sky-200";
  }

  return "border-white/15 text-zinc-200";
}
