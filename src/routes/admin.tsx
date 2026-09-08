import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Receipt, TrendingUp } from "lucide-react";
import { PhoneShell, SectionLabel } from "@/components/PhoneShell";
import { AdminAccounts } from "@/components/AdminAccounts";
import { formatIDR } from "@/lib/barista-data";
import { useBarista } from "@/lib/barista-store";
import { downloadReceipt } from "@/lib/receipt";
import { getLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Laporan Transaksi & Keuangan — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Dashboard barista/admin Scoffey: rekap transaksi, pendapatan, pajak, biaya layanan, dan tip barista.",
      },
      { property: "og:title", content: "Laporan Transaksi & Keuangan — Digital Barista" },
      {
        property: "og:description",
        content: "Rekap penjualan harian, metode pembayaran, dan catatan tip barista.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type RangeKey = "today" | "week" | "month" | "year";

const RANGES: { id: RangeKey; label: string }[] = [
  { id: "today", label: "Harian" },
  { id: "week", label: "Mingguan" },
  { id: "month", label: "Bulanan" },
  { id: "year", label: "Tahunan" },
];

function inRange(when: string, range: RangeKey) {
  const d = new Date(when);
  const now = new Date();
  if (range === "today") return d.toDateString() === now.toDateString();
  if (range === "week") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);
    return d >= start && d <= now;
  }
  if (range === "month")
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  return d.getFullYear() === now.getFullYear();
}

