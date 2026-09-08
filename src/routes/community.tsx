import { createFileRoute, Link } from "@tanstack/react-router";
import { Coffee, Heart, Sparkles, Users } from "lucide-react";
import { GoldButton, InfoCard, PhoneShell, SectionLabel } from "@/components/PhoneShell";
import { BASE_IMAGES, drinkCinnamonCaramel } from "@/lib/barista-images";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Together, we brew innovation. 10K+ resep tercipta, 5K+ kreator aktif, dan 98% kepuasan pengguna di komunitas Scoffey.",
      },
      { property: "og:title", content: "Community — Digital Barista by Scoffey" },
      {
        property: "og:description",
        content: "Kolaborasi rasa, teknologi, dan komunitas untuk masa depan kopi yang lebih baik.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityPage,
});

const STATS = [
  { icon: Coffee, value: "10K+", label: "Resep Tercipta" },
  { icon: Users, value: "5K+", label: "Kreator Aktif" },
  { icon: Heart, value: "98%", label: "Kepuasan Pengguna" },
];

const TRENDING = [
  { img: drinkCinnamonCaramel, name: "Cinnamon Caramel Cloud", by: "Rara", likes: 412 },
  { img: BASE_IMAGES.coldbrew, name: "Citrus Cold Brew Fizz", by: "Bagas", likes: 388 },
  { img: BASE_IMAGES.matcha, name: "Velvet Matcha Salt", by: "Nadia", likes: 341 },
];

function CommunityPage() {
  return (
    <PhoneShell title={t("COMMUNITY")} step={t("Together, We Brew Innovation")} back="/home" nav>
      <div className="space-y-4">
        <InfoCard title={t("Kolaborasi Rasa")}>
          {t(
            "Kolaborasi rasa, teknologi, dan komunitas untuk masa depan kopi yang lebih baik. Kreasi terbaik dari komunitas bisa jadi menu musiman Scoffey.",
          )}
        </InfoCard>

        <section className="grid grid-cols-3 gap-2.5">
          {STATS.map(({ icon: Icon, value, label }) => (
            <article
              key={label}
              className="rounded-2xl border border-primary/30 bg-card/60 p-3 text-center"
            >
              <Icon className="mx-auto size-4 text-primary" aria-hidden="true" />
              <p className="display-title mt-2 text-2xl text-foreground">{value}</p>
              <p className="text-[0.72rem] leading-tight text-muted-foreground">{t(label)}</p>
            </article>
          ))}
        </section>

        <section>
          <SectionLabel>{t("Trending kreasi komunitas")}</SectionLabel>
          <ul className="mt-2.5 space-y-2">
            {TRENDING.map((item) => (
              <li
                key={item.name}
                className="flex gap-3 rounded-xl border border-border bg-card/60 p-2.5"
              >
                <img
                  src={item.img}
                  alt={`Foto ${item.name}`}
                  loading="lazy"
                  width={768}
                  height={768}
                  className="size-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.92rem] font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-[0.66rem] text-muted-foreground">
                    {t("oleh")} {item.by}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[0.66rem] text-primary">
                    <Heart className="size-3 fill-primary" aria-hidden="true" /> {item.likes}{" "}
                    {t("suka")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-wood rounded-2xl border border-primary/30 p-4">
          <h3 className="label-caps flex items-center gap-2 text-cream">
            <Sparkles className="size-4 text-gold" aria-hidden="true" /> Brewing the Future
          </h3>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-cream/85">
            {t(
              "Digital Barista adalah langkah kecil hari ini untuk menciptakan pengalaman minum kopi yang lebih personal, konsisten, dan berkelanjutan.",
            )}
          </p>
        </section>

        <Link to="/future" className="block">
          <GoldButton>{t("Lihat Visi Scoffey")}</GoldButton>
        </Link>
      </div>
    </PhoneShell>
  );
}
