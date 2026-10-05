import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BotonFlotante, Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { getAjustes, getMenus } from "@/lib/cms";
import { CLIP_PATHS } from "@/lib/logo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://asoproyuja.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Asoproyuja — Inicio",
    template: "%s — Asoproyuja",
  },
  description:
    "Asoproyuja, Asociación Agropecuaria Campesina Nacional. Trabajamos por el fortalecimiento y bienestar de la niñez y las familias en Colombia.",
  icons: { icon: "/assets/img/favicon.png" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Asoproyuja",
    images: ["/assets/img/hero-comunidad.jpg"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [ajustes, menus] = await Promise.all([getAjustes(), getMenus()]);
  return (
    <html lang="es">
      <head>
        {/* Hoja de estilos aprobada, sin modificaciones (copiada del preview) */}
        <link rel="stylesheet" href="/assets/css/style.css" />
        {/* Estilos de lo nuevo: páginas interiores, formularios, logos de aliados */}
        <link rel="stylesheet" href="/assets/css/extra.css" />
      </head>
      <body>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: CLIP_PATHS }} />
        <Header menu={menus.principal} />
        {children}
        <Footer a={ajustes} navegacion={menus.footer} enlaces={menus.enlaces} />
        <BotonFlotante boton={ajustes.boton_flotante} />
        <Reveal />
      </body>
    </html>
  );
}
