import { createFileRoute, Link } from "@tanstack/react-router";
import { Coffee, Heart, Share2 } from "lucide-react";
import { GoldButton, InfoCard, PhoneShell, SectionLabel } from "@/components/PhoneShell";
import { formatIDR } from "@/lib/barista-data";
import { useBarista } from "@/lib/barista-store";
import { drinkCaramelNutty, drinkCinnamonCaramel } from "@/lib/barista-images";
import { getLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/creations")({
  head: () => ({
    meta: [
      { title: "My Creations — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Kreasi tersimpan dan riwayat racikan kamu bersama Digital Barista. Setiap racikan adalah ekspresi dirimu.",
      },
      { property: "og:title", content: "My Creations — Digital Barista by Scoffey" },
      {
        property: "og:description",
        content: "Your recipe, your story — simpan, pesan ulang, dan bagikan kreasimu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreationsPage,
});

function CreationsPage() {
  const { saved, orders } = useBarista();

  return (
    <PhoneShell title={t("MY CREATIONS")} step={t("Your Recipe, Your Story")} back="/home" nav>
      <div className="space-y-4 md:space-y-8">
        <InfoCard title={t("Kreasi Kamu")}>
          {t(
            "Setiap racikan adalah ekspresi dirimu. Scoffey mengapresiasi kreasimu — simpan, pesan ulang, atau bagikan ke komunitas.",
          )}
        </InfoCard>

        <section>
          <SectionLabel>{t("Kreasi tersimpan")}</SectionLabel>
          {saved.length ? (
            <ul className="mt-2.5 space-y-2 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
              {saved.map((s, i) => (
                <li
                  key={s}
                  className="flex gap-3 rounded-xl border border-border bg-card/60 p-2.5 md:p-4"
                >
                  <img
                    src={i % 2 ? drinkCinnamonCaramel : drinkCaramelNutty}
                    alt={`Foto ${s}`}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="size-14 shrink-0 rounded-lg object-cover md:size-20"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.92rem] font-semibold text-foreground">{s}</p>
                    <div className="mt-1.5 flex gap-2">
                      <Link
                        to="/create/recipe"
                        className="rounded-lg border border-border px-2.5 py-1 text-[0.73rem] font-bold tracking-[0.1em] text-foreground uppercase"
                      >
                        {t("Detail")}
                      </Link>
                      <Link
                        to="/checkout"
                        className="surface-gold rounded-lg px-2.5 py-1 text-[0.73rem] font-bold tracking-[0.1em] text-primary-foreground uppercase"
                      >
                        {t("Reorder")}
                      </Link>
                    </div>
                  </div>
                  <Heart className="size-4 shrink-0 fill-primary text-primary" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "Belum ada kreasi tersimpan. Racik minumanmu, lalu simpan dari Final Recipe Card.",
              )}
            </p>
          )}
        </section>

        <section>
          <SectionLabel>{t("Riwayat pesanan")}</SectionLabel>
          {orders.length ? (
            <ul className="mt-2.5 space-y-2 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              {orders.map((o) => (
                <li key={o.id} className="rounded-xl border border-border bg-card/60 px-3.5 py-3">
                  <div className="flex justify-between gap-2">
                    <span className="truncate text-sm text-foreground">{o.name}</span>
                    <span className="shrink-0 text-sm text-primary">{formatIDR(o.price)}</span>
                  </div>
                  <p className="mt-1 text-[0.76rem] text-muted-foreground">
                    #{o.id} · AI Match {o.matchScore}% ·{" "}
                    {new Date(o.when).toLocaleString(getLang() === "id" ? "id-ID" : "en-US")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{t("Belum ada pesanan.")}</p>
          )}
        </section>

        <section className="surface-wood flex items-center gap-3 rounded-2xl border border-primary/30 p-4">
          <Share2 className="size-5 shrink-0 text-gold" aria-hidden="true" />
          <p className="text-[0.82rem] leading-snug text-cream/85">
            {t(
              "Bagikan racikan terbaikmu ke komunitas Scoffey dan bantu kreator lain menemukan rasa baru.",
            )}
          </p>
        </section>

        <Link to="/create/base" className="block md:max-w-xs">
          <GoldButton>
            <span className="inline-flex items-center gap-2">
              <Coffee className="size-4" /> {t("Racik Kreasi Baru")}
            </span>
          </GoldButton>
        </Link>
      </div>
    </PhoneShell>
  );
}
