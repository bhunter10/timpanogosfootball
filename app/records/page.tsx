import type { Metadata } from "next";
import Image from "next/image";
import { createPageMetadata } from "@/lib/seo";

const recordsHeroImage = "/images/records-hero-wide-v2.webp";

type Source = {
  id: string;
  label: string;
  href: string;
};

type RecordMark = {
  side: "offense" | "defense" | "specialTeams";
  category: string;
  mark: string;
  player: string;
  value: string;
  season: string;
  sourceId: string;
  note?: string;
};

type WatchlistMark = {
  category: string;
  stat: string;
  player: string;
  value: string;
  season: string;
  sourceId?: string;
  note?: string;
};

type ActiveWatchMark = {
  category: string;
  player: string;
  classYear: string;
  current: string;
  record: string;
  needed: string;
  sourceId: string;
  note: string;
};

const sources: readonly Source[] = [
  {
    id: "daily-herald-2024-preview",
    label: "Daily Herald 2024 preview",
    href: "https://www.heraldextra.com/sports/high-school/2024/aug/13/high-school-football-t-wolves-take-their-own-path-to-success/",
  },
  {
    id: "deseret-1996-schedule",
    label: "Deseret News 1996 schedule",
    href: "https://sports.deseret.com/high-school/school/timpanogos/football/scores-schedule/1997",
  },
  {
    id: "deseret-1999-leaders",
    label: "Deseret News 1999 leaders",
    href: "https://www.deseret.com/1999/10/5/19469025/1999-statistical-leaders-for-utah-high-school-football/",
  },
  {
    id: "utah-football-history",
    label: "Utah football historical records",
    href: "https://utah-football.com/f/allteams.htm",
  },
  {
    id: "maxpreps-2025-stats",
    label: "MaxPreps 2025 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/stats/",
  },
  {
    id: "maxpreps-2025-punt-average",
    label: "MaxPreps 2025 punt average leaders",
    href: "https://www.maxpreps.com/ut/football/stat-leaders/special-teams/punts/yds-punt/",
  },
  {
    id: "maxpreps-2025-pat",
    label: "MaxPreps 2025 PAT leaders",
    href: "https://www.maxpreps.com/ut/football/stat-leaders/special-teams/pat/made/",
  },
  {
    id: "maxpreps-luke-livingston-stats",
    label: "MaxPreps Luke Livingston stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/athletes/luke-livingston/football/stats/?careerid=cec25qupvf1aa",
  },
  {
    id: "maxpreps-2024-stats",
    label: "MaxPreps 2024 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/24-25/stats/",
  },
  {
    id: "maxpreps-2023-stats",
    label: "MaxPreps 2023 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/23-24/stats/",
  },
  {
    id: "maxpreps-jesse-king-stats",
    label: "MaxPreps Jesse King stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/athletes/jesse-king/football/stats/?careerid=8c84n1jt9n3aa",
  },
  {
    id: "maxpreps-adam-ahmu-stats",
    label: "MaxPreps Adam Ahmu stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/athletes/adam-ahmu/football/stats/?careerid=0jt47cj283bk4",
  },
  {
    id: "maxpreps-tyson-miller-stats",
    label: "MaxPreps Tyson Miller stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/athletes/tyson-miller/football/stats/?careerid=qapfspi3fra00",
  },
  {
    id: "maxpreps-2022-stats",
    label: "MaxPreps 2022 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/22-23/stats/",
  },
  {
    id: "maxpreps-2021-stats",
    label: "MaxPreps 2021 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/21-22/stats/",
  },
  {
    id: "maxpreps-carl-pinegar-stats",
    label: "MaxPreps Carl Pinegar stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/athletes/carl-pinegar/football/stats/?careerid=cakk4h5vl00n7",
  },
  {
    id: "maxpreps-2018-stats",
    label: "MaxPreps 2018 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/18-19/stats/",
  },
  {
    id: "maxpreps-2017-stats",
    label: "MaxPreps 2017 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/17-18/stats/",
  },
  {
    id: "maxpreps-2016-stats",
    label: "MaxPreps 2016 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/16-17/stats/",
  },
  {
    id: "maxpreps-mote-siufanua-stats",
    label: "MaxPreps Mote Siufanua stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/athletes/mote-siufanua/football/stats/?careerid=c8g56sgk20rj3",
  },
  {
    id: "maxpreps-2013-stats",
    label: "MaxPreps 2013 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/13-14/stats/",
  },
  {
    id: "maxpreps-2007-stats",
    label: "MaxPreps 2007 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/07-08/stats/",
  },
  {
    id: "maxpreps-nash-fowler-stats",
    label: "MaxPreps Nash Fowler stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/athletes/nash-fowler/football/stats/?careerid=2fq5ospd98uue",
  },
  {
    id: "maxpreps-2004-stats",
    label: "MaxPreps 2004 stats",
    href: "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/04-05/stats/",
  },
];

