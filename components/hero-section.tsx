import Image from "next/image";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
};

export function HeroSection({ title, subtitle, imageUrl }: HeroSectionProps) {
  return (
    <section className="relative isolate h-[325px] overflow-hidden bg-[#070f22]">
      <div className="absolute inset-0 opacity-40">
        {imageUrl ? (
          <div className="relative h-full min-h-[360px] w-full">
            <Image
              src={imageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-full min-h-[360px] w-full bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.15),transparent_45%),linear-gradient(135deg,#070f22,#0b1533)]" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#050914]/95 via-[#050914]/80 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--tf-neon)]">
          Home of the Thunderbirds
        </p>
        <h1 className="font-display mt-4 max-w-4xl text-6xl font-bold leading-[0.88] tracking-tight text-white md:text-8xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-200 md:text-base">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
