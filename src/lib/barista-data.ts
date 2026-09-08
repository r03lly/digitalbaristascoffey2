import { getLang, t } from "@/lib/i18n";

export type Base = {
  id: string;
  name: string;
  desc: string;
  strength: number; // 1..5
  emoji: string;
  price: number;
  /** Takaran dasar yang dipakai barista. */
  amount: string;
};

export const BASES: Base[] = [
  { id: "espresso", name: "Espresso", desc: "Pekat, bold, karakter kopi paling dominan.", strength: 5, emoji: "☕", price: 22000, amount: "2 shot (60 ml)" },
  { id: "latte", name: "Latte Base", desc: "Lembut, creamy, seimbang dengan susu.", strength: 2, emoji: "🥛", price: 28000, amount: "1 shot + 150 ml susu" },
  { id: "coldbrew", name: "Cold Brew", desc: "Smooth, low acid, manis alami.", strength: 4, emoji: "🧊", price: 30000, amount: "180 ml" },
  { id: "matcha", name: "Matcha", desc: "Earthy, hijau segar, tanpa kopi.", strength: 2, emoji: "🍵", price: 29000, amount: "5 g bubuk + 150 ml air" },
  { id: "chocolate", name: "Chocolate", desc: "Manis, hangat, ramah untuk semua.", strength: 1, emoji: "🍫", price: 26000, amount: "30 g cokelat + 150 ml susu" },
  { id: "teh", name: "Teh", desc: "Ringan dan menenangkan, seduhan daun teh pilihan.", strength: 2, emoji: "🫖", price: 20000, amount: "1 kantong + 200 ml air" },
  { id: "noncoffee", name: "Non Coffee", desc: "Tanpa kopi sama sekali — dasar jus, milkshake, dan mocktail.", strength: 1, emoji: "🥤", price: 24000, amount: "200 ml" },
];

export const DEFAULT_BASE: Base = BASES[0]!;

/** Menu reguler siap saji (tanpa proses co-creation). */
export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  emoji: string;
  imageId: string;
};

export const REGULAR_MENU: MenuItem[] = [
  { id: "americano", name: "Americano", desc: "Ringan, bersih, aroma kopi yang jelas.", price: 24000, emoji: "🫙", imageId: "americano" },
  { id: "cafe-latte", name: "Cafe Latte", desc: "Espresso lembut dengan susu segar.", price: 28000, emoji: "🥛", imageId: "latte" },
  { id: "cappuccino", name: "Cappuccino", desc: "Espresso, susu, dan foam seimbang.", price: 28000, emoji: "☕", imageId: "espresso" },
  { id: "cold-brew", name: "Cold Brew", desc: "Diseduh dingin 12 jam, smooth & manis alami.", price: 30000, emoji: "🧊", imageId: "coldbrew" },
  { id: "matcha-latte", name: "Matcha Latte", desc: "Matcha premium dengan susu creamy.", price: 29000, emoji: "🍵", imageId: "matcha" },
  { id: "chocolate", name: "Chocolate", desc: "Cokelat hangat manis untuk semua umur.", price: 26000, emoji: "🍫", imageId: "chocolate" },
];

