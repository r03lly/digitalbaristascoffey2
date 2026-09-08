import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Brain,
  Cpu,
  Database,
  Gauge,
  Lightbulb,
  Rocket,
  Sparkles,
  TrendingUp,
  UserRound,
  Zap,
} from "lucide-react";
import {
  FeatureList,
  PhoneMock,
  SectionBadge,
  SlideShell,
  SlideTitle,
} from "@/components/SlideShell";
import { heroDrink } from "@/lib/barista-images";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Behind the Scene — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Proses AI Digital Barista: input preferensi, AI analysis, database matching, recipe co-creation, hingga final recipe card.",
      },
      { property: "og:title", content: "Behind the Scene Digital Barista" },
      {
        property: "og:description",
        content: "Inovasi AI dan database bahan minuman untuk rekomendasi resep yang akurat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function getProcess() {
  return [
    { icon: UserRound, title: t("Input Preferensi"), desc: t("Pelanggan memilih bahan, rasa yang disukai, dan mood.") },
    { icon: Brain, title: t("AI Analysis"), desc: t("AI menganalisis preferensi dari data rasa (taste profile).") },
    { icon: Database, title: t("Database Matching"), desc: t("Mencocokkan dengan ribuan data bahan & resep.") },
    { icon: Sparkles, title: t("Recipe Co-Creation"), desc: t("Menghasilkan rekomendasi resep yang personal.") },
    { icon: BadgeCheck, title: t("Final Recipe Card"), desc: t("Resep terbaik disajikan dalam recipe card.") },
  ];
}

function getFeatures() {
  return [
    { icon: Brain, title: t("AI Taste Engine"), desc: t("Algoritma AI terlatih untuk memahami ribuan kombinasi rasa dan bahan.") },
    { icon: Sparkles, title: t("Smart Matching"), desc: t("Pencocokan presisi antara preferensi pengguna dan profil rasa minuman.") },
    { icon: TrendingUp, title: t("Dynamic Learning"), desc: t("Sistem belajar dari setiap interaksi untuk rekomendasi yang makin akurat.") },
    { icon: Database, title: t("Recipe Database"), desc: t("Database terintegrasi berisi bahan, profil rasa, dan standar resep Scoffey.") },
    { icon: Gauge, title: t("Consistent Quality"), desc: t("Setiap resep terukur untuk konsistensi rasa di setiap penyajian.") },
  ];
}

function getBenefits() {
  return [
    { icon: UserRound, title: t("Personalized Experience"), desc: t("Pengalaman minum yang unik dan sesuai selera setiap pelanggan.") },
    { icon: Zap, title: t("Efficiency"), desc: t("Mempercepat proses kreasi dan mengurangi trial & error.") },
    { icon: Lightbulb, title: t("Innovation"), desc: t("Mendorong inovasi rasa baru melalui kombinasi bahan tak terbatas.") },
    { icon: Cpu, title: t("Data-Driven"), desc: t("Keputusan berbasis data untuk meningkatkan kualitas dan kepuasan.") },
    { icon: Rocket, title: t("Scalability"), desc: t("Mudah direplikasi di berbagai outlet dengan standar kualitas sama.") },
  ];
}

function getAnalysis() {
  return [
    t("Taste Profile Analysis"),
    t("Ingredient Matching"),
    t("Flavor Balance Optimization"),
    t("Finalizing Recommendation"),
  ];
}

function getComposition() {
  return [
    [t("Espresso"), t("2 shot (60 ml)")],
    [t("Fresh Milk"), t("120 ml")],
    [t("Caramel Syrup"), t("20 ml")],
    [t("Hazelnut Syrup"), t("15 ml")],
    [t("Sea Salt"), t("1 pinch")],
    [t("Whipped Cream"), t("Topping")],
    [t("Crushed Nuts"), t("Topping")],
  ];
}

function getToggles() {
  return [t("Caramel"), t("Nutty"), t("Iced"), t("Medium"), t("Creamy"), t("Less Sweet")];
}

