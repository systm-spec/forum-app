"use client";

import Link from "next/link";

const ErrorPage = ({ retry }: { error: unknown; retry: () => void }) => (
  <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px] rounded-2xl border border-dashed border-line bg-surface px-[25px] py-[34px] text-muted" role="alert">
    <h1>Inhalte konnten nicht geladen werden</h1>
    <p>Bitte versuche es erneut.</p>
    <button className="mt-3 inline-block rounded-lg bg-accent px-[15px] py-[9px] font-bold text-bg hover:bg-[#a6b2ff] hover:text-bg m-0 justify-self-start border-0 cursor-pointer disabled:cursor-wait disabled:bg-accent-wash disabled:text-muted" type="button" onClick={() => retry()}>Erneut laden</button>
    <Link className="mt-[14px] inline-block text-sm font-semibold text-accent [overflow-wrap:anywhere]" href="/">Zum Homefeed</Link>
  </main>
);

export default ErrorPage;