const headlineRecords: readonly RecordMark[] = [
  {
    side: "offense",
    category: "Career",
    mark: "Career receptions",
    player: "Luke Livingston",
    value: "221",
    season: "Class of 2024",
    sourceId: "maxpreps-luke-livingston-stats",
    note: "MaxPreps career total across varsity seasons.",
  },
  {
    side: "offense",
    category: "Career",
    mark: "Career total touchdowns",
    player: "Luke Livingston",
    value: "59",
    season: "Class of 2024",
    sourceId: "daily-herald-2024-preview",
  },
  {
    side: "offense",
    category: "Career",
    mark: "Career passing touchdowns",
    player: "Chase Riggs",
    value: "60",
    season: "Class of 2024",
    sourceId: "daily-herald-2024-preview",
  },
  {
    side: "defense",
    category: "Career",
    mark: "Total tackles",
    player: "Jesse King",
    value: "300",
    season: "Class of 2026",
    sourceId: "maxpreps-jesse-king-stats",
    note: "MaxPreps career total across varsity seasons.",
  },
  {
    side: "defense",
    category: "Career",
    mark: "Solo tackles",
    player: "Jesse King",
    value: "184",
    season: "Class of 2026",
    sourceId: "maxpreps-jesse-king-stats",
  },
  {
    side: "defense",
    category: "Career",
    mark: "Sacks",
    player: "Jesse King",
    value: "35.5",
    season: "Class of 2026",
    sourceId: "maxpreps-jesse-king-stats",
  },
  {
    side: "defense",
    category: "Season",
    mark: "Total tackles",
    player: "Adam Ahmu",
    value: "123",
    season: "2015 season",
    sourceId: "maxpreps-adam-ahmu-stats",
    note: "Highest public player-page season total found in the profile sweep.",
  },
  {
    side: "defense",
    category: "Season",
    mark: "Tackles per game",
    player: "Adam Ahmu",
    value: "12.5",
    season: "2016 season",
    sourceId: "maxpreps-2016-stats",
    note: "Highest public team-page tackles-per-game mark found in the 2005-2025 audit.",
  },
  {
    side: "defense",
    category: "Game",
    mark: "Total tackles",
    player: "Tyson Miller",
    value: "13",
    season: "2023 season",
    sourceId: "maxpreps-tyson-miller-stats",
    note: "Public game-log high found so far, vs. Park City on Aug. 18, 2023.",
  },
  {
    side: "offense",
    category: "Season",
    mark: "Passing touchdowns",
    player: "Christian Stewart",
    value: "44",
    season: "2007 season",
    sourceId: "maxpreps-2007-stats",
  },
  {
    side: "offense",
    category: "Season",
    mark: "Receiving touchdowns",
    player: "Luke Livingston",
    value: "23",
    season: "2021 season",
    sourceId: "maxpreps-2021-stats",
  },
  {
    side: "offense",
    category: "Season",
    mark: "Total touchdowns",
    player: "Luke Livingston",
    value: "24",
    season: "2021 season",
    sourceId: "maxpreps-2021-stats",
  },
  {
    side: "offense",
    category: "Season",
    mark: "Rushing touchdowns",
    player: "Easton Bretzing",
    value: "17",
    season: "2023 season",
    sourceId: "maxpreps-2023-stats",
  },
  {
    side: "defense",
    category: "Season",
    mark: "Sacks",
    player: "Hunter Greer",
    value: "14.5",
    season: "2017 season",
    sourceId: "maxpreps-2017-stats",
  },
  {
    side: "defense",
    category: "Season",
    mark: "Interceptions",
    player: "Haydn Sandstrom",
    value: "8",
    season: "2018 season",
    sourceId: "maxpreps-2018-stats",
  },
  {
    side: "defense",
    category: "Season",
    mark: "Caused fumbles",
    player: "Marlee Iosefo",
    value: "6",
    season: "2024 season",
    sourceId: "maxpreps-2024-stats",
  },
  {
    side: "defense",
    category: "Season",
    mark: "Fumble recoveries",
    player: "Cory Morin",
    value: "6",
    season: "2013 season",
    sourceId: "maxpreps-2013-stats",
  },
  {
    side: "defense",
    category: "Season",
    mark: "QB hurries",
    player: "Jesse King",
    value: "17",
    season: "2024 season",
    sourceId: "maxpreps-2024-stats",
    note: "Tied public mark found with Joe Kruger, 17 QB hurries in 2008.",
  },
  {
    side: "specialTeams",
    category: "Game",
    mark: "Field goals made",
    player: "Chris Broadhead",
    value: "4",
    season: "1999 game",
    sourceId: "deseret-1999-leaders",
    note: "Reported vs. Hillcrest on Sept. 10, 1999.",
  },
  {
    side: "specialTeams",
    category: "Game",
    mark: "Longest field goal",
    player: "Chris Broadhead",
    value: "51",
    season: "1999 game",
    sourceId: "deseret-1999-leaders",
    note: "Reported vs. Hillcrest on Sept. 10, 1999.",
  },
  {
    side: "specialTeams",
    category: "Season",
    mark: "Kickoff return yards",
    player: "Mote Siufanua",
    value: "743",
    season: "2015 season",
    sourceId: "maxpreps-mote-siufanua-stats",
  },
  {
    side: "specialTeams",
    category: "Season",
    mark: "Longest kickoff return",
    player: "Carl Pinegar",
    value: "100",
    season: "2016 season",
    sourceId: "maxpreps-carl-pinegar-stats",
  },
  {
    side: "specialTeams",
    category: "Season",
    mark: "Punt return yards",
    player: "Nash Fowler",
    value: "172",
    season: "2006 season",
    sourceId: "maxpreps-nash-fowler-stats",
  },
  {
    side: "specialTeams",
    category: "Season",
    mark: "Longest punt return",
    player: "Nash Fowler",
    value: "73",
    season: "2006 season",
    sourceId: "maxpreps-nash-fowler-stats",
  },
  {
    side: "specialTeams",
    category: "Season",
    mark: "Punt average",
    player: "Andrew Hillstead",
    value: "43.68",
    season: "2025 season",
    sourceId: "maxpreps-2025-punt-average",
    note: "MaxPreps state punt average leaders list 1,223 yards on 28 punts.",
  },
  {
    side: "specialTeams",
    category: "Season",
    mark: "PATs made",
    player: "Luke Bergin",
    value: "26",
    season: "2025 season",
    sourceId: "maxpreps-2025-pat",
  },
];

