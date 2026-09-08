import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Bot,
  Check,
  Coffee,
  Home,
  PlusCircle,
  Sparkles,
  User,
  Users,
  Wifi,
} from "lucide-react";
import { robotLogo } from "@/lib/barista-images";
import { t } from "@/lib/i18n";
import { FitScale } from "@/components/FitScale";

export function BaristaLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const scale = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" }[size];
  const mark = { sm: "size-9", md: "size-12", lg: "size-16" }[size];
  return (
    <div className="flex flex-col items-center gap-1">
      <img
        src={robotLogo}
        alt="Logo robot barista Digital Barista by Scoffey"
        width={816}
        height={816}
        className={`${mark} object-contain`}
      />
      <p className="label-caps text-primary/80">Digital</p>
      <h1 className={`display-title ${scale} font-bold tracking-[0.16em] text-foreground`}>
        BARISTA
      </h1>
      <p className="label-caps text-muted-foreground">
        by <span className="text-primary">SCOFFEY</span>
      </p>
    </div>
  );
}

/** iPhone-style status bar with dynamic island, matching the PDF mockups. */
export function StatusBar() {
  return (
    <div className="relative flex items-center justify-between px-6 pt-3 pb-1 text-[0.82rem] font-semibold text-foreground">
      <span>9:41</span>
      <span className="absolute top-2 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <span className="flex items-end gap-[2px]">
          <span className="h-1 w-[3px] rounded-sm bg-foreground/70" />
          <span className="h-1.5 w-[3px] rounded-sm bg-foreground/70" />
          <span className="h-2 w-[3px] rounded-sm bg-foreground/70" />
          <span className="h-2.5 w-[3px] rounded-sm bg-foreground" />
        </span>
        <Wifi className="size-3" />
        <span className="flex h-2.5 w-5 items-center rounded-[3px] border border-foreground/70 p-[1.5px]">
          <span className="h-full w-4/5 rounded-[1px] bg-foreground" />
        </span>
      </span>
    </div>
  );
}

