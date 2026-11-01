import type { ReactNode } from "react";

type InfoPanelProps = { title: string; eyebrow: string; children: ReactNode };

export const InfoPanel = ({ title, eyebrow, children }: InfoPanelProps) => (
  <section className="min-w-0 rounded-2xl border border-line bg-surface p-[22px]">
    <p className="mb-[7px] text-xs font-bold tracking-[.09em] text-accent uppercase">{eyebrow}</p>
    <h2 className="mb-[11px] text-xl leading-[1.2] tracking-[-.025em] [overflow-wrap:anywhere]">{title}</h2>
    {children}
  </section>
);
