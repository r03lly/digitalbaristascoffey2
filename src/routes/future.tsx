import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Coffee,
  Globe,
  Heart,
  Instagram,
  Leaf,
  Lightbulb,
  Mail,
  MapPin,
  QrCode,
  Quote,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react";
import { SlideShell, SlideTitle } from "@/components/SlideShell";
import { heroDrink } from "@/lib/barista-images";
import { getLang } from "@/lib/i18n";
import { EN_FUTURE, ID_FUTURE } from "@/lib/i18n-future";

/** Translate source copy (Indonesian or English) for the active language. */
function t(text: string): string {
  return getLang() === "id" ? (ID_FUTURE[text] ?? text) : (EN_FUTURE[text] ?? text);
}

export const Route = createFileRoute("/future")({
  head: () => ({
    meta: [
      { title: "Brewing the Future, Together — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Dari ide menjadi impact: inovasi, kolaborasi, keberlanjutan, dan pertumbuhan bersama komunitas Scoffey.",
      },
      { property: "og:title", content: "Brewing the Future, Together" },
      {
        property: "og:description",
        content: "Langkah kecil hari ini untuk pengalaman kopi yang lebih personal dan berkelanjutan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FuturePage,
});

const IMPACT = [
  {
    icon: Lightbulb,
    title: "Inovasi",
    desc: "Menggabungkan AI, data, dan kreativitas untuk pengalaman kopi yang unik.",
  },
  {
    icon: Users,
    title: "Kolaborasi",
    desc: "Bersinergi dengan komunitas, barista, dan pecinta kopi tanpa batas.",
  },
  {
    icon: Leaf,
    title: "Keberlanjutan",
    desc: "Mendorong pemanfaatan bahan lokal dan praktik bisnis yang berkelanjutan.",
  },
  {
    icon: TrendingUp,
    title: "Pertumbuhan",
    desc: "Membangun nilai bersama dan membuka peluang baru di industri kopi.",
  },
];

const CONTACTS = [
  { icon: Globe, label: "Website", value: "www.scoffey.id" },
  { icon: Instagram, label: "Instagram", value: "@scoffey.streetcoffee" },
  { icon: Mail, label: "Email", value: "hello@scoffey.id" },
  { icon: MapPin, label: "Location", value: "Scoffey @ Borles Mart, UNBL Campus Area" },
];

function FuturePage() {
  return (
    <SlideShell
      page={t("Halaman 14")}
      pageNumber="14 / 14"
      prev={{ to: "/technology", label: t("Technology") }}
      next={{ to: "/flow", label: t("Design Flow") }}
    >
      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr_0.8fr]">
        {/* Kolom kiri */}
        <div>
          <SlideTitle
            lines={["BREWING THE FUTURE,", "TOGETHER"]}
            desc={t(
              "Digital Barista adalah langkah kecil hari ini untuk menciptakan pengalaman minum kopi yang lebih personal, konsisten, dan berkelanjutan.",
            )}
          />

          {/* Dari ide, menjadi impact */}
          <section className="surface-wood mt-7 rounded-3xl border border-primary/30 p-5">
            <h2 className="display-title text-center text-base font-bold tracking-[0.1em] text-cream">
              {t("DARI IDE, MENJADI IMPACT")}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 2xl:grid-cols-4">
              {IMPACT.map(({ icon: Icon, title, desc }) => (
                <article key={title} className="text-center">
                  <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-primary/40 text-gold">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-2 text-xs font-semibold tracking-[0.08em] text-gold uppercase">
                    {t(title)}
                  </p>
                  <p className="mt-1 text-[0.78rem] leading-snug text-cream/75">{t(desc)}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Kutipan */}
          <blockquote className="mt-5 rounded-2xl border border-primary/25 bg-card/50 p-4">
            <Quote className="size-4 text-primary" />
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
              {t("Setiap racikan adalah cerita.")}
              <br />
              {t("Setiap cerita adalah koneksi.")}
              <br />
              {t("Setiap koneksi menciptakan masa depan kopi yang lebih baik.")}
            </p>
            <footer className="label-caps mt-2 text-primary">{t("— Scoffey Community")}</footer>
          </blockquote>

          {/* Ready to brew */}
          <section className="surface-wood mt-5 flex flex-wrap items-center gap-4 rounded-3xl border border-primary/30 p-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/40 text-gold">
              <Coffee className="size-6" />
            </span>
            <div className="min-w-[12rem] flex-1">
              <h3 className="display-title text-base font-bold tracking-[0.06em] text-gold">
                {t("READY TO BREW YOUR STORY?")}
              </h3>
              <p className="mt-1 text-[0.8rem] text-cream/80">
                {t("Unduh Digital Barista sekarang dan temukan racikan terbaikmu!")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-lg border border-cream/30 px-3 py-1.5 text-[0.76rem] text-cream">
                  {t("Download on the App Store")}
                </span>
                <span className="rounded-lg border border-cream/30 px-3 py-1.5 text-[0.76rem] text-cream">
                  {t("Get it on Google Play")}
                </span>
              </div>
            </div>
            <div className="text-center">
              <span className="flex size-16 items-center justify-center rounded-lg border border-primary/40 bg-background/60 text-primary">
                <QrCode className="size-10" />
              </span>
              <p className="mt-1 text-[0.68rem] tracking-[0.08em] text-cream/70 uppercase">
                {t("Scan to download")}
              </p>
            </div>
          </section>
        </div>

        {/* Kolom tengah: mockup Thank You */}
        <div className="surface-navy shadow-premium rounded-[1.75rem] border border-primary/25 p-3">
          <div className="flex items-center justify-between px-1 text-[0.72rem] text-muted-foreground">
            <span>9:41</span>
            <span className="flex gap-1">
              <span className="h-1 w-4 rounded-full bg-muted-foreground/50" />
              <span className="h-1 w-2 rounded-full bg-muted-foreground/50" />
            </span>
          </div>

          <div className="mt-4 text-center">
            <p className="display-title text-gold-gradient text-3xl font-bold italic">{t("Thank You!")}</p>
            <p className="label-caps mt-2 text-foreground">{t("Let's Brew the Future Together")}</p>
            <span className="mx-auto mt-2 flex items-center justify-center gap-2">
              <span className="h-px w-10 bg-primary/40" />
              <Heart className="size-3 text-primary" />
              <span className="h-px w-10 bg-primary/40" />
            </span>
          </div>

          <img
            src={heroDrink}
            alt={t("Secangkir kopi Scoffey dengan latte art di atas meja kayu")}
            loading="lazy"
            width={1024}
            height={1280}
            className="mt-4 h-44 w-full rounded-2xl border border-primary/25 object-cover"
          />

          <p className="mt-4 text-[0.82rem] leading-relaxed text-muted-foreground">
            {t("Terima kasih telah menjadi bagian dari perjalanan inovasi Digital Barista.")}{" "}
            <span className="text-primary">
              {t("Kami tidak sabar meracik pengalaman terbaik untukmu!")}
            </span>
          </p>

          <div className="mt-4 space-y-2">
            <Link
              to="/create/base"
              className="surface-gold shadow-gold flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold tracking-[0.1em] text-primary-foreground uppercase"
            >
              <span className="flex items-center gap-2">
                <Coffee className="size-4" /> {t("Mulai Meracik")}
              </span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/community"
              className="flex items-center justify-center gap-2 rounded-xl border border-primary/50 px-4 py-3 text-xs font-semibold tracking-[0.1em] text-primary uppercase"
            >
              <Share2 className="size-4" /> {t("Bagikan ke Rekan")}
            </Link>
          </div>
        </div>

        {/* Kolom kanan: Stay Connected */}
        <div>
          <h2 className="display-title text-gold-gradient text-2xl font-bold italic">
            {t("Stay Connected!")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("Mari terus berbagi ide dan menciptakan racikan terbaik untuk dunia.")}
          </p>
          <span className="mt-4 block h-px w-full bg-primary/25" />

          <ul className="mt-4 space-y-4">
            {CONTACTS.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-primary">{t(label)}</p>
                  <p className="mt-0.5 text-[0.82rem] text-muted-foreground">{t(value)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-primary/30 bg-card/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="label-caps text-primary">{t("Your Recipe, Your Story")}</h3>
                <p className="mt-2 text-[0.82rem] leading-snug text-muted-foreground">
                  {t("Setiap racikan adalah ekspresi dirimu. Scoffey mengapresiasi kreasimu!")}
                </p>
              </div>
              <Heart className="size-4 shrink-0 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
