import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";
import { BaristaLogo, GoldButton, PhoneFrame } from "@/components/PhoneShell";
import { useBarista } from "@/lib/barista-store";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar Akun Baru — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Buat akun Digital Barista by Scoffey untuk menyimpan kreasi, poin, dan rencana langganan kopi kamu.",
      },
      { property: "og:title", content: "Daftar Akun Baru — Digital Barista" },
      {
        property: "og:description",
        content: "Registrasi mandiri dengan email dan password, langsung bisa dipakai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

function Field({
  icon,
  ...props
}: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-input bg-background/40 px-4 py-3.5">
      <span className="text-muted-foreground">{icon}</span>
      <input
        {...props}
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </label>
  );
}

function RegisterPage() {
  const { signUpPassword, signInPassword } = useBarista();
  const navigate = useNavigate();

  // Sudah login/masuk sebagai guest: kunci halaman ini sampai logout.
  useEffect(() => {
    if (localStorage.getItem("scoffey-entered") === "1") {
      navigate({ to: "/home", replace: true });
    }
  }, [navigate]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError(t("Password minimal 6 karakter."));
    if (password !== confirm) return setError(t("Konfirmasi password tidak cocok."));
    setBusy(true);
    try {
      await signUpPassword(email.trim(), password, name.trim());
      await signInPassword(email.trim(), password);
      localStorage.setItem("scoffey-entered", "1");
      navigate({ to: "/home", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Pendaftaran gagal."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhoneFrame>
      <div className="animate-rise mx-auto w-full max-w-md flex-1 px-6 pt-6 pb-8 md:max-w-lg md:pt-10">
        <Link to="/auth" aria-label={t("Kembali ke halaman masuk")} className="text-foreground">
          <ArrowLeft className="size-5" />
        </Link>

        <BaristaLogo />

        <h2 className="mt-6 text-center text-lg font-semibold text-primary">
          {t("Buat Akun Baru")}
        </h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {t("Daftar untuk menyimpan semua kreasi, favorit, dan riwayat pesanan kamu.")}
        </p>

        <form className="mt-6 space-y-3" onSubmit={submit}>
          <Field
            icon={<User className="size-4" />}
            placeholder={t("Nama Lengkap")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Field
            icon={<Mail className="size-4" />}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Field
            icon={<Lock className="size-4" />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Field
            icon={<Lock className="size-4" />}
            type="password"
            placeholder={t("Konfirmasi Password")}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <GoldButton type="submit" disabled={busy}>
            {busy ? t("Memproses…") : t("Daftar")}
          </GoldButton>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("Sudah punya akun? ")}
          <Link to="/auth" className="text-primary underline">
            {t("Masuk di sini")}
          </Link>
        </p>
      </div>
    </PhoneFrame>
  );
}
