import Image from "next/image";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--tf-black)] text-zinc-50 selection:bg-[var(--tf-neon)]/30">
      <header className="border-b border-white/10 bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Image
            src="/images/twolves-wolf.svg"
            alt=""
            width={443}
            height={492}
            className="h-10 w-auto shrink-0"
            priority
          />
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)]">
              Timpanogos Football
            </p>
            <p className="font-display text-xl font-bold uppercase text-white">
              Admin
            </p>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
