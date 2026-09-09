import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import { GoldButton, InfoCard, PhoneShell, ProgressDots } from "@/components/PhoneShell";
import {
  BASES,
  DEFAULT_BASE,
  INGREDIENTS,
  REGULAR_MENU,
  SCOFFEY_MENU,
  formatIDR,
} from "@/lib/barista-data";
import { heroDrink } from "@/lib/barista-images";
import { QrisCode } from "@/components/QrisCode";
import { useBarista, type Order, type OrderLine } from "@/lib/barista-store";
import { downloadReceipt, sendReceiptViaWhatsApp } from "@/lib/receipt";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Order Summary & Checkout — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Konfirmasi racikanmu: opsi dine-in atau takeaway, metode pembayaran QRIS/e-wallet/tunai, tip barista, dan nota PDF via WhatsApp.",
      },
      { property: "og:title", content: "Order Summary & Checkout — Digital Barista" },
      {
        property: "og:description",
        content: "Ringkasan pesanan yang jelas sebelum diproses oleh barista Scoffey.",
      },
    ],
  }),
  component: CheckoutPage,
});

const OPTIONS = ["Dine In", "Takeaway"];

const PAYMENTS = [
  { id: "QRIS", label: "QRIS", hint: "Scan sekali, semua aplikasi bisa" },
  { id: "DANA", label: "DANA", hint: "0821-4855-115 · Ahmad Adib Raihan" },
  { id: "GoPay", label: "GoPay", hint: "0821-4855-115 · Ahmad Adib Raihan" },
  { id: "Transfer Bank", label: "Transfer Bank", hint: "Seabank · 901773318448 · Ahmad Adib Raihan" },
  { id: "Tunai di Kasir", label: "Tunai di Kasir", hint: "Bayar langsung ke barista" },
];

const EWALLETS = [
  { id: "DANA", number: "0821-4855-115", name: "Ahmad Adib Raihan" },
  { id: "GoPay", number: "0821-4855-115", name: "Ahmad Adib Raihan" },
];
const BANK = { id: "Seabank", number: "901773318448", name: "Ahmad Adib Raihan" };


const TIPS = [0, 2000, 5000, 10000];

