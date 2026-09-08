import { createFileRoute, Link } from "@tanstack/react-router";
import { GoldButton, InfoCard, PhoneShell, ProgressDots } from "@/components/PhoneShell";
import { GROUP_LIMITS, INGREDIENTS, formatIDR } from "@/lib/barista-data";
import { useBarista } from "@/lib/barista-store";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/create/ingredients")({
  head: () => ({
    meta: [
      { title: "Pick Ingredients — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Pilih bahan favoritmu — susu, sirup, topping, dan ekstra — lalu Digital Barista meracik kombinasi terbaik.",
      },
      { property: "og:title", content: "Pick Ingredients — Digital Barista" },
      {
        property: "og:description",
        content: "Ruang kreativitas untuk memilih bahan sebagai bagian dari proses co-creation.",
      },
    ],
  }),
  component: IngredientsPage,
});

const GROUPS = ["Susu & Krim", "Sirup & Rasa", "Topping", "Bahan Lokal", "Ekstra"] as const;

function IngredientsPage() {
  const { ingredients, toggleIngredient } = useBarista();
  const chosen = INGREDIENTS.filter((i) => ingredients.includes(i.id));

  return (
    <PhoneShell title={t("PICK INGREDIENTS")} back="/create/taste">
      <ProgressDots
        current={3}
        total={6}
        labels={["Base", "Taste", "Items", "AI", "Adjust", "Recipe"]}
        showCounter
      />
      <p className="mt-3 text-sm text-muted-foreground">
        {t("Pilih bahan favoritmu dengan tap. Bahan yang dipilih akan terhighlight.")}
      </p>

      <div className="mt-5 space-y-4">
        {GROUPS.map((g) => (
          <section key={g}>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="label-caps text-primary">{t(g)}</h3>
              {GROUP_LIMITS[g] ? (
                <span className="text-[0.72rem] text-muted-foreground">
                  {t("Maks")} {GROUP_LIMITS[g]}
                </span>
              ) : null}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
              {INGREDIENTS.filter((i) => i.group === g).map((i) => {
                const active = ingredients.includes(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => toggleIngredient(i.id)}
                    className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-left transition-all ${
                      active
                        ? "border-primary bg-accent shadow-gold"
                        : "border-border bg-card/60 hover:border-primary/50"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <span className="text-base">{i.emoji}</span>
                      {t(i.name)}
                    </span>
                    <span className="text-[0.72rem] text-muted-foreground">+{i.price / 1000}k</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-5">
        <InfoCard title={t("Ringkasan pilihan")}>
          {chosen.length ? (
            <>
              <p className="text-foreground">{chosen.map((c) => t(c.name)).join(" · ")}</p>
              <p className="mt-2">
                {t("Tambahan bahan:")} {formatIDR(chosen.reduce((s, c) => s + c.price, 0))}
              </p>
            </>
          ) : (
            t("Belum ada bahan dipilih. Digital Barista tetap bisa meracik versi murni.")
          )}
        </InfoCard>
      </div>

      <div className="mt-5">
        <Link to="/create/result" className="block">
          <GoldButton>{t("Lanjut ke AI Recommendation")}</GoldButton>
        </Link>
      </div>
    </PhoneShell>
  );
}
