export const scheduleTeamLevels = [
  { value: "varsity", label: "Varsity" },
  { value: "jv", label: "JV" },
  { value: "freshman", label: "Freshman" },
] as const;

export type ScheduleTeamLevel = (typeof scheduleTeamLevels)[number]["value"];

export type ScheduleGame = {
  id: string;
  teamLevel: ScheduleTeamLevel;
  opponentId?: string;
  opponent: string;
  opponentMascot?: string;
  opponentLogoUrl?: string;
  opponentPrimaryColor?: string;
  opponentSecondaryColor?: string;
  dateISO: string;
  location: string;
  address?: string;
  isHome: boolean;
  result?: string;
  notes?: string;
  sortOrder: number;
};

export type Opponent = {
  id: string;
  schoolName: string;
  shortName?: string;
  mascot?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  address?: string;
  city?: string;
  state?: string;
  sortOrder: number;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  sortOrder: number;
};

export type SiteSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  ticketUrl?: string;
  ticketSecondaryUrl?: string;
  ticketBlurb?: string;
  shopPrimaryUrl?: string;
  shopMessage?: string;
  recruitingFormUrl?: string;
  /** Optional rich recruiting intro shown on /recruiting */
  recruitingBlurb?: string;
  footerNote?: string;
};

export const defaultSiteSettings: SiteSettings = {
  heroTitle: "Timpanogos Football",
  heroSubtitle: "Utah high school football — schedule, staff, and team news.",
  ticketBlurb:
    "Game tickets and passes are sold through the school. Links below open official purchasing pages when available.",
  ticketUrl: "https://gofan.co/app/school/UT7313",
  shopMessage:
    "Find official Timpanogos Football apparel and fan gear here. Use the product cards below to choose sizes and colors, or open the storefront when new items are being added.",
};
