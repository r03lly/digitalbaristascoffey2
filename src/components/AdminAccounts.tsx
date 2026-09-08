import { useCallback, useEffect, useState } from "react";
import { KeyRound, Trash2, Users } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminFetchProfiles,
  adminFetchRoles,
  adminSetRole,
  adminUpdateProfile,
  createPlan,
  deletePlan,
  fetchPlans,
  updatePlan,
  type Plan,
  type Profile,
  type RoleRow,
} from "@/lib/account-db";
import { adminResetPassword } from "@/lib/admin.functions";
import { t } from "@/lib/i18n";


export function AdminAccounts() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);
  const resetPasswordFn = useServerFn(adminResetPassword);
  const [loading, setLoading] = useState(true);

  const [newPlan, setNewPlan] = useState<{ user: string; drink: string; freq: string }>({
    user: "",
    drink: "",
    freq: "weekly",
  });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([adminFetchProfiles(), adminFetchRoles(), fetchPlans()])
      .then(([p, r, pl]) => {
        setProfiles(p);
        setRoles(r);
        setPlans(pl);
        setError(null);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : t("Gagal memuat data akun.")),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const roleOf = (id: string) => roles.find((r) => r.user_id === id)?.role ?? "customer";
  const nameOf = (id: string) => profiles.find((p) => p.id === id)?.display_name ?? id.slice(0, 8);

  async function savePoints(id: string, points: number) {
    await adminUpdateProfile(id, { points });
    setProfiles((ps) => ps.map((p) => (p.id === id ? { ...p, points } : p)));
  }

  async function saveName(id: string, display_name: string) {
    await adminUpdateProfile(id, { display_name });
  }

  async function saveRole(id: string, role: RoleRow["role"]) {
    await adminSetRole(id, role);
    setRoles((rs) => [...rs.filter((r) => r.user_id !== id), { user_id: id, role }]);
  }

  async function resetPassword(p: Profile) {
    const pwd = window.prompt(
      `${t("Kata sandi baru untuk")} ${p.display_name || p.email} (${t("minimal 8 karakter")})`,
      "",
    );
    if (!pwd) return;
    if (pwd.length < 8) {
      setError(t("Kata sandi minimal 8 karakter."));
      return;
    }
    setResetting(p.id);
    try {
      await resetPasswordFn({ data: { userId: p.id, newPassword: pwd } });
      setError(null);
      setNotice(`${t("Kata sandi diperbarui untuk")} ${p.email}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Gagal mengatur ulang kata sandi."));
    } finally {
      setResetting(null);
    }
  }


  if (loading) return <p className="mt-3 text-sm text-muted-foreground">{t("Memuat…")}</p>;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2">
        <Users className="size-4 text-primary" />
        <h3 className="label-caps text-primary">{t("Kelola akun, poin & rencana")}</h3>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {notice && <p className="mt-2 text-sm text-primary">{notice}</p>}


      <div className="mt-3 space-y-2">
        {profiles.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card/60 p-3">
            <div className="grid gap-2 sm:grid-cols-4 sm:items-center">
              <input
                defaultValue={p.display_name}
                onBlur={(e) => void saveName(p.id, e.target.value)}
                aria-label={t("Nama pengguna")}
                className="rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground"
              />
              <span className="truncate text-xs text-muted-foreground">{p.email}</span>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                {t("Poin")}
                <input
                  type="number"
                  defaultValue={p.points}
                  onBlur={(e) => void savePoints(p.id, Number(e.target.value) || 0)}
                  className="w-24 rounded-xl border border-input bg-background/40 px-2 py-1 text-sm text-foreground"
                />
              </label>
              <select
                value={roleOf(p.id)}
                onChange={(e) => void saveRole(p.id, e.target.value as RoleRow["role"])}
                className="rounded-xl border border-input bg-background/40 px-2 py-2 text-sm text-foreground"
              >
                <option value="customer">customer</option>
                <option value="barista">barista</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => void resetPassword(p)}
              disabled={resetting === p.id}
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-primary/60 px-3 py-1.5 text-xs font-semibold text-primary disabled:opacity-60"
            >
              <KeyRound className="size-3.5" />
              {resetting === p.id ? t("Menyimpan…") : t("Reset kata sandi")}
            </button>
          </div>
        ))}
        {!profiles.length && (
          <p className="text-sm text-muted-foreground">{t("Belum ada akun terdaftar.")}</p>
        )}
      </div>

      <h4 className="mt-6 label-caps text-primary">{t("Rencana langganan semua pengguna")}</h4>
      <form
        className="mt-2 grid gap-2 sm:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          void createPlan(newPlan.user, { drink_name: newPlan.drink, frequency: newPlan.freq })
            .then((pl) => {
              setPlans((ps) => [pl, ...ps]);
              setNewPlan((s) => ({ ...s, drink: "" }));
            })
            .catch((err: unknown) =>
              setError(err instanceof Error ? err.message : t("Gagal menambah rencana.")),
            );
        }}
      >
        <select
          value={newPlan.user}
          onChange={(e) => setNewPlan((s) => ({ ...s, user: e.target.value }))}
          required
          aria-label={t("Pilih pengguna")}
          className="rounded-xl border border-input bg-background/40 px-2 py-2 text-sm text-foreground"
        >
          <option value="">{t("Pilih pengguna")}</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.display_name || p.email}
            </option>
          ))}
        </select>
        <input
          value={newPlan.drink}
          onChange={(e) => setNewPlan((s) => ({ ...s, drink: e.target.value }))}
          required
          placeholder={t("Nama minuman")}
          className="rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground"
        />
        <select
          value={newPlan.freq}
          onChange={(e) => setNewPlan((s) => ({ ...s, freq: e.target.value }))}
          className="rounded-xl border border-input bg-background/40 px-2 py-2 text-sm text-foreground"
        >
          <option value="daily">{t("Harian")}</option>
          <option value="weekly">{t("Mingguan")}</option>
          <option value="monthly">{t("Bulanan")}</option>
        </select>
        <button
          type="submit"
          className="rounded-xl border border-primary/60 px-3 py-2 text-sm font-semibold text-primary"
        >
          {t("Tambah rencana")}
        </button>
      </form>

      <ul className="mt-3 space-y-2">
        {plans.map((pl) => (
          <li
            key={pl.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 px-3 py-2 text-sm"
          >
            <div>
              <p className="text-foreground">
                {pl.drink_name} · <span className="text-muted-foreground">{nameOf(pl.user_id)}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {pl.frequency}
                {pl.next_date ? ` · ${pl.next_date}` : ""} · {pl.active ? t("aktif") : t("jeda")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  void updatePlan(pl.id, { active: !pl.active }).then(() =>
                    setPlans((ps) =>
                      ps.map((x) => (x.id === pl.id ? { ...x, active: !pl.active } : x)),
                    ),
                  )
                }
                className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground"
              >
                {pl.active ? t("Jeda") : t("Aktifkan")}
              </button>
              <button
                type="button"
                aria-label={t("Hapus rencana")}
                onClick={() =>
                  void deletePlan(pl.id).then(() =>
                    setPlans((ps) => ps.filter((x) => x.id !== pl.id)),
                  )
                }
                className="text-muted-foreground"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
        {!plans.length && (
          <li className="text-sm text-muted-foreground">{t("Belum ada rencana.")}</li>
        )}
      </ul>
    </section>
  );
}