/** Numbered 1..5 step chain used across the co-creation flow (PDF pages 4-8). */
export function StepChain({ current, total = 5 }: { current: number; total?: number }) {
  return (
    <div className="flex items-center justify-center gap-0 px-2">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex flex-1 items-center last:flex-none">
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.76rem] font-bold ${
                done || active
                  ? "surface-gold border-primary text-primary-foreground"
                  : "border-muted-foreground/40 text-muted-foreground"
              }`}
            >
              {done ? <Check className="size-3" /> : n}
            </span>
            {n < total && (
              <span
                className={`h-[2px] flex-1 ${done ? "bg-primary" : "bg-muted-foreground/30"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Centered robot header + step chain + centered title, as in the PDF screens. */
export function CreateHeader({
  back,
  step,
  title,
  subtitle,
  right,
}: {
  back: string;
  step?: number;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="px-5 pt-1">
      <div className="flex items-center justify-between">
        <Link
          to={back}
          aria-label={t("Kembali")}
          className="text-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-5 text-right">{right}</div>
      </div>

      {step && (
        <div className="mt-3">
          <StepChain current={step} />
        </div>
      )}
      <h2 className="display-title mt-4 text-center text-[1.35rem] font-semibold tracking-[0.06em] text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-center text-[0.86rem] text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}

/**
 * Responsive device frame.
 * - mobile: full-bleed, full height, no rounding
 * - tablet/desktop: centered card, capped to the viewport height with
 *   internal scrolling so it always fits on screen.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-[100dvh] justify-center overflow-hidden bg-background px-0 py-0 sm:items-center sm:px-6 sm:py-6 lg:px-10 lg:py-8">
      <div className="flex h-full w-full max-w-none flex-col sm:max-w-[440px] md:max-w-3xl lg:max-w-3xl xl:max-w-4xl">
        <div className="surface-navy shadow-premium relative flex h-full min-h-0 flex-col overflow-hidden rounded-none border-0 sm:rounded-[2.25rem] sm:border sm:border-border md:rounded-[2rem]">

          {children}
        </div>
      </div>
    </main>
  );
}

export type NavItem = { to: string; label: string; icon: typeof Home };

export function PhoneShell({
  children,
  title,
  step,
  back,
  nav = false,
  navItems,
  header,
  flush = false,
}: {
  children: ReactNode;
  title?: string;
  step?: string;
  back?: string;
  nav?: boolean;
  /** Custom nav items; when provided with `nav`, overrides the default bottom nav. */
  navItems?: NavItem[] | undefined;
  /** Custom header rendered inside the phone frame (e.g. CreateHeader). */
  header?: ReactNode;
  /** Remove horizontal padding on the content area. */
  flush?: boolean;
}) {
  return (
    <PhoneFrame>
      <>
        <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex h-full min-h-0 flex-1 flex-col">
          <div className="shrink-0 md:order-1">
            <BrandBar />
          </div>
          {header && <div className="shrink-0 md:order-3 md:mt-2">{header}</div>}
          {!header && (title || back) && (
            <header className="relative flex shrink-0 items-center gap-3 border-b border-border/60 px-6 pt-1 pb-3 md:order-3 md:mt-2 md:px-10 md:pb-5">
              {back && (
                <Link
                  to={back}
                  aria-label={t("Kembali")}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ArrowLeft className="size-4" />
                </Link>
              )}
              <div className="min-w-0 flex-1 text-center md:text-left">
                {title && (
                  <h2 className="display-title truncate text-[1.3rem] font-semibold tracking-[0.06em] text-foreground md:text-[1.9rem]">
                    {title}
                  </h2>
                )}
                {step && <p className="label-caps mt-1 text-primary">{step}</p>}
              </div>
              {back && <span className="size-8 shrink-0 md:hidden" aria-hidden />}
            </header>
          )}
          <FitScale
            lgOnly
            min={0.82}
            className={`animate-rise pt-3 pb-4 md:order-4 md:pt-5 md:pb-8 ${
              flush ? "px-0" : "px-5 md:px-10"
            }`}
          >
            {children}
          </FitScale>


          {nav ? (
            <BottomNav items={navItems ?? NAV} />
          ) : (
            <div className="flex justify-center pb-2 md:hidden">
              <span className="h-1 w-32 rounded-full bg-foreground/70" />
            </div>
          )}
        </div>
      </>
    </PhoneFrame>
  );
}

/** Compact brand lockup matching the splash screen, shown on pages 02-10. */
export function BrandBar() {
  return (
    <div className="relative flex flex-col items-center gap-0.5 pt-6 pb-3 md:flex-row md:items-center md:gap-3 md:px-10 md:pt-7 md:pb-4">
      <img
        src={robotLogo}
        alt="Logo robot barista Digital Barista by Scoffey"
        width={816}
        height={816}
        className="size-10 shrink-0 object-contain md:size-12"
      />
      <div className="flex flex-col items-center md:items-start">
        <p className="label-caps text-primary/80">Digital</p>
        <p className="display-title text-lg font-bold tracking-[0.16em] text-foreground md:text-2xl">
          BARISTA
        </p>
        <p className="label-caps text-muted-foreground">
          by <span className="text-primary">SCOFFEY</span>
        </p>
      </div>
    </div>
  );
}

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/create/base", label: "Create", icon: PlusCircle },
  { to: "/creations", label: "My Creations", icon: Coffee },
  { to: "/community", label: "Community", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav({ items = NAV }: { items?: NavItem[] }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="shrink-0 border-t border-border bg-background/60 px-3 pt-2 pb-3 md:order-2 md:border-t-0 md:border-b md:bg-transparent md:px-10 md:pt-0 md:pb-4">
      <div className="flex items-start gap-0.5 md:justify-start md:gap-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = path === to || (to !== "/home" && path.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5 md:flex-none text-center text-[0.66rem] leading-tight transition-colors sm:text-[0.72rem] md:flex-row md:rounded-full md:border md:px-4 md:py-2 md:text-[0.88rem] ${
                active
                  ? "text-primary md:border-primary/60 md:bg-primary/10"
                  : "text-muted-foreground hover:text-foreground md:border-border/60 md:hover:border-primary/50"
              }`}
            >
              <Icon className="size-5 shrink-0 md:size-4" />
              <span className="w-full truncate md:w-auto md:overflow-visible">{t(label)}</span>
            </Link>
          );
        })}

      </div>
      <div className="mt-2 flex justify-center md:hidden">
        <span className="h-1 w-32 rounded-full bg-foreground/70" />
      </div>
    </nav>
  );
}

export function ScoffeyFooter() {
  return (
    <footer className="mt-5 flex items-center justify-between gap-4 px-2 text-muted-foreground">
      <div>
        <p className="display-title text-base tracking-[0.28em] text-foreground">SCOFFEY</p>
        <p className="text-[0.72rem] tracking-[0.14em]">coffee • community • comfort</p>
      </div>
      <div className="text-right">
        <p className="label-caps text-primary">Digital Barista</p>
        <p className="text-[0.72rem] tracking-[0.14em]">AI-Driven Beverage Co-Creation</p>
      </div>
    </footer>
  );
}

export function GoldButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="surface-gold shadow-gold w-full rounded-2xl px-6 py-3.5 text-sm font-semibold tracking-[0.12em] text-primary-foreground uppercase transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-primary/60 px-6 py-3.5 text-sm font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-accent"
    >
      {children}
    </button>
  );
}

export function InfoCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2">
        {icon ?? <Sparkles className="size-4 text-primary" />}
        <h3 className="label-caps text-primary">{title}</h3>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

/** Section heading in the PDF's small uppercase style. */
export function SectionLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[0.82rem] font-semibold tracking-[0.14em] text-foreground uppercase">
        {children}
      </h3>
      {action}
    </div>
  );
}

/** Circular gold progress ring used for AI scores. */
export function ScoreRing({ value, size = 64 }: { value: number; size?: number }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth="5"
        className="stroke-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${(c * value) / 100} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="stroke-primary"
      />
    </svg>
  );
}

/** Small segmented meter used for taste profiles in the PDF. */
export function SegmentMeter({ value, total = 6 }: { value: number; total?: number }) {
  const filled = Math.round((value / 100) * total);
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-3 rounded-full ${i < filled ? "bg-primary" : "bg-muted"}`}
        />
      ))}
    </span>
  );
}

