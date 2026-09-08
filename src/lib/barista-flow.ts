/**
 * Alur sistem resmi mengikuti "DESIGN FLOW" pada PDF UI/UX Summary (halaman 1).
 * 01–10 adalah layar aplikasi, 11–14 adalah slide presentasi.
 */
export type FlowStep = {
  no: string;
  to:
    | "/"
    | "/auth"
    | "/home"
    | "/create/base"
    | "/create/taste"
    | "/create/ingredients"
    | "/create/result"
    | "/create/adjust"
    | "/create/recipe"
    | "/checkout"
    | "/about"
    | "/vision"
    | "/technology"
    | "/future";
  label: string;
  short: string;
  group: "Aplikasi" | "Presentasi";
};

export const FLOW_STEPS: FlowStep[] = [
  { no: "01", to: "/", label: "Splash / Onboarding", short: "Splash", group: "Aplikasi" },
  { no: "02", to: "/auth", label: "Login / Register", short: "Login", group: "Aplikasi" },
  { no: "03", to: "/home", label: "Home / Welcome Screen", short: "Home", group: "Aplikasi" },
  { no: "04", to: "/create/base", label: "Choose Your Base", short: "Base", group: "Aplikasi" },
  {
    no: "05",
    to: "/create/taste",
    label: "Select Taste Preferences",
    short: "Taste",
    group: "Aplikasi",
  },
  {
    no: "06",
    to: "/create/ingredients",
    label: "Pick Ingredients / Customize",
    short: "Ingredients",
    group: "Aplikasi",
  },
  {
    no: "07",
    to: "/create/result",
    label: "AI Recommendation / Digital Barista Result",
    short: "AI Result",
    group: "Aplikasi",
  },
  { no: "08", to: "/create/adjust", label: "Adjust Your Drink", short: "Adjust", group: "Aplikasi" },
  { no: "09", to: "/create/recipe", label: "Final Recipe Card", short: "Recipe", group: "Aplikasi" },
  {
    no: "10",
    to: "/checkout",
    label: "Order Summary / Checkout",
    short: "Checkout",
    group: "Aplikasi",
  },
  {
    no: "11",
    to: "/about",
    label: "Behind the Scene Digital Barista",
    short: "Behind the Scene",
    group: "Presentasi",
  },
  {
    no: "12",
    to: "/vision",
    label: "Bring Your Vision to Life with Digital Barista",
    short: "Vision",
    group: "Presentasi",
  },
  {
    no: "13",
    to: "/technology",
    label: "Technology Behind Digital Barista",
    short: "Technology",
    group: "Presentasi",
  },
  {
    no: "14",
    to: "/future",
    label: "Brewing the Future, Together",
    short: "Future",
    group: "Presentasi",
  },
];

/** Palet & tipografi seperti yang ditulis di PDF. */
export const BRAND_PALETTE = [
  { hex: "#0D1B2A", name: "Navy Deep" },
  { hex: "#14213D", name: "Navy" },
  { hex: "#1B263B", name: "Navy Soft" },
  { hex: "#D4AF37", name: "Gold" },
  { hex: "#E9D6B1", name: "Cream Gold" },
  { hex: "#6B4423", name: "Wood" },
  { hex: "#F5F7FA", name: "Off White" },
];

export const BRAND_TYPOGRAPHY = [
  { role: "Heading", value: "Poppins SemiBold / Bold" },
  { role: "Body", value: "Poppins Regular" },
  { role: "Accent", value: "Bebas Neue" },
];

export const DESIGN_PRINCIPLES = [
  { title: "Hangat & Premium", desc: "Warna kopi, krem, dan emas." },
  { title: "Sederhana & Fokus", desc: "Fokus pada satu tujuan: mulai berkreasi." },
  { title: "Mengundang", desc: "Visual & copy yang mengajak pengguna berkreasi." },
  { title: "Modern & Teknologis", desc: "AI siap membantu setiap kreativitas pelanggan." },
];