/** Menu lengkap Scoffey yang ditampilkan di halaman Home. */
export const SCOFFEY_MENU: MenuItem[] = [
  { id: "butterscotch", name: "Butterscotch", desc: "Sirup butterscotch premium.", price: 18000, emoji: "🧈", imageId: "butterscotch" },
  { id: "caramel", name: "Caramel", desc: "Rasa karamel yang manis dan creamy.", price: 18000, emoji: "🍯", imageId: "caramel" },
  { id: "hazelnut", name: "Hazelnut", desc: "Aroma hazelnut yang kaya dan nutty.", price: 18000, emoji: "🌰", imageId: "hazelnut" },
  { id: "pandan", name: "Pandan", desc: "Rasa pandan khas dan harum.", price: 18000, emoji: "🌿", imageId: "pandan" },
  { id: "aren", name: "Aren", desc: "Gula aren alami yang earthy.", price: 18000, emoji: "🟤", imageId: "aren" },
  { id: "vanilla", name: "Vanilla", desc: "Vanilla klasik yang lembut.", price: 18000, emoji: "🤍", imageId: "vanilla" },
  { id: "scoffey-signature", name: "Scoffey Signature", desc: "Racikan khas Scoffey.", price: 16500, emoji: "⭐", imageId: "scoffey-signature" },
  { id: "classic-sweet", name: "Classic Sweet", desc: "Manis klasik yang pas.", price: 13500, emoji: "☕", imageId: "classic-sweet" },
  { id: "choco-butterscotch", name: "Choco Butterscotch", desc: "Paduan cokelat dan butterscotch.", price: 17500, emoji: "🍫", imageId: "choco-butterscotch" },
  { id: "choco-caramel", name: "Choco Caramel", desc: "Cokelat bertemu karamel.", price: 17500, emoji: "🍫", imageId: "choco-caramel" },
  { id: "choco-vanilla", name: "Choco Vanilla", desc: "Cokelat creamy dengan vanilla.", price: 17500, emoji: "🍫", imageId: "choco-vanilla" },
  { id: "choco-pandan", name: "Choco Pandan", desc: "Cokelat harum dengan pandan.", price: 17500, emoji: "🍫", imageId: "choco-pandan" },
  { id: "brown-matcha", name: "Brown Matcha", desc: "Matcha dengan sentuhan gula aren.", price: 17500, emoji: "🍵", imageId: "brown-matcha" },
  { id: "chocolate-menu", name: "Chocolate", desc: "Cokelat manis klasik.", price: 15000, emoji: "🍫", imageId: "chocolate" },
  { id: "matcha-menu", name: "Matcha", desc: "Matcha premium yang earthy.", price: 15000, emoji: "🍵", imageId: "matcha" },
  { id: "red-velvet", name: "Red Velvet", desc: "Red velvet yang lembut dan creamy.", price: 15000, emoji: "🍰", imageId: "red-velvet" },
  { id: "strawberry", name: "Strawberry", desc: "Rasa stroberi yang segar.", price: 15000, emoji: "🍓", imageId: "strawberry" },
  { id: "americano-menu", name: "Americano", desc: "Espresso yang ringan dan bersih.", price: 13000, emoji: "🫙", imageId: "americano" },
  { id: "espresso-addon", name: "Espresso Shot (Add On)", desc: "Tambahan shot espresso.", price: 3000, emoji: "⚡", imageId: "espresso" },
];

/** Menu makanan ringan Scoffey. */
export const FOOD_MENU: MenuItem[] = [
  { id: "lempeng", name: "Lempeng", desc: "Kue tipis gurih, pas teman ngopi.", price: 15000, emoji: "🫓", imageId: "food-lempeng" },
  { id: "tapai-goreng", name: "Tapai Goreng", desc: "Tapai goreng renyah dengan rasa manis.", price: 15000, emoji: "🍘", imageId: "food-tapai-goreng" },
  { id: "tahu-bakso", name: "Tahu Bakso", desc: "Tahu isi bakso gurih hangat.", price: 20000, emoji: "🥟", imageId: "food-tahu-bakso" },
  { id: "tempe-mendoan", name: "Tempe Mendoan", desc: "Tempe goreng tepung khas Banyumas.", price: 20000, emoji: "🍘", imageId: "food-tempe-mendoan" },
  { id: "pisang-aroma", name: "Pisang Aroma", desc: "Pisang goreng renyah beraroma vanila.", price: 20000, emoji: "🍌", imageId: "food-pisang-aroma" },
  { id: "tahu-krispy", name: "Tahu Krispy", desc: "Tahu goreng crispy dengan bumbu lezat.", price: 15000, emoji: "🧈", imageId: "food-tahu-krispy" },
  { id: "pisang-roll", name: "Pisang Roll", desc: "Pisang gulung kulit lumpia renyah.", price: 15000, emoji: "🍥", imageId: "food-pisang-roll" },
  { id: "french-fries", name: "French Fries", desc: "Kentang goreng renyah klasik.", price: 20000, emoji: "🍟", imageId: "food-french-fries" },
  { id: "singkong-goreng", name: "Singkong Goreng", desc: "Singkong goreng empuk, taburan gula aren.", price: 20000, emoji: "🍠", imageId: "food-singkong-goreng" },
  { id: "cheesecake-original", name: "Cheesecake Original", desc: "Cheesecake klasik creamy, lembut dan manis pas.", price: 25000, emoji: "🍰", imageId: "food-cheesecake-original" },
  { id: "cheesecake-blueberry", name: "Cheesecake Blueberry", desc: "Cheesecake dengan topping blueberry segar.", price: 27000, emoji: "🫐", imageId: "food-cheesecake-blueberry" },
  { id: "cheesecake-chocolate", name: "Cheesecake Chocolate", desc: "Cheesecake dengan ganache cokelat pekat.", price: 27000, emoji: "🍫", imageId: "food-cheesecake-chocolate" },
  { id: "cheesecake-lotus", name: "Cheesecake Lotus", desc: "Cheesecake dengan crumbs biskuit Lotus Biscoff.", price: 32000, emoji: "🍪", imageId: "food-cheesecake-lotus" },
];