function CheckoutPage() {
  const {
    recipe,
    placeOrder,
    baseId,
    ingredients,
    menuItem,
    userId,
    cart,
    setCartQty,
    clearCart,
  } = useBarista();
  const [customerName, setCustomerName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [option, setOption] = useState(OPTIONS[0]!);
  const [payment, setPayment] = useState(PAYMENTS[0]!.id);
  const [note, setNote] = useState("");
  const [tip, setTip] = useState(0);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [placed, setPlaced] = useState<Order | null>(null);
  const [paid, setPaid] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // Pesanan menu reguler kini memakai keranjang: bisa banyak item + jumlah.
  const hasCart = cart.length > 0;

  const base = BASES.find((b) => b.id === baseId) ?? DEFAULT_BASE;
  const chosen = INGREDIENTS.filter((i) => ingredients.includes(i.id));

  const cartCount = cart.reduce((n, c) => n + c.qty, 0);
  const itemName = hasCart
    ? cart.length === 1
      ? `${cart[0]!.name}${cart[0]!.qty > 1 ? ` x${cart[0]!.qty}` : ""}`
      : `${cart[0]!.name} + ${cart.length - 1} ${t("menu lain")}`
    : recipe.name;
  const itemTagline = hasCart
    ? `${cartCount} ${t("item")} · ${t("Menu Scoffey")}`
    : recipe.tagline;

  const lines: OrderLine[] = hasCart
    ? cart.map((c) => ({
        name: c.name,
        amount: `${c.qty} x ${formatIDR(c.price)}`,
        price: c.price * c.qty,
      }))
    : [
        { name: `${t(base.name)} (base)`, amount: base.amount, price: base.price },
        ...chosen.map((c) => ({ name: c.name, amount: c.amount, price: c.price })),
      ];

  const subtotal = hasCart
    ? cart.reduce((n, c) => n + c.price * c.qty, 0)
    : recipe.price;

  const tax = 0;
  const service = 0;
  const total = subtotal + tip;


  const activeWallet = EWALLETS.find((w) => w.id === payment);
  const paymentLabel = activeWallet
    ? `${activeWallet.id} · ${activeWallet.number} (${activeWallet.name})`
    : payment === "Transfer Bank"
      ? `${BANK.id} · ${BANK.number} (${BANK.name})`
      : payment;

  if (placed && !paid) {
    const cash = placed.payment.startsWith("Tunai");
    return (
      <PhoneShell step={t("Halaman 10")} title={t("MENUNGGU PEMBAYARAN")}>
        <div className="mx-auto flex max-w-xl flex-col items-center py-8 text-center md:py-12">
          <p className="text-sm text-muted-foreground">
            {t("Pesanan")} <span className="text-primary">#{placed.id}</span> · {placed.name}
          </p>
          <p className="display-title mt-2 text-3xl font-bold text-primary">
            {formatIDR(placed.total)}
          </p>
          <p className="mt-1 text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t(placed.payment)}
          </p>

          {placed.payment.startsWith("QRIS") && (
            <QrisCode
              amount={placed.total}
              className="mt-5 size-64 rounded-2xl border border-border bg-background object-contain p-2"
            />
          )}

          {EWALLETS.filter((w) => placed.payment.startsWith(w.id)).map((w) => (
            <div
              key={w.id}
              className="mt-5 rounded-2xl border border-primary/40 bg-card/60 p-4 text-center text-sm"
            >
              <p className="text-xs text-muted-foreground">
                {t("Kirim ke nomor")} {w.id}
              </p>
              <p className="mt-1 font-semibold text-foreground">{w.number}</p>
              <p className="text-xs text-muted-foreground">
                {t("Atas nama")}: {w.name}
              </p>
            </div>
          ))}

          {placed.payment.startsWith(BANK.id) && (
            <div className="mt-5 rounded-2xl border border-primary/40 bg-card/60 p-4 text-center text-sm">
              <p className="text-xs text-muted-foreground">{t("Transfer ke rekening")}</p>
              <p className="mt-1 font-semibold text-foreground">{BANK.id}</p>
              <p className="font-semibold text-foreground">{BANK.number}</p>
              <p className="text-xs text-muted-foreground">
                {t("Atas nama")}: {BANK.name}
              </p>
            </div>
          )}

          <p className="mt-5 max-w-sm text-sm text-muted-foreground">
            {cash
              ? t("Bayar ke barista di kasir, lalu tekan tombol di bawah untuk melihat struk.")
              : t("Selesaikan pembayaran, lalu tekan tombol di bawah. Struk keluar setelah pembayaran berhasil.")}
          </p>

          <div className="mt-6 w-full">
            <GoldButton
              disabled={verifying}
              onClick={() => {
                setVerifying(true);
                setTimeout(() => {
                  setVerifying(false);
                  setPaid(true);
                }, 1600);
              }}
            >
              {verifying ? t("Memeriksa pembayaran…") : t("Saya sudah bayar")}
            </GoldButton>
          </div>
        </div>
      </PhoneShell>
    );
  }

  if (placed) {
    return (
      <PhoneShell step={t("Halaman 10")} title={t("PESANAN DITERIMA")}>
        <div className="mx-auto flex max-w-xl flex-col items-center py-8 text-center md:py-16">
          <CheckCircle2 className="size-16 text-primary" />
          <h3 className="display-title mt-4 text-2xl font-bold text-foreground">
            {t("Barista sedang meracik")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Pesanan")} <span className="text-primary">#{placed.id}</span> · {placed.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(placed.option)} · {placed.payment} · {formatIDR(placed.total)}
          </p>

          <section className="mt-6 w-full rounded-2xl border border-border bg-card/60 p-4 text-left">
            <h4 className="label-caps text-primary">{t("Nota pembelian")}</h4>
            <p className="mt-2 text-xs text-muted-foreground">
              {t(
                "Unduh nota dalam bentuk PDF, atau kirim ringkasannya lewat WhatsApp lalu lampirkan file PDF-nya.",
              )}
            </p>
            <label className="mt-3 flex items-center gap-3 rounded-2xl border border-input bg-background/40 px-4 py-3">
              <span className="text-xs text-muted-foreground">+62</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
                placeholder={t("Nomor WhatsApp")}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void downloadReceipt(placed)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 py-3 text-xs font-semibold tracking-[0.1em] text-primary uppercase"
              >
                <Download className="size-4" /> {t("Nota PDF")}
              </button>
              <button
                type="button"
                onClick={() =>
                  sendReceiptViaWhatsApp(placed, phone ? `62${phone.replace(/^0+/, "")}` : "")
                }
                className="flex items-center justify-center gap-2 rounded-2xl border border-border py-3 text-xs font-semibold tracking-[0.1em] text-foreground uppercase"
              >
                <MessageCircle className="size-4" /> {t("Kirim via WA")}
              </button>
            </div>
          </section>

          <div className="mt-6 w-full">
            <Link to="/home" className="block">
              <GoldButton>{t("Kembali ke Home")}</GoldButton>
            </Link>
          </div>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell step={t("Halaman 10")} title={t("ORDER SUMMARY")} back="/create/recipe">
      <ProgressDots current={7} />
      <p className="mt-3 text-sm text-muted-foreground">
        {t(
          "Konfirmasi detail pesananmu sebelum diproses oleh barista. Pastikan semua sudah sesuai seleramu.",
        )}
      </p>

      <div className="md:mt-2 md:grid md:grid-cols-[1.4fr_1fr] md:items-start md:gap-8">
        <div>
          <section className="mt-5 rounded-2xl border border-primary/40 bg-card/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{itemName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{itemTagline}</p>
              </div>
              <img
                src={heroDrink}
                alt="Visual racikan pesanan"
                loading="lazy"
                width={1024}
                height={1280}
                className="size-12 rounded-xl border border-primary/30 object-cover"
              />
            </div>
            {hasCart ? (
              <p className="mt-3 text-xs text-primary">{t("Menu Reguler")}</p>
            ) : (
              <p className="mt-3 text-xs text-primary">{t("AI Match Score")} {recipe.matchScore}%</p>
            )}
            {hasCart ? (
              <>
                <ul className="mt-3 divide-y divide-border/60 border-t border-border pt-1 text-xs">
                  {cart.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 py-2">
                      <span className="min-w-0">
                        <span className="block text-foreground">{c.name}</span>
                        <span className="block text-muted-foreground">
                          {formatIDR(c.price)} / {t("item")}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-lg border border-primary/60 px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => setCartQty(c.id, c.qty - 1)}
                            aria-label={`${t("Kurangi")} ${c.name}`}
                            className="flex size-6 items-center justify-center text-primary"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="min-w-4 text-center font-bold text-foreground">
                            {c.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCartQty(c.id, c.qty + 1)}
                            aria-label={`${t("Tambah")} ${c.name}`}
                            className="flex size-6 items-center justify-center text-primary"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </span>
                        <span className="w-20 text-right text-foreground">
                          {formatIDR(c.price * c.qty)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCartQty(c.id, 0)}
                          aria-label={`${t("Hapus")} ${c.name}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/menu"
                  className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-primary/60 py-2.5 text-[0.7rem] font-semibold tracking-[0.1em] text-primary uppercase"
                >
                  <Plus className="size-4" /> {t("Tambah menu lain")}
                </Link>
              </>
            ) : (
              <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                {lines.map((l) => (
                  <li key={l.name} className="flex justify-between gap-3">
                    <span>
                      {t(l.name)} · <span className="text-foreground">{t(l.amount)}</span>
                    </span>
                    <span>{formatIDR(l.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>


          {!userId && (
            <section className="mt-4">
              <h3 className="label-caps text-primary">{t("Nama pemesan")}</h3>
              <input
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (e.target.value.trim()) setNameError(false);
                }}
                placeholder={t("Tulis namamu supaya barista tahu pesanan ini milik siapa")}
                className={`mt-2 w-full rounded-2xl border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
                  nameError ? "border-destructive" : "border-input"
                }`}
              />
              {nameError && (
                <p className="mt-1 text-xs text-destructive">
                  {t("Nama pemesan wajib diisi sebelum konfirmasi pesanan.")}
                </p>
              )}
            </section>
          )}

          <section className="mt-4">
            <h3 className="label-caps text-primary">{t("No Telp / WhatsApp")}</h3>
            <label className="mt-2 flex items-center gap-3 rounded-2xl border bg-background/40 px-4 py-3">
              <span className="text-xs text-muted-foreground">+62</span>
              <input
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 15);
                  setPhone(digits);
                  if (digits.trim()) setPhoneError(false);
                }}
                inputMode="numeric"
                placeholder={t("Contoh: 81234567890")}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </label>
            {phoneError && (
              <p className="mt-1 text-xs text-destructive">
                {t("Nomor Telp/WhatsApp wajib diisi sebelum konfirmasi pesanan.")}
              </p>
            )}
          </section>

          <section className="mt-4">
            <h3 className="label-caps text-primary">{t("Opsi pesanan")}</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 md:gap-3">
              {OPTIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOption(o)}
                  className={`rounded-2xl border py-3 text-xs font-semibold uppercase transition-all ${
                    option === o
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card/60 text-muted-foreground"
                  }`}
                >
                  {t(o)}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-4">
            <h3 className="label-caps text-primary">{t("Metode pembayaran")}</h3>
            <div className="mt-2 space-y-2">
              {PAYMENTS.map((p) => (
                <div key={p.id}>
                  <button
                    type="button"
                    onClick={() => setPayment(p.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all ${
                      payment === p.id
                        ? "border-primary bg-accent text-foreground"
                        : "border-border bg-card/60 text-muted-foreground"
                    }`}
                  >
                    <span className="text-left">
                      {t(p.label)}
                      <span className="block text-[0.7rem] text-muted-foreground">{t(p.hint)}</span>
                    </span>
                    <span
                      className={`size-3.5 shrink-0 rounded-full border ${
                        payment === p.id ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    />
                  </button>

                  {p.id === "QRIS" && payment === "QRIS" && (
                    <div className="mt-2 flex flex-col items-center rounded-2xl border border-primary/40 bg-card/60 p-4">
                      <QrisCode
                        amount={total}
                        className="w-56 rounded-xl border border-primary/30 bg-background object-contain p-2"
                      />
                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        {t("Scan kode QRIS ini dengan aplikasi bank atau e-wallet apa pun.")}
                      </p>
                      <p className="mt-1 text-center text-sm font-semibold text-primary">
                        {formatIDR(total)}
                      </p>
                    </div>
                  )}

                  {activeWallet && p.id === activeWallet.id && (
                    <div className="mt-2 rounded-2xl border border-primary/40 bg-card/60 p-4 text-sm">
                      <p className="text-xs text-muted-foreground">
                        {t("Kirim ke nomor")} {activeWallet.id}
                      </p>
                      <p className="mt-1 font-semibold text-foreground">{activeWallet.number}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("Atas nama")}: {activeWallet.name}
                      </p>
                      <p className="mt-2 text-center text-sm font-semibold text-primary">
                        {formatIDR(total)}
                      </p>
                    </div>
                  )}

                  {p.id === "Transfer Bank" && payment === "Transfer Bank" && (
                    <div className="mt-2 rounded-2xl border border-primary/40 bg-card/60 p-4 text-sm">
                      <p className="text-xs text-muted-foreground">{t("Transfer ke rekening")}</p>
                      <p className="mt-1 font-semibold text-foreground">{BANK.id}</p>
                      <p className="font-semibold text-foreground">{BANK.number}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("Atas nama")}: {BANK.name}
                      </p>
                      <p className="mt-2 text-center text-sm font-semibold text-primary">
                        {formatIDR(total)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4">
            <h3 className="label-caps text-primary">{t("Pesan Manis untuk Barista")}</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={t("Contoh: semangat terus ya, kopimu selalu bikin hari lebih baik!")}
              className="mt-2 w-full rounded-2xl border border-input bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </section>

          <section className="mt-4">
            <h3 className="label-caps text-primary">{t("Tip untuk Barista")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("Tip ditambahkan ke total pembayaran dan dicatat terpisah untuk barista.")}
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {TIPS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTip(amount)}
                  className={`rounded-2xl border py-3 text-xs font-semibold transition-all ${
                    tip === amount
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card/60 text-muted-foreground"
                  }`}
                >
                  {amount === 0 ? t("Tanpa tip") : `${amount / 1000}k`}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="md:sticky md:top-6">
          <section className="mt-4 rounded-2xl border border-border bg-card/60 p-4 text-sm md:mt-0">
            <h3 className="label-caps text-primary">{t("Ringkasan harga")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("Harga sudah final — tidak ada pajak dan biaya layanan tambahan.")}
            </p>
            <dl className="mt-3 space-y-2 text-muted-foreground">

              <div className="flex justify-between">
                <dt>{t("Subtotal racikan")}</dt>
                <dd className="text-foreground">{formatIDR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{t("Pajak (0%)")}</dt>
                <dd className="text-foreground">{formatIDR(tax)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{t("Biaya layanan")}</dt>
                <dd className="text-foreground">{formatIDR(service)}</dd>
              </div>
              {tip > 0 && (
                <div className="flex justify-between">
                  <dt>{t("Tip untuk Barista")}</dt>
                  <dd className="text-foreground">{formatIDR(tip)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="label-caps text-foreground">{t("Total")}</dt>
                <dd className="display-title text-xl font-bold text-primary">{formatIDR(total)}</dd>
              </div>
            </dl>
          </section>

          <div className="mt-4">
            <InfoCard title={t("Transparan")}>
              {t("Tanpa biaya tersembunyi. Kamu tahu persis apa yang kamu bayar.")}
            </InfoCard>
          </div>

          <div className="mt-5">
            <GoldButton
              onClick={() => {
                if (!userId && !customerName.trim()) {
                  setNameError(true);
                  return;
                }
                if (phone.trim() && phone.replace(/^0+/, "").length < 9) {
                  setPhoneError(true);
                  return;
                }
                const order = placeOrder({
                  name: itemName,
                  customer: customerName,
                  price: subtotal,
                  tax,
                  service,
                  tip,
                  matchScore: hasCart ? 0 : recipe.matchScore,
                  payment: paymentLabel,
                  option,
                  note: [
                    phone.trim() ? `${t("No Telp/WA")}: +62 ${phone.replace(/^0+/, "")}` : "",
                    note.trim(),
                  ]
                    .filter(Boolean)
                    .join("\n"),
                  kind: hasCart ? "regular" : "signature",
                  lines,
                });
                setPlaced(order);
                clearCart();
                navigate({ to: "/checkout" });

              }}
            >
              {t("Konfirmasi Pesanan")}
            </GoldButton>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