function AdminPage() {
  const { dbOrders, isAdmin, authReady } = useBarista();
  const orders = dbOrders;
  const [range, setRange] = useState<RangeKey>("today");


  const rows = useMemo(() => orders.filter((o) => inRange(o.when, range)), [orders, range]);

  const sum = (pick: (o: (typeof rows)[number]) => number) =>
    rows.reduce((s, o) => s + pick(o), 0);

  const net = sum((o) => o.price);
  const tax = sum((o) => o.tax);
  const service = sum((o) => o.service);
  const tip = sum((o) => o.tip);
  const gross = sum((o) => o.total);
  const avg = rows.length ? Math.round(gross / rows.length) : 0;

  const byPayment = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    rows.forEach((o) => {
      const key = o.payment;
      const prev = map.get(key) ?? { count: 0, total: 0 };
      map.set(key, { count: prev.count + 1, total: prev.total + o.total });
    });
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [rows]);

  const locale = getLang() === "id" ? "id-ID" : "en-US";

  /** Rekap 7 hari terakhir: pendapatan, jumlah transaksi, pesan manis, tip. */
  const daily = useMemo(() => {
    const days: {
      key: string;
      label: string;
      total: number;
      count: number;
      notes: number;
      tip: number;
    }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push({
        key: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString(locale, { day: "2-digit", month: "short" }),
        total: 0,
        count: 0,
        notes: 0,
        tip: 0,
      });
    }
    orders.forEach((o) => {
      const key = new Date(o.when).toISOString().slice(0, 10);
      const day = days.find((x) => x.key === key);
      if (!day) return;
      day.total += o.total;
      day.count += 1;
      day.tip += o.tip;
      if (o.note?.trim()) day.notes += 1;
    });
    return days;
  }, [orders, locale]);

  /** Rekap 6 bulan terakhir. */
  const monthly = useMemo(() => {
    const months: { key: string; label: string; total: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      d.setMonth(d.getMonth() - i);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString(locale, { month: "short" }),
        total: 0,
        count: 0,
      });
    }
    orders.forEach((o) => {
      const d = new Date(o.when);
      const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (!m) return;
      m.total += o.total;
      m.count += 1;
    });
    return months;
  }, [orders, locale]);

  const signature = rows.filter((o) => o.kind === "signature").length;
  const regular = rows.length - signature;

  if (authReady && !isAdmin) {
    return (
      <PhoneShell title={t("DASHBOARD ADMIN")} back="/profile">
        <p className="mt-4 text-sm text-muted-foreground">
          {t("Halaman ini khusus untuk admin Scoffey.")}
        </p>
        <Link
          to="/auth"
          className="mt-4 inline-flex rounded-2xl border border-primary/60 px-4 py-2.5 text-sm font-semibold text-primary"
        >
          {t("Masuk sebagai admin")}
        </Link>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell title={t("DASHBOARD ADMIN")} back="/profile" nav>
      <p className="mt-3 text-sm text-muted-foreground">
        {t("Rekap transaksi dan keuangan untuk akun admin Scoffey.")}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          to="/barista"
          className="inline-flex rounded-xl border border-primary/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary"
        >
          {t("Buka antrian pesanan")}
        </Link>
        <Link
          to="/admin-menu"
          className="inline-flex rounded-xl border border-primary/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary"
        >
          {t("Kelola menu & harga")}
        </Link>
      </div>




      <div className="mt-4 flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRange(r.id)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase transition-colors ${
              range === r.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card/60 text-muted-foreground"
            }`}
          >
            {t(r.label)}
          </button>
        ))}
      </div>

      <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label={t("Total penerimaan")} value={formatIDR(gross)} accent />
        <Stat label={t("Jumlah transaksi")} value={String(rows.length)} />
        <Stat label={t("Rata-rata per transaksi")} value={formatIDR(avg)} />
        <Stat label={t("Tip barista")} value={formatIDR(tip)} accent />
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-card/60 p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <h3 className="label-caps text-primary">{t("Rincian keuangan")}</h3>
        </div>
        <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
          <Row label={t("Penjualan minuman (net)")} value={formatIDR(net)} />
          <Row label={t("Pajak (11%)")} value={formatIDR(tax)} />
          <Row label={t("Biaya layanan")} value={formatIDR(service)} />
          <Row label={t("Tip barista (kategori khusus)")} value={formatIDR(tip)} />
          <div className="flex justify-between border-t border-border pt-2">
            <dt className="label-caps text-foreground">{t("Total penerimaan")}</dt>
            <dd className="display-title text-xl font-bold text-primary">{formatIDR(gross)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          {t("Racikan signature")}: {signature} · {t("Menu reguler")}: {regular}
        </p>
      </section>

      <section className="mt-5">
        <SectionLabel>{t("Pendapatan harian")}</SectionLabel>
        <BarChart
          data={daily.map((d) => ({ label: d.label, value: d.total }))}
          empty={t("Belum ada data untuk grafik.")}
        />
      </section>

      <section className="mt-5">
        <SectionLabel>{t("Pendapatan bulanan")}</SectionLabel>
        <BarChart
          data={monthly.map((m) => ({ label: m.label, value: m.total }))}
          empty={t("Belum ada data untuk grafik.")}
        />
      </section>

      <section className="mt-5">
        <SectionLabel>{t("Pesan manis & tip harian")}</SectionLabel>
        <ul className="mt-2 space-y-2">
          {daily.map((d) => (
            <li
              key={d.key}
              className="flex items-center justify-between rounded-2xl border border-border bg-card/60 px-4 py-3 text-sm"
            >
              <span className="text-foreground">{d.label}</span>
              <span className="text-xs text-muted-foreground">
                {d.count} {t("transaksi")} · {d.notes} {t("pesan")} ·{" "}
                <span className="text-primary">{formatIDR(d.tip)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <SectionLabel>{t("Metode pembayaran")}</SectionLabel>
        {byPayment.length ? (
          <ul className="mt-2 space-y-2">
            {byPayment.map(([name, v]) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-2xl border border-border bg-card/60 px-4 py-3 text-sm"
              >
                <span className="text-foreground">{name}</span>
                <span className="text-muted-foreground">
                  {v.count}x · <span className="text-primary">{formatIDR(v.total)}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">{t("Belum ada transaksi.")}</p>
        )}
      </section>

      <section className="mt-5">
        <SectionLabel>{t("Daftar transaksi")}</SectionLabel>
        {rows.length ? (
          <ul className="mt-2 space-y-2">
            {rows.map((o) => (
              <li key={o.id} className="rounded-2xl border border-border bg-card/60 p-4 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-foreground">{o.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      #{o.id} ·{" "}
                      {new Date(o.when).toLocaleString(getLang() === "id" ? "id-ID" : "en-US")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {o.customer} · {o.option} · {o.payment}
                      {o.tip > 0 ? ` · ${t("tip")} ${formatIDR(o.tip)}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-primary">{formatIDR(o.total)}</p>
                    <button
                      type="button"
                      onClick={() => void downloadReceipt(o)}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[0.68rem] uppercase text-muted-foreground"
                    >
                      <Download className="size-3" /> {t("Nota")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Receipt className="size-4" /> {t("Belum ada transaksi pada rentang ini.")}
          </p>
        )}
      </section>

      {isAdmin && <AdminAccounts />}

      <div className="mt-6">
        <Link
          to="/profile"
          className="flex items-center justify-center rounded-2xl border border-border py-3.5 text-sm font-semibold tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-primary"
        >
          {t("Kembali ke Profil")}
        </Link>
      </div>
    </PhoneShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-3">
      <p className="text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p
        className={`display-title mt-1 text-lg font-bold ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

function BarChart({
  data,
  empty,
}: {
  data: { label: string; value: number }[];
  empty: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 0);
  if (!max) return <p className="mt-2 text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="mt-2 rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex h-36 items-end gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[0.6rem] text-muted-foreground">
              {d.value ? Math.round(d.value / 1000) + "k" : ""}
            </span>
            <div
              className="w-full rounded-t-md bg-primary/80"
              style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
              aria-hidden="true"
            />
            <span className="text-[0.6rem] tracking-tight text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
