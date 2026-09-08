import { Coffee, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";

const PHASES = [
  "Membaca preferensi rasamu…",
  "Menyeimbangkan manis & body…",
  "Memilih bahan yang paling cocok…",
  "Menulis catatan barista…",
];

/** Animasi visual saat Digital Barista (AI) sedang meracik resep. */
export function BrewingLoader() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className="animate-rise mt-4 rounded-3xl border border-primary/30 bg-card/60 p-6"
    >
      <div className="relative mx-auto flex size-40 items-center justify-center">
        {/* cincin pulsa */}
        <span className="animate-pulse-ring absolute inset-0 rounded-full border border-primary/40" />
        <span
          className="animate-pulse-ring absolute inset-0 rounded-full border border-primary/25"
          style={{ animationDelay: "1s" }}
        />

        {/* orbit partikel aroma */}
        <div className="animate-orbit absolute inset-0">
          <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary" />
          <span className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary/60" />
        </div>

        {/* uap */}
        <div className="absolute top-2 flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-steam h-6 w-1.5 rounded-full bg-primary/50"
              style={{ animationDelay: `${i * 0.45}s` }}
            />
          ))}
        </div>

        {/* cangkir dengan cairan naik-turun */}
        <div className="relative mt-6 flex h-20 w-20 items-end justify-center overflow-hidden rounded-b-[2rem] rounded-t-xl border border-primary/50 bg-navy-soft">
          <div className="surface-gold animate-brew-fill w-full opacity-80" />
          <Coffee className="absolute bottom-2 size-6 text-primary-foreground/70" />
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="display-title flex items-center justify-center gap-2 text-xl text-primary">
          <Sparkles className="size-4 animate-pulse" />
          {t("AI sedang meracik")}
        </p>
        <p key={phase} className="animate-rise mt-1 text-sm text-muted-foreground">
          {t(PHASES[phase] ?? PHASES[0]!)}
        </p>
      </div>

    </section>
  );
}
