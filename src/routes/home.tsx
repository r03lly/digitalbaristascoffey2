import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, ChevronRight, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { fetchTopCreations, type TopCreation } from "@/lib/orders-db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhoneShell, SectionLabel } from "@/components/PhoneShell";
import { useBarista } from "@/lib/barista-store";
import { SCOFFEY_MENU, formatIDR } from "@/lib/barista-data";
import {
  BASE_IMAGES,
  MENU_IMAGES,
  avatarUser,
  drinkCaramelNutty,
  drinkCinnamonCaramel,
  drinkImage,
  promoSummer,
} from "@/lib/barista-images";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Pusat navigasi Digital Barista: mulai co-creation, lihat rekomendasi AI, kreasi terakhir, dan promo Scoffey.",
      },
      { property: "og:title", content: "Home — Digital Barista by Scoffey" },
      {
        property: "og:description",
        content: "Mulai berkreasi, lihat rekomendasi AI, kreasi terakhir, dan promo Scoffey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const FALLBACK_TOP: TopCreation[] = [
  {
    name: "Cinnamon Caramel Cloud",
    matchScore: 96,
    price: 0,
    lines: [
      { name: "Espresso", amount: "2 shot", price: 0 },
      { name: "Susu oat", amount: "200 ml", price: 0 },
      { name: "Sirup karamel", amount: "2 pump", price: 0 },
      { name: "Kayu manis", amount: "1 taburan", price: 0 },
    ],
  },
  {
    name: "Hazelnut Cream Latte",
    matchScore: 94,
    price: 0,
    lines: [
      { name: "Espresso", amount: "2 shot", price: 0 },
      { name: "Susu full cream", amount: "200 ml", price: 0 },
      { name: "Sirup hazelnut", amount: "2 pump", price: 0 },
    ],
  },
  {
    name: "Strawberry Espresso Fizz",
    matchScore: 92,
    price: 0,
    lines: [
      { name: "Espresso", amount: "1 shot", price: 0 },
      { name: "Soda", amount: "150 ml", price: 0 },
      { name: "Puree stroberi", amount: "2 sdm", price: 0 },
    ],
  },
  {
    name: "Matcha Cloud",
    matchScore: 91,
    price: 0,
    lines: [
      { name: "Matcha", amount: "2 sdt", price: 0 },
      { name: "Susu oat", amount: "200 ml", price: 0 },
      { name: "Madu", amount: "1 sdm", price: 0 },
    ],
  },
];

function creationImage(name: string): string {
  const n = name.toLowerCase();
  // rasa dulu, supaya tiap nama minuman punya foto berbeda
  if (n.includes("cinnamon") || n.includes("kayu manis")) return drinkCinnamonCaramel;
  if (n.includes("hazelnut")) return MENU_IMAGES["hazelnut"]!;
  if (n.includes("strawberry") || n.includes("stroberi")) return MENU_IMAGES["strawberry"]!;
  if (n.includes("red velvet")) return MENU_IMAGES["red-velvet"]!;
  if (n.includes("butterscotch")) return MENU_IMAGES["butterscotch"]!;
  if (n.includes("pandan")) return MENU_IMAGES["pandan"]!;
  if (n.includes("vanilla") || n.includes("vanila")) return MENU_IMAGES["vanilla"]!;
  if (n.includes("aren") || n.includes("brown sugar") || n.includes("gula aren"))
    return MENU_IMAGES["aren"]!;
  if (n.includes("caramel") || n.includes("karamel")) return MENU_IMAGES["caramel"]!;
  if (n.includes("matcha")) return BASE_IMAGES.matcha;
  if (n.includes("cold brew") || n.includes("coldbrew")) return BASE_IMAGES.coldbrew;
  if (n.includes("choc") || n.includes("mocha") || n.includes("cokelat")) return BASE_IMAGES.chocolate;
  if (n.includes("espresso")) return BASE_IMAGES.espresso;
  if (n.includes("americano")) return BASE_IMAGES.americano;
  if (n.includes("nutty") || n.includes("almond")) return drinkCaramelNutty;
  return BASE_IMAGES.latte;
}