export function RobotNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-primary/30 bg-card/60 p-3">
      <div className="flex gap-2.5">
        <Bot className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="text-[0.8rem] font-semibold tracking-[0.12em] text-primary uppercase">
            {title}
          </p>
          <p className="mt-1 text-[0.84rem] leading-snug text-muted-foreground">{children}</p>
        </div>
      </div>
    </section>
  );
}

export function ProgressDots({
  current,
  total = 7,
  labels,
  showCounter = false,
}: {
  current: number;
  total?: number;
  labels?: string[];
  showCounter?: boolean;
}) {
  const effectiveLabels = labels ?? [];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i + 1 === current ? "w-6 bg-primary" : "w-1.5 bg-muted"
            }`}
          />
        ))}
      </div>
      {(showCounter || effectiveLabels.length > 0) && (
        <div className="flex flex-col items-center gap-0.5">
          {showCounter && (
            <p className="text-[0.72rem] tracking-[0.12em] text-muted-foreground uppercase">
              {t("Langkah")} {current} {t("dari")} {total}
            </p>
          )}
          {effectiveLabels.length > 0 && (
            <div className="flex w-full items-center justify-center gap-0 px-1">
              {effectiveLabels.map((label, i) => (
                <span
                  key={i}
                  className={`flex-1 text-center text-[0.62rem] leading-tight md:text-[0.72rem] ${
                    i + 1 === current ? "font-semibold text-primary" : "text-muted-foreground"
                  }`}
                >
                  {t(label)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
