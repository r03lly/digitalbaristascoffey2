import {
  BASES,
  DEFAULT_BASE,
  INGREDIENTS,
  buildRecipe,
  type Adjust,
  type Base,
  type Recipe,
  type Taste,
} from "./barista-data";
import { getLang, t } from "@/lib/i18n";

/**
 * Generator resep lokal — berjalan sepenuhnya di browser, tanpa kunci AI,
 * sehingga aplikasi berfungsi penuh di hosting mana pun (termasuk Vercel).
 * Menghasilkan 3 variasi resep yang deterministik dari pilihan pengguna,
 * dengan variasi karakter rasa yang berbeda antar variasi.
 */

const NAME_BANK: Record<string, string[]> = {
  Fruity: ["Sunset", "Orchard", "Citrus Bloom", "Tropic", "Berry Field"],
  Nutty: ["Amber", "Roasted", "Hazel Grove", "Toffee Ridge", "Cacao Nib"],
  Chocolatey: ["Midnight", "Cocoa Ember", "Truffle", "Mocha Lane", "Dark Cacao"],
  Floral: ["Bloom", "Petal", "Garden Mist", "Jasmine Air", "Morning Dew"],
  Classic: ["Signature", "Heritage", "Golden Cup", "Roastery", "House Blend"],
};

const STYLE_LABELS = [
  { style: "Best Match", styleEn: "Best Match" },
  { style: "Bold Twist", styleEn: "Bold Twist" },
  { style: "Fresh Twist", styleEn: "Fresh Twist" },
];

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n)));

function pick<T>(arr: T[], seed: number, offset: number): T {
  return arr[Math.abs(seed * 7 + offset * 13) % arr.length]!;
}

function baseFlavorNotes(base: Base, mood: string, id: boolean): string[] {
  const notes: string[] = [];
  if (id) {
    if (base.id === "matcha") notes.push("earthy", "umami lembut");
    else if (base.id === "chocolate") notes.push("cokelat pekat", "hangat");
    else if (base.id === "teh") notes.push("floral", "menenangkan");
    else if (base.id === "noncoffee") notes.push("segar", "ringan");
    else notes.push("kopi arabika", "roasted");
    if (mood === "Fruity") notes.push("buah segar");
    if (mood === "Nutty") notes.push("kacang panggang");
    if (mood === "Chocolatey") notes.push("dark cocoa");
    if (mood === "Floral") notes.push("aroma bunga");
  } else {
    if (base.id === "matcha") notes.push("earthy", "soft umami");
    else if (base.id === "chocolate") notes.push("rich chocolate", "warm");
    else if (base.id === "teh") notes.push("floral", "calming");
    else if (base.id === "noncoffee") notes.push("fresh", "light");
    else notes.push("arabica coffee", "roasted");
    if (mood === "Fruity") notes.push("fresh fruit");
    if (mood === "Nutty") notes.push("roasted nuts");
    if (mood === "Chocolatey") notes.push("dark cocoa");
    if (mood === "Floral") notes.push("floral aroma");
  }
  return notes.slice(0, 3);
}