function HomePage() {
  const { userName, orders, saved, isAdmin, isBarista, cartCount, cartTotal } = useBarista();
  const navigate = useNavigate();
  const [topCreations, setTopCreations] = useState<TopCreation[]>(FALLBACK_TOP);
  const [selected, setSelected] = useState<TopCreation | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchTopCreations(8)
      .then((rows) => {
        if (!cancelled && rows.length > 0) setTopCreations(rows);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const lastName = orders[0]?.name ?? saved[0] ?? "Vanilla Sea Salt Latte";
  const lastPrice = orders[0]?.price;

  return (
    <PhoneShell nav>
      {/* Greeting */}
      <div className="flex items-start justify-between pt-2 md:items-center md:rounded-2xl md:border md:border-border md:bg-card/40 md:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={avatarUser}
            alt={`Foto profil ${userName}`}
            width={512}
            height={512}
            className="size-11 shrink-0 rounded-full border border-primary/40 object-cover md:size-14"
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-foreground md:text-2xl">
              {t("Hi")}, {userName}!
            </p>
            <p className="text-[0.84rem] leading-tight text-muted-foreground md:text-sm">
              {t("Ready to create your perfect coffee today?")}
            </p>
          </div>
        </div>
        <Bell className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
      </div>

      {(isAdmin || isBarista) && (
        <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-primary/30 bg-card/60 p-3">
          <span className="label-caps w-full text-primary">{t("Mode Staf")}</span>
          {isBarista && (
            <Link
              to="/barista"
              className="rounded-full border border-primary/40 px-4 py-2 text-sm text-primary"
            >
              {t("Dashboard Barista")}
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-full border border-primary/40 px-4 py-2 text-sm text-primary"
            >
              {t("Dashboard Admin")}
            </Link>
          )}
        </div>
      )}



      {/* Hero banner */}
      <div className="surface-wood shadow-gold relative mt-4 overflow-hidden rounded-2xl border border-primary/25 md:mt-6">
        <img
          src={drinkCinnamonCaramel}
          alt="Iced caramel latte Scoffey"
          width={768}
          height={768}
          className="absolute top-0 right-0 h-full w-2/5 object-cover opacity-90"
        />
        <div className="relative w-3/5 p-4 md:py-10 md:pl-8 lg:py-14 lg:pl-12">
          <h2 className="text-[0.95rem] leading-snug font-bold tracking-[0.04em] text-cream uppercase md:text-xl lg:text-3xl">
            {t("Create your drink")}
            <br />
            {t("with Digital Barista")}
          </h2>
          <p className="mt-2 text-[0.8rem] leading-tight text-cream/85 md:mt-3 md:text-sm">
            AI-Driven Beverage Co-Creation
          </p>
          <Link
            to="/create/base"
            className="surface-gold shadow-gold mt-3 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[0.82rem] md:mt-6 md:px-6 md:py-3 md:text-sm font-bold tracking-[0.08em] text-primary-foreground uppercase"
          >
            ☕ {t("Create Your Drink")}
          </Link>
        </div>
      </div>




      {/* Menu favorit */}
      <section className="mt-5">
        <SectionLabel
          action={
            <Link to="/menu" className="flex items-center text-[0.8rem] text-primary">
              {t("Lihat semua")} <ChevronRight className="size-3" />
            </Link>
          }
        >
          {t("Menu Favorit")}
        </SectionLabel>
        <p className="mt-1 text-[0.8rem] text-muted-foreground">
          {t("Pilihan terlaris Scoffey — menu lengkap ada di halaman Menu Scoffey.")}
        </p>
        <p className="mt-0.5 text-[0.72rem] text-muted-foreground">
          {t("Harga sudah final — tidak ada pajak dan biaya layanan tambahan.")}
        </p>

        <MenuScoffeyGrid />
      </section>


      {/* Recommended */}
      <section className="mt-5">
        <SectionLabel
          action={
            <Link to="/creations" className="flex items-center text-[0.8rem] text-primary">
              {t("Lihat semua")} <ChevronRight className="size-3" />
            </Link>
          }
        >
          {t("Top Creations")}
        </SectionLabel>
        <p className="mt-1 text-[0.8rem] text-muted-foreground">
          {t("Racikan buatan pelanggan dengan match score tertinggi.")}
        </p>
        <div className="-mx-5 mt-2.5 flex gap-2.5 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4 lg:gap-5">
          {topCreations.map((r) => (
            <button
              key={r.name}
              type="button"
              onClick={() => setSelected(r)}
              className="flex w-[7.5rem] shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card/60 text-left transition-colors hover:border-primary/50 md:w-auto md:rounded-2xl"
            >
              <img
                src={creationImage(r.name)}
                alt={`Foto ${r.name}`}
                loading="lazy"
                width={768}
                height={768}
                className="aspect-square w-full object-cover md:aspect-auto md:h-32 lg:h-40"
              />
              <div className="flex flex-1 flex-col p-2 md:p-4">
                <p className="text-[0.82rem] leading-tight font-medium text-foreground md:text-sm lg:text-base">
                  {r.name}
                </p>
                <div className="mt-1.5 flex items-center justify-between md:mt-auto md:pt-3">
                  <span className="flex items-center gap-1 text-[0.8rem] text-foreground">
                    <Sparkles className="size-3 text-primary" /> {r.matchScore}%
                  </span>
                  {r.price > 0 && (
                    <span className="text-[0.72rem] text-muted-foreground">
                      {formatIDR(r.price)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Top creation detail */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-sm border-border bg-card">
          {selected && (
            <>
              <img
                src={creationImage(selected.name)}
                alt={`Foto ${selected.name}`}
                className="h-40 w-full rounded-xl object-cover"
              />
              <DialogHeader>
                <DialogTitle className="text-foreground">{selected.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-1 text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  {t("Match score")} {selected.matchScore}%
                  {selected.price > 0 && ` • ${formatIDR(selected.price)}`}
                </DialogDescription>
              </DialogHeader>
              {selected.lines.length > 0 && (
                <div>
                  <p className="label-caps text-primary">{t("Racikan")}</p>
                  <ul className="mt-2 space-y-1.5">
                    {selected.lines.map((l, i) => (
                      <li
                        key={`${l.name}-${i}`}
                        className="flex items-center justify-between text-sm text-foreground"
                      >
                        <span>{l.name}</span>
                        <span className="text-muted-foreground">{l.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link
                to="/create/base"
                className="surface-gold mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold tracking-[0.08em] text-primary-foreground uppercase"
              >
                ☕ {t("Buat minuman seperti ini")}
              </Link>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Last creations */}
      <div className="md:mt-6 md:grid md:grid-cols-2 md:items-start md:gap-6">
        <section className="mt-4 md:mt-0">
          <SectionLabel
            action={
              <Link to="/creations" className="flex items-center text-[0.8rem] text-primary">
                {t("Lihat semua")} <ChevronRight className="size-3" />
              </Link>
            }
          >
            {t("Your last creations")}
          </SectionLabel>
          <div className="mt-2.5 flex gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <img
              src={drinkCaramelNutty}
              alt={`Foto ${lastName}`}
              loading="lazy"
              width={768}
              height={768}
              className="size-[4.5rem] shrink-0 rounded-lg object-cover md:size-24"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-[0.92rem] font-semibold text-foreground">{lastName}</p>
                <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[0.72rem] text-primary">
                  Iced
                </span>
              </div>
              <p className="mt-0.5 text-[0.78rem] text-muted-foreground">
                Dibuat 2 hari lalu • Rating 4.9
                {lastPrice ? ` • ${formatIDR(lastPrice)}` : ""}
              </p>
              <div className="mt-2 flex gap-2">
                <Link
                  to="/checkout"
                  className="surface-gold rounded-lg px-3 py-1.5 text-[0.76rem] font-bold tracking-[0.1em] text-primary-foreground uppercase"
                >
                  {t("Reorder")}
                </Link>
                <Link
                  to="/create/recipe"
                  className="rounded-lg border border-border px-3 py-1.5 text-[0.76rem] font-bold tracking-[0.1em] text-foreground uppercase"
                >
                  Detail
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What's new */}
        <section className="mt-4 md:mt-0">
          <SectionLabel>{t("What's new")}</SectionLabel>
          <div className="relative mt-2.5 overflow-hidden rounded-xl border border-primary/30 bg-card/60">
            <span className="absolute top-0 left-0 z-10 rounded-br-lg bg-primary px-2 py-0.5 text-[0.68rem] font-bold text-primary-foreground">
              NEW
            </span>
            <img
              src={promoSummer}
              alt="Promo Summer Breeze Series"
              loading="lazy"
              width={1024}
              height={576}
              className="absolute top-0 right-0 h-full w-2/5 object-cover"
            />
            <div
              className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-r from-card/95 to-transparent"
              aria-hidden="true"
            />
            <div className="relative w-3/5 p-3 pt-4 md:p-5 md:pt-6">
              <p className="text-[0.92rem] font-semibold text-foreground md:text-base">
                Summer Breeze Series
              </p>
              <p className="mt-1 text-[0.76rem] leading-snug text-muted-foreground md:text-xs">
                {t("Rasakan kesegaran buah-buahan pilihan dalam racikan kopi spesial Scoffey.")}
              </p>

              <Link
                to="/community"
                className="surface-gold mt-2 inline-block rounded-lg px-3 py-1.5 text-[0.73rem] font-bold tracking-[0.1em] text-primary-foreground uppercase"
              >
                {t("Lihat Promo")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PhoneShell>
  );
}

const FAVORITE_IDS = ["scoffey-signature", "caramel", "brown-matcha", "red-velvet"];

function MenuScoffeyGrid() {
  const { cart, addToCart, setCartQty } = useBarista();

  const visible = FAVORITE_IDS.map((id) =>
    SCOFFEY_MENU.find((m) => m.id === id),
  ).filter((m): m is (typeof SCOFFEY_MENU)[number] => Boolean(m));


  return (
    <>
      <div className="-mx-5 mt-2.5 flex gap-2.5 overflow-x-auto scroll-px-5 px-5 pb-2 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
        {visible.map((m) => {
          const qty = cart.find((c) => c.id === m.id)?.qty ?? 0;
          return (
          <article
            key={m.id}
            className="flex w-[10.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border bg-card/60 md:w-auto"
          >
            <img
              src={drinkImage(m.imageId)}
              alt={`Foto ${m.name}`}
              loading="lazy"
              width={768}
              height={768}
              className="aspect-square w-full object-cover md:h-28 lg:h-32"
            />
            <div className="flex flex-1 flex-col p-2.5 md:p-3.5">
              <p className="text-[0.84rem] leading-tight font-semibold text-foreground md:text-base">
                {m.name}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[0.72rem] leading-tight text-muted-foreground md:text-xs">
                {t(m.desc)}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 md:mt-auto md:flex-nowrap md:pt-2">
                <span className="text-[0.8rem] font-semibold whitespace-nowrap text-primary md:text-sm">
                  {formatIDR(m.price)}
                </span>
                {qty > 0 ? (
                  <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/60 px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => setCartQty(m.id, qty - 1)}
                      aria-label={`${t("Kurangi")} ${m.name}`}
                      className="flex size-6 items-center justify-center text-primary"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="min-w-4 text-center text-xs font-bold text-foreground">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setCartQty(m.id, qty + 1)}
                      aria-label={`${t("Tambah")} ${m.name}`}
                      className="flex size-6 items-center justify-center text-primary"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => addToCart({ id: m.id, name: m.name, price: m.price })}
                    className="surface-gold shrink-0 rounded-lg px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.08em] text-primary-foreground uppercase md:text-xs"
                  >
                    {t("Tambah")}
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}

      </div>
    </>
  );
}
