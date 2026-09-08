import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Bookmark,
  Brain,
  Heart,
  Quote,
  Share2,
  Sliders,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import {
  FeatureList,
  PhoneMock,
  SectionBadge,
  SlideShell,
  SlideTitle,
} from "@/components/SlideShell";
import { getLang } from "@/lib/i18n";
import { EN_VISION, ID_VISION } from "@/lib/i18n-vision";

/** Translate vision-page copy for the active language. */
function t(text: string): string {
  return getLang() === "id" ? (ID_VISION[text] ?? text) : (EN_VISION[text] ?? text);
}

export const Route = createFileRoute("/vision")({
  head: () => ({
    meta: [
      { title: "Bring Your Vision to Life — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Pilih bahan, atur takaran, preview rasa dengan AI, simpan kreasi, dan bagikan ke komunitas Scoffey.",
      },
      { property: "og:title", content: "Bring Your Vision to Life with Digital Barista" },
      {
        property: "og:description",
        content: "Eksplorasi, simpan, dan bagikan racikan kopimu bersama komunitas Scoffey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VisionPage,
});

const STEPS = [
  { icon: Sliders, title: "Pilih Bahan", desc: "Pilih bahan utama, flavor, dan accent sesuai seleramu." },
  { icon: Sparkles, title: "Atur Takaran", desc: "Sesuaikan takaran setiap bahan menggunakan smart slider." },
  { icon: Brain, title: "Preview Rasa", desc: "AI memprediksi rasa, aroma, dan keseimbangan minumanmu." },
  { icon: Heart, title: "Simpan Kreasi", desc: "Simpan resep pribadi dan beri nama unikmu." },
  { icon: Share2, title: "Bagikan ke Komunitas", desc: "Bagikan kreasimu dan dapatkan feedback komunitas Scoffey." },
];

const FEATURES = [
  { icon: Brain, title: "AI Flavor Prediction", desc: "AI memprediksi rasa berdasarkan kombinasi bahan dan takaran secara real-time." },
  { icon: Bookmark, title: "My Recipe Library", desc: "Simpan semua resep favoritmu dan lihat riwayat kreasimu kapan saja." },
  { icon: Users, title: "Community Sharing", desc: "Bagikan kreasimu ke komunitas Scoffey dan dapatkan apresiasi serta inspirasi." },
  { icon: Star, title: "Top Creation Highlight", desc: "Kreasi terbaik dari komunitas mendapatkan highlight setiap minggu." },
  { icon: BarChart3, title: "Taste Analytics", desc: "Lihat tren bahan dan profil rasa favorit dalam bentuk insight yang menarik." },
];

const INGREDIENTS = ["Espresso", "Cold Brew", "Fresh Milk", "Oat Milk", "Almond Milk", "Coconut Milk"];
const DOSES: [string, string][] = [
  ["Espresso", "60 ml"],
  ["Fresh Milk", "120 ml"],
  ["Caramel Syrup", "20 ml"],
  ["Hazelnut Syrup", "15 ml"],
];
const PROFILE: [string, number][] = [
  ["Sweetness", 6],
  ["Creaminess", 4],
  ["Aroma", 5],
  ["Balance", 5],
  ["Aftertaste", 5],
];

const STATS = [
  { icon: Sparkles, value: "10K+", label: "Resep Tercipta" },
  { icon: Users, value: "5K+", label: "Kreator Aktif" },
  { icon: Heart, value: "98%", label: "Kepuasan Pengguna" },
];

function VisionPage() {
  return (
    <SlideShell
      page={t("Halaman 12")}
      pageNumber="12 / 14"
      prev={{ to: "/about", label: t("Behind the Scene") }}
      next={{ to: "/technology", label: t("Technology") }}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr_0.9fr]">
        <div>
          <SlideTitle
            lines={[t("BRING YOUR VISION TO LIFE WITH"), "DIGITAL BARISTA"]}
            desc={t(
              "Digital Barista bukan hanya memberikan rekomendasi, tapi juga membantumu mengeksplorasi dan menyimpan kreasimu sendiri.",
            )}
          />

          <div className="mt-7">
            <SectionBadge>{t("Buat Kreasimu Sendiri")}</SectionBadge>
            <ol className="mt-4 space-y-3">
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.08em] text-foreground uppercase">
                      {i + 1}. {t(title)}
                    </p>
                    <p className="mt-0.5 text-[0.82rem] leading-snug text-muted-foreground">{t(desc)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <blockquote className="mt-7 rounded-2xl border border-primary/25 bg-card/50 p-4">
            <Quote className="size-4 text-primary" />
            <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground italic">
              {t(
                "Setiap kreasi adalah cerita. Setiap tegukan adalah pengalaman. Bersama Digital Barista, jadilah bagian dari komunitas kreator rasa.",
              )}
            </p>
            <footer className="mt-2 label-caps text-primary">— Scoffey Community</footer>
          </blockquote>
        </div>

        <div>
          <div className="mb-4 text-center">
            <SectionBadge>{t("Create Your Own Recipe")}</SectionBadge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PhoneMock title={t("CREATE YOUR RECIPE")} subtitle={t("Kreasikan racikan sesuai seleramu.")}>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <p className="label-caps text-primary">1. {t("Pilih Bahan")}</p>
                <ul className="mt-2 space-y-1.5">
                  {INGREDIENTS.map((n, i) => (
                    <li
                      key={n}
                      className="flex items-center justify-between text-[0.8rem] text-muted-foreground"
                    >
                      <span>{t(n)}</span>
                      <span
                        className={`size-3 rounded-full border ${
                          i < 2 ? "border-primary bg-primary" : "border-border"
                        }`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <p className="label-caps text-primary">2. {t("Atur Takaran")}</p>
                <ul className="mt-2 space-y-2">
                  {DOSES.map(([n, v], i) => (
                    <li key={n}>
                      <div className="flex justify-between text-[0.78rem] text-muted-foreground">
                        <span>{t(n)}</span>
                        <span className="text-foreground">{v}</span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-muted">
                        <div
                          className="h-1 rounded-full bg-primary"
                          style={{ width: `${80 - i * 15}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="surface-gold rounded-xl px-3 py-2 text-center text-[0.8rem] font-semibold text-primary-foreground">
                {t("PREVIEW RASA")} →
              </div>
            </PhoneMock>

            <PhoneMock title={t("PREVIEW RASA")} subtitle={t("AI memprediksi profil rasa kreasimu.")}>
              <div className="rounded-2xl border border-border bg-card/60 p-3 text-center">
                <p className="display-title text-3xl font-bold text-primary">87%</p>
                <p className="text-[0.76rem] text-muted-foreground">{t("Great Match!")}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                {PROFILE.map(([label, score]) => (
                  <div key={label} className="flex items-center justify-between py-0.5">
                    <span className="text-[0.78rem] text-muted-foreground">{t(label)}</span>
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
              <div className="surface-wood rounded-2xl border border-primary/30 p-4 text-center">
                <span className="text-4xl">🧋</span>
                <p className="display-title mt-2 text-base font-bold text-cream">
                  Caramel Nutty Dream
                </p>
                <p className="text-[0.76rem] text-cream/80">
                  {t("Creamy • nutty • dengan sentuhan karamel yang lembut dan seimbang.")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-primary/50 px-2 py-2 text-center text-[0.76rem] font-semibold text-primary">
                  {t("SIMPAN KREASI")}
                </div>
                <div className="surface-gold rounded-xl px-2 py-2 text-center text-[0.76rem] font-semibold text-primary-foreground">
                  {t("BAGIKAN")}
                </div>
              </div>
            </PhoneMock>
          </div>
        </div>

        <FeatureList
          heading={t("Fitur Utama")}
          items={FEATURES.map((f) => ({ ...f, title: t(f.title), desc: t(f.desc) }))}
        />
      </div>

      <section className="surface-wood mt-8 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-primary/30 p-5">
        <div>
          <h2 className="display-title text-xl font-bold text-cream">
            {t("TOGETHER, WE BREW INNOVATION")}
          </h2>
          <p className="mt-1 text-xs text-cream/80">
            {t("Kolaborasi rasa, teknologi, dan komunitas untuk masa depan kopi yang lebih baik.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="size-5 text-gold" />
              <div>
                <p className="display-title text-lg font-bold text-cream">{value}</p>
                <p className="text-[0.76rem] text-cream/75">{t(label)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SlideShell>
  );
}
