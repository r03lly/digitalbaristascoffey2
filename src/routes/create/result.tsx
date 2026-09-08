import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { heroDrink } from "@/lib/barista-images";
import { BrewingLoader } from "@/components/BrewingLoader";
import { GoldButton, InfoCard, PhoneShell, ProgressDots } from "@/components/PhoneShell";
import { formatIDR } from "@/lib/barista-data";
import { useBarista } from "@/lib/barista-store";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/create/result")({
  head: () => ({
    meta: [
      { title: "AI Recommendation — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Hasil racikan Digital Barista: match score, compatibility score, profil rasa, dan catatan barista untuk kreasimu.",
      },
      { property: "og:title", content: "AI Recommendation — Digital Barista" },
      {
        property: "og:description",
        content: "Racikan rekomendasi AI yang seimbang, feasible, dan sesuai preferensimu.",
      },
    ],
  }),
  component: ResultPage,
});

export function ProfileBars({ profile }: { profile: { label: string; value: number }[] }) {
  return (
    <div className="space-y-2.5">
      {profile.map((p) => (
        <div key={p.label}>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t(p.label)}</span>
            <span className="text-foreground">{p.value}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-muted">
            <div
              className="surface-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, p.value)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScoreRing({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card/60 p-4">
      <div
        className="flex size-20 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(var(--gold) ${value * 3.6}deg, var(--muted) 0deg)`,
        }}
      >
        <div className="flex size-16 flex-col items-center justify-center rounded-full bg-card">
          <span className="display-title text-xl font-bold text-primary">{value}</span>
          <span className="text-[0.68rem] text-muted-foreground">%</span>
        </div>
      </div>
      <p className="label-caps mt-2 text-center text-muted-foreground">{label}</p>
    </div>
  );
}

function ResultPage() {
  const {
    baseId,
    recipe,
    aiStatus,
    aiError,
    aiVariants,
    activeVariant,
    setActiveVariant,
    ensureRecipe,
  } = useBarista();
  const navigate = useNavigate();
  const loading = aiStatus === "loading";

  // Pilihan base hanya hidup di memori: refresh atau buka URL ini langsung
  // membuat state kosong, dan tanpa base tidak ada yang bisa diracik.
  // Antar pengguna kembali ke awal alur, bukan membiarkannya stuck di loader.
  useEffect(() => {
    if (!baseId) void navigate({ to: "/create/base", replace: true });
  }, [baseId, navigate]);

  // Proses meracik dimulai di sini (bukan sejak halaman bahan) supaya
  // pengguna selalu melihat animasi "AI is Brewing" begitu halaman terbuka.
  useEffect(() => {
    if (baseId) ensureRecipe();
  }, [baseId, ensureRecipe]);

  if (!baseId) {
    return (
    <PhoneShell title={t("AI RECOMMENDATION")} back="/create/base">
      <ProgressDots
        current={4}
        total={6}
        labels={["Base", "Taste", "Items", "AI", "Adjust", "Recipe"]}
        showCounter
      />
      <p className="mt-6 text-sm text-muted-foreground">
        {t("Pilihan racikanmu belum lengkap. Mulai lagi dari pemilihan base ya.")}
      </p>
        <div className="mt-5">
          <Link to="/create/base">
            <GoldButton>{t("Mulai dari base")}</GoldButton>
          </Link>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell title={t("AI RECOMMENDATION")} back="/create/ingredients">
      <ProgressDots
        current={4}
        total={6}
        labels={["Base", "Taste", "Items", "AI", "Adjust", "Recipe"]}
        showCounter
      />
      <p className="mt-3 text-sm text-muted-foreground">
        {t(
          "Digital Barista menganalisis pilihanmu dan merekomendasikan racikan terbaik yang seimbang, feasible, dan sesuai preferensi rasa.",
        )}
      </p>

      {loading && <BrewingLoader />}

      {!loading && (
        <>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-primary/25 bg-card/60 px-3 py-2">
            <Sparkles className="size-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              {aiStatus === "ready"
                ? t("Diracik oleh AI Digital Barista")
                : aiStatus === "error"
                  ? t(aiError ?? "AI tidak tersedia — memakai racikan dasar.")
                  : t("Racikan dasar")}
            </span>
          </div>

          {aiVariants.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {aiVariants.map((v, i) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setActiveVariant(i)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    i === activeVariant
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {v.style ?? `Variasi ${i + 1}`}
                </button>
              ))}
            </div>
          )}

          <article className="surface-wood shadow-gold mt-4 rounded-3xl border border-primary/30 p-5 text-center">
        <img
          src={heroDrink}
          alt={`Visual racikan ${recipe.name}`}
          loading="lazy"
          width={1024}
          height={1280}
          className="mx-auto h-44 w-36 rounded-2xl border border-primary/30 object-cover"
        />
        <h3 className="display-title mt-3 text-2xl font-bold text-cream">{recipe.name}</h3>
        <p className="mt-1 text-xs tracking-[0.14em] text-cream/85 uppercase">{recipe.tagline}</p>
        <p className="mt-3 text-lg font-semibold text-primary">{formatIDR(recipe.price)}</p>
          </article>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <ScoreRing label={t("AI Match Score")} value={recipe.matchScore} />
        <ScoreRing label={t("Compatibility")} value={recipe.compatibility} />
      </div>

      <section className="mt-4 rounded-2xl border border-border bg-card/60 p-4">
        <h3 className="label-caps text-primary">{t("Profil rasa")}</h3>
        <div className="mt-3">
          <ProfileBars profile={recipe.profile} />
        </div>
      </section>

      {recipe.flavorNotes?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.flavorNotes.map((n) => (
            <span
              key={n}
              className="rounded-full border border-primary/30 px-3 py-1 text-xs text-primary"
            >
              {n}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4">
        <InfoCard title={t("Catatan Digital Barista")}>{recipe.note}</InfoCard>
      </div>

      <div className="mt-5 space-y-3">
        <Link to="/create/adjust" className="block">
          <GoldButton>{t("Adjust Your Drink")}</GoldButton>
        </Link>
        <Link
          to="/create/recipe"
          className="block rounded-2xl border border-primary/60 px-6 py-3.5 text-center text-sm font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-accent"
        >
          {t("Terima Racikan Ini")}
        </Link>
      </div>
        </>
      )}
    </PhoneShell>
  );
}
