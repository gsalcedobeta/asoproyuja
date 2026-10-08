import Script from "next/script";
import { SITE_URL } from "@/lib/seo";

// Google Tag Manager y Google Analytics 4. Se pueden cambiar con NEXT_PUBLIC_GTM_ID y NEXT_PUBLIC_GA_ID
// (vacías con el valor "off" las desactiva). Solo miden en el dominio de NEXT_PUBLIC_SITE_URL:
// así no se cuentan visitas de localhost ni de las versiones de prueba de Vercel.
const id = (v: string | undefined, porDefecto: string) => (v === "off" ? "" : (v || porDefecto).trim());
export const GTM_ID = id(process.env.NEXT_PUBLIC_GTM_ID, "GTM-K9H7CCQT");
export const GA_ID = id(process.env.NEXT_PUBLIC_GA_ID, "G-0ZYNYKJ7X6");

const HOST = new URL(SITE_URL).hostname.replace(/^www\./, "");
const enDominio = `(location.hostname===${JSON.stringify(HOST)}||location.hostname===${JSON.stringify("www." + HOST)})`;

/** Scripts en el <head> (se cargan después de que la página es interactiva, sin frenar la carga). */
export function Analytics() {
  return (
    <>
      {GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">
          {`if(${enDominio}){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');}`}
        </Script>
      )}
      {GA_ID && (
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}if(${enDominio}){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);gtag('js',new Date());gtag('config','${GA_ID}');}`}
        </Script>
      )}
    </>
  );
}

/** GTM sin JavaScript: va justo después de abrir <body>. */
export function AnalyticsNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      ></iframe>
    </noscript>
  );
}

/**
 * Evento de conversión (formularios). Llega a GA4 (gtag) y a GTM (dataLayer) para usarlo en etiquetas.
 * Eventos: "generate_lead" (contacto) y "sign_up" (newsletter).
 */
export function evento(nombre: string, datos: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: nombre, ...datos });
  if (typeof w.gtag === "function") w.gtag("event", nombre, datos);
}