const publicLeaderWatchlist: readonly WatchlistMark[] = [
  {
    category: "Receiving",
    stat: "Receiving yards per game",
    player: "Gabe Graf",
    value: "97.6",
    season: "2024 season",
    sourceId: "maxpreps-2024-stats",
  },
  {
    category: "Receiving",
    stat: "Receiving yards per game",
    player: "Luke Livingston",
    value: "91.1",
    season: "2022 season",
    sourceId: "maxpreps-2022-stats",
  },
  {
    category: "Receiving",
    stat: "Receiving yards per game",
    player: "Kyle Lapray",
    value: "89.3",
    season: "2025 season",
    sourceId: "maxpreps-2025-stats",
  },
  {
    category: "Defense",
    stat: "Tackles per game",
    player: "Tyson Miller",
    value: "9.0",
    season: "2022 season",
    sourceId: "maxpreps-2022-stats",
  },
  {
    category: "Defense",
    stat: "Tackles per game",
    player: "Cougar Peterson",
    value: "8.5",
    season: "2024 season",
    sourceId: "maxpreps-2024-stats",
  },
  {
    category: "Defense",
    stat: "Tackles per game",
    player: "Jesse King / Marlee Iosefo",
    value: "6.9",
    season: "2025 season",
    sourceId: "maxpreps-2025-stats",
  },
  {
    category: "Offense",
    stat: "Rushing yards per game",
    player: "Logan Holloway",
    value: "49.2",
    season: "2025 season",
    sourceId: "maxpreps-2025-stats",
  },
  {
    category: "Offense",
    stat: "Rushing yards per game",
    player: "Luke Livingston",
    value: "45.2",
    season: "2022 season",
    sourceId: "maxpreps-2022-stats",
  },
  {
    category: "Offense",
    stat: "Rushing yards per game",
    player: "Dash Mccann",
    value: "38.4",
    season: "2024 season",
    sourceId: "maxpreps-2024-stats",
  },
];

