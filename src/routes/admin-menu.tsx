import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { PhoneShell, SectionLabel } from "@/components/PhoneShell";
import { useBarista } from "@/lib/barista-store";
import { formatIDR } from "@/lib/barista-data";
import {
  adminCreateMenuItem,
  adminDeleteMenuItem,
  adminUpdateMenuItem,
  fetchMenuItems,
  type MenuRow,
} from "@/lib/menu-db";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/admin-menu")({
  head: () => ({
    meta: [
      { title: "Kelola Menu & Harga — Digital Barista by Scoffey" },
      {
        name: "description",
        content:
          "Halaman admin Scoffey untuk menambah item menu baru, mengubah harga, dan menyembunyikan item yang habis.",
      },
      { property: "og:title", content: "Kelola Menu & Harga — Digital Barista" },
      {
        property: "og:description",
        content: "Tambah item baru dan perbarui harga menu Scoffey langsung dari aplikasi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminMenuPage,
});

const EMPTY = { name: "", description: "", price: "", category: "drink", emoji: "", image_id: "" };

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function AdminMenuPage() {
  const { isAdmin, authReady } = useBarista();
  const [rows, setRows] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ ...EMPTY });

  const load = useCallback(() => {
    setLoading(true);
    fetchMenuItems(true)
      .then((r) => {
        setRows(r);
        setError(null);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : t("Gagal memuat menu.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  async function patch(row: MenuRow, changes: Partial<MenuRow>) {
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...changes } : r)));
    try {
      await adminUpdateMenuItem(row.id, changes);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Gagal menyimpan perubahan."));
      load();
    }
  }

  async function remove(row: MenuRow) {
    setRows((rs) => rs.filter((r) => r.id !== row.id));
    try {
      await adminDeleteMenuItem(row.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Gagal menghapus item."));
      load();
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const name = draft.name.trim();
    if (!name) return;
    try {
      const created = await adminCreateMenuItem({
        slug: slugify(name) || `item-${Date.now()}`,
        name,
        description: draft.description.trim(),
        price: Number(draft.price) || 0,
        category: draft.category,
        emoji: draft.emoji,
        image_id: draft.image_id.trim(),
        sort_order: 99,
      });
      setRows((rs) => [...rs, created]);
      setDraft({ ...EMPTY });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Gagal menambah item."));
    }
  }

  if (authReady && !isAdmin) {
    return (
      <PhoneShell title={t("KELOLA MENU")} back="/admin">
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

  const drinks = rows.filter((r) => r.category !== "food");
  const food = rows.filter((r) => r.category === "food");

  return (
    <PhoneShell title={t("KELOLA MENU")} back="/admin" nav>
      <div className="mt-3 flex items-center gap-2">
        <UtensilsCrossed className="size-4 text-primary" />
        <p className="text-sm text-muted-foreground">
          {t("Tambah item baru dan ubah harga menu Scoffey.")}
        </p>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <form onSubmit={(e) => void add(e)} className="mt-4 grid gap-2 sm:grid-cols-2">
        <input
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          required
          placeholder={t("Nama item")}
          className="rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground"
        />
        <input
          value={draft.price}
          onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
          inputMode="numeric"
          required
          placeholder={t("Harga (Rp)")}
          className="rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground"
        />
        <input
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder={t("Deskripsi singkat")}
          className="rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground sm:col-span-2"
        />
        <select
          value={draft.category}
          onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
          aria-label={t("Kategori")}
          className="rounded-xl border border-input bg-background/40 px-2 py-2 text-sm text-foreground"
        >
          <option value="drink">{t("Minuman")}</option>
          <option value="food">{t("Makanan Ringan")}</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/60 px-3 py-2 text-sm font-semibold text-primary"
        >
          <Plus className="size-4" /> {t("Tambah item")}
        </button>
      </form>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">{t("Memuat…")}</p>
      ) : (
        <>
          <section className="mt-6">
            <SectionLabel>{t("Minuman")}</SectionLabel>
            <List rows={drinks} patch={patch} remove={remove} />
          </section>
          <section className="mt-6">
            <SectionLabel>{t("Makanan Ringan")}</SectionLabel>
            <List rows={food} patch={patch} remove={remove} />
          </section>
        </>
      )}
    </PhoneShell>
  );
}

function List({
  rows,
  patch,
  remove,
}: {
  rows: MenuRow[];
  patch: (row: MenuRow, changes: Partial<MenuRow>) => Promise<void>;
  remove: (row: MenuRow) => Promise<void>;
}) {
  if (!rows.length)
    return <p className="mt-2 text-sm text-muted-foreground">{t("Belum ada item.")}</p>;
  return (
    <ul className="mt-2 space-y-2">
      {rows.map((r) => (
        <li key={r.id} className="rounded-2xl border border-border bg-card/60 p-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_9rem_auto_auto] sm:items-center">
            <input
              defaultValue={r.name}
              onBlur={(e) => void patch(r, { name: e.target.value })}
              aria-label={t("Nama item")}
              className="rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground"
            />
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Rp
              <input
                type="number"
                defaultValue={Number(r.price)}
                onBlur={(e) => void patch(r, { price: Number(e.target.value) || 0 })}
                aria-label={t("Harga (Rp)")}
                className="w-full rounded-xl border border-input bg-background/40 px-2 py-1 text-sm text-foreground"
              />
            </label>
            <button
              type="button"
              onClick={() => void patch(r, { active: !r.active })}
              className={`rounded-lg border px-2 py-1 text-xs ${
                r.active ? "border-primary/60 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {r.active ? t("Tampil") : t("Disembunyikan")}
            </button>
            <button
              type="button"
              aria-label={t("Hapus item")}
              onClick={() => void remove(r)}
              className="justify-self-end text-muted-foreground"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatIDR(Number(r.price))} · {r.slug}
          </p>
        </li>
      ))}
    </ul>
  );
}
