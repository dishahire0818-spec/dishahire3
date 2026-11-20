import type { ReactNode, SVGProps } from "react";

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";
export const btn = {
  gold: cn(base, "bg-gold-400 text-brand-950 shadow-[0_8px_24px_-10px_rgba(201,162,83,.8)] hover:bg-gold-300 px-5 py-2.5 text-sm"),
  dark: cn(base, "bg-brand-950 text-white shadow-[0_8px_24px_-12px_rgba(11,40,40,.7)] hover:bg-brand-800 px-5 py-2.5 text-sm"),
  outline: cn(base, "border border-brand-900/15 bg-white text-brand-900 hover:border-brand-900/40 hover:bg-brand-50 px-5 py-2.5 text-sm"),
  outlineLight: cn(base, "border border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/40 px-5 py-2.5 text-sm"),
  lg: "px-6 py-3.5 text-[0.95rem]",
};

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]",
        light ? "text-gold-300" : "text-gold-700",
      )}
    >
      <span className={cn("h-px w-6", light ? "bg-gold-300" : "bg-gold-500")} aria-hidden />
      {children}
    </p>
  );
}

/** Signature mark: a minimal compass ("Disha" = direction). */
export function Compass({ className, light, spin }: { className?: string; light?: boolean; spin?: boolean }) {
  const line = light ? "rgba(217,187,115,.55)" : "rgba(16,56,56,.22)";
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden className={cn("pointer-events-none", className)}>
      <g className={spin ? "origin-center animate-spin-slow" : undefined} style={{ transformBox: "fill-box" }}>
        <circle cx="100" cy="100" r="96" stroke={line} strokeWidth="1" />
        <circle cx="100" cy="100" r="78" stroke={line} strokeWidth="1" strokeDasharray="2 6" />
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i * Math.PI) / 18;
          const r1 = i % 9 === 0 ? 84 : 89;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * r1}
              y1={100 + Math.sin(a) * r1}
              x2={100 + Math.cos(a) * 94}
              y2={100 + Math.sin(a) * 94}
              stroke={line}
              strokeWidth="1"
            />
          );
        })}
      </g>
      <path d="M100 30 L112 100 L100 170 L88 100 Z" fill={light ? "rgba(255,255,255,.08)" : "rgba(16,56,56,.06)"} stroke={line} />
      <path d="M100 30 L112 100 L88 100 Z" fill="#b08d3e" />
      <circle cx="100" cy="100" r="5" fill={light ? "#d9bb73" : "#103838"} />
    </svg>
  );
}

/** Section heading with an index number, used across pages for a consistent rhythm. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  light,
  align = "left",
  className,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  light?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("reveal", align === "center" && "mx-auto max-w-2xl text-center", className)}>
      <p
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
          light ? "border-white/15 bg-white/5 text-gold-300" : "border-brand-900/10 bg-brand-50 text-brand-800",
        )}
      >
        {index && <span className={cn("tabular-nums", light ? "text-white/50" : "text-brand-900/40")}>{index}</span>}
        {index && <span className={cn("h-3 w-px", light ? "bg-white/20" : "bg-brand-900/15")} />}
        {eyebrow}
      </p>
      <h2 className={cn("mt-5 text-[2.3rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem]", light ? "text-white" : "text-brand-950")}>{title}</h2>
      {intro && <p className={cn("mt-5 max-w-xl text-base leading-relaxed sm:text-lg", align === "center" && "mx-auto", light ? "text-white/70" : "text-muted")}>{intro}</p>}
    </div>
  );
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number };
const svg = (size = 18, p: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
  ...p,
});

export const LinkedInIcon = ({ size, ...p }: IconProps) => (
  <svg {...svg(size, p)}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);
export const InstagramIcon = ({ size, ...p }: IconProps) => (
  <svg {...svg(size, p)}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
  </svg>
);
export const WhatsAppIcon = ({ size, ...p }: IconProps) => (
  <svg {...svg(size, p)}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88Zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41Z" />
  </svg>
);
