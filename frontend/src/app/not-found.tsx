import Link from "next/link";
import { MoveLeft, ScanFace } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const content = {
  badge: "404",
  title: "Face not found",
  description:
    "We ran the detection model on this URL. No faces, no page, nothing. Whatever you were looking for isn't here.",
  cta: "Back to home",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-primary)] px-6 py-24 text-center">

      {/* Badge */}
      <span className="font-mono text-[0.72rem] font-bold tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-full bg-[var(--badge-accent-primary-bg)] text-[var(--text-accent)] border border-[rgba(37,99,235,0.2)] mb-6">
        {content.badge}
      </span>

      {/* Animated scan icon */}
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">

        {/* Outer ring */}
        <div className="absolute inset-0 rounded-2xl border border-[rgba(37,99,235,0.15)] bg-[var(--bg-theme-light)]" />

        {/* Scan line animation */}
        <div className="absolute inset-x-3 h-px bg-[var(--text-accent)] opacity-60 animate-[scanline_2s_ease-in-out_infinite]" />

        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--text-accent)] rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[var(--text-accent)] rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[var(--text-accent)] rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--text-accent)] rounded-br-sm" />

        <ScanFace size={30} strokeWidth={1.25} className="text-[var(--text-accent)] relative z-10" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mb-3">
        {content.title}
      </h1>

      {/* Description */}
      <p className="max-w-sm text-[0.95rem] leading-relaxed text-[var(--text-secondary)] opacity-90 mb-8">
        {content.description}
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-sm font-semibold transition-all duration-300 hover:bg-[var(--btn-primary-bg-hover)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(37,99,235,0.35)] active:translate-y-0 active:scale-[0.98]"
      >
        <MoveLeft size={15} strokeWidth={2} />
        {content.cta}
      </Link>

    </main>
  );
}