function AboutPage() {
  const PROCESS = getProcess();
  const FEATURES = getFeatures();
  const BENEFITS = getBenefits();
  const ANALYSIS = getAnalysis();
  const COMPOSITION = getComposition();
  const TOGGLES = getToggles();

  return (
    <SlideShell
      page={t("Halaman 11")}
      pageNumber="11 / 14"
      prev={{ to: "/checkout", label: t("Checkout") }}
      next={{ to: "/vision", label: t("Vision") }}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr_0.9fr]">
        <div>
          <SlideTitle
            lines={["BEHIND THE SCENE", "DIGITAL BARISTA"]}
            desc={t(
              "Inovasi yang didukung teknologi AI dan database bahan minuman untuk menghadirkan rekomendasi resep yang akurat, personal, dan konsisten.",
            )}
          />

          <div className="mt-7">
            <SectionBadge>{t("Ringkasan Proses")}</SectionBadge>
            <ol className="mt-4 space-y-3">
              {PROCESS.map(({ icon: Icon, title, desc }, i) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.08em] text-foreground uppercase">
                      {i + 1}. {title}
                    </p>
                    <p className="mt-0.5 text-[0.82rem] leading-snug text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PhoneMock
            title={t("AI RECOMMENDATION IN PROGRESS")}
            subtitle={t("Digital Barista sedang meracik resep terbaik untukmu.")}
          >
            <div className="rounded-2xl border border-border bg-card/60 p-3">
              <div className="grid grid-cols-2 gap-2 text-[0.76rem] text-muted-foreground">
                {TOGGLES.map((tg) => (
                  <span key={tg} className="rounded-full border border-border px-2 py-1 text-center">
                    {tg}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-3">
              <p className="label-caps text-primary">{t("Analyzing your preferences")}</p>
              <ul className="mt-2 space-y-1.5">
                {ANALYSIS.map((a) => (
                  <li key={a} className="flex items-center justify-between text-[0.8rem] text-muted-foreground">
                    <span>{a}</span>
                    <BadgeCheck className="size-3.5 text-primary" />
                  </li>
                ))}
              </ul>
            </div>
            <p className="rounded-2xl border border-primary/30 bg-primary/5 p-3 text-[0.8rem] leading-snug text-muted-foreground italic">
              {t("“Setiap racikan adalah kombinasi unik dari sains, data, dan sentuhan kreativitas.”")}
              <span className="mt-1 block not-italic text-primary">— Digital Barista</span>
            </p>
          </PhoneMock>

          <PhoneMock title={t("YOUR RECOMMENDED RECIPE")}>
            <div className="surface-wood rounded-2xl border border-primary/30 p-4 text-center">
              <img
                src={heroDrink}
                alt={t("Rekomendasi Caramel Nutty Latte")}
                loading="lazy"
                width={1024}
                height={1280}
                className="mx-auto h-24 w-20 rounded-xl border border-primary/30 object-cover"
              />
              <p className="display-title mt-2 text-base font-bold text-cream">
                Caramel Nutty Latte
              </p>
              <p className="text-[0.76rem] text-cream/80">{t("Iced")}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-3 text-center">
              <p className="label-caps text-muted-foreground">{t("AI Match Score")}</p>
              <p className="display-title text-3xl font-bold text-primary">86%</p>
              <p className="text-[0.76rem] text-muted-foreground">{t("↑ 6% improved")}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-3">
              <p className="label-caps text-primary">{t("Komposisi Utama")}</p>
              <ul className="mt-2 space-y-1">
                {COMPOSITION.map(([n, v]) => (
                  <li key={n} className="flex justify-between text-[0.78rem] text-muted-foreground">
                    <span>{n}</span>
                    <span className="text-foreground">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-gold rounded-xl px-3 py-2 text-center text-[0.8rem] font-semibold text-primary-foreground">
              {t("SIMPAN RESEP")}
            </div>
            <div className="rounded-xl border border-primary/50 px-3 py-2 text-center text-[0.8rem] font-semibold text-primary">
              {t("BAGIKAN RESEP")}
            </div>
          </PhoneMock>
        </div>

        <FeatureList heading={t("Fitur Utama")} items={FEATURES} />
      </div>

      <section className="surface-wood mt-8 rounded-3xl border border-primary/30 p-5">
        <SectionBadge>{t("Manfaat")}</SectionBadge>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <article key={title}>
              <Icon className="size-4 text-gold" />
              <p className="mt-2 text-[0.8rem] font-semibold tracking-[0.08em] text-cream uppercase">
                {title}
              </p>
              <p className="mt-1 text-[0.78rem] leading-snug text-cream/75">{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </SlideShell>
  );
}