export type IngredientGroup =
  | "Susu & Krim"
  | "Sirup & Rasa"
  | "Topping"
  | "Bahan Lokal"
  | "Ekstra";

export type Ingredient = {
  id: string;
  name: string;
  group: IngredientGroup;
  emoji: string;
  price: number;
  /** Takaran komposisi yang dipakai barista. */
  amount: string;
};

/** Batas maksimal pilihan per grup. Grup tanpa entry = bebas. */
export const GROUP_LIMITS: Partial<Record<IngredientGroup, number>> = {
  "Susu & Krim": 1,
  Topping: 2,
};

export const INGREDIENTS: Ingredient[] = [
  { id: "fresh-milk", name: "Fresh Milk", group: "Susu & Krim", emoji: "🥛", price: 3000, amount: "120 ml" },
  { id: "oat-milk", name: "Oat Milk", group: "Susu & Krim", emoji: "🌾", price: 6000, amount: "120 ml" },
  { id: "almond-milk", name: "Almond Milk", group: "Susu & Krim", emoji: "🌰", price: 6000, amount: "120 ml" },
  { id: "caramel", name: "Caramel", group: "Sirup & Rasa", emoji: "🍯", price: 4000, amount: "15 ml (1 pump)" },
  { id: "butterscotch", name: "Butterscotch", group: "Sirup & Rasa", emoji: "🧈", price: 5000, amount: "15 ml (1 pump)" },
  { id: "brown-sugar", name: "Brown Sugar", group: "Sirup & Rasa", emoji: "🟤", price: 4000, amount: "15 ml (1 pump)" },
  { id: "vanilla", name: "Vanilla", group: "Sirup & Rasa", emoji: "🤍", price: 4000, amount: "15 ml (1 pump)" },
  { id: "pandan", name: "Pandan", group: "Sirup & Rasa", emoji: "🌿", price: 5000, amount: "15 ml (1 pump)" },
  { id: "chocolate-syrup", name: "Chocolate", group: "Sirup & Rasa", emoji: "🍫", price: 5000, amount: "20 ml" },
  { id: "strawberry", name: "Strawberry", group: "Sirup & Rasa", emoji: "🍓", price: 5000, amount: "15 ml (1 pump)" },
  { id: "orange", name: "Orange", group: "Sirup & Rasa", emoji: "🍊", price: 5000, amount: "15 ml (1 pump)" },
  { id: "mango", name: "Mango", group: "Sirup & Rasa", emoji: "🥭", price: 5000, amount: "15 ml (1 pump)" },
  { id: "lemon", name: "Lemon", group: "Sirup & Rasa", emoji: "🍋", price: 4000, amount: "10 ml + 1 slice" },
  { id: "hazelnut", name: "Hazelnut", group: "Sirup & Rasa", emoji: "🌳", price: 4000, amount: "15 ml (1 pump)" },
  { id: "whipped", name: "Whipped Cream", group: "Topping", emoji: "🍦", price: 5000, amount: "1 swirl (20 g)" },
  { id: "cinnamon", name: "Cinnamon", group: "Topping", emoji: "🪵", price: 2000, amount: "1 g taburan" },
  { id: "cocoa", name: "Cocoa Dust", group: "Topping", emoji: "🍫", price: 2000, amount: "1 g taburan" },
  { id: "boba", name: "Brown Sugar Boba", group: "Topping", emoji: "🧋", price: 7000, amount: "60 g" },
  { id: "sea-salt", name: "Sea Salt Foam", group: "Topping", emoji: "🧂", price: 6000, amount: "40 ml" },
  { id: "walnut", name: "Kacang Kenari", group: "Topping", emoji: "🌰", price: 6000, amount: "10 g cincang" },
  { id: "cashew", name: "Kacang Mede", group: "Topping", emoji: "🥜", price: 6000, amount: "10 g cincang" },
  { id: "jahe", name: "Jahe", group: "Bahan Lokal", emoji: "🫚", price: 4000, amount: "5 g parut" },
  { id: "telang", name: "Bunga Telang", group: "Bahan Lokal", emoji: "🌸", price: 5000, amount: "3 kuntum" },
  { id: "moringa", name: "Moringa", group: "Bahan Lokal", emoji: "🌿", price: 5000, amount: "2 g bubuk" },
  { id: "kelakai", name: "Kelakai", group: "Bahan Lokal", emoji: "🍃", price: 5000, amount: "2 g ekstrak" },
  { id: "extra-shot", name: "Extra Shot", group: "Ekstra", emoji: "⚡", price: 8000, amount: "1 shot (30 ml)" },
  { id: "honey", name: "Honey", group: "Ekstra", emoji: "🍯", price: 3000, amount: "10 ml" },
];


