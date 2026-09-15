import type { Metadata } from "next";
import "./globals.css";

const title = "Mis XV de Alma · 12 de diciembre";
const description = "Te espero para compartir una noche inolvidable. Confirmá tu asistencia a los XV de Alma.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL ?? "http://localhost:3000"),
  title,
  description,
  icons: { icon: "/favicon.svg" },
  openGraph: { title, description, type: "website", locale: "es_AR", images: [{ url: "/og.png", width: 1733, height: 908, alt: "Mis XV de Alma — 12 de diciembre" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
