import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Bot, Coffee } from "lucide-react";
import { FLOW_STEPS } from "@/lib/barista-flow";
import { FitScale } from "@/components/FitScale";

/** Menu slide mengikuti DESIGN FLOW 01–14 pada PDF. */
export function SlideMenu() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-wrap items-center gap-1.5">
      <Link
        to="/flow"
        className={`rounded-full border px-3 py-1 text-[0.76rem] tracking-[0.1em] uppercase transition-colors ${
          path === "/flow"
            ? "border-primary bg-primary/15 text-primary"
            : "border-border text-muted-foreground hover:border-primary hover:text-primary"
        }`}
      >
        Design Flow
      </Link>
      {FLOW_STEPS.map((item) => {
        const active = path === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            title={`${item.no} — ${item.label}`}
            className={`rounded-full border px-3 py-1 text-[0.76rem] tracking-[0.1em] uppercase transition-colors ${
              active
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <span className="mr-1 text-primary/70">{item.no}</span>
            {item.short}
          </Link>
        );
      })}
    </nav>
  );
}


export function SlideHeader({ page }: { page: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <span className="rounded-md border border-primary/50 bg-primary/10 px-3 py-1 label-caps text-primary">
        {page}
      </span>
      <div className="flex items-center gap-2 text-right">
        <Coffee className="size-6 text-primary" />
        <div>
          <p className="display-title text-lg leading-none tracking-[0.18em] text-foreground">
            DIGITAL BARISTA
          </p>
          <p className="label-caps text-muted-foreground">
            by <span className="text-primary">SCOFFEY</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function SlideTitle({
  lines,
  desc,
}: {
  lines: [string, string];
  desc: string;
}) {
  return (
    <div>
      <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/50 text-primary">
        <Bot className="size-6" />
      </div>
      <h1 className="display-title mt-4 text-4xl leading-[1.05] font-bold text-foreground lg:text-5xl">
        {lines[0]}
        <span className="text-gold-gradient block">{lines[1]}</span>
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

export function SectionBadge({ children }: { children: ReactNode }) {
  return (
    <span className="surface-wood inline-block rounded-lg border border-primary/30 px-4 py-1.5 label-caps text-cream">
      {children}
    </span>
  );
}

/** Slim mockup of a phone screen, used as the centre column of each slide. */
export function PhoneMock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="surface-navy shadow-premium rounded-[1.75rem] border border-primary/25 p-3">
      <div className="flex items-center justify-between px-1 text-[0.72rem] text-muted-foreground">
        <span>9:41</span>
        <span className="flex gap-1">
          <span className="h-1 w-4 rounded-full bg-muted-foreground/50" />
          <span className="h-1 w-2 rounded-full bg-muted-foreground/50" />
        </span>
      </div>
      <div className="mt-2 text-center">
        <p className="display-title text-sm tracking-[0.14em] text-primary">{title}</p>
        {subtitle && <p className="mt-1 text-[0.76rem] text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

export function FeatureList({
  heading,
  items,
}: {
  heading: string;
  items: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }[];
}) {
  return (
    <div>
      <p className="label-caps text-primary">{heading}</p>
      <div className="mt-4 space-y-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <article key={title} className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/40 text-primary">
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
                {title}
              </p>
              <p className="mt-1 text-[0.82rem] leading-snug text-muted-foreground">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function SlideShell({
  page,
  pageNumber,
  prev,
  next,
  prevLabel,
  nextLabel,
  children,
}: {
  page: string;
  pageNumber: string;
  prev: { to: string; label: string };
  next: { to: string; label: string };
  prevLabel?: string;
  nextLabel?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-background px-4 py-4 lg:h-[100dvh] lg:overflow-hidden lg:px-10 lg:py-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col lg:h-full lg:min-h-0">
        <div className="shrink-0 overflow-x-auto pb-1">
          <SlideMenu />
        </div>
        <div className="surface-navy shadow-premium animate-rise mt-3 flex flex-col rounded-[2rem] border border-border p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:p-8">
          <div className="shrink-0">
            <SlideHeader page={page} />
          </div>
          <FitScale className="mt-5" min={0.62} lgOnly>
            {children}
          </FitScale>

          <footer className="mt-6 flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-border pt-5 lg:mt-5">
            <div>
              <p className="display-title text-base tracking-[0.28em] text-foreground">SCOFFEY</p>
              <p className="text-[0.72rem] tracking-[0.14em] text-muted-foreground">
                coffee • community • comfort
              </p>
            </div>
            <div className="hidden sm:block">
              <p className="label-caps text-primary">Digital Barista</p>
              <p className="text-[0.72rem] tracking-[0.14em] text-muted-foreground">
                AI-Driven Beverage Co-Creation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={prev.to}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ArrowLeft className="size-3.5" /> {prevLabel ?? prev.label}
              </Link>
              <Link
                to={next.to}
                className="surface-gold shadow-gold inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                {nextLabel ?? next.label} <ArrowRight className="size-3.5" />
              </Link>
              <span className="ml-1 text-xs text-muted-foreground">{pageNumber}</span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
