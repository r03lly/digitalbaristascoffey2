import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { PhoneShell, SectionLabel } from "@/components/PhoneShell";
import { useBarista } from "@/lib/barista-store";
import { formatIDR, type MenuItem } from "@/lib/barista-data";
import { FALLBACK_DRINKS, FALLBACK_FOOD, fetchMenuItems, rowToItem } from "@/lib/menu-db";
import { drinkImage } from "@/lib/barista-images";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu Scoffey — Minuman & Makanan Ringan" },
      {
        name: "description",
        content:
          "Daftar lengkap Menu Scoffey: minuman kopi, matcha, cokelat, plus makanan ringan lempeng, tapai goreng, tahu bakso, dan lainnya dengan harga final.",
      },
      { property: "og:title", content: "Menu Scoffey — Minuman & Makanan Ringan" },
      {
        property: "og:description",
        content: "Lihat semua minuman dan camilan Scoffey, pesan langsung dari halaman menu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const navigate = useNavigate();
  const { cart, addToCart, setCartQty, cartCount, cartTotal } = useBarista();
  const [drinks, setDrinks] = useState<MenuItem[]>(FALLBACK_DRINKS);
  const [food, setFood] = useState<MenuItem[]>(FALLBACK_FOOD);

  useEffect(() => {
    let alive = true;
    fetchMenuItems()
      .then((rows) => {
        if (!alive || !rows.length) return;
        setDrinks(rows.filter((r) => r.category !== "food").map(rowToItem));
        setFood(rows.filter((r) => r.category === "food").map(rowToItem));
      })
      .catch(() => {
        /* pakai daftar bawaan */
      });
    return () => {
      alive = false;
    };
  }, []);

  const card = (m: MenuItem) => {
    const qty = cart.find((c) => c.id === m.id)?.qty ?? 0;
    return (
      <article
        key={m.id}
        className="flex flex-col overflow-hidden rounded-xl border border-border bg-card/60"
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
  };


  return (
    <PhoneShell nav>
      <div className="flex items-center gap-2 pt-2">
        <Link
          to="/home"
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground"
          aria-label={t("Kembali")}
        >
          <ChevronLeft className="size-4" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground md:text-2xl">
          {t("Menu Scoffey")}
        </h1>
      </div>

      <section className="mt-4">
        <SectionLabel>{t("Semua menu")}</SectionLabel>
        <p className="mt-1 text-[0.8rem] text-muted-foreground">
          {t("Daftar minuman lengkap Scoffey — pilih favoritmu dan pesan langsung.")}
        </p>
        <p className="mt-0.5 text-[0.72rem] text-muted-foreground">
          {t("Harga sudah final — tidak ada pajak dan biaya layanan tambahan.")}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
          {drinks.map(card)}
        </div>
      </section>

      <section className="mt-6">
        <SectionLabel>{t("Makanan Ringan")}</SectionLabel>
        <p className="mt-1 text-[0.8rem] text-muted-foreground">
          {t("Camilan gurih dan manis untuk teman minum kopi Scoffey.")}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
          {food.map(card)}
        </div>
      </section>

      {cartCount > 0 && (
        <>
          <div className="h-24" aria-hidden />
          <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/checkout" })}
              className="surface-gold mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-2xl px-4 py-3 text-primary-foreground shadow-lg"
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <ShoppingBag className="size-4" />
                {cartCount} {t("item")}
              </span>
              <span className="text-sm font-bold">
                {formatIDR(cartTotal)} · {t("Pesan")}
              </span>
            </button>
          </div>
        </>
      )}

    </PhoneShell>
  );
}
