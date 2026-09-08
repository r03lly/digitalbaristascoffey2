import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Share2 } from "lucide-react";
import { heroDrink } from "@/lib/barista-images";
import { GoldButton, InfoCard, PhoneShell, ProgressDots } from "@/components/PhoneShell";
import { BASES, DEFAULT_BASE, INGREDIENTS, formatIDR } from "@/lib/barista-data";
import { useBarista } from "@/lib/barista-store";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/create/recipe")({
  head: () => ({
    meta: [
      { title: "Final Recipe Card — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Resep final hasil co-creation: komposisi, langkah penyajian, deskripsi rasa, dan aksi pesan atau simpan.",
      },
      { property: "og:title", content: "Final Recipe Card — Digital Barista" },
      {
        property: "og:description",
        content: "Racikan finalmu siap dinikmati — your recipe, your story.",
      },
    ],
  }),
  component: RecipePage,
});

function RecipePage() {
  const { recipe, baseId, ingredients, taste, adjust, saveRecipe, saved } = useBarista();
  const base = BASES.find((b) => b.id === baseId) ?? DEFAULT_BASE;
  const chosen = INGREDIENTS.filter((i) => ingredients.includes(i.id));
  const isSaved = saved.includes(recipe.name);

  return (
    <PhoneShell title={t("FINAL RECIPE CARD")} back="/create/adjust">
      <ProgressDots
        current={6}
        total={6}
        labels={["Base", "Taste", "Items", "AI", "Adjust", "Recipe"]}
        showCounter
      />
      <p className="mt-3 text-sm text-muted-foreground">
        {t(
          "Racikan finalmu siap dinikmati! Ini adalah hasil co-creation terbaikmu bersama Digital Barista.",
        )}
      </p>

      <article className="mt-5 overflow-hidden rounded-3xl border border-primary/40 bg-card/60">
        <div className="surface-wood p-5 text-center">
          <img
            src={heroDrink}
            alt={`Visual racikan ${recipe.name}`}
            loading="lazy"
            width={1024}
            height={1280}
            className="mx-auto h-44 w-36 rounded-2xl border border-primary/30 object-cover"
          />
          <h3 className="display-title mt-2 text-2xl font-bold text-cream">{recipe.name}</h3>
          <p className="mt-1 text-xs tracking-[0.14em] text-cream/85 uppercase">{recipe.tagline}</p>
        </div>
        <div className="p-5">
          <h4 className="label-caps text-primary">{t("Komposisi")}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("Takaran tiap bahan yang dipakai barista untuk satu gelas.")}
          </p>
          <ul className="mt-2 divide-y divide-border/60 text-sm">
            <li className="flex items-start justify-between gap-3 py-1.5">
              <span className="min-w-0">
                <span className="block text-foreground">
                  {base.emoji} {t(base.name)} <span className="text-muted-foreground">(base)</span>
                </span>
                <span className="block text-xs text-primary">{t(base.amount)}</span>
              </span>
              <span className="shrink-0 text-muted-foreground">{formatIDR(base.price)}</span>
            </li>
            {chosen.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 py-1.5">
                <span className="min-w-0">
                  <span className="block text-foreground">
                    {c.emoji} {t(c.name)}{" "}
                    <span className="text-muted-foreground">· {t(c.group)}</span>
                  </span>
                  <span className="block text-xs text-primary">{t(c.amount)}</span>
                </span>
                <span className="shrink-0 text-muted-foreground">{formatIDR(c.price)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            {chosen.length + 1} {t("komponen")} · {t("Sajian")} {t(taste.temperature)} ·{" "}
            {t("Manis")} {adjust.sweet}% · {t("Kekuatan")} {adjust.strength}% · {t("Susu")}{" "}
            {adjust.milk}% · {t("Es")} {adjust.ice}%
          </p>


          <h4 className="label-caps mt-4 text-primary">{t("Langkah penyajian")}</h4>
          <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            {recipe.steps.map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="text-primary">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="label-caps text-muted-foreground">Total</span>
            <span className="display-title text-2xl font-bold text-primary">
              {formatIDR(recipe.price)}
            </span>
          </div>
        </div>
      </article>

      <div className="mt-4">
        <InfoCard title={t("Deskripsi rasa")}>{recipe.note}</InfoCard>
      </div>

      <div className="mt-5 space-y-3">
        <Link to="/checkout" className="block">
          <GoldButton>{t("Pesan Sekarang")}</GoldButton>
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={saveRecipe}
            className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 py-3 text-xs font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-accent"
          >
            <Heart className="size-4" /> {isSaved ? t("Tersimpan") : t("Simpan")}
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-2xl border border-border py-3 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:border-primary/60 hover:text-primary"
          >
            <Share2 className="size-4" /> {t("Bagikan")}
          </button>
        </div>
      </div>

      <p className="label-caps mt-6 text-center text-primary">{t("Your Recipe, Your Story")}</p>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        {t("Setiap racikan adalah ekspresi dirimu. Scoffey mengapresiasi kreasimu!")}
      </p>
    </PhoneShell>
  );
}
