import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Context,
} from "react";
import {
  DEFAULT_ADJUST,
  DEFAULT_TASTE,
  GROUP_LIMITS,
  INGREDIENTS,
  applyAdjust,
  buildRecipe,
  computePrice,
  type Adjust,
  type Recipe,
  type Taste,
  type TasteKey,
} from "./barista-data";
import { buildLocalVariants, brewDelayMs } from "./recipe-local";
import { supabase } from "@/integrations/supabase/client";
import { fetchOrders, saveOrder } from "./orders-db";
import {
  createPlan,
  deletePlan,
  fetchMyProfile,
  fetchPlans,
  updatePlan,
  type Plan,
  type PlanInput,
} from "./account-db";

export type OrderLine = { name: string; amount: string; price: number };

export type Order = {
  id: string;
  name: string;
  /** Subtotal minuman (tanpa pajak/layanan/tip). */
  price: number;
  tax: number;
  service: number;
  tip: number;
  total: number;
  when: string;
  matchScore: number;
  payment: string;
  option: string;
  note: string;
  customer: string;
  kind: "signature" | "regular";
  lines: OrderLine[];
};

export type OrderInput = {
  name: string;
  /** Nama pemesan dari tamu (tanpa akun); menimpa userName bila diisi. */
  customer?: string;
  price: number;
  tax: number;
  service: number;
  tip: number;
  matchScore: number;
  payment: string;
  option: string;
  note: string;
  kind: "signature" | "regular";
  lines: OrderLine[];
};

type MenuSelection = { id: string; name: string; price: number } | null;

export type CartItem = { id: string; name: string; price: number; qty: number };

type State = {
  userName: string;
  guest: boolean;
  /** true setelah login / masuk sebagai guest; false lagi setelah logout. */
  entered: boolean;
  baseId: string | null;
  taste: Taste;
  ingredients: string[];
  adjust: Adjust;
  orders: Order[];
  saved: string[];
  menuItem: MenuSelection;
  /** Keranjang menu reguler: bisa banyak item dengan jumlah masing-masing. */
  cart: CartItem[];
};

const initial: State = {
  userName: "Kreator",
  guest: true,
  entered: false,
  baseId: null,
  taste: DEFAULT_TASTE,
  ingredients: [],
  adjust: DEFAULT_ADJUST,
  orders: [],
  saved: [],
  menuItem: null,
  cart: [],
};


type AiStatus = "idle" | "loading" | "ready" | "error";

type Ctx = State & {
  recipe: Recipe;
  aiStatus: AiStatus;
  aiError: string | null;
  aiVariants: Recipe[];
  activeVariant: number;
  setActiveVariant: (i: number) => void;
  generateRecipe: (regenerate?: boolean) => void;
  /** Mulai meracik hanya jika pilihan berubah sejak racikan terakhir (dipanggil dari halaman hasil). */
  ensureRecipe: () => void;
  signIn: (name: string, guest?: boolean) => void;
  setBase: (id: string) => void;
  setTaste: (key: TasteKey, value: string) => void;
  toggleIngredient: (id: string) => void;
  setAdjust: (key: keyof Adjust, value: number) => void;
  saveRecipe: () => void;
  placeOrder: (input: OrderInput) => Order;
  /** Akun yang sedang masuk (null = tamu). */
  userId: string | null;
  email: string | null;
  roles: string[];
  isAdmin: boolean;
  isBarista: boolean;
  authReady: boolean;
  dbOrders: Order[];
  dbLoading: boolean;
  refreshOrders: () => void;
  /** Poin loyalitas dari database (0 untuk tamu). */
  points: number;
  plans: Plan[];
  accountLoading: boolean;
  refreshAccount: () => void;
  addPlan: (input: PlanInput) => Promise<void>;
  setPlanActive: (id: string, active: boolean) => Promise<void>;
  removePlan: (id: string) => Promise<void>;
  signInPassword: (email: string, password: string) => Promise<void>;
  signUpPassword: (email: string, password: string, name: string) => Promise<void>;
  signOutAccount: () => Promise<void>;
  selectMenuItem: (item: MenuSelection) => void;
  addToCart: (item: { id: string; name: string; price: number }, qty?: number) => void;
  setCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  resetCreation: () => void;
};


// Keep the context identity stable across hot-module reloads, otherwise a
// refreshed hook module can't see the provider mounted from the old module.
const g = globalThis as unknown as { __baristaCtx?: Context<Ctx | null> };
const BaristaContext = (g.__baristaCtx ??= createContext<Ctx | null>(null));
const KEY = "scoffey-digital-barista";