const activePlayerWatchlist: readonly ActiveWatchMark[] = [
  {
    category: "Rushing touchdowns",
    player: "Logan Holloway",
    classYear: "Sophomore in 2025",
    current: "6",
    record: "17",
    needed: "12",
    sourceId: "maxpreps-2025-stats",
    note: "Needs 12 rushing TDs in a future season to pass Easton Bretzing's public season mark.",
  },
  {
    category: "Total touchdowns",
    player: "Logan Holloway",
    classYear: "Sophomore in 2025",
    current: "7",
    record: "24",
    needed: "18",
    sourceId: "maxpreps-2025-stats",
    note: "Needs 18 total TDs in a future season to pass Luke Livingston's public season mark.",
  },
  {
    category: "Receiving touchdowns",
    player: "Tevita Mounga",
    classYear: "Junior in 2025",
    current: "6",
    record: "23",
    needed: "18",
    sourceId: "maxpreps-2025-stats",
    note: "Tied for the 2025 team lead; needs 18 receiving TDs to pass Luke Livingston's public season mark.",
  },
  {
    category: "Receiving touchdowns",
    player: "Shane Eaquinto",
    classYear: "Junior in 2025",
    current: "4",
    record: "23",
    needed: "20",
    sourceId: "maxpreps-2025-stats",
    note: "Returning 2025 varsity receiving TD leader candidate to keep an eye on.",
  },
];

function getSource(sourceId?: string) {
  if (!sourceId) return undefined;
  return sources.find((source) => source.id === sourceId);
}

