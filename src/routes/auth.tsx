import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Coffee, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { BaristaLogo, GoldButton, OutlineButton, PhoneFrame } from "@/components/PhoneShell";
import { useBarista } from "@/lib/barista-store";
import { supabase } from "@/integrations/supabase/client";

import { t } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk atau Daftar — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Masuk, buat akun baru, atau lanjut sebagai guest untuk mulai meracik minuman personal bersama Digital Barista.",
      },
      { property: "og:title", content: "Masuk atau Daftar — Digital Barista" },
      {
        property: "og:description",
        content: "Akses cepat: masuk, daftar, atau lanjut sebagai guest tanpa registrasi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
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

const ENTERED_KEY = "scoffey-entered";

function AuthPage() {
  const { signIn, signInPassword } = useBarista();
  const navigate = useNavigate();

  // Sudah login/masuk sebagai guest: kunci halaman ini sampai logout.
  useEffect(() => {
    if (localStorage.getItem(ENTERED_KEY) === "1") {
      navigate({ to: "/home", replace: true });
    }
  }, [navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signInPassword(email.trim(), password);
      localStorage.setItem(ENTERED_KEY, "1");
      const { data: auth } = await supabase.auth.getUser();
      let dest: "/home" | "/admin" | "/barista" = "/home";
      if (auth.user) {
        const { data: rows } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", auth.user.id);
        const roles = (rows ?? []).map((r) => String((r as { role: string }).role));
        if (roles.includes("admin")) dest = "/admin";
        else if (roles.includes("barista")) dest = "/barista";
      }
      navigate({ to: dest, replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Email atau password salah."));
    } finally {
      setBusy(false);
    }
  }


  const enterGuest = () => {
    localStorage.setItem(ENTERED_KEY, "1");
    signIn("Guest", true);
    navigate({ to: "/home", replace: true });
  };

  return (
    <PhoneFrame>
      <div className="animate-rise mx-auto w-full max-w-md flex-1 px-6 pt-6 pb-8 md:max-w-lg md:pt-10">
        <BaristaLogo />

        <h2 className="mt-6 text-center text-lg font-semibold text-primary">
          {t("Welcome Back!")}
        </h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {t("Masuk untuk melanjutkan perjalanan kreasi kopi kamu.")}
        </p>

        <form className="mt-6 space-y-3" onSubmit={submit}>
          <Field
            icon={<Mail className="size-4" />}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="flex items-center gap-3 rounded-2xl border border-input bg-background/40 px-4 py-3.5">
            <span className="text-muted-foreground">
              <Lock className="size-4" />
            </span>
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="button"
              aria-label={show ? t("Sembunyikan password") : t("Tampilkan password")}
              onClick={() => setShow((v) => !v)}
              className="text-muted-foreground"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <GoldButton type="submit" disabled={busy}>
            {busy ? t("Memproses…") : t("Masuk")}
          </GoldButton>
        </form>

        <div className="mt-4">
          <OutlineButton onClick={enterGuest}>
            <span className="flex items-center justify-center gap-2">
              <Coffee className="size-4" /> {t("Lanjut sebagai Guest")}
            </span>
          </OutlineButton>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("Belum punya akun? ")}
          <Link to="/register" className="text-primary underline">
            {t("Daftar sekarang")}
          </Link>
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card/60 p-4">
          <h3 className="label-caps text-primary">{t("Kenapa ada Guest Mode?")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "Kami ingin kamu langsung berkreasi tanpa hambatan. Akun bisa dibuat nanti saat kamu siap.",
            )}
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="text-primary">
            {t("Kembali ke splash")}
          </Link>
        </p>
      </div>
    </PhoneFrame>
  );
}