export function BaristaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [authReady, setAuthReady] = useState(false);
  const [dbOrders, setDbOrders] = useState<Order[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [accountLoading, setAccountLoading] = useState(false);

  useEffect(() => {
    const apply = (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null) => {
      setUserId(user?.id ?? null);
      setEmail(user?.email ?? null);
      setAuthReady(true);
      if (user) {
        const dn = (user.user_metadata?.["display_name"] as string | undefined) ?? user.email?.split("@")[0];
        setState((s) => ({ ...s, userName: dn || s.userName, guest: false, entered: true }));
      }
    };
    supabase.auth.getSession().then(({ data }) => apply(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => apply(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setRoles([]);
      return;
    }
    let alive = true;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (alive) setRoles((data ?? []).map((r) => String((r as { role: string }).role)));
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  const refreshOrders = useCallback(() => {
    setDbLoading(true);
    fetchOrders()
      .then((rows) => setDbOrders(rows))
      .catch(() => setDbOrders([]))
      .finally(() => setDbLoading(false));
  }, []);

  useEffect(() => {
    if (userId) refreshOrders();
    else setDbOrders([]);
  }, [userId, refreshOrders]);

  const refreshAccount = useCallback(() => {
    if (!userId) {
      setPoints(0);
      setPlans([]);
      return;
    }
    setAccountLoading(true);
    Promise.all([fetchMyProfile(userId), fetchPlans(userId)])
      .then(([profile, rows]) => {
        setPoints(profile?.points ?? 0);
        setPlans(rows);
        if (profile?.display_name)
          setState((s) => ({ ...s, userName: profile.display_name, guest: false }));
      })
      .catch(() => {
        /* offline: biarkan nilai terakhir */
      })
      .finally(() => setAccountLoading(false));
  }, [userId]);

  useEffect(() => {
    refreshAccount();
  }, [refreshAccount]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const localRecipe = useMemo(
    () => buildRecipe(state.baseId, state.taste, state.ingredients, state.adjust),
    [state.baseId, state.taste, state.ingredients, state.adjust],
  );

  const [aiStatus, setAiStatus] = useState<AiStatus>("idle");
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiVariants, setAiVariants] = useState<Recipe[]>([]);
  const [activeVariant, setActiveVariant] = useState(0);
  const [seed, setSeed] = useState(1);

  const signature = `${state.baseId}|${JSON.stringify(state.taste)}|${state.ingredients
    .slice()
    .sort()
    .join(",")}`;
  const lastSignature = useRef<string | null>(null);

  const price = computePrice(state.baseId, state.ingredients, state.taste);

  const generateRecipe = useCallback(
    (regenerate = false) => {
      const nextSeed = regenerate ? seed + 1 : seed;
      if (regenerate) setSeed(nextSeed);
      lastSignature.current = signature;
      setAiStatus("loading");
      setAiError(null);
      // Resep diracik 100% lokal (tanpa server/kunci AI) supaya berfungsi di
      // hosting mana pun. Delay disimulasikan agar animasi "AI meracik" tampil.
      const usedSeed = regenerate ? nextSeed : seed;
      const variants = buildLocalVariants(
        state.baseId,
        state.taste,
        state.ingredients,
        state.adjust,
        usedSeed,
      ).map((v) => ({ ...v, price }));
      window.setTimeout(() => {
        setAiVariants(variants);
        setActiveVariant(0);
        setAiStatus("ready");
      }, brewDelayMs(usedSeed));
    },
    [seed, signature, state.baseId, state.taste, state.ingredients, state.adjust, price],
  );

  // Meracik hanya dimulai saat halaman AI Recommendation dibuka (lewat
  // ensureRecipe), supaya animasi "AI is Brewing" selalu terlihat pengguna —
  // sebelumnya auto-generate berjalan sejak halaman bahan sehingga animasi
  // sudah selesai sebelum pengguna menekan Continue.
  const ensureRecipe = useCallback(() => {
    if (!state.baseId) return;
    if (lastSignature.current === signature && aiStatus !== "idle") return;
    generateRecipe(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, state.baseId, aiStatus, generateRecipe]);

  const baseRecipe: Recipe =
    aiStatus === "ready" && aiVariants[activeVariant]
      ? { ...aiVariants[activeVariant]!, price }
      : localRecipe;

  // Slider penyesuaian (termasuk Ice Level) selalu diterapkan ke resep aktif
  // supaya profil rasa dan skor berubah real-time.
  const recipe: Recipe = applyAdjust(baseRecipe, state.adjust, state.taste);

  const value: Ctx = {
    ...state,
    recipe,
    aiStatus,
    aiError,
    aiVariants,
    activeVariant,
    setActiveVariant,
    generateRecipe,
    ensureRecipe,
    signIn: (userName, guest = false) =>
      setState((s) => ({ ...s, userName: userName || "Kreator", guest, entered: true })),
    setBase: (baseId) => setState((s) => ({ ...s, baseId, menuItem: null })),
    setTaste: (key, val) => setState((s) => ({ ...s, taste: { ...s.taste, [key]: val } })),
    toggleIngredient: (id) =>
      setState((s) => {
        if (s.ingredients.includes(id))
          return { ...s, ingredients: s.ingredients.filter((i) => i !== id) };

        const group = INGREDIENTS.find((i) => i.id === id)?.group;
        const limit = group ? GROUP_LIMITS[group] : undefined;
        let next = s.ingredients;

        if (group && limit) {
          const sameGroup = next.filter(
            (x) => INGREDIENTS.find((i) => i.id === x)?.group === group,
          );
          // Buang pilihan terlama di grup ini bila sudah mencapai batas.
          const overflow = sameGroup.slice(0, Math.max(0, sameGroup.length - (limit - 1)));
          next = next.filter((x) => !overflow.includes(x));
        }

        return { ...s, ingredients: [...next, id] };
      }),
    setAdjust: (key, val) => setState((s) => ({ ...s, adjust: { ...s.adjust, [key]: val } })),
    saveRecipe: () =>
      setState((s) => ({
        ...s,
        saved: s.saved.includes(recipe.name) ? s.saved : [recipe.name, ...s.saved].slice(0, 8),
      })),
    placeOrder: (input) => {
      const order: Order = {
        ...input,
        id: Math.random().toString(36).slice(2, 8).toUpperCase(),
        when: new Date().toISOString(),
        total: input.price + input.tax + input.service + input.tip,
        customer: input.customer?.trim() || state.userName,
      };
      setState((s) => ({ ...s, orders: [order, ...s.orders].slice(0, 100) }));
      // Simpan permanen di database supaya laporan tetap ada setelah logout.
      void saveOrder(order, userId)
        .then(() => {
          if (userId) refreshOrders();
        })
        .catch(() => {
          /* offline: pesanan tetap tampil dari penyimpanan lokal */
        });
      return order;
    },
    userId,
    email,
    roles,
    isAdmin: roles.includes("admin"),
    isBarista: roles.includes("barista") || roles.includes("admin"),
    authReady,
    dbOrders,
    dbLoading,
    refreshOrders,
    points,
    plans,
    accountLoading,
    refreshAccount,
    addPlan: async (input) => {
      if (!userId) throw new Error("Masuk dulu untuk menyimpan rencana.");
      const plan = await createPlan(userId, input);
      setPlans((p) => [plan, ...p]);
    },
    setPlanActive: async (id, active) => {
      await updatePlan(id, { active });
      setPlans((p) => p.map((x) => (x.id === id ? { ...x, active } : x)));
    },
    removePlan: async (id) => {
      await deletePlan(id);
      setPlans((p) => p.filter((x) => x.id !== id));
    },
    signInPassword: async (mail, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email: mail, password });
      if (error) throw error;
    },
    signUpPassword: async (mail, password, name) => {
      const { error } = await supabase.auth.signUp({
        email: mail,
        password,
        options: { data: { display_name: name || mail.split("@")[0] } },
      });
      if (error) throw error;
    },
    signOutAccount: async () => {
      await supabase.auth.signOut();
      setRoles([]);
      setDbOrders([]);
      setPoints(0);
      setPlans([]);
      setState((s) => ({ ...s, guest: true, userName: "Kreator", entered: false }));
    },
    selectMenuItem: (item) => setState((s) => ({ ...s, menuItem: item })),
    addToCart: (item, qty = 1) =>
      setState((s) => {
        const found = s.cart.find((c) => c.id === item.id);
        const cart = found
          ? s.cart.map((c) => (c.id === item.id ? { ...c, qty: Math.min(99, c.qty + qty) } : c))
          : [...s.cart, { ...item, qty: Math.max(1, qty) }];
        return { ...s, cart, menuItem: item };
      }),
    setCartQty: (id, qty) =>
      setState((s) => ({
        ...s,
        cart:
          qty <= 0
            ? s.cart.filter((c) => c.id !== id)
            : s.cart.map((c) => (c.id === id ? { ...c, qty: Math.min(99, qty) } : c)),
      })),
    removeFromCart: (id) => setState((s) => ({ ...s, cart: s.cart.filter((c) => c.id !== id) })),
    clearCart: () => setState((s) => ({ ...s, cart: [], menuItem: null })),
    cartCount: state.cart.reduce((n, c) => n + c.qty, 0),
    cartTotal: state.cart.reduce((n, c) => n + c.price * c.qty, 0),
    resetCreation: () =>
      setState((s) => ({
        ...s,
        baseId: null,
        taste: DEFAULT_TASTE,
        ingredients: [],
        adjust: DEFAULT_ADJUST,
        menuItem: null,
      })),

  };

  return <BaristaContext.Provider value={value}>{children}</BaristaContext.Provider>;
}

export function useBarista() {
  const ctx = useContext(BaristaContext);
  if (!ctx) throw new Error("useBarista must be used inside BaristaProvider");
  return ctx;
}
