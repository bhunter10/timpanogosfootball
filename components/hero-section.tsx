import Image from "next/image";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
};

export function HeroSection({ title, subtitle, imageUrl }: HeroSectionProps) {
  return (
    <section className="relative isolate min-h-[360px] overflow-hidden bg-[#070f22]">
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
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 lg:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--tf-neon)]">
          Home of the Thunderbirds
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
