import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GoldButton, InfoCard, PhoneShell, ProgressDots } from "@/components/PhoneShell";
import { BASES } from "@/lib/barista-data";
import { drinkImage } from "@/lib/barista-images";
import { useBarista } from "@/lib/barista-store";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/create/base")({
  head: () => ({
    meta: [
      { title: "Choose Your Base — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Pilih dasar minuman sebagai fondasi kreasimu: espresso, cold brew, matcha, dan lainnya dengan indikator strength.",
      },
      { property: "og:title", content: "Choose Your Base — Digital Barista" },
      {
        property: "og:description",
        content: "Enam pilihan base dengan karakter rasa berbeda sebagai fondasi racikanmu.",
      },
    ],
  }),
  component: BasePage,
});

function BasePage() {
  const { baseId, setBase, selectMenuItem } = useBarista();

  // Masuk alur co-creation: lupakan pilihan menu reguler dari home.
  useEffect(() => {
    selectMenuItem(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PhoneShell title={t("CHOOSE YOUR BASE")} back="/home">
      <ProgressDots
        current={1}
        total={6}
        labels={["Base", "Taste", "Items", "AI", "Adjust", "Recipe"]}
        showCounter
      />
      <p className="mt-3 text-sm text-muted-foreground">
        {t(
          "Pilih dasar minuman sebagai fondasi utama kreasi kamu. Setiap base memiliki karakter rasa yang berbeda.",
        )}
      </p>

      <div className="mt-5 grid grid-cols-2 items-stretch gap-3 md:grid-cols-3">
        {BASES.map((b) => {
          const active = baseId === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setBase(b.id)}
              className={`flex h-full flex-col rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-primary bg-accent shadow-gold"
                  : "border-border bg-card/60 hover:border-primary/50"
              }`}
            >
              <img
                src={drinkImage(b.id)}
                alt={`${t("Foto minuman")} ${b.name}`}
                loading="lazy"
                width={640}
                height={640}
                className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
              />
              <p className="mt-2 text-sm font-semibold text-foreground">{t(b.name)}</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{t(b.desc)}</p>
              <div className="mt-auto flex items-center gap-1 pt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < b.strength ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-[0.72rem] tracking-[0.14em] text-muted-foreground uppercase">
                Strength {b.strength}/5
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <InfoCard title={t("Cara kerja")}>
          {t(
            "Pilih salah satu base yang paling sesuai dengan mood dan preferensi kamu, lalu lanjut untuk menentukan preferensi rasa.",
          )}
        </InfoCard>
      </div>

      <div className="mt-5">
        {baseId ? (
          <Link to="/create/taste" className="block">
            <GoldButton>{t("Lanjut ke Taste Preferences")}</GoldButton>
          </Link>
        ) : (
          <GoldButton disabled>{t("Pilih base dulu")}</GoldButton>
        )}
      </div>
    </PhoneShell>
  );
}
