import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bookmark,
  Brain,
  Check,
  Cloud,
  Database,
  Heart,
  Leaf,
  Quote,
  RefreshCw,
  Share2,
  ShieldCheck,
  Smartphone,
  Star,
  Trophy,
  UserRound,
  Users,
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

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology Behind — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Arsitektur Digital Barista: user input, AI engine, recipe database, cloud sync, dan personalized output yang akurat serta konsisten.",
      },
      { property: "og:title", content: "Technology Behind Digital Barista" },
      {
        property: "og:description",
        content: "AI, machine learning, dan database bahan minuman terintegrasi di balik setiap racikan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TechnologyPage,
});

const ARCHITECTURE = () => [
  { icon: Smartphone, title: t("User Input"), desc: t("Pengguna memilih preferensi rasa, bahan, dan mood.") },
  { icon: Brain, title: t("AI Engine"), desc: t("Algoritma AI menganalisis dan memprediksi rasa terbaik.") },
  { icon: Database, title: t("Recipe Database"), desc: t("Data bahan, resep, dan profil rasa tersimpan aman.") },
  { icon: Cloud, title: t("Cloud Sync"), desc: t("Data real-time disinkronkan ke cloud.") },
  { icon: Users, title: t("Personalized Output"), desc: t("Rekomendasi resep personal dengan akurasi tinggi.") },
];

const FEATURES = () => [
  { icon: Brain, title: t("AI & Machine Learning"), desc: t("Menganalisis ribuan kombinasi rasa dan bahan untuk hasil rekomendasi terbaik.") },
  { icon: Database, title: t("Smart Database"), desc: t("Database bahan, resep, dan profil rasa yang selalu terbarui dan terstandar.") },
  { icon: Cloud, title: t("Cloud Technology"), desc: t("Sync real-time untuk menjaga konsistensi resep di semua perangkat dan outlet.") },
  { icon: ShieldCheck, title: t("Data Security"), desc: t("Keamanan data pengguna dan resep terjamin dengan enkripsi tingkat tinggi.") },
  { icon: BarChart3, title: t("Analytics & Insight"), desc: t("Monitoring performa resep dan preferensi untuk inovasi berkelanjutan.") },
];

const RADAR = () => [t("Sweetness"), t("Body"), t("Acidity"), t("Creaminess"), t("Temperature"), t("Balance"), t("Aroma")];

const ANALYSIS = (): [string, boolean][] => [
  [t("Flavor Profile Matching"), true],
  [t("Ingredient Compatibility"), true],
  [t("Taste Balance Optimization"), true],
  [t("Personalization Tuning"), false],
];

const COMPOSITION = (): [string, string][] => [
  [t("Espresso"), t("2 shot (60 ml)")],
  [t("Fresh Milk"), t("120 ml")],
  [t("Caramel Syrup"), t("20 ml")],
  [t("Hazelnut Syrup"), t("15 ml")],
  [t("Whipped Cream"), t("Topping")],
  [t("Crushed Nuts"), t("Topping")],
];

const PROFILE = (): [string, number][] => [
  [t("Sweetness"), 4],
  [t("Creaminess"), 5],
  [t("Aroma"), 4],
  [t("Body"), 4],
  [t("Acidity"), 3],
];

const IMPACT = () => [
  { icon: ArrowUp, value: "30%", label: t("Akurasi Rasa Rekomendasi"), dir: "up" as const },
  { icon: ArrowDown, value: "40%", label: t("Waktu Eksplorasi Resep Baru"), dir: "down" as const },
  { icon: ArrowUp, value: "25%", label: t("Kepuasan Pelanggan"), dir: "up" as const },
  { icon: ArrowUp, value: "20%", label: t("Repeat Order Rate"), dir: "up" as const },
  { icon: Leaf, value: t("Sustainable"), label: t("Mengurangi waste bahan hingga 15%"), dir: "flat" as const },
];

