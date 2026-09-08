import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3, CalendarClock, ClipboardList, Coffee, Heart, LogOut, Sparkles, Trash2, User } from "lucide-react";
import { OutlineButton, PhoneShell } from "@/components/PhoneShell";
import { formatIDR } from "@/lib/barista-data";
import { useBarista } from "@/lib/barista-store";
import { getLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil & Riwayat Kreasi — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Lihat kreasi tersimpan dan riwayat pesanan racikanmu bersama Digital Barista by Scoffey.",
      },
      { property: "og:title", content: "Profil & Riwayat — Digital Barista by Scoffey" },
      {
        property: "og:description",
        content: "Kreasi tersimpan, riwayat pesanan, dan pengaturan akun kamu.",
      },
    ],
  }),
  component: ProfilePage,
});

const staffNav = [
  { to: "/barista", label: "Pesanan", icon: ClipboardList },
  { to: "/orders", label: "Riwayat", icon: Coffee },
  { to: "/profile", label: "Profile", icon: User },
];

function ProfilePage() {
  const {
    userName,
    guest,
    orders,
    saved,
    resetCreation,
    signOutAccount,
    userId,
    points,
    plans,
    addPlan,
    setPlanActive,
    removePlan,
    isAdmin,
    isBarista,
  } = useBarista();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/profile" });
  const [drink, setDrink] = useState("");
  const [freq, setFreq] = useState("weekly");
  const [nextDate, setNextDate] = useState("");
  const [planError, setPlanError] = useState<string | null>(null);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOutAccount();
    localStorage.removeItem("scoffey-entered");
    navigate({ to: "/", replace: true });
  }

  async function handleAddPlan(e: React.FormEvent) {
    e.preventDefault();
    setPlanError(null);
    try {
      await addPlan({ drink_name: drink.trim(), frequency: freq, next_date: nextDate || null });
      setDrink("");
      setNextDate("");
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : t("Gagal menyimpan rencana."));
    }
  }

  return (
    <PhoneShell title={t("PROFIL")} back="/home" nav navItems={isBarista || isAdmin ? staffNav : undefined}>
      <section className="mt-3 flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-4 md:gap-6 md:p-6">
        <div className="surface-gold flex size-14 shrink-0 items-center justify-center rounded-full text-xl text-primary-foreground md:size-20 md:text-3xl">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-semibold text-foreground md:text-2xl">{userName}</p>
          <p className="text-xs text-muted-foreground">
            {guest ? t("Mode Guest — buat akun untuk menyimpan semuanya") : t("Member Scoffey")}
          </p>
          {userId && (
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-primary">
              <Sparkles className="size-4" /> {points} {t("poin")}
            </p>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-card/60 p-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" />
          <h3 className="label-caps text-primary">{t("Rencana langganan")}</h3>
        </div>
        {userId ? (
          <>
            <form className="mt-3 grid gap-2 sm:grid-cols-4" onSubmit={handleAddPlan}>
              <input
                value={drink}
                onChange={(e) => setDrink(e.target.value)}
                required
                placeholder={t("Nama minuman")}
                className="rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground sm:col-span-2"
              />
              <select
                value={freq}
                onChange={(e) => setFreq(e.target.value)}
                className="rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground"
              >
                <option value="daily">{t("Harian")}</option>
                <option value="weekly">{t("Mingguan")}</option>
                <option value="monthly">{t("Bulanan")}</option>
              </select>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground"
              />
              <button
                type="submit"
                className="rounded-xl border border-primary/60 px-3 py-2 text-sm font-semibold text-primary sm:col-span-4"
              >
                {t("Tambah rencana")}
              </button>
            </form>
            {planError && <p className="mt-2 text-sm text-destructive">{planError}</p>}
            <ul className="mt-3 space-y-2">
              {plans.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="text-foreground">{p.drink_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.frequency}
                      {p.next_date ? ` · ${p.next_date}` : ""} · {p.active ? t("aktif") : t("jeda")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void setPlanActive(p.id, !p.active)}
                      className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground"
                    >
                      {p.active ? t("Jeda") : t("Aktifkan")}
                    </button>
                    <button
                      type="button"
                      aria-label={t("Hapus rencana")}
                      onClick={() => void removePlan(p.id)}
                      className="text-muted-foreground"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
              {!plans.length && (
                <li className="text-sm text-muted-foreground">{t("Belum ada rencana.")}</li>
              )}
            </ul>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Masuk atau daftar untuk menyimpan rencana langganan.")}
          </p>
        )}
      </section>


      <div className="md:mt-8 md:grid md:grid-cols-2 md:items-start md:gap-8">
        <section className="mt-5 md:mt-0">
          <div className="flex items-center gap-2">
            <Heart className="size-4 text-primary" />
            <h3 className="label-caps text-primary">{t("Kreasi tersimpan")}</h3>
          </div>
          {saved.length ? (
            <ul className="mt-3 space-y-2">
              {saved.map((s) => (
                <li
                  key={s}
                  className="rounded-2xl border border-border bg-card/60 px-4 py-3 text-sm text-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{t("Belum ada kreasi tersimpan.")}</p>
          )}
        </section>

        <section className="mt-5 md:mt-0">
          <div className="flex items-center gap-2">
            <Coffee className="size-4 text-primary" />
            <h3 className="label-caps text-primary">{t("Riwayat pesanan")}</h3>
          </div>
          {orders.length ? (
            <ul className="mt-3 space-y-2">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="rounded-2xl border border-border bg-card/60 px-4 py-3 text-sm"
                >
                  <div className="flex justify-between">
                    <span className="text-foreground">{o.name}</span>
                    <span className="text-primary">{formatIDR(o.price)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    #{o.id} · Match {o.matchScore}% ·{" "}
                    {new Date(o.when).toLocaleString(getLang() === "id" ? "id-ID" : "en-US")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{t("Belum ada pesanan.")}</p>
          )}
        </section>
      </div>

      <div className="mt-6 space-y-3 md:mt-10 md:grid md:max-w-xl md:grid-cols-2 md:gap-4 md:space-y-0">
        <OutlineButton onClick={resetCreation}>{t("Reset Racikan Saat Ini")}</OutlineButton>
        <Link
          to="/orders"
          className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 py-3.5 text-sm font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-accent"
        >
          <ClipboardList className="size-4" /> {t("Riwayat Pesanan")}
        </Link>
        {isBarista && (
          <Link
            to="/barista"
            className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 py-3.5 text-sm font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-accent"
          >
            <Coffee className="size-4" /> {t("Panel Barista")}
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 py-3.5 text-sm font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-accent"
          >
            <BarChart3 className="size-4" /> {t("Dashboard Admin")}
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm font-semibold tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-primary"
        >
          <LogOut className="size-4" /> {t("Keluar")}
        </button>
      </div>
    </PhoneShell>
  );
}
