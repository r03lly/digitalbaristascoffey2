import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SlideMenu } from "@/components/SlideShell";
import { FitScale } from "@/components/FitScale";
import { getLang } from "@/lib/i18n";
import { EN_FLOW, ID_FLOW } from "@/lib/i18n-flow";
import {
  BRAND_PALETTE,
  BRAND_TYPOGRAPHY,
  DESIGN_PRINCIPLES,
  FLOW_STEPS,
} from "@/lib/barista-flow";

/** Translate copy specific to this route using the app's active language. */
function t(text: string): string {
  if (getLang() === "id") return ID_FLOW[text] ?? text;
  return EN_FLOW[text] ?? text;
}

export const Route = createFileRoute("/flow")({
  head: () => ({
    meta: [
      { title: "Design Flow 1–14 — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Alur sistem Digital Barista by Scoffey: 14 layar dari splash, login, co-creation, checkout, sampai slide Brewing the Future.",
      },
      { property: "og:title", content: "Design Flow — Digital Barista by Scoffey" },
      {
        property: "og:description",
        content: "Peta 14 halaman UI/UX Digital Barista beserta palet dan tipografi resmi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FlowPage,
});

function FlowPage() {
  const app = FLOW_STEPS.filter((s) => s.group === "Aplikasi");
  const deck = FLOW_STEPS.filter((s) => s.group === "Presentasi");

  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-background px-4 py-4 lg:px-10 lg:py-6">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1200px] flex-col">
        <div className="shrink-0">
          <SlideMenu />
        </div>
        <div className="surface-navy shadow-premium animate-rise mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-border p-5 lg:p-8">
          <FitScale min={0.62}>
          <span className="label-caps rounded-md border border-primary/50 bg-primary/10 px-3 py-1 text-primary">
            {t("UI/UX Design Summary")}
          </span>
          <h1 className="display-title mt-5 text-4xl font-bold text-foreground lg:text-5xl">
            DIGITAL BARISTA
            <span className="text-gold-gradient block">{t("DESIGN FLOW 1 – 14")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t(
              "AI-Driven Beverage Co-Creation by Scoffey. Kompilasi rancangan antarmuka halaman 1 sampai 14 dengan arah visual navy technology + warm wood + gold coffee accents."
            )}
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section>
              <h2 className="label-caps text-primary">{t("Alur Aplikasi (01 – 10)")}</h2>
              <ol className="mt-4 space-y-2">
                {app.map((s) => (
                  <li key={s.no}>
                    <Link
                      to={s.to}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-card/60 px-4 py-3 transition-colors hover:border-primary"
                    >
                      <span className="display-title w-8 shrink-0 text-xl text-primary">{s.no}</span>
                      <span className="min-w-0 flex-1 text-sm text-foreground">{t(s.label)}</span>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ol>
            </section>

            <div className="space-y-6">
              <section>
                <h2 className="label-caps text-primary">{t("Slide Presentasi (11 – 14)")}</h2>
                <ol className="mt-4 space-y-2">
                  {deck.map((s) => (
                    <li key={s.no}>
                      <Link
                        to={s.to}
                        className="group flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/60 px-4 py-3 transition-colors hover:border-primary"
                      >
                        <span className="display-title w-8 shrink-0 text-xl text-primary">
                          {s.no}
                        </span>
                        <span className="min-w-0 flex-1 text-sm text-foreground">{t(s.label)}</span>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="surface-wood rounded-2xl border border-primary/30 p-4">
                <h2 className="label-caps text-cream">{t("Prinsip Desain")}</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {DESIGN_PRINCIPLES.map((p) => (
                    <div key={p.title}>
                      <p className="text-xs font-semibold tracking-[0.08em] text-gold uppercase">
                        {t(p.title)}
                      </p>
                      <p className="mt-1 text-[0.82rem] leading-snug text-cream/85">{t(p.desc)}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card/60 p-4">
                <h2 className="label-caps text-primary">{t("Warna Utama")}</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {BRAND_PALETTE.map((c) => (
                    <div key={c.hex} className="w-[5.5rem]">
                      <span
                        className="block h-10 rounded-lg border border-border"
                        style={{ backgroundColor: c.hex }}
                      />
                      <p className="mt-1 text-[0.73rem] text-foreground">{c.hex}</p>
                      <p className="text-[0.58rem] text-muted-foreground">{t(c.name)}</p>
                    </div>
                  ))}
                </div>
                <h2 className="label-caps mt-5 text-primary">{t("Tipografi")}</h2>
                <ul className="mt-2 space-y-1">
                  {BRAND_TYPOGRAPHY.map((tp) => (
                    <li key={tp.role} className="text-xs text-muted-foreground">
                      <span className="text-foreground">{t(tp.role)}</span> — {tp.value}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <footer className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <p className="display-title text-base tracking-[0.28em] text-foreground">SCOFFEY</p>
              <p className="text-[0.72rem] tracking-[0.14em] text-muted-foreground">
                {t("coffee • community • comfort")}
              </p>
            </div>
            <Link
              to="/"
              className="surface-gold shadow-gold inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              {t("Mulai dari Halaman 01")} <ArrowRight className="size-3.5" />
            </Link>
          </footer>
          </FitScale>
        </div>
      </div>
    </main>
  );
}