function TechnologyPage() {
  return (
    <SlideShell
      page={t("Halaman 13")}
      pageNumber="13 / 14"
      prev={{ to: "/vision", label: "Vision" }}
      next={{ to: "/future", label: "Future" }}
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.9fr_0.8fr]">
        {/* Kolom kiri: judul, arsitektur, kutipan */}
        <div>
          <SlideTitle
            lines={["TECHNOLOGY BEHIND", "DIGITAL BARISTA"]}
            desc={t(
              "Didukung teknologi AI, machine learning, dan database bahan minuman yang terintegrasi untuk memberikan pengalaman personal yang akurat dan konsisten.",
            )}
          />

          <div className="mt-7">
            <div className="flex items-center gap-3">
              <SectionBadge>{t("Arsitektur Sistem")}</SectionBadge>
              <span className="h-px flex-1 bg-primary/25" />
            </div>
            <ol className="mt-4 space-y-3">
              {ARCHITECTURE().map(({ icon: Icon, title, desc }, i) => (
                <li key={title} className="flex gap-3">
                  <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary">
                    <Icon className="size-4" />
                    <span className="surface-gold absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full text-[0.68rem] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[0.82rem] leading-snug text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <blockquote className="mt-7 rounded-2xl border border-primary/25 bg-card/50 p-4">
            <Quote className="size-4 text-primary" />
            <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">
              {t(
                "Teknologi bukan menggantikan barista, tapi memperkuat kreativitas dan konsistensi untuk setiap racikan.",
              )}
            </p>
            <footer className="label-caps mt-2 text-primary">
              — Digital Barista Design Principle
            </footer>
          </blockquote>
        </div>

        {/* Kolom tengah: badge + tiga mockup HP */}
        <div>
          <div className="mb-4 text-center">
            <SectionBadge>Data to Insight, Insight to Delight</SectionBadge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <PhoneMock title={t("REAL-TIME AI ANALYSIS")} subtitle={t("AI mengevaluasi preferensimu…")}>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <div className="relative mx-auto flex size-24 items-center justify-center rounded-full border border-primary/30">
                  <span className="absolute inset-3 rounded-full border border-primary/20" />
                  <Brain className="size-6 text-primary" />
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {RADAR().map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-border px-2 py-0.5 text-[0.68rem] text-muted-foreground"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <p className="text-[0.76rem] text-muted-foreground">{t("Analyzing your preference…")}</p>
                <ul className="mt-2 space-y-1.5">
                  {ANALYSIS().map(([label, done]) => (
                    <li
                      key={label}
                      className="flex items-center justify-between text-[0.76rem] text-muted-foreground"
                    >
                      <span>{label}</span>
                      {done ? (
                        <Check className="size-3 text-primary" />
                      ) : (
                        <RefreshCw className="size-3 text-primary/60" />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-muted">
                    <div className="surface-gold h-1.5 w-[92%] rounded-full" />
                  </div>
                  <span className="text-[0.72rem] text-primary">92%</span>
                </div>
              </div>
              <p className="flex gap-2 rounded-2xl border border-primary/30 bg-primary/5 p-3 text-[0.76rem] leading-snug text-muted-foreground">
                <Star className="size-3.5 shrink-0 text-primary" />
                {t("Semakin sering kamu bereksplorasi, AI semakin memahami seleramu.")}
              </p>
            </PhoneMock>

            <PhoneMock title={t("YOUR RECIPE RESULT")} subtitle={t("Rekomendasi terbaik untukmu!")}>
              <div className="relative overflow-hidden rounded-2xl border border-primary/30">
                <img
                  src={heroDrink}
                  alt={t("Caramel Nutty Dream hasil rekomendasi AI")}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="h-28 w-full object-cover"
                />
                <span className="surface-gold absolute top-2 left-2 flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.68rem] font-bold text-primary-foreground">
                  <Trophy className="size-2.5" /> Best Match
                </span>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <p className="flex items-center gap-2 text-[0.86rem] font-semibold text-foreground">
                  {t("Caramel Nutty Dream")}
                  <span className="rounded border border-border px-1.5 py-0.5 text-[0.68rem] text-muted-foreground">
                    Iced
                  </span>
                </p>
                <p className="mt-1 text-[0.72rem] text-muted-foreground">{t("AI Match Score")}</p>
                <p className="display-title text-3xl font-bold text-primary">
                  87<span className="text-lg">%</span>
                </p>
                <p className="text-[0.72rem] text-green-400">{t("↑ 9% Improved!")}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <p className="label-caps text-primary">{t("Rasa")}</p>
                <p className="mt-1 text-[0.76rem] text-muted-foreground">
                  {t("Creamy • Nutty • Caramel")}
                  <br />
                  {t("Bold • Smooth • Balanced")}
                </p>
              </div>
              <div className="surface-gold flex items-center justify-between rounded-xl px-3 py-2 text-[0.76rem] font-semibold text-primary-foreground">
                {t("LIHAT RESEP LENGKAP")} <ArrowRight className="size-3" />
              </div>
              <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/50 px-3 py-2 text-[0.76rem] font-semibold text-primary">
                <Bookmark className="size-3" /> {t("SIMPAN KE FAVORIT")}
              </div>
            </PhoneMock>

            <PhoneMock title={t("RECIPE DETAIL")} subtitle={t("Detail racikanmu")}>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[0.8rem] font-semibold text-foreground">{t("Komposisi Bahan")}</p>
                  <span className="text-[0.72rem] text-primary">16 oz</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {COMPOSITION().map(([n, v]) => (
                    <li key={n} className="flex justify-between text-[0.73rem] text-muted-foreground">
                      <span>{n}</span>
                      <span className="text-foreground">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <p className="text-[0.8rem] font-semibold text-foreground">{t("Profil Rasa")}</p>
                <div className="mt-2 space-y-1">
                  {PROFILE().map(([label, score]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[0.73rem] text-muted-foreground">{label}</span>
                      <span className="flex gap-0.5">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <span
                            key={i}
                            className={`size-1.5 rounded-full ${
                              i < score ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <p className="text-[0.8rem] font-semibold text-foreground">{t("Saran Penyajian")}</p>
                <p className="mt-1 text-[0.73rem] leading-snug text-muted-foreground">
                  {t("Disajikan dingin dengan es batu. Aduk sebelum diminum untuk sensasi terbaik.")}
                </p>
              </div>
              <div className="surface-gold flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[0.76rem] font-semibold text-primary-foreground">
                <Share2 className="size-3" /> BAGIKAN RESEP
              </div>
            </PhoneMock>
          </div>
        </div>

        {/* Kolom kanan: fitur utama */}
        <FeatureList heading={t("Fitur Utama")} items={FEATURES()} />
      </div>

      {/* Strip bawah kayu */}
      <section className="surface-wood mt-8 rounded-3xl border border-primary/30 p-5">
        <h2 className="display-title text-center text-xl font-bold tracking-[0.08em] text-cream">
          {t("IMPACT THAT WE BREW")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {IMPACT().map(({ icon: Icon, value, label }) => (
            <article key={label} className="flex items-start gap-2">
              <Icon className="mt-1 size-5 shrink-0 text-gold" />
              <div>
                <p className="display-title text-lg font-bold text-cream">{value}</p>
                <p className="text-[0.78rem] leading-snug text-cream/75">{label}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SlideShell>
  );
}
