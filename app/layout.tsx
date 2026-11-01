import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/UI/Header";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const sourceSans = Source_Sans_3({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Forum",
  description: "Ein Ort für gute Fragen und gemeinsame Ideen.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="de" className={`${sourceSans.className} scroll-smooth [color-scheme:dark] selection:bg-accent-wash selection:text-text`}>
    <body className="min-h-screen min-w-0 bg-bg text-base leading-normal text-text [&_*:focus-visible]:outline-2 [&_*:focus-visible]:outline-offset-[3px] [&_*:focus-visible]:outline-accent">
      <a className="fixed z-[100] top-2 left-2 -translate-y-[150%] rounded-lg bg-accent px-3.5 py-2.5 text-bg focus:translate-y-0" href="#main-content">Zum Inhalt springen</a>
      <Header />
      <div className="mx-auto grid w-[calc(100%_-_48px)] max-w-[1310px] grid-cols-[minmax(190px,232px)_minmax(0,740px)_minmax(210px,270px)] items-start gap-[clamp(20px,2.4vw,34px)] pt-[110px] pb-20 max-[1100px]:max-w-[950px] max-[1100px]:grid-cols-[minmax(170px,210px)_minmax(0,1fr)] max-[700px]:flex max-[700px]:w-[calc(100%_-_28px)] max-[700px]:max-w-[600px] max-[700px]:flex-col max-[700px]:gap-5 max-[700px]:pt-[86px] max-[390px]:w-[calc(100%_-_20px)]">
        <Navigation />
        {children}
      </div>
    </body>
  </html>
);

export default RootLayout;
