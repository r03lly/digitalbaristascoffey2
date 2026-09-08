import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bot, Coffee, SlidersHorizontal, Sparkles, User } from "lucide-react";
import { BaristaLogo, GoldButton, PhoneFrame } from "@/components/PhoneShell";
import { heroDrink } from "@/lib/barista-images";
import { LanguageToggle } from "@/components/LanguageToggle";
import { t } from "@/lib/i18n";
import { FitScale } from "@/components/FitScale";
import { useBarista } from "@/lib/barista-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Barista by Scoffey — Create Your Coffee. Your Way." },
      {
        name: "description",
        content:
          "Digital Barista by Scoffey: co-creation minuman berbasis AI. Pilih base, rasa, dan bahan — dapatkan resep personal yang seimbang.",
      },
      { property: "og:title", content: "Digital Barista by Scoffey" },
      {
        property: "og:description",
        content: "AI-driven beverage co-creation. Create Your Coffee. Your Way.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  // Mulai sesi baru: buang sisa pilihan racikan & keranjang dari sesi
  // sebelumnya supaya perangkat lain/tamu tidak melihat riwayat pilihan.
  const { resetCreation, clearCart } = useBarista();
  const startFresh = () => {
    resetCreation();
    clearCart();
  };
  // Perangkat baru / kunjungan baru selalu mulai dari awal — tidak ada
  // sisa racikan atau keranjang dari pemakaian sebelumnya.
  useEffect(startFresh, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <PhoneFrame>
      <>
        <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-primary/10 blur-3xl" />
        <FitScale>
        <div className="animate-rise relative mx-auto flex w-full max-w-xl flex-col items-center pt-8 text-center sm:pt-10">
          <div className="mb-4 flex w-full justify-end px-6">
            <LanguageToggle />
          </div>
          <BaristaLogo size="lg" />

          <h2 className="mt-8 px-6 text-[1.7rem] leading-snug font-medium text-foreground">
            Create Your Coffee.
            <span className="block">Your Way.</span>
          </h2>
          <p className="label-caps mt-3 px-6 text-primary">AI-Driven Beverage Co-Creation</p>

          {/* Foto bulat dengan gelas tetap tampil utuh. */}
          <div className="relative mt-3 flex w-full justify-center px-8">
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 size-[370px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/25"
            />
            <div className="relative aspect-square w-full max-w-[350px] overflow-hidden rounded-full border border-primary/20 bg-card shadow-premium">
              <img
                src={heroDrink}
                alt="Iced caramel latte premium Scoffey di atas meja kayu gelap"
                width={1024}
                height={1024}
                className="size-full object-contain"
              />
            </div>

          </div>

          {/* Indikator carousel (3 titik) seperti di PDF */}
          <div className="mt-1 flex items-center gap-2" aria-hidden>
            <span className="size-2 rounded-full bg-foreground" />
            <span className="size-2 rounded-full bg-muted-foreground/40" />
            <span className="size-2 rounded-full bg-muted-foreground/40" />
          </div>

          <FlowPreview />

          <div className="mt-5 w-full space-y-3 px-6">
            <Link to="/home" className="block" onClick={startFresh}>
              <GoldButton>
                <span className="inline-flex items-center justify-center gap-2">
                  <Coffee className="size-4" />
                  {t("Masuk Sebagai Tamu")}
                </span>
              </GoldButton>
            </Link>
            <Link
              to="/auth"
              className="flex items-center justify-center gap-2 rounded-2xl border border-primary/60 px-6 py-3.5 text-sm font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-accent"
            >
              <User className="size-4" />
              {t("Masuk / Daftar")}
            </Link>
          </div>

          <div className="pb-6" />

        </div>
        </FitScale>
        <div className="relative flex shrink-0 justify-center pb-2">
          <span className="h-1 w-32 rounded-full bg-foreground/70" />
        </div>
      </>
    </PhoneFrame>
  );
}

function FlowPreview() {
  const steps = [
    { icon: Coffee, label: "Pilih Base" },
    { icon: SlidersHorizontal, label: "Atur Rasa" },
    { icon: Sparkles, label: "Pilih Bahan" },
    { icon: Bot, label: "Rekomendasi AI" },
  ];
  return (
    <div className="mt-5 w-full px-6">
      <p className="text-center text-[0.72rem] tracking-[0.14em] text-muted-foreground uppercase">
        {t("Cara kerja")}
      </p>
      <div className="mt-3 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex size-9 items-center justify-center rounded-full border border-primary/30 bg-card/60 text-primary">
              <s.icon className="size-4" />
            </div>
            <span className="text-center text-[0.62rem] leading-tight text-muted-foreground md:text-[0.7rem]">
              {t(s.label)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