export function buildLocalVariants(
  baseId: string | null,
  taste: Taste,
  ingredientIds: string[],
  adjust: Adjust,
  seed: number,
): Recipe[] {
  const base = BASES.find((b) => b.id === baseId) ?? DEFAULT_BASE;
  const ingredients = INGREDIENTS.filter((i) => ingredientIds.includes(i.id));
  const id = getLang() === "id";

  // Variasi 1: racikan paling setia pada preferensi (dipakai sebagai fondasi).
  const best = buildRecipe(baseId, taste, ingredientIds, adjust);

  const names = NAME_BANK[taste.mood] ?? NAME_BANK["Classic"]!;
  const flavorLead = ingredients.find((i) => i.group === "Sirup & Rasa")?.name;
  const baseWord = base.name.split(" ")[0] ?? base.name;

  const milkItem = ingredients.find((i) => i.group === "Susu & Krim");
  const toppingItems = ingredients.filter((i) => i.group === "Topping");

  const variants: Recipe[] = [0, 1, 2].map((idx) => {
    const twist = STYLE_LABELS[idx]!;
    // Geser karakter tiap variasi: 1 setia, 2 lebih bold, 3 lebih segar/ringan.
    const sweetShift = idx === 0 ? 0 : idx === 1 ? -12 : -4;
    const strengthShift = idx === 0 ? 0 : idx === 1 ? 14 : -8;
    const creamyShift = idx === 0 ? 0 : idx === 1 ? -6 : 8;

    const profile = best.profile.map((p) => {
      if (p.label === "Sweetness") return { ...p, value: clamp(p.value + sweetShift) };
      if (p.label === "Strength") return { ...p, value: clamp(p.value + strengthShift) };
      if (p.label === "Creaminess") return { ...p, value: clamp(p.value + creamyShift) };
      return p;
    });

    const matchScore = clamp(best.matchScore - idx * 5 + ((seed + idx) % 3), 70, 99);
    const compatibility = clamp(matchScore - 3 - idx * 2 + ((seed + idx * 2) % 2), 70, 98);

    const name =
      idx === 0
        ? best.name
        : `${pick(names, seed, idx)} ${flavorLead ?? pick(names, seed, idx + 2)} ${
            idx === 2 ? (id ? "Segar" : "Fresh") : baseWord
          }`;

    const tagline =
      idx === 0
        ? best.tagline
        : idx === 1
          ? id
            ? `${t(taste.temperature)} · Lebih bold · Karakter kuat`
            : `${taste.temperature} · Bolder · Strong character`
          : id
            ? `${t(taste.temperature)} · Lebih segar · Ringan`
            : `${taste.temperature} · Fresher · Light`;

    const note = id
      ? idx === 0
        ? best.note
        : idx === 1
          ? `Intensitas ${base.name.toLowerCase()} dinaikkan dan manisnya diturunkan sedikit, jadi karakternya lebih tegas${
              toppingItems.length ? ` dengan aksen ${toppingItems[0]!.name.toLowerCase()}` : ""
            }. Cocok buat kamu yang suka rasa berani.`
          : `Racikan dibuat lebih ringan dan segar${
              milkItem ? ` dengan kelembutan ${milkItem.name.toLowerCase()}` : ""
            }, pas dinikmati santai di siang hari.`
      : idx === 0
        ? best.note
        : idx === 1
          ? `The ${base.name.toLowerCase()} intensity is turned up and the sweetness dialled back, giving it a bolder character${
              toppingItems.length ? ` with a ${toppingItems[0]!.name.toLowerCase()} accent` : ""
            }. Perfect if you like a braver cup.`
          : `This take is lighter and fresher${
              milkItem ? ` with the softness of ${milkItem.name.toLowerCase()}` : ""
            }, ideal for a slow afternoon.`;

    const steps =
      idx === 0
        ? best.steps
        : id
          ? [
              idx === 1
                ? `Ekstraksi ${base.name} lebih pekat dari takaran standar.`
                : `Siapkan ${base.name} dengan takaran lebih ringan.`,
              ingredients.length
                ? `Tambahkan ${ingredients.map((i) => i.name).join(", ")} dengan urutan rasa utama dulu.`
                : "Sajikan murni tanpa tambahan bahan.",
              `Sajikan ${t(taste.temperature).toLowerCase()} dengan tingkat es ${adjust.ice}%.`,
              idx === 1
                ? "Aduk singkat agar karakter bold-nya menyatu, sajikan segera."
                : "Aduk lembut dan sajikan dalam gelas dingin signature Scoffey.",
            ]
          : [
              idx === 1
                ? `Extract the ${base.name} slightly stronger than standard.`
                : `Prepare the ${base.name} with a lighter measure.`,
              ingredients.length
                ? `Add ${ingredients.map((i) => i.name).join(", ")}, lead flavour first.`
                : "Serve pure with no extra ingredients.",
              `Serve ${taste.temperature.toLowerCase()} with an ice level of ${adjust.ice}%.`,
              idx === 1
                ? "Stir briefly so the bold character comes together, serve right away."
                : "Stir gently and serve in Scoffey's chilled signature glass.",
            ];

    const ingredientNotes = ingredients.slice(0, 2).map((i) => i.name.toLowerCase());
    const flavorNotes = [...baseFlavorNotes(base, taste.mood, id), ...ingredientNotes].slice(0, 4);

    return {
      ...best,
      name,
      style: id ? twist.style : twist.styleEn,
      tagline,
      note,
      matchScore,
      compatibility,
      profile,
      steps,
      flavorNotes,
    };
  });

  // Variasi 1 wajib punya matchScore tertinggi.
  variants[0]!.matchScore = Math.max(...variants.map((v) => v.matchScore));
  return variants;
}

/** Simulasi durasi "meracik" agar animasi brewing tampil natural (5–6,5 dtk). */
export function brewDelayMs(seed: number): number {
  return 5000 + (Math.abs(seed * 977) % 1500);
}
