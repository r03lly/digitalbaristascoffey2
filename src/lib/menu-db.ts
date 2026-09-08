import { supabase } from "@/integrations/supabase/client";
import { FOOD_MENU, SCOFFEY_MENU, type MenuItem } from "./barista-data";

export type MenuRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  image_id: string;
  sort_order: number;
  active: boolean;
};

export type MenuInput = {
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji?: string;
  image_id?: string;
  sort_order?: number;
  active?: boolean;
};

export function rowToItem(row: MenuRow): MenuItem {
  return {
    id: row.slug,
    name: row.name,
    desc: row.description,
    price: Number(row.price),
    emoji: row.emoji,
    imageId: row.image_id,
  };
}

/** Menu bawaan sebagai cadangan jika database belum bisa dibaca. */
export const FALLBACK_DRINKS = SCOFFEY_MENU;
export const FALLBACK_FOOD = FOOD_MENU;

export async function fetchMenuItems(includeInactive = false): Promise<MenuRow[]> {
  let q = supabase
    .from("menu_items")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  if (!includeInactive) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as MenuRow[];
}

export async function adminCreateMenuItem(input: MenuInput): Promise<MenuRow> {
  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      slug: input.slug,
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      emoji: input.emoji ?? "",
      image_id: input.image_id ?? "",
      sort_order: input.sort_order ?? 99,
      active: input.active ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  return data as MenuRow;
}

export async function adminUpdateMenuItem(
  id: string,
  patch: Partial<Omit<MenuRow, "id">>,
): Promise<void> {
  const { error } = await supabase.from("menu_items").update(patch).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}