function RecordsTable({
  title,
  description,
  records,
}: {
  title: string;
  description: string;
  records: readonly RecordMark[];
}) {
  return (
    <section>
      <div className="flex flex-col gap-2 border-b border-white/15 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
            Publicly Sourced
          </p>
          <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none md:text-5xl">
            {title}
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-zinc-300">{description}</p>
      </div>

      <div className="mt-6 overflow-hidden border border-white/10 bg-white/[0.06]">
        <div className="hidden grid-cols-[110px_1.2fr_1fr_100px_90px] gap-4 border-b border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 md:grid">
          <span>Type</span>
          <span>Record</span>
          <span>Player</span>
          <span>Value</span>
          <span>Season</span>
        </div>
        <div className="divide-y divide-white/10">
          {records.map((record) => {
            const source = getSource(record.sourceId);

            return (
              <article
                key={`${record.side}-${record.category}-${record.mark}-${record.player}-${record.season}`}
                className="grid grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-x-3 gap-y-2 px-3 py-3 md:grid-cols-[110px_1.2fr_1fr_100px_90px] md:items-center md:gap-4 md:px-4 md:py-4"
              >
                <div className="min-w-0 md:contents">
                  <span className="w-fit rounded-sm bg-[var(--tf-neon)] px-2 py-0.5 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] md:px-2.5 md:py-1 md:text-xs">
                    {record.category}
                  </span>
                  <div className="mt-2 min-w-0 md:mt-0">
                    <h3 className="text-sm font-bold leading-tight text-white md:text-base">
                      {record.mark}
                    </h3>
                    {record.note ? (
                      <p className="mt-0.5 text-xs leading-4 text-zinc-300 md:mt-1 md:text-xs md:leading-5">
                        {record.note}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="min-w-0 self-start md:contents">
                  <p className="font-display min-w-0 text-base font-bold uppercase leading-none md:text-2xl">
                    {record.player}
                  </p>
                  <p className="font-display mt-1 text-3xl font-bold leading-none text-[var(--tf-neon)] md:mt-0 md:text-4xl">
                    {record.value}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 md:mt-0 md:block">
                    <p className="text-xs font-semibold text-zinc-200 md:text-sm">
                      {record.season}
                    </p>
                    {source ? (
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[var(--tf-neon)] underline decoration-[var(--tf-neon)]/40 underline-offset-4 hover:decoration-[var(--tf-neon)]"
                      >
                        Source
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Records",
    description:
      "Timpanogos football school records, public stat leaders, record watch, and historical audit notes for the Timberwolves.",
    path: "/records",
    image: recordsHeroImage,
  }),
};

export default function RecordsPage() {
  const offenseRecords = headlineRecords.filter((record) => record.side === "offense");
  const defenseRecords = headlineRecords.filter((record) => record.side === "defense");
  const specialTeamsRecords = headlineRecords.filter(
    (record) => record.side === "specialTeams",
  );

  return (
    <main className="min-h-screen bg-[var(--tf-black)] text-white">
      <section className="relative isolate h-[325px] overflow-hidden border-b border-white/10 bg-[rgb(0,1,10)]">
        <Image
          src={recordsHeroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center saturate-110"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,23,0.78)_0%,rgba(2,9,23,0.42)_52%,rgba(5,7,9,0.82)_100%)] md:bg-[linear-gradient(90deg,rgba(2,9,23,0.96)_0%,rgba(2,9,23,0.82)_34%,rgba(2,9,23,0.36)_70%,rgba(2,9,23,0.3)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,var(--tf-black),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--tf-neon)]">
            Record Book
          </p>
          <h1 className="font-display mt-4 max-w-4xl text-5xl font-bold uppercase leading-[0.9] md:text-7xl">
            School Records
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-200 md:text-base">
            Known public all-time Timpanogos football marks from local coverage,
            MaxPreps, and Deseret News stat pages. This page is an ongoing public audit,
            starting with the program&apos;s first season in 1996.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="space-y-10">
          <RecordsTable
            title="Offense"
            description="Known public offensive marks from local coverage and MaxPreps stat pages."
            records={offenseRecords}
          />

          <RecordsTable
            title="Defense"
            description="Known public defensive marks from MaxPreps team and player stat pages."
            records={defenseRecords}
          />

          <RecordsTable
            title="Special Teams"
            description="Known public kicking and punting marks from state record and MaxPreps leader pages."
            records={specialTeamsRecords}
          />

          <section>
            <div className="border-b border-white/15 pb-5">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Record Watch
              </p>
              <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none md:text-5xl">
                Returning Players
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                Current public stat leaders who could climb the record book in future
                seasons. These are watch-list targets, not official records yet.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {activePlayerWatchlist.map((item) => {
                const source = getSource(item.sourceId);

                return (
                  <article
                    key={`${item.category}-${item.player}`}
                    className="border border-white/10 bg-white/[0.06] p-4"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--tf-neon)]">
                      {item.category}
                    </p>
                    <p className="font-display mt-3 text-3xl font-bold uppercase leading-none">
                      {item.player}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      {item.classYear}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden bg-white/10 text-center">
                      {[
                        ["Current", item.current],
                        ["Record", item.record],
                        ["Needed", item.needed],
                      ].map(([label, value]) => (
                        <div key={label} className="bg-[var(--tf-black)] px-2 py-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">
                            {label}
                          </p>
                          <p className="font-display mt-1 text-3xl font-bold leading-none text-white">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-xs leading-5 text-zinc-300">{item.note}</p>
                    {source ? (
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs font-semibold text-[var(--tf-neon)] underline decoration-[var(--tf-neon)]/40 underline-offset-4 hover:decoration-[var(--tf-neon)]"
                      >
                        Source
                      </a>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>

          <section>
            <div className="border-b border-white/15 pb-5">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Research Queue
              </p>
              <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none md:text-5xl">
                Recent Public Leaders
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                These are not listed as records yet. They are useful candidates to check
                against older stat pages, archived programs, and Hudl exports.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {publicLeaderWatchlist.map((item) => {
                const source = getSource(item.sourceId);

                return (
                  <article
                    key={`${item.stat}-${item.player}-${item.season}`}
                    className="border border-white/10 bg-white/[0.06] p-4"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--tf-neon)]">
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-sm font-bold text-white">{item.stat}</h3>
                    <p className="font-display mt-4 text-3xl font-bold uppercase leading-none">
                      {item.player}
                    </p>
                    {item.note ? (
                      <p className="mt-3 text-xs leading-5 text-zinc-300">
                        {item.note}
                      </p>
                    ) : null}
                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                      <div>
                        <p className="font-display text-4xl font-bold leading-none text-[var(--tf-neon)]">
                          {item.value}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-zinc-400">
                          {item.season}
                        </p>
                      </div>
                      {source ? (
                        <a
                          href={source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-[var(--tf-neon)]"
                        >
                          Source
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section>
            <div className="border-b border-white/15 pb-5">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Audit Status
              </p>
              <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none md:text-5xl">
                Coverage
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                The public audit now starts with Timpanogos&apos; first football season in
                1996. Public sources confirm schedules and team history for the early
                years, but usable individual stat leader tables begin later and are
                uneven before 2012.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                [
                  "Team History",
                  "1996-2025",
                  "Deseret News schedules, Utah-football records, and MaxPreps history.",
                ],
                [
                  "Stat Leaders",
                  "2006-2025",
                  "Usable MaxPreps player stat leader pages exist for many seasons in this range.",
                ],
                [
                  "No Public Leaders",
                  "1996-2005, 2009-2011",
                  "Public team pages exist, but usable player stat leader data was empty or not found.",
                ],
              ].map(([label, years, note]) => (
                <article key={label} className="border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--tf-neon)]">
                    {label}
                  </p>
                  <p className="font-display mt-2 text-3xl font-bold uppercase leading-none">
                    {years}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-zinc-300">{note}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
