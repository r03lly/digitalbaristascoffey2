import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  ClipboardList,
  Coffee,
  CupSoda,
  Download,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Timer,
  User,
} from "lucide-react";
import { PhoneShell, SectionLabel } from "@/components/PhoneShell";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR } from "@/lib/barista-data";
import { useBarista } from "@/lib/barista-store";
import { rowToOrder } from "@/lib/orders-db";
import { downloadReceipt } from "@/lib/receipt";
import { getLang, t } from "@/lib/i18n";
import { fetchMenuItems, type MenuRow } from "@/lib/menu-db";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Riwayat Pesanan — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Lihat riwayat pesanan Scoffey: racikan sebelumnya, status penyajian, dan struk digital.",
      },
      { property: "og:title", content: "Riwayat Pesanan — Digital Barista by Scoffey" },
      {
        property: "og:description",
        content: "Riwayat pesanan pelanggan dan antrean pengambilan pesanan untuk barista.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrdersPage,
});

type Row = {
  id: string;
  code: string;
  user_id: string | null;
  customer: string;
  name: string;
  price: number;
  tax: number;
  service: number;
  tip: number;
  total: number;
  match_score: number;
  payment: string;
  option: string;
  note: string;
  kind: string;
  status: string;
  lines: unknown;
  created_at: string;
};

type Line = { label?: string; name?: string; amount?: string; value?: string };

function qtyOf(amount?: string) {
  const m = /^\s*(\d+)\s*x/i.exec(amount ?? "");
  return m ? Number(m[1]) : 1;
}

const STATUS_LABEL: Record<string, string> = {
  baru: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
};

const FILTERS = [
  { key: "semua", label: "Semua" },
  { key: "baru", label: "Menunggu" },
  { key: "diproses", label: "Diproses" },
  { key: "selesai", label: "Selesai" },
] as const;
type Filter = (typeof FILTERS)[number]["key"];

