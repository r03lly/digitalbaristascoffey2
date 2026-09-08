import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Skala isi agar muat di tinggi wadahnya, supaya layar mobile & tablet
 * tidak perlu scroll ke bawah.
 *
 * Cara kerja: ukur tinggi natural konten pada skala 1, lalu kecilkan dengan
 * transform (origin kiri-atas) sambil melebarkan kotak isi (100/s %) supaya
 * lebar visualnya tetap penuh. Skala dibatasi `min` agar teks tetap terbaca —
 * jika konten masih terlalu panjang, wadahnya baru boleh discroll.
 */
export function FitScale({
  children,
  min = 0.68,
  className = "",
  lgOnly = false,
}: {
  children: ReactNode;
  /** Skala terkecil yang diizinkan (jaga keterbacaan). */
  min?: number;
  className?: string;
  /** Jika true, penskalaan hanya aktif di layar lg ke atas; di mobile konten discroll natural. */
  lgOnly?: boolean;
}) {
  const [isLg, setIsLg] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const active = !lgOnly || isLg;
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const [boxHeight, setBoxHeight] = useState<number | undefined>(undefined);

  const measure = useCallback(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    if (!active) {
      setScale(1);
      setBoxHeight(undefined);
      return;
    }
    const cs = getComputedStyle(o);
    const avail =
      o.clientHeight -
      (parseFloat(cs.paddingTop) || 0) -
      (parseFloat(cs.paddingBottom) || 0);
    if (avail <= 0) return;
    // tinggi natural = tinggi terukur dibagi skala yang sedang dipakai
    const current = Number(i.dataset["scale"] ?? "1");
    const rendered = i.getBoundingClientRect().height;
    const natural = rendered / current;
    if (natural <= 0) return;
    const raw = Math.min(1, Math.max(min, avail / natural));
    // bulatkan supaya tidak jitter bolak-balik antar render
    const next = Math.round(raw * 100) / 100;
    setScale((prev) => (Math.abs(prev - next) > 0.011 ? next : prev));
    const box = Math.ceil(natural * next);
    setBoxHeight((prev) => (prev === undefined || Math.abs(prev - box) > 2 ? box : prev));
  }, [min, active]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(o);
    ro.observe(i);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div ref={outer} className={`min-h-0 flex-1 overflow-x-hidden overflow-y-auto ${className}`}>
      {/* kotak penampung: tingginya = tinggi konten setelah diskalakan,
          supaya area scroll ikut mengecil (transform saja tidak cukup). */}
      <div
        className="overflow-hidden"
        style={scale < 1 && boxHeight ? { height: boxHeight } : undefined}
      >
        <div
          ref={inner}
          data-scale={scale}
          style={
            scale < 1
              ? {
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: `${100 / scale}%`,
                }
              : undefined
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}

