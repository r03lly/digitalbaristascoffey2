import { createFileRoute, Link } from "@tanstack/react-router";
import { GoldButton, InfoCard, PhoneShell, ProgressDots } from "@/components/PhoneShell";
import { TASTE_STEPS } from "@/lib/barista-data";
import { useBarista } from "@/lib/barista-store";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/create/taste")({
  head: () => ({
    meta: [
      { title: "Select Taste Preferences — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Tentukan sweetness, intensity, creaminess, temperature, dan mood — Digital Barista menyesuaikan resep dengan seleramu.",
      },
      { property: "og:title", content: "Select Taste Preferences — Digital Barista" },
      {
        property: "og:description",
        content: "Preferensi rasa sebagai input utama AI untuk meracik minuman personal.",
      },
    ],
  }),
  component: TastePage,
});

function TastePage() {
  const { taste, setTaste } = useBarista();

  return (
    <PhoneShell title={t("TASTE PREFERENCES")} back="/create/base">
      <ProgressDots
        current={2}
        total={6}
        labels={["Base", "Taste", "Items", "AI", "Adjust", "Recipe"]}
        showCounter
      />
      <p className="mt-3 text-sm text-muted-foreground">
        {t(
          "Tentukan preferensi rasa kamu. Digital Barista akan menyesuaikan resep berdasarkan selera unikmu.",
        )}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          {TASTE_STEPS.map((step) => (
            <section key={step.key}>
              <h3 className="label-caps text-primary">{t(step.label)}</h3>
              <div className="mt-2 flex flex-wrap gap-2 md:grid md:grid-cols-2">
                {step.options.map((opt) => {
                  const active = taste[step.key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTaste(step.key, opt)}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card/60 text-muted-foreground hover:border-primary/60"
                      }`}
                    >
                      {t(opt)}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-5">
          <InfoCard title={t("Ringkasan pilihan")}>
            <ul className="space-y-1">
              {TASTE_STEPS.map((s) => (
                <li key={s.key} className="flex justify-between">
                  <span>{t(s.label)}</span>
                  <span className="text-foreground">{t(taste[s.key])}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              {t("AI akan mencari kombinasi bahan terbaik berdasarkan preferensi di atas.")}
            </p>
          </InfoCard>

          <Link to="/create/ingredients" className="block">
            <GoldButton>{t("Lanjut Pilih Bahan")}</GoldButton>
          </Link>
        </aside>
      </div>
    </PhoneShell>
  );
}