export const TASTE_STEPS = [
  { key: "sweetness", label: "Sweetness", options: ["Low", "Medium", "Sweet", "Extra Sweet"] },
  { key: "intensity", label: "Intensity", options: ["Mild", "Balanced", "Strong", "Very Strong"] },
  { key: "creaminess", label: "Creaminess", options: ["Light", "Creamy", "Very Creamy"] },
  { key: "temperature", label: "Temperature", options: ["Hot", "Iced", "Frappe"] },
  { key: "mood", label: "Mood", options: ["Fruity", "Nutty", "Chocolatey", "Floral", "Classic"] },
] as const;

export type TasteKey = (typeof TASTE_STEPS)[number]["key"];
export type Taste = Record<TasteKey, string>;

export const DEFAULT_TASTE: Taste = {
  sweetness: "Medium",
  intensity: "Strong",
  creaminess: "Very Creamy",
  temperature: "Iced",
  mood: "Fruity",
};

export type Adjust = { sweet: number; strength: number; milk: number; ice: number };
export const DEFAULT_ADJUST: Adjust = { sweet: 50, strength: 65, milk: 55, ice: 60 };

export const formatIDR = (n: number) =>
  "Rp " + Math.round(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

const NAME_PREFIX: Record<string, string> = {
  Fruity: "Sunset",
  Nutty: "Amber",
  Chocolatey: "Midnight",
  Floral: "Bloom",
  Classic: "Signature",
};


export type Recipe = {
  name: string;
  tagline: string;
  note: string;
  matchScore: number;
  compatibility: number;
  profile: { label: string; value: number }[];
  steps: string[];
  price: number;
  style?: string;
  flavorNotes?: string[];
};

export function computePrice(
  baseId: string | null,
  ingredientIds: string[],
  taste: Taste,
): number {
  const base = BASES.find((b) => b.id === baseId) ?? DEFAULT_BASE;
  return (
    base.price +
    INGREDIENTS.filter((i) => ingredientIds.includes(i.id)).reduce((s, i) => s + i.price, 0) +
    (taste.temperature === "Frappe" ? 5000 : 0)
  );
}

export function buildRecipe(
  baseId: string | null,
  taste: Taste,
  ingredientIds: string[],
  adjust: Adjust,
): Recipe {
  const base = BASES.find((b) => b.id === baseId) ?? DEFAULT_BASE;
  const ingredients = INGREDIENTS.filter((i) => ingredientIds.includes(i.id));

  const sweetMap: Record<string, number> = { Low: 25, Medium: 50, Sweet: 72, "Extra Sweet": 90 };
  const intenseMap: Record<string, number> = { Mild: 30, Balanced: 55, Strong: 78, "Very Strong": 92 };
  const creamMap: Record<string, number> = { Light: 30, Creamy: 60, "Very Creamy": 85 };

  const sweet = Math.round(((sweetMap[taste.sweetness] ?? 50) + adjust.sweet) / 2);
  const strength = Math.round(
    ((intenseMap[taste.intensity] ?? 55) + base.strength * 18 + adjust.strength) / 3,
  );
  const creamy = Math.round(((creamMap[taste.creaminess] ?? 60) + adjust.milk) / 2);

  const aroma = Math.min(96, 45 + ingredients.length * 7);
  const body = Math.round((creamy + strength) / 2);

  const balance = 100 - Math.abs(sweet - strength) / 2 - Math.abs(creamy - 60) / 4;
  const matchScore = Math.max(72, Math.min(99, Math.round(balance - 4 + ingredients.length * 1.4)));
  const compatibility = Math.max(70, Math.min(98, Math.round(matchScore - 3 + (ingredients.length > 5 ? -4 : 2))));

  const flavorLead = ingredients.find((i) => i.group === "Sirup & Rasa")?.name ?? taste.mood;
  const name = `${NAME_PREFIX[taste.mood] ?? "Signature"} ${flavorLead} ${base.name.split(" ")[0] ?? base.name}`;

  const price =
    base.price +
    ingredients.reduce((s, i) => s + i.price, 0) +
    (taste.temperature === "Frappe" ? 5000 : 0);

  const id = getLang() === "id";

  return {
    name,
    tagline: `${t(taste.temperature)} · ${t(taste.intensity)} · ${t(taste.creaminess)}`,
    note: id
      ? `Takaran ${flavorLead.toLowerCase()} disesuaikan agar rasa ${base.name.toLowerCase()} tetap dominan dan seimbang dengan kelembutan susu.`
      : `The ${flavorLead.toLowerCase()} measure is tuned so the ${base.name.toLowerCase()} character stays dominant and balanced with the softness of milk.`,
    matchScore,
    compatibility,
    profile: [
      { label: "Sweetness", value: sweet },
      { label: "Strength", value: strength },
      { label: "Creaminess", value: creamy },
      { label: "Aroma", value: aroma },
      { label: "Body", value: body },
      { label: "Ice Level", value: adjust.ice },
    ],

    steps: id
      ? [
          `Ekstraksi ${base.name} sebagai fondasi rasa.`,
          ingredients.length
            ? `Tambahkan ${ingredients.map((i) => i.name).join(", ")} sesuai takaran AI.`
            : "Sajikan murni tanpa tambahan bahan.",
          `Sajikan ${t(taste.temperature).toLowerCase()} dengan tingkat es ${adjust.ice}%.`,
          "Cek balance akhir dan sajikan dalam gelas signature Scoffey.",
        ]
      : [
          `Extract the ${base.name} as the flavour foundation.`,
          ingredients.length
            ? `Add ${ingredients.map((i) => i.name).join(", ")} per the AI measurements.`
            : "Serve pure with no extra ingredients.",
          `Serve ${taste.temperature.toLowerCase()} with an ice level of ${adjust.ice}%.`,
          "Check the final balance and serve in Scoffey's signature glass.",
        ],
    price,
  };
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n)));
const blend = (a: number, b: number) => (a + b) / 2;