function OrdersPage() {
  const { userId, isBarista, isAdmin, authReady } = useBarista();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("semua");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuRow[]>([]);

  const locale = getLang() === "id" ? "id-ID" : "en-US";

  const load = useCallback(async () => {
    let q = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (!isBarista) {
      if (!userId) {
        setRows([]);
        setLoading(false);
        return;
      }
      q = q.eq("user_id", userId);
    }
    const { data, error: err } = await q;
    if (err) setError(err.message);
    else {
      setError(null);
      setRows((data ?? []) as Row[]);
    }
    setLoading(false);
  }, [isBarista, userId]);

  useEffect(() => {
    if (!authReady) return;
    void load();
    if (!isBarista) return;
    const channel = supabase
      .channel("orders-history")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => void load())
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [authReady, isBarista, load]);

  useEffect(() => {
    if (!isBarista) return;
    void fetchMenuItems()
      .then(setMenu)
      .catch(() => setMenu([]));
  }, [isBarista]);

  const list = useMemo(() => {
    const s = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "semua" || (r.status || "baru") === filter) &&
        (!s ||
          r.name.toLowerCase().includes(s) ||
          r.customer.toLowerCase().includes(s) ||
          r.code.toLowerCase().includes(s)),
    );
  }, [rows, filter, query]);

  const spend = useMemo(() => rows.reduce((sum, r) => sum + r.total, 0), [rows]);

  /** Jumlah pesanan per status untuk ditampilkan sebagai angka di tombol filter. */
  const statusCount = useMemo(() => {
    const c: Record<Filter, number> = { semua: rows.length, baru: 0, diproses: 0, selesai: 0 };
    rows.forEach((r) => {
      const s = (r.status || "baru") as Filter;
      if (s === "baru" || s === "diproses" || s === "selesai") c[s] += 1;
    });
    return c;
  }, [rows]);


  /** Rekap per menu (khusus staf): jumlah terjual dan statusnya. */
  const menuRecap = useMemo(() => {
    const stat = new Map<
      string,
      { label: string; baru: number; diproses: number; selesai: number }
    >();
    const add = (name: string, status: string, qty: number) => {
      const label = name.trim();
      const key = label.toLowerCase();
      if (!key) return;
      const cur = stat.get(key) ?? { label, baru: 0, diproses: 0, selesai: 0 };
      const s = status === "diproses" ? "diproses" : status === "selesai" ? "selesai" : "baru";
      cur[s] += qty;
      stat.set(key, cur);
    };
    rows.forEach((r) => {
      const lines = Array.isArray(r.lines) ? (r.lines as Line[]) : [];
      const status = r.status || "baru";
      if (r.kind === "regular" && lines.length) {
        lines.forEach((l) => add(String(l.name ?? l.label ?? ""), status, qtyOf(l.amount)));
      } else {
        add(r.name, status, 1);
      }
    });
    const known = new Set(menu.map((m) => m.name.trim().toLowerCase()));
    const items = menu.map((m) => {
      const s = stat.get(m.name.trim().toLowerCase()) ?? { baru: 0, diproses: 0, selesai: 0 };
      return {
        name: m.name,
        emoji: m.emoji,
        baru: s.baru,
        diproses: s.diproses,
        selesai: s.selesai,
        sold: s.baru + s.diproses + s.selesai,
      };
    });
    const extras = [...stat.entries()]
      .filter(([k]) => !known.has(k))
      .map(([, v]) => ({
        name: v.label,
        emoji: "✨",
        baru: v.baru,
        diproses: v.diproses,
        selesai: v.selesai,
        sold: v.baru + v.diproses + v.selesai,
      }));
    return [...items, ...extras].sort((a, b) => b.sold - a.sold || a.name.localeCompare(b.name));
  }, [rows, menu]);

  async function setStatus(id: string, status: "baru" | "diproses" | "selesai") {
    setBusyId(id);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    const { error: err } = await supabase.from("orders").update({ status }).eq("id", id);
    if (err) {
      setError(err.message);
      void load();
    }
    setBusyId(null);
  }

  const staffNav = [
    { to: "/orders", label: "Riwayat", icon: ClipboardList },
    { to: "/barista", label: "Pesanan", icon: Coffee },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const title = isBarista ? t("Pesanan Masuk") : t("Riwayat Pesanan");

  if (!authReady) {
    return (
      <PhoneShell title={title} back="/profile" nav>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {t("Memuat…")}
        </p>
      </PhoneShell>
    );
  }

  if (!userId) {
    return (
      <PhoneShell title={title} back="/home" nav>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("Masuk ke akunmu untuk melihat riwayat pesanan sebelumnya.")}
        </p>
        <Link
          to="/auth"
          className="mt-4 inline-flex rounded-2xl border border-primary/60 px-4 py-2.5 text-sm font-semibold text-primary"
        >
          {t("Masuk / Daftar")}
        </Link>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell
      title={title}
      back={isBarista ? "/barista" : "/profile"}
      nav
      navItems={isBarista || isAdmin ? staffNav : undefined}
    >
      <div className="mt-1 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5 text-center">
          <p className="text-lg font-bold text-foreground">{rows.length}</p>
          <p className="label-caps text-muted-foreground">{t("Total pesanan")}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5 text-center">
          <p className="text-lg font-bold text-primary">{formatIDR(spend)}</p>
          <p className="label-caps text-muted-foreground">
            {isBarista ? t("Nilai pesanan") : t("Total belanja")}
          </p>
        </div>
      </div>

      {isBarista && (
        <>
          <div className="mt-4">
            <SectionLabel>{t("Rekap menu")}</SectionLabel>
          </div>
          <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-card/60">
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 border-b border-border/60 px-3 py-2 text-[0.6rem] uppercase tracking-[0.08em] text-muted-foreground">
              <span>{t("Menu")}</span>
              <span className="text-right">{t("Laku")}</span>
              <span className="text-right">{t("Dipesan")}</span>
              <span className="text-right">{t("Diproses")}</span>
              <span className="text-right">{t("Diserahkan")}</span>
            </div>
            {menuRecap.length ? (
              <ul className="divide-y divide-border/40">
                {menuRecap.map((m) => (
                  <li
                    key={m.name}
                    className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 px-3 py-2 text-xs"
                  >
                    <span className="truncate text-foreground">
                      {m.emoji ? `${m.emoji} ` : ""}
                      {m.name}
                    </span>
                    <span className="w-8 text-right font-semibold text-primary">{m.sold}</span>
                    <span className="w-8 text-right text-muted-foreground">{m.baru}</span>
                    <span className="w-8 text-right text-muted-foreground">{m.diproses}</span>
                    <span className="w-8 text-right text-muted-foreground">{m.selesai}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-3 text-xs text-muted-foreground">
                {t("Menu belum tersedia.")}
              </p>
            )}
          </div>
        </>
      )}

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
          {isBarista ? t("Ambil pesanan") : t("Pesanan sebelumnya")}
        </SectionLabel>
      </div>

      <label className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-card/60 px-3 py-2.5">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Cari nama, pelanggan, atau kode…")}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </label>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-2xl border px-2 py-2 text-center ${
              filter === key
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            <span className="block text-base font-bold leading-none">{statusCount[key]}</span>
            <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.06em]">
              {t(label)}
            </span>
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
            const status = o.status || "baru";
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
                      {new Date(o.created_at).toLocaleString(locale)}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-primary">{formatIDR(o.total)}</p>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold ${
                      status === "selesai"
                        ? "border border-primary/40 bg-primary/10 text-primary"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    {t(STATUS_LABEL[status] ?? status)}
                  </span>
                  {o.match_score > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-accent/30 px-2 py-0.5 text-[0.68rem] font-semibold text-primary">
                      <Sparkles className="size-3" /> Match {o.match_score}%
                    </span>
                  )}
                </div>

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
                  <p className="mt-3 rounded-xl border border-primary/30 bg-accent/30 px-3 py-2 text-xs text-foreground">
                    “{o.note}”
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {isBarista ? (
                    <>
                      {status === "baru" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void setStatus(o.id, "diproses")}
                          className="inline-flex items-center gap-1 rounded-xl border border-primary/60 px-3 py-1.5 text-xs font-semibold text-primary disabled:opacity-50"
                        >
                          <Timer className="size-3" /> {t("Ambil pesanan")}
                        </button>
                      )}
                      {status !== "selesai" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void setStatus(o.id, "selesai")}
                          className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground disabled:opacity-50"
                        >
                          <Check className="size-3" /> {t("Selesai")}
                        </button>
                      )}
                      {status === "selesai" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void setStatus(o.id, "baru")}
                          className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground disabled:opacity-50"
                        >
                          {t("Buka lagi")}
                        </button>
                      )}
                    </>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void downloadReceipt(rowToOrder(o))}
                    className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    <Download className="size-3" /> {t("Unduh struk")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{t("Belum ada pesanan.")}</p>
      )}
    </PhoneShell>
  );
}
