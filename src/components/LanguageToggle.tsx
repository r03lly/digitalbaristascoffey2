import { Globe } from "lucide-react";
import { useLanguage, type Lang } from "@/lib/i18n";

const OPTIONS: { value: Lang; label: string; full: string }[] = [
  { value: "en", label: "EN", full: "English" },
  { value: "id", label: "ID", full: "Bahasa Indonesia" },
];

/** Global language switcher — the choice persists across every page. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-1.5 py-1 ${className}`}
    >
      <Globe className="ml-0.5 size-3.5 text-primary" aria-hidden="true" />
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLang(o.value)}
          aria-label={o.full}
          aria-pressed={lang === o.value}
          className={`rounded-full px-2.5 py-1 text-[0.73rem] font-bold tracking-[0.12em] uppercase transition-colors ${
            lang === o.value
              ? "surface-gold text-primary-foreground"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
