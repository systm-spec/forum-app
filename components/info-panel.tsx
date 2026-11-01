import type { ReactNode } from "react";

type InfoPanelProps = { title: string; eyebrow: string; children: ReactNode };

export const InfoPanel = ({ title, eyebrow, children }: InfoPanelProps) => (
  <section className="info-panel">
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {children}
  </section>
);
