import type { Metadata, Viewport } from "next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";
import { Analytics, AnalyticsNoScript } from "@/components/Analytics";
import { BotonFlotante, Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { getAjustes, getMenus } from "@/lib/cms";
import { CLIP_PATHS } from "@/lib/logo";
import { OG_DEFAULT, schemaOrganizacion, schemaSitio, SITE_NAME, SITE_URL } from "@/lib/seo";

// Valores por defecto; cada página define su título, descripción, canónica e imagen (lib/seo.ts).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Asociación Agropecuaria Campesina Nacional`, template: `%s | ${SITE_NAME}` },
  description:
    "Asoproyuja trabaja en Santa Marta por el bienestar de la niñez y las familias: primera infancia, seguridad alimentaria y desarrollo comunitario.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: { type: "website", locale: "es_CO", siteName: SITE_NAME, images: [OG_DEFAULT] },
  twitter: { card: "summary" },
  category: "nonprofit",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1F4430" };

const V = process.env.NEXT_PUBLIC_VERSION || "1";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [ajustes, menus] = await Promise.all([getAjustes(), getMenus()]);
  return (
    <html lang="es-CO">
      <head>
        {/* Hoja de estilos aprobada, sin modificaciones (copiada del preview). ?v= evita copias viejas en caché */}
        <link rel="stylesheet" href={`/assets/css/style.css?v=${V}`} />
        {/* Estilos de lo nuevo: páginas interiores, formularios, logos de aliados, reels */}
        <link rel="stylesheet" href={`/assets/css/extra.css?v=${V}`} />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <JsonLd data={[schemaOrganizacion(ajustes), schemaSitio()]} />
      </head>
      <body>
        <AnalyticsNoScript />
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: CLIP_PATHS }} />
        <Header menu={menus.principal} />
        <main id="contenido">{children}</main>
        <Footer a={ajustes} navegacion={menus.footer} enlaces={menus.enlaces} />
        <BotonFlotante boton={ajustes.boton_flotante} />
        <Reveal />
        <Analytics />
        {/* Vercel: visitas sin cookies y velocidad real de los visitantes (Core Web Vitals). Solo envían datos en Vercel. */}
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
