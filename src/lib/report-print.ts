import { formatIDR } from "./barista-data";
import { getLang, t } from "./i18n";

export type ReportRow = {
  code: string;
  customer: string;
  name: string;
  total: number;
  payment: string;
  status: string;
  created_at: string;
};

export type ReportRecap = {
  name: string;
  emoji: string;
  baru: number;
  diproses: number;
  selesai: number;
  sold: number;
};

const STATUS: Record<string, string> = {
  baru: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
};

export function isToday(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

function esc(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);
}

/** Buka jendela cetak berisi laporan penjualan hari ini. */
export function printDailyReport(rows: ReportRow[], recap: ReportRecap[]) {
  const now = new Date();
  const locale = getLang() === "id" ? "id-ID" : "en-GB";
  const tanggal = now.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const jam = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const omzet = rows.reduce((s, r) => s + r.total, 0);
  const count = (k: string) => rows.filter((r) => (r.status || "baru") === k).length;

  const orderRows = rows.length
    ? rows
        .map(
          (r) => `<tr>
      <td>${new Date(r.created_at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}</td>
      <td>${esc(r.code)}</td>
      <td>${esc(r.customer || "-")}</td>
      <td>${esc(r.name)}</td>
      <td>${esc(r.payment || "-")}</td>
      <td>${esc(t(STATUS[r.status || "baru"] ?? r.status))}</td>
      <td class="r">${formatIDR(r.total)}</td>
    </tr>`,
        )
        .join("")
    : `<tr><td colspan="7" class="c">${esc(t("Belum ada pesanan hari ini."))}</td></tr>`;

  const recapRows = recap
    .filter((m) => m.sold > 0)
    .map(
      (m) => `<tr>
      <td>${esc(`${m.emoji ? m.emoji + " " : ""}${m.name}`)}</td>
      <td class="r">${m.sold}</td>
      <td class="r">${m.baru}</td>
      <td class="r">${m.diproses}</td>
      <td class="r">${m.selesai}</td>
    </tr>`,
    )
    .join("");

  const html = `<!doctype html><html lang="${getLang()}"><head><meta charset="utf-8">
<title>${esc(t("Laporan Harian Scoffey"))} — ${tanggal}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:ui-sans-serif,system-ui,Arial,sans-serif;color:#1b1410;margin:32px;font-size:12px}
  h1{font-size:18px;margin:0 0 2px}
  .sub{color:#7a6a5f;margin:0 0 18px}
  .cards{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}
  .card{border:1px solid #e2d8d0;border-radius:10px;padding:8px 14px;min-width:110px}
  .card b{display:block;font-size:15px}
  .card span{color:#7a6a5f;font-size:10px;text-transform:uppercase;letter-spacing:.06em}
  h2{font-size:13px;margin:18px 0 6px}
  table{width:100%;border-collapse:collapse}
  th,td{border-bottom:1px solid #e8e0da;padding:5px 6px;text-align:left}
  th{background:#f7f2ee;font-size:10px;text-transform:uppercase;letter-spacing:.06em}
  .r{text-align:right}.c{text-align:center;color:#7a6a5f}
  tfoot td{font-weight:700;border-top:2px solid #d8ccc3}
  @media print{body{margin:12mm}}
</style></head><body>
<h1>${esc(t("Laporan Penjualan Harian — Scoffey"))}</h1>
<p class="sub">${tanggal} · ${esc(t("dicetak"))} ${jam}</p>
<div class="cards">
  <div class="card"><b>${rows.length}</b><span>${esc(t("Pesanan"))}</span></div>
  <div class="card"><b>${formatIDR(omzet)}</b><span>${esc(t("Omzet"))}</span></div>
  <div class="card"><b>${count("baru")}</b><span>${esc(t("Menunggu"))}</span></div>
  <div class="card"><b>${count("diproses")}</b><span>${esc(t("Diproses"))}</span></div>
  <div class="card"><b>${count("selesai")}</b><span>${esc(t("Selesai"))}</span></div>
</div>
<h2>${esc(t("Daftar Pesanan"))}</h2>
<table><thead><tr><th>${esc(t("Jam"))}</th><th>${esc(t("Kode"))}</th><th>${esc(t("Pelanggan"))}</th><th>${esc(t("Menu"))}</th><th>${esc(t("Bayar"))}</th><th>${esc(t("Status"))}</th><th class="r">Total</th></tr></thead>
<tbody>${orderRows}</tbody>
<tfoot><tr><td colspan="6">${esc(t("Total"))}</td><td class="r">${formatIDR(omzet)}</td></tr></tfoot></table>
${recapRows ? `<h2>${esc(t("Rekap Menu"))}</h2><table><thead><tr><th>${esc(t("Menu"))}</th><th class="r">${esc(t("Semua"))}</th><th class="r">${esc(t("Menunggu"))}</th><th class="r">${esc(t("Diproses"))}</th><th class="r">${esc(t("Selesai"))}</th></tr></thead><tbody>${recapRows}</tbody></table>` : ""}
<script>window.onload=function(){window.print()}</script>
</body></html>`;

  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  return true;
}