/**
 * Terapkan slider penyesuaian ke sebuah resep (lokal maupun hasil AI) supaya
 * profil rasa, match score, dan compatibility berubah real-time — termasuk
 * pengaruh Ice Level.
 */
export function applyAdjust(recipe: Recipe, adjust: Adjust, taste?: Taste): Recipe {
  const get = (label: string) =>
    recipe.profile.find((p) => p.label.toLowerCase().startsWith(label))?.value ?? 55;

  const iceDelta = adjust.ice - 50; // > 0 = lebih banyak es → lebih encer & segar

  const sweet = clamp(blend(get("sweet"), adjust.sweet) - iceDelta * 0.12);
  const strength = clamp(blend(get("strength"), adjust.strength) - iceDelta * 0.18);
  const creamy = clamp(blend(get("cream"), adjust.milk) - iceDelta * 0.1);
  const aroma = clamp(get("aroma") - iceDelta * 0.14);
  const body = clamp((creamy + strength) / 2 - iceDelta * 0.2);

  // Ice ideal mengikuti suhu sajian yang dipilih.
  const idealIce =
    taste?.temperature === "Hot" ? 10 : taste?.temperature === "Frappe" ? 80 : 60;
  const icePenalty = Math.abs(adjust.ice - idealIce) / 5;

  const balance =
    100 - Math.abs(sweet - strength) / 2 - Math.abs(creamy - 60) / 4 - icePenalty;

  const matchScore = clamp(balance, 60, 99);
  const compatibility = clamp(matchScore - 2 - icePenalty / 2, 55, 98);

  return {
    ...recipe,
    matchScore,
    compatibility,
    profile: [
      { label: "Sweetness", value: sweet },
      { label: "Strength", value: strength },
      { label: "Creaminess", value: creamy },
      { label: "Aroma", value: aroma },
      { label: "Body", value: body },
      { label: "Ice Level", value: adjust.ice },
    ],
  };
}
