import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const sourceSans = Source_Sans_3({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Forum",
  description: "Ein Ort für gute Fragen und gemeinsame Ideen.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="de" className={sourceSans.className}>
    <body>
      <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
      <Header />
      <div className="app-grid">
        <Navigation />
        {children}
      </div>
    </body>
  </html>
);

export default RootLayout;
