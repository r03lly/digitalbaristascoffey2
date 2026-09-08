import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarClock,
  Check,
  Coffee,
  CupSoda,
  Heart,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Timer,
} from "lucide-react";
import { PhoneShell, SectionLabel } from "@/components/PhoneShell";
import { User, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR } from "@/lib/barista-data";
import { useBarista } from "@/lib/barista-store";
import { getLang, t } from "@/lib/i18n";


export const Route = createFileRoute("/barista")({
  head: () => ({
    meta: [
      { title: "Panel Barista — Antrian Pesanan | Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Antrian pesanan Scoffey untuk barista: pesanan masuk, rincian racikan, dan status penyajian.",
      },
      { property: "og:title", content: "Panel Barista — Antrian Pesanan" },
      {
        property: "og:description",
        content: "Antrian pesanan dan racikan pelanggan untuk barista Scoffey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BaristaPanel,
});

type Order = {
  id: string;
  code: string;
  customer: string;
  name: string;
  kind: string;
  total: number;
  tip: number;
  payment: string;
  option: string;
  note: string;
  match_score: number;
  status: string;
  lines: unknown;
  created_at: string;
};

type Line = { label?: string; name?: string; amount?: string; value?: string };

const TABS = [
  { key: "baru", label: "Baru", icon: Coffee },
  { key: "diproses", label: "Diproses", icon: Timer },
  { key: "selesai", label: "Selesai", icon: Check },
] as const;
type Tab = (typeof TABS)[number]["key"];

function timeAgo(iso: string, idLocale: boolean) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return idLocale ? "baru saja" : "just now";
  if (mins < 60) return idLocale ? `${mins} mnt lalu` : `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return idLocale ? `${hrs} jam lalu` : `${hrs} h ago`;
  return new Date(iso).toLocaleDateString(idLocale ? "id-ID" : "en-US");
}

function BaristaPanel() {
  const { isBarista, isAdmin, authReady } = useBarista();
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("baru");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const idLocale = getLang() === "id";
  const locale = idLocale ? "id-ID" : "en-US";

  const load = useCallback(async () => {
    let q = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    // Barista hanya melihat rekap pesanan hari ini; admin melihat semua hari.
    if (!isAdmin) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      q = q.gte("created_at", start.toISOString());
    }
    const { data, error: err } = await q;
    if (err) setError(err.message);
    else {
      setError(null);
      setRows((data ?? []) as Order[]);
    }
    setLoading(false);
  }, [isAdmin]);


  useEffect(() => {
    if (!isBarista) return;
    void load();
    const channel = supabase
      .channel("barista-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () =>
        void load(),
      )
      .subscribe();
    const poll = setInterval(() => void load(), 30000);
    return () => {
      void supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [isBarista, load]);


  const counts = useMemo(() => {
    const c: Record<string, number> = { baru: 0, diproses: 0, selesai: 0 };
    rows.forEach((r) => (c[r.status || "baru"] = (c[r.status || "baru"] ?? 0) + 1));
    return c;
  }, [rows]);


  const today = useMemo(() => {
    const key = new Date().toDateString();
    const list = rows.filter((r) => new Date(r.created_at).toDateString() === key);
    return {
      count: list.length,
      done: list.filter((r) => (r.status || "baru") === "selesai").length,
      total: list.reduce((s, r) => s + r.total, 0),
      tip: list.reduce((s, r) => s + r.tip, 0),
    };
  }, [rows]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (r.status || "baru") === tab &&
        (!q ||
          r.name.toLowerCase().includes(q) ||
          r.customer.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q)),
    );
  }, [rows, tab, query]);

  async function setStatus(id: string, status: Tab) {
    setBusyId(id);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    const { error: err } = await supabase.from("orders").update({ status }).eq("id", id);
    if (err) {
      setError(err.message);
      void load();
    }
    setBusyId(null);
  }

  const baristaNav = [
    { to: "/barista", label: "Pesanan", icon: ClipboardList },
    { to: "/orders", label: "Riwayat", icon: CalendarClock },
    { to: "/profile", label: "Profile", icon: User },
  ];

  if (!authReady) {
    return (
      <PhoneShell title={t("Panel Barista")} back="/profile" nav navItems={baristaNav}>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {t("Memuat…")}
        </p>
      </PhoneShell>
    );
  }

  if (!isBarista) {
    return (
      <PhoneShell title={t("Panel Barista")} back="/profile" nav navItems={baristaNav}>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("Halaman ini khusus untuk barista dan admin Scoffey.")}
        </p>
        <Link
          to="/auth"
          className="mt-4 inline-flex rounded-2xl border border-primary/60 px-4 py-2.5 text-sm font-semibold text-primary"
        >
          {t("Masuk sebagai staf")}
        </Link>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell title={t("Panel Barista")} back="/profile" nav navItems={baristaNav}>
      {/* Rekap harian */}
      <div className="mt-1 rounded-2xl border border-border bg-card/60 p-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" />
          <h3 className="label-caps text-primary">{t("Rekap hari ini")}</h3>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          <RecapStat label={t("Pesanan masuk")} value={String(today.count)} />
          <RecapStat label={t("Selesai disajikan")} value={String(today.done)} />
          <RecapStat label={t("Omzet")} value={formatIDR(today.total)} accent />
          <RecapStat label={t("Tip diterima")} value={formatIDR(today.tip)} accent />
        </div>
      </div>

      {/* Ringkasan status */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {TABS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="rounded-2xl border border-border bg-card/60 px-3 py-2.5 text-center"
          >
            <Icon className="mx-auto size-4 text-primary" />
            <p className="mt-1 text-lg font-bold text-foreground">{counts[key] ?? 0}</p>
            <p className="label-caps text-muted-foreground">{t(label)}</p>
          </div>
        ))}
      </div>


      <div className="mt-4">
        <SectionLabel
          action={
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void load();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[0.68rem] uppercase text-muted-foreground"
            >
              <RefreshCw className="size-3" /> {t("Muat ulang")}
            </button>
          }
        >
          {t("Antrian pesanan")}
        </SectionLabel>
      </div>

      {/* Cari pesanan */}
      <label className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-card/60 px-3 py-2.5">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Cari nama, pelanggan, atau kode…")}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </label>

      {/* Tab status */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-2xl border px-2 py-2 text-xs font-semibold uppercase tracking-[0.08em] ${
              tab === key
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            {t(label)} · {counts[key] ?? 0}
          </button>
        ))}
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {t("Memuat…")}
        </p>
      ) : list.length ? (
        <ul className="mt-4 space-y-3">
          {list.map((o) => {
            const lines = Array.isArray(o.lines) ? (o.lines as Line[]) : [];
            const busy = busyId === o.id;
            return (
              <li key={o.id} className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-semibold text-foreground">
                      <CupSoda className="size-4 shrink-0 text-primary" />
                      <span className="truncate">{o.name}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      #{o.code} · {o.customer} · {o.option} · {o.payment}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(o.created_at, idLocale)} ·{" "}
                      {new Date(o.created_at).toLocaleTimeString(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-primary">{formatIDR(o.total)}</p>
                </div>

                {o.match_score > 0 && (
                  <p className="mt-2 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-accent/30 px-2 py-0.5 text-[0.68rem] font-semibold text-primary">
                    <Sparkles className="size-3" /> Match {o.match_score}%
                  </p>
                )}

                {lines.length > 0 && (
                  <ul className="mt-3 space-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    {lines.map((l, i) => (
                      <li key={i} className="flex justify-between gap-3">
                        <span>{l.label ?? l.name}</span>
                        <span className="text-foreground">{l.amount ?? l.value}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {o.note?.trim() && (
                  <p className="mt-3 flex items-start gap-1.5 rounded-xl border border-primary/30 bg-accent/30 px-3 py-2 text-xs text-foreground">
                    <Heart className="mt-0.5 size-3 shrink-0 text-primary" />
                    <span>
                      “{o.note}”{o.tip > 0 ? ` · ${t("tip")} ${formatIDR(o.tip)}` : ""}
                    </span>
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  {o.status !== "diproses" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void setStatus(o.id, "diproses")}
                      className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground disabled:opacity-50"
                    >
                      <Timer className="size-3" /> {t("Sudah diproses")}
                    </button>
                  )}
                  {o.status !== "selesai" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void setStatus(o.id, "selesai")}
                      className="inline-flex items-center gap-1 rounded-xl border border-primary/60 px-3 py-1.5 text-xs font-semibold text-primary disabled:opacity-50"
                    >
                      <Check className="size-3" /> {t("Selesai")}
                    </button>
                  )}
                  {o.status === "selesai" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void setStatus(o.id, "baru")}
                      className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground disabled:opacity-50"
                    >
                      {t("Buka lagi")}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Coffee className="size-4" /> {t("Tidak ada pesanan pada status ini.")}
        </p>
      )}
    </PhoneShell>
  );
}

function RecapStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p
        className={`display-title mt-1 text-base font-bold ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}
