import { jsPDF } from "jspdf";
import { formatIDR } from "@/lib/barista-data";
import type { Order } from "@/lib/barista-store";

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

/** Bangun nota pembelian dalam bentuk PDF (jsPDF). */
export function buildReceiptPdf(order: Order): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: [80, 200] });
  const left = 6;
  const right = 74;
  let y = 12;

  const line = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, left, y);
    doc.text(value, right, y, { align: "right" });
    y += 5;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("DIGITAL BARISTA", 40, y, { align: "center" });
  y += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("by Scoffey", 40, y, { align: "center" });
  y += 6;
  doc.setFontSize(8);
  doc.text(`Nota #${order.id}`, 40, y, { align: "center" });
  y += 4;
  doc.text(dateLabel(order.when), 40, y, { align: "center" });
  y += 5;
  doc.line(left, y, right, y);
  y += 6;

  doc.setFontSize(9);
  line("Pelanggan", order.customer);
  line("Opsi", order.option);
  line("Pembayaran", order.payment);
  y += 1;
  doc.line(left, y, right, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.text(order.name, left, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  order.lines.forEach((l) => {
    doc.text(`- ${l.name} (${l.amount})`, left, y);
    doc.text(formatIDR(l.price), right, y, { align: "right" });
    y += 4.5;
  });

  y += 2;
  doc.line(left, y, right, y);
  y += 6;
  doc.setFontSize(9);
  line("Subtotal", formatIDR(order.price));
  line("Pajak (0%)", formatIDR(order.tax));
  line("Biaya layanan", formatIDR(order.service));
  if (order.tip > 0) line("Tip barista", formatIDR(order.tip));
  y += 1;
  doc.line(left, y, right, y);
  y += 6;
  doc.setFontSize(11);
  line("TOTAL", formatIDR(order.total), true);

  if (order.note) {
    y += 2;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(doc.splitTextToSize(`Pesan manis: "${order.note}"`, right - left), left, y);
    y += 8;
  }

  y += 4;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Terima kasih sudah berkreasi!", 40, y, { align: "center" });

  return doc;
}

const isMobile = () =>
  typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/**
 * Simpan / buka nota. Di HP, `jsPDF.save()` sering gagal (in-app browser,
 * iOS Safari), jadi kita coba Web Share dulu, lalu tautan unduh, lalu
 * membuka PDF di tab baru sebagai cadangan.
 */
export async function downloadReceipt(order: Order) {
  const doc = buildReceiptPdf(order);
  const filename = `nota-${order.id}.pdf`;
  const blob = doc.output("blob");
  const file = new File([blob], filename, { type: "application/pdf" });

  if (isMobile() && typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch {
      // pengguna membatalkan atau share gagal — lanjut ke cara lain
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}


/** Ringkasan nota dalam teks untuk dikirim lewat WhatsApp. */
export function receiptText(order: Order) {
  const rows = order.lines.map((l) => `• ${l.name} (${l.amount}) — ${formatIDR(l.price)}`);
  return [
    "*NOTA DIGITAL BARISTA by Scoffey*",
    `Nota #${order.id} — ${dateLabel(order.when)}`,
    `Pelanggan: ${order.customer}`,
    `${order.option} · ${order.payment}`,
    "",
    `*${order.name}*`,
    ...rows,
    "",
    `Subtotal: ${formatIDR(order.price)}`,
    `Pajak (0%): ${formatIDR(order.tax)}`,
    `Biaya layanan: ${formatIDR(order.service)}`,
    ...(order.tip > 0 ? [`Tip barista: ${formatIDR(order.tip)}`] : []),
    `*TOTAL: ${formatIDR(order.total)}*`,
    ...(order.note ? ["", `Pesan manis: "${order.note}"`] : []),
  ].join("\n");
}

/**
 * Unduh nota PDF lalu buka WhatsApp dengan ringkasan pesanan siap kirim
 * (file PDF dilampirkan manual dari unduhan — WhatsApp Web tidak menerima
 * lampiran otomatis lewat tautan).
 */
export function sendReceiptViaWhatsApp(order: Order, phone?: string) {
  const target = (phone ?? "").replace(/\D/g, "");
  const url = `https://wa.me/${target}?text=${encodeURIComponent(receiptText(order))}`;
  // buka WhatsApp dulu (klik langsung) agar tidak diblokir popup di HP
  window.open(url, "_blank", "noopener,noreferrer");
  void downloadReceipt(order);
}

