import { createFileRoute, Link } from "@tanstack/react-router";
import { GoldButton, InfoCard, PhoneShell, ProgressDots } from "@/components/PhoneShell";
import { useBarista } from "@/lib/barista-store";
import type { Adjust } from "@/lib/barista-data";
import { ProfileBars, ScoreRing } from "./result";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/create/adjust")({
  head: () => ({
    meta: [
      { title: "Adjust Your Drink — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Sesuaikan sweetness, strength, susu, dan es. Digital Barista mengkalkulasi ulang komposisi dan match score secara real-time.",
      },
      { property: "og:title", content: "Adjust Your Drink — Digital Barista" },
      {
        property: "og:description",
        content: "Kendali penuh untuk menyempurnakan racikan hingga rasa paling pas.",
      },
    ],
  }),
  component: AdjustPage,
});

const SLIDERS: { key: keyof Adjust; label: string }[] = [
  { key: "sweet", label: "Sweetness" },
  { key: "strength", label: "Coffee Strength" },
  { key: "milk", label: "Milk / Creaminess" },
  { key: "ice", label: "Ice Level" },
];

function AdjustPage() {
  const { adjust, setAdjust, recipe } = useBarista();

  return (
    <PhoneShell title={t("ADJUST YOUR DRINK")} back="/create/result">
      <ProgressDots
        current={5}
        total={6}
        labels={["Base", "Taste", "Items", "AI", "Adjust", "Recipe"]}
        showCounter
      />
      <p className="mt-3 text-sm text-muted-foreground">
        {t(
          "Sempurnakan racikanmu! Digital Barista akan mengkalkulasi ulang komposisi dan memberikan hasil terbaik untuk kamu.",
        )}
      </p>

      <section className="mt-5 space-y-5 rounded-2xl border border-border bg-card/60 p-4">
        {SLIDERS.map((s) => (
          <div key={s.key}>
            <div className="flex justify-between text-xs">
              <span className="label-caps text-primary">{t(s.label)}</span>
              <span className="text-foreground">{adjust[s.key]}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={adjust[s.key]}
              onChange={(e) => setAdjust(s.key, Number(e.target.value))}
              aria-label={t(s.label)}
              className="mt-2 h-2 w-full appearance-none rounded-full bg-muted accent-primary"
            />
          </div>
        ))}
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-card/60 p-4">
        <h3 className="label-caps text-primary">{t("Perubahan real-time")}</h3>
        <div className="mt-3">
          <ProfileBars profile={recipe.profile} />
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <ScoreRing label={t("AI Match Score")} value={recipe.matchScore} />
        <ScoreRing label={t("Compatibility")} value={recipe.compatibility} />
      </div>

      <div className="mt-4">
        <InfoCard title={t("Peringkat kecocokan")}>
          {t("AI Match Score berubah secara real-time mengikuti penyesuaian yang kamu pilih.")}
        </InfoCard>
      </div>

      <div className="mt-5">
        <Link to="/create/recipe" className="block">
          <GoldButton>{t("Simpan & Lihat Resep Final")}</GoldButton>
        </Link>
      </div>
    </PhoneShell>
  );
}
