import { supabase } from "@/integrations/supabase/client";
import type { Order, OrderLine } from "./barista-store";

type Row = {
  id: string;
  code: string;
  customer: string;
  name: string;
  price: number;
  tax: number;
  service: number;
  tip: number;
  total: number;
  match_score: number;
  payment: string;
  option: string;
  note: string;
  kind: string;
  lines: unknown;
  created_at: string;
};

export function rowToOrder(row: Row): Order {
  return {
    id: row.code,
    name: row.name,
    price: row.price,
    tax: row.tax,
    service: row.service,
    tip: row.tip,
    total: row.total,
    when: row.created_at,
    matchScore: row.match_score,
    payment: row.payment,
    option: row.option,
    note: row.note,
    customer: row.customer,
    kind: row.kind === "regular" ? "regular" : "signature",
    lines: Array.isArray(row.lines) ? (row.lines as OrderLine[]) : [],
  };
}

/** Simpan pesanan ke database supaya tetap tercatat setelah logout. */
export async function saveOrder(order: Order, userId: string | null) {
  const { error } = await supabase.from("orders").insert({
    code: order.id,
    user_id: userId,
    customer: order.customer,
    name: order.name,
    price: Math.round(order.price),
    tax: Math.round(order.tax),
    service: Math.round(order.service),
    tip: Math.round(order.tip),
    total: Math.round(order.total),
    match_score: Math.round(order.matchScore),
    payment: order.payment,
    option: order.option,
    note: order.note,
    kind: order.kind,
    lines: order.lines,
  });
  if (error) throw error;
}

export type TopCreation = {
  name: string;
  matchScore: number;
  price: number;
  lines: OrderLine[];
};

/** Kreasi buatan pelanggan dengan match score tertinggi. */
export async function fetchTopCreations(limit = 8): Promise<TopCreation[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("name, match_score, price, lines")
    .eq("kind", "signature")
    .gt("match_score", 0)
    .order("match_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  const seen = new Set<string>();
  const out: TopCreation[] = [];
  for (const r of data ?? []) {
    const name = (r.name ?? "").trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    out.push({
      name,
      matchScore: r.match_score,
      price: r.price,
      lines: Array.isArray(r.lines) ? (r.lines as OrderLine[]) : [],
    });
    if (out.length >= limit) break;
  }
  return out;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return (data ?? []).map((r) => rowToOrder(r as unknown as Row));
}